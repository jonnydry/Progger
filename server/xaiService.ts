import OpenAI from "openai";
import type { ResponseFormatJSONSchema } from "openai/resources/shared";
import { redisCache, getProgressionCacheKey } from "./cache";
import { pendingRequests } from "./pendingRequests";
import {
  buildOptimizedPrompt,
  estimateTokenUsage,
  type ProgressionRequest,
} from "./promptOptimization";
import { withRetry, xaiCircuitBreaker } from "./retryLogic";
import { logger } from "./utils/logger";
import { validateAPIResponse, APIValidationError } from "./utils/apiValidation";
import { normalizeScaleDescriptor, normalizeModeCanonical } from "@shared/music/scaleModes";
import { env, isTest } from "./env";

const XAI_REQUEST_TIMEOUT_MS = env.XAI_REQUEST_TIMEOUT_MS;
const XAI_MAX_CONCURRENT_REQUESTS = env.XAI_MAX_CONCURRENT_REQUESTS;

class RequestConcurrencyLimiter {
  private activeCount = 0;
  private queue: Array<() => void> = [];

  constructor(private readonly maxConcurrent: number) {}

  async run<T>(operation: () => Promise<T>): Promise<T> {
    if (this.activeCount >= this.maxConcurrent) {
      await new Promise<void>((resolve) => this.queue.push(resolve));
    }

    this.activeCount += 1;
    try {
      return await operation();
    } finally {
      this.activeCount = Math.max(0, this.activeCount - 1);
      const next = this.queue.shift();
      if (next) {
        next();
      }
    }
  }
}

const xaiRequestLimiter = new RequestConcurrencyLimiter(XAI_MAX_CONCURRENT_REQUESTS);

let openAIClient: OpenAI | null = null;
let openAIClientApiKey: string | null = null;

function createOpenAIClient(apiKey: string): OpenAI {
  return new OpenAI({
    baseURL: "https://api.x.ai/v1",
    apiKey,
    timeout: XAI_REQUEST_TIMEOUT_MS,
    maxRetries: 0,
  });
}

const getOpenAI = () => {
  // Read from process.env (not env) so test suites that mutate
  // process.env.XAI_API_KEY mid-run still see the latest value.
  const apiKey = process.env.XAI_API_KEY ?? env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error("XAI_API_KEY environment variable is not set.");
  }

  if (isTest) {
    return createOpenAIClient(apiKey);
  }

  if (!openAIClient || openAIClientApiKey !== apiKey) {
    openAIClient = createOpenAIClient(apiKey);
    openAIClientApiKey = apiKey;
  }

  return openAIClient;
};

export function __resetXaiClientForTests(): void {
  openAIClient = null;
  openAIClientApiKey = null;
}

// JSON Schema definitions for Grok-4 Structured Outputs.
// Using strict mode guarantees the model returns valid JSON conforming to the
// schema, eliminating most of the "EXACT FORMAT" / "Return ONLY JSON" prompt
// boilerplate that older models needed.

const CHORD_ITEM_SCHEMA = {
  type: "object",
  properties: {
    chordName: {
      type: "string",
      description:
        "Exact chord notation, e.g. 'Cmaj7', 'Am7', 'G7b9', 'D7alt', 'F#maj9', 'Bm7b5'",
    },
    musicalFunction: {
      type: "string",
      description: "Detailed harmonic role, e.g. 'Tonic Major 7th', 'Secondary Dominant to ii'",
    },
    relationToKey: {
      type: "string",
      description: "Roman numeral, e.g. 'Imaj7', 'V7', 'iim7', 'V7/ii'",
    },
  },
  required: ["chordName", "musicalFunction", "relationToKey"],
  additionalProperties: false,
} as const;

const SCALE_ITEM_SCHEMA = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description:
        "Format: '<Root> <ModeName>'. Examples: 'C Major', 'A Dorian', 'G Major Pentatonic'. Do NOT include qualifiers like 'Natural', 'Harmonic', 'Melodic', or the word 'Scale'.",
    },
    rootNote: {
      type: "string",
      description:
        "Root note matching the key signature accidental preference, e.g. 'C', 'F#', 'Bb'",
    },
  },
  required: ["name", "rootNote"],
  additionalProperties: false,
} as const;

const PROGRESSION_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    progression: { type: "array", items: CHORD_ITEM_SCHEMA },
    scales: { type: "array", items: SCALE_ITEM_SCHEMA, minItems: 1 },
  },
  required: ["progression", "scales"],
  additionalProperties: false,
} as const;

const ANALYSIS_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    detectedKey: {
      type: "string",
      description:
        "Detected tonal center, e.g. 'C', 'F#', 'Bb'. Append 'm' for minor keys (e.g. 'Am').",
    },
    detectedMode: {
      type: "string",
      description:
        "Canonical mode: one of 'Major', 'Minor', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Locrian'",
    },
    progression: { type: "array", items: CHORD_ITEM_SCHEMA, minItems: 1 },
    scales: { type: "array", items: SCALE_ITEM_SCHEMA, minItems: 1 },
  },
  required: ["detectedKey", "detectedMode", "progression", "scales"],
  additionalProperties: false,
} as const;

function buildProgressionResponseFormat(numChords: number): ResponseFormatJSONSchema {
  return {
    type: "json_schema",
    json_schema: {
      name: "ChordProgressionResponse",
      strict: true,
      schema: {
        ...PROGRESSION_RESPONSE_SCHEMA,
        properties: {
          ...PROGRESSION_RESPONSE_SCHEMA.properties,
          progression: {
            type: "array",
            items: CHORD_ITEM_SCHEMA,
            minItems: numChords,
            maxItems: numChords,
          },
        },
      },
    },
  };
}

const ANALYSIS_RESPONSE_FORMAT: ResponseFormatJSONSchema = {
  type: "json_schema",
  json_schema: {
    name: "ProgressionAnalysisResponse",
    strict: true,
    schema: ANALYSIS_RESPONSE_SCHEMA,
  },
};

// Helper to strip markdown code blocks from API response. Kept as a defensive
// fallback even though Structured Outputs guarantee clean JSON.
function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  // Remove markdown code block wrapper if present
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

interface SimpleChord {
  chordName: string;
  musicalFunction: string;
  relationToKey: string;
}

interface SimpleScale {
  name: string;
  rootNote: string;
}

interface ProgressionResultFromAPI {
  progression: SimpleChord[];
  scales: SimpleScale[];
  detectedKey?: string;
  detectedMode?: string;
}

function isAdvancedChordSymbol(chordName: string): boolean {
  const normalized = chordName.trim();
  if (!normalized) return false;

  // Remove the root token and optional slash bass to focus on chord quality.
  const quality = normalized
    .replace(/^([A-G][#b]?)/i, "")
    .replace(/\/[A-G][#b]?$/i, "")
    .toLowerCase();

  if (!quality) return false;

  return /(?:alt|sus|add|\+|aug|dim7|m7b5|min7b5|maj9|maj11|maj13|min9|min11|min13|9|11|13|7b9|7#9|7b5|7#5|6\/9|#11|b13|b9)/i.test(
    quality
  );
}

function countAdvancedChords(progression: SimpleChord[]): number {
  return progression.filter((chord) => {
    const relation = chord.relationToKey.toLowerCase();
    const functionText = chord.musicalFunction.toLowerCase();

    return (
      isAdvancedChordSymbol(chord.chordName) ||
      relation.includes("/") ||
      functionText.includes("secondary dominant") ||
      functionText.includes("tritone") ||
      functionText.includes("altered")
    );
  }).length;
}

const ROOT_TO_PITCH_CLASS: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

function normalizeRootToken(token: string): string {
  const trimmed = token.trim();
  if (trimmed.length <= 1) {
    return trimmed.toUpperCase();
  }
  const first = trimmed.charAt(0).toUpperCase();
  const second = trimmed.charAt(1);

  if (second === "#" || second === "♯") return `${first}#`;
  if (second === "b" || second === "♭" || second === "B") return `${first}b`;
  return first + second.toLowerCase();
}

function toPitchClass(root: string): number | null {
  const normalized = normalizeRootToken(root);
  if (!(normalized in ROOT_TO_PITCH_CLASS)) return null;
  return ROOT_TO_PITCH_CLASS[normalized];
}

function parseScaleName(scaleName: string): { root: string; descriptor: string } | null {
  const match = scaleName.trim().match(/^([A-G](?:[#b♯♭])?)(?:\s+)(.+)$/i);
  if (!match) return null;
  return { root: match[1], descriptor: match[2] };
}

function scaleMatchesRequest(
  scale: SimpleScale,
  requestedPitchClass: number,
  requestedModeCanonical: string
): boolean {
  const parsed = parseScaleName(scale.name);
  if (!parsed) return false;

  const scalePitchClass = toPitchClass(parsed.root);
  if (scalePitchClass === null || scalePitchClass !== requestedPitchClass) {
    return false;
  }

  const scaleModeCanonical = normalizeModeCanonical(parsed.descriptor).toLowerCase();
  return scaleModeCanonical === requestedModeCanonical;
}

function getPrimaryScaleAlignment(
  scales: SimpleScale[],
  requestedKey: string,
  requestedMode: string
): { hasAnyMatch: boolean; firstIsMatch: boolean } {
  const requestedPitchClass = toPitchClass(requestedKey);
  const requestedModeCanonical = normalizeModeCanonical(requestedMode).toLowerCase();

  if (requestedPitchClass === null || scales.length === 0) {
    return { hasAnyMatch: false, firstIsMatch: false };
  }

  const firstIsMatch = scaleMatchesRequest(scales[0], requestedPitchClass, requestedModeCanonical);

  const hasAnyMatch = firstIsMatch
    ? true
    : scales
        .slice(1)
        .some((scale) => scaleMatchesRequest(scale, requestedPitchClass, requestedModeCanonical));

  return { hasAnyMatch, firstIsMatch };
}

export async function generateChordProgression(
  key: string,
  mode: string,
  includeTensions: boolean,
  generationStyle: "conservative" | "balanced" | "adventurous" = "balanced",
  numChords: number,
  selectedProgression: string
): Promise<ProgressionResultFromAPI> {
  // Log incoming parameters for debugging chord count issues
  logger.info("generateChordProgression called", {
    key,
    mode,
    includeTensions,
    generationStyle,
    numChords,
    selectedProgression,
  });

  // Create cache key using semantic fingerprinting
  const cacheKey = getProgressionCacheKey(
    key,
    mode,
    includeTensions,
    numChords,
    selectedProgression,
    generationStyle
  );

  // Log the cache key to verify numChords is included
  logger.debug("Cache key generated", { cacheKey, numChords });

  // Step 1: Check if we have a similar request already pending (deduplication)
  const pending = pendingRequests.get(cacheKey);
  if (pending) {
    logger.debug("Returning pending request", { cacheKey });
    return pending;
  }

  // Step 2: Check Redis cache for existing result
  const cachedResult = await redisCache.get<ProgressionResultFromAPI>(cacheKey);
  if (cachedResult) {
    const alignment = getPrimaryScaleAlignment(cachedResult.scales, key, mode);
    if (!alignment.hasAnyMatch || !alignment.firstIsMatch) {
      logger.warn("Ignoring stale cache entry with mismatched primary scale", {
        cacheKey,
        key,
        mode,
        hasAnyPrimaryMatch: alignment.hasAnyMatch,
        primaryScaleFirst: alignment.firstIsMatch,
      });
      await redisCache.delete(cacheKey);
    } else {
      logger.debug("Cache hit", { cacheKey });
      return cachedResult;
    }
  }

  // Create request object for optimization
  const request: ProgressionRequest = {
    key,
    mode,
    includeTensions,
    generationStyle,
    numChords,
    selectedProgression,
  };

  // Step 3: Build optimized prompt
  const promptComponents = buildOptimizedPrompt(request);
  logger.debug("Prompt built", {
    estimatedTokens: estimateTokenUsage(promptComponents),
    cacheKey,
  });

  // Step 4: Create async operation with all optimizations
  const generateWithOptimizations = async (): Promise<ProgressionResultFromAPI> => {
    logger.info("Generating chord progression with XAI Grok API", { cacheKey });

    const openai = getOpenAI();

    return await xaiRequestLimiter.run(async () =>
      xaiCircuitBreaker.execute(async () => {
        const response = await openai.chat.completions.create({
          model: env.XAI_MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are a jazz and contemporary guitar music theory expert. Respond with structured JSON matching the provided schema.",
            },
            {
              role: "user",
              content: promptComponents.fullPrompt,
            },
          ],
          // Structured Outputs: schema enforces shape AND exact chord count
          // (minItems/maxItems = numChords). The model can no longer return the
          // wrong number of chords or omit fields.
          response_format: buildProgressionResponseFormat(numChords),
          temperature: 0.7,
          max_tokens: 2048,
        });

        const rawText = response.choices[0].message.content?.trim();
        if (!rawText) {
          throw new Error("Empty response from API");
        }

        // Clean markdown code blocks if present
        const jsonText = cleanJsonResponse(rawText);
        const parsedResult = JSON.parse(jsonText);

        // Enhanced validation with format checking and chord count verification
        logger.info("Validating API response", {
          expectedChordCount: numChords,
          actualChordCount: parsedResult?.progression?.length,
          rawProgressionLength: Array.isArray(parsedResult?.progression)
            ? parsedResult.progression.length
            : "not an array",
        });

        const resultFromApi = validateAPIResponse(parsedResult, numChords);
        const primaryScaleAlignment = getPrimaryScaleAlignment(resultFromApi.scales, key, mode);
        if (!primaryScaleAlignment.hasAnyMatch) {
          throw new APIValidationError(
            `AI response is missing a primary scale that matches requested mode: ${key} ${mode}.`
          );
        }
        if (!primaryScaleAlignment.firstIsMatch) {
          throw new APIValidationError(
            `Primary scale must be listed first and match requested mode: ${key} ${mode}.`
          );
        }
        if (includeTensions) {
          const minimumAdvancedChords = Math.max(1, Math.floor(numChords * 0.2));
          const advancedChordCount = countAdvancedChords(resultFromApi.progression);
          if (advancedChordCount < minimumAdvancedChords) {
            throw new APIValidationError(
              `includeTensions was enabled but only ${advancedChordCount} advanced chord(s) were returned. Expected at least ${minimumAdvancedChords}.`
            );
          }
        }

        logger.info("API response validated successfully", {
          requestedChordCount: numChords,
          returnedChordCount: resultFromApi.progression.length,
          scaleCount: resultFromApi.scales.length,
          chordCountMatch: resultFromApi.progression.length === numChords,
        });

        return resultFromApi;
      })
    );
  };

  // Step 5: Create request promise once and share it for deduplication
  const requestPromise = withRetry(
    generateWithOptimizations,
    {
      maxRetries: 3,
      initialDelay: 2000, // Start with 2 seconds
      maxDelay: 15000, // Max 15 seconds
      backoffMultiplier: 1.5,
      jitterFactor: 0.2,
    },
    (stats) => {
      logger.warn("Retrying chord progression generation", {
        attempt: stats.attemptNumber,
        totalRetries: stats.totalRetries,
        delayMs: stats.totalDelay,
        cacheKey,
      });
    }
  );
  pendingRequests.set(cacheKey, requestPromise);

  try {
    // Step 6: Await shared request promise
    const result = await requestPromise;

    // Step 7: Cache successful result (24 hour TTL)
    await redisCache.set(cacheKey, result, 86400);

    logger.info("Chord progression generated and cached", {
      cacheKey,
      tokens: estimateTokenUsage(promptComponents),
      chordCount: result.progression.length,
      scaleCount: result.scales.length,
    });

    return result;
  } catch (error) {
    logger.error("Error generating chord progression", error, { cacheKey });

    // Enhanced error classification
    if (error instanceof APIValidationError) {
      logger.error("API response validation failed", error, { cacheKey });
      throw new Error(`Invalid response from AI: ${error.message}`);
    }
    if (error instanceof SyntaxError) {
      logger.error("JSON parse error from API response", error, { cacheKey });
      throw new Error("Failed to parse the response from the AI. The format was invalid.");
    }
    if (error instanceof Error) {
      // Enhance error messages with more context
      if (error.message.includes("Circuit breaker is OPEN")) {
        throw new Error(
          "XAI API is temporarily unavailable (circuit breaker activated). Please try again later."
        );
      }
      if (error.message.includes("timed out")) {
        throw new Error("XAI API request timed out. The service may be busy.");
      }
      throw error;
    }
    throw new Error(`Unexpected error: ${JSON.stringify(error)}`);
  }
  // Note: pendingRequests automatically cleans up via promise.finally()
}

export async function analyzeCustomProgression(
  chords: string[]
): Promise<ProgressionResultFromAPI> {
  // Create cache key for custom progression
  const cacheKey = `custom:${chords.join("-")}`;

  // Step 1: Check if we have a similar request already pending (deduplication)
  const pending = pendingRequests.get(cacheKey);
  if (pending) {
    logger.debug("Returning pending custom progression request", { cacheKey });
    return pending;
  }

  // Step 2: Check Redis cache for existing result
  const cachedResult = await redisCache.get<ProgressionResultFromAPI>(cacheKey);
  if (cachedResult) {
    logger.debug("Cache hit for custom progression", { cacheKey });
    return cachedResult;
  }

  // Step 3: Build prompt for custom progression analysis. JSON shape and field
  // presence are enforced by the Structured Outputs schema, so this prompt
  // focuses on the musical analysis itself.
  const prompt = `Analyze this chord progression and produce a key detection plus full Roman-numeral analysis with compatible scales.

CHORD PROGRESSION:
${chords.map((chord, i) => `${i + 1}. ${chord}`).join("\n")}

KEY & MODE DETECTION:
- Identify the tonal center and whether the music is major, minor, or modal (Dorian, Phrygian, Lydian, Mixolydian, Locrian).
- Use canonical mode names: 'Major' (not 'Ionian'), 'Minor' (not 'Aeolian').
- detectedKey format: root + optional 'm' for minor (e.g. 'C', 'F#', 'Am').

PER-CHORD ANALYSIS:
- chordName: exact notation matching guitar voicing standards (e.g. 'Cmaj7', 'Am7', 'G7b9', 'D7alt', 'F#maj9').
- musicalFunction: detailed role (e.g. 'Tonic Major 7th', 'Dominant 7th with flat 9', 'Secondary Dominant to ii').
- relationToKey: Roman numeral relative to the detected key (e.g. 'Imaj7', 'V7', 'iim7', 'V7/ii').

SCALE SUGGESTIONS:
- Include every musically plausible compatible scale.
- Primary scale MUST match the detected key/mode and MUST appear first.
- For modal progressions, include the detected mode at the different chord-root positions that appear in the progression, and prioritize those over generic major/minor scales.
- Add compatible pentatonic variants or related modes when they fit.
- No duplicate scales (same root + descriptor). Order from strongest fit to optional color choices.
- Scale name format: '<Root> <ModeName>' (e.g. 'C Major', 'A Dorian', 'G Mixolydian', 'C Minor Pentatonic'). Do NOT add 'Natural', 'Harmonic', 'Melodic', or 'Scale'.

Respect key-signature accidentals throughout (prefer flats vs sharps based on the detected key).`;

  // Step 4: Create async operation
  const analyzeWithOptimizations = async (): Promise<ProgressionResultFromAPI> => {
    logger.info("Analyzing custom chord progression with XAI Grok API", {
      cacheKey,
      chordCount: chords.length,
    });

    const openai = getOpenAI();

    return await xaiRequestLimiter.run(async () =>
      xaiCircuitBreaker.execute(async () => {
        const response = await openai.chat.completions.create({
          model: env.XAI_MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are a jazz and contemporary guitar music theory expert. Respond with structured JSON matching the provided schema.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: ANALYSIS_RESPONSE_FORMAT,
          // Lower temperature for analysis: key/mode detection should be
          // deterministic, not creative.
          temperature: 0.3,
          max_tokens: 2048,
        });

        const rawText = response.choices[0].message.content?.trim();
        if (!rawText) {
          throw new Error("Empty response from API");
        }

        // Clean markdown code blocks if present
        const jsonText = cleanJsonResponse(rawText);
        const parsedResult = JSON.parse(jsonText);

        // Enhanced validation with format checking
        const resultFromApi = validateAPIResponse(parsedResult);

        logger.debug("Custom progression analysis validated successfully", {
          chordCount: resultFromApi.progression.length,
          scaleCount: resultFromApi.scales.length,
        });

        return resultFromApi;
      })
    );
  };

  // Step 5: Create request promise once and share it for deduplication
  const requestPromise = withRetry(
    analyzeWithOptimizations,
    {
      maxRetries: 3,
      initialDelay: 2000,
      maxDelay: 15000,
      backoffMultiplier: 1.5,
      jitterFactor: 0.2,
    },
    (stats) => {
      logger.warn("Retrying custom progression analysis", {
        attempt: stats.attemptNumber,
        totalRetries: stats.totalRetries,
        delayMs: stats.totalDelay,
        cacheKey,
      });
    }
  );
  pendingRequests.set(cacheKey, requestPromise);

  try {
    // Step 6: Await shared request promise
    const result = await requestPromise;

    // Step 7: Cache successful result (24 hour TTL)
    await redisCache.set(cacheKey, result, 86400);

    logger.info("Custom progression analyzed and cached", {
      cacheKey,
      chordCount: result.progression.length,
      scaleCount: result.scales.length,
    });

    return result;
  } catch (error) {
    logger.error("Error analyzing custom progression", error, { cacheKey });

    // Enhanced error classification
    if (error instanceof APIValidationError) {
      logger.error("API response validation failed", error, { cacheKey });
      throw new Error(`Invalid response from AI: ${error.message}`);
    }
    if (error instanceof SyntaxError) {
      logger.error("JSON parse error from API response", error, { cacheKey });
      throw new Error("Failed to parse the response from the AI. The format was invalid.");
    }
    if (error instanceof Error) {
      if (error.message.includes("Circuit breaker is OPEN")) {
        throw new Error(
          "XAI API is temporarily unavailable (circuit breaker activated). Please try again later."
        );
      }
      if (error.message.includes("timed out")) {
        throw new Error("XAI API request timed out. The service may be busy.");
      }
      throw error;
    }

    throw new Error(
      "Failed to analyze custom progression. The AI might be busy, or the request was invalid."
    );
  }
}
