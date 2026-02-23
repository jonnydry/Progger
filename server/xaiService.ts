import OpenAI from "openai";
import { redisCache, getProgressionCacheKey } from './cache';
import { pendingRequests } from './pendingRequests';
import { buildOptimizedPrompt, estimateTokenUsage, type ProgressionRequest } from './promptOptimization';
import { withRetry, xaiCircuitBreaker } from './retryLogic';
import { logger } from './utils/logger';
import { validateAPIResponse, APIValidationError } from './utils/apiValidation';
import { normalizeScaleDescriptor, normalizeModeCanonical } from '@shared/music/scaleModes';

const DEFAULT_XAI_REQUEST_TIMEOUT_MS = 25000;
const DEFAULT_XAI_MAX_CONCURRENT_REQUESTS = 8;

function parsePositiveIntEnv(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const XAI_REQUEST_TIMEOUT_MS = parsePositiveIntEnv(
  process.env.XAI_REQUEST_TIMEOUT_MS,
  DEFAULT_XAI_REQUEST_TIMEOUT_MS,
);
const XAI_MAX_CONCURRENT_REQUESTS = parsePositiveIntEnv(
  process.env.XAI_MAX_CONCURRENT_REQUESTS,
  DEFAULT_XAI_MAX_CONCURRENT_REQUESTS,
);

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
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error("XAI_API_KEY environment variable is not set.");
  }

  const isTestRuntime = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);
  if (isTestRuntime) {
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

// Helper to strip markdown code blocks from API response
function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  // Remove markdown code block wrapper if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
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
    .replace(/^([A-G][#b]?)/i, '')
    .replace(/\/[A-G][#b]?$/i, '')
    .toLowerCase();

  if (!quality) return false;

  return /(?:alt|sus|add|\+|aug|dim7|m7b5|min7b5|maj9|maj11|maj13|min9|min11|min13|9|11|13|7b9|7#9|7b5|7#5|6\/9|#11|b13|b9)/i.test(
    quality,
  );
}

function countAdvancedChords(progression: SimpleChord[]): number {
  return progression.filter((chord) => {
    const relation = chord.relationToKey.toLowerCase();
    const functionText = chord.musicalFunction.toLowerCase();

    return (
      isAdvancedChordSymbol(chord.chordName) ||
      relation.includes('/') ||
      functionText.includes('secondary dominant') ||
      functionText.includes('tritone') ||
      functionText.includes('altered')
    );
  }).length;
}

const ROOT_TO_PITCH_CLASS: Record<string, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
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

  if (second === '#' || second === '♯') return `${first}#`;
  if (second === 'b' || second === '♭' || second === 'B') return `${first}b`;
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
  requestedModeCanonical: string,
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
  requestedMode: string,
): { hasAnyMatch: boolean; firstIsMatch: boolean } {
  const requestedPitchClass = toPitchClass(requestedKey);
  const requestedModeCanonical = normalizeModeCanonical(requestedMode).toLowerCase();

  if (requestedPitchClass === null || scales.length === 0) {
    return { hasAnyMatch: false, firstIsMatch: false };
  }

  const firstIsMatch = scaleMatchesRequest(
    scales[0],
    requestedPitchClass,
    requestedModeCanonical,
  );

  const hasAnyMatch = firstIsMatch
    ? true
    : scales
        .slice(1)
        .some((scale) =>
          scaleMatchesRequest(scale, requestedPitchClass, requestedModeCanonical),
        );

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
    generationStyle,
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
    selectedProgression
  };

  // Step 3: Build optimized prompt
  const promptComponents = buildOptimizedPrompt(request);
  logger.debug("Prompt built", { 
    estimatedTokens: estimateTokenUsage(promptComponents),
    cacheKey 
  });

  // Step 4: Create async operation with all optimizations
  const generateWithOptimizations = async (): Promise<ProgressionResultFromAPI> => {
    logger.info("Generating chord progression with XAI Grok API", { cacheKey });

    const openai = getOpenAI();

    return await xaiRequestLimiter.run(async () =>
      xaiCircuitBreaker.execute(async () => {
        const response = await openai.chat.completions.create({
          model: "grok-4-1-fast-non-reasoning",
          messages: [
            {
              role: "system",
              content: "You are a music theory expert. Always respond with valid JSON matching the exact schema provided."
            },
            {
              role: "user",
              content: promptComponents.fullPrompt
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 1500, // Increased to accommodate 7+ chords with detailed descriptions
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
          rawProgressionLength: Array.isArray(parsedResult?.progression) ? parsedResult.progression.length : 'not an array',
        });
        
        const resultFromApi = validateAPIResponse(parsedResult, numChords);
        const primaryScaleAlignment = getPrimaryScaleAlignment(
          resultFromApi.scales,
          key,
          mode,
        );
        if (!primaryScaleAlignment.hasAnyMatch) {
          throw new APIValidationError(
            `AI response is missing a primary scale that matches requested mode: ${key} ${mode}.`,
          );
        }
        if (!primaryScaleAlignment.firstIsMatch) {
          throw new APIValidationError(
            `Primary scale must be listed first and match requested mode: ${key} ${mode}.`,
          );
        }
        if (includeTensions) {
          const minimumAdvancedChords = Math.max(1, Math.floor(numChords * 0.2));
          const advancedChordCount = countAdvancedChords(resultFromApi.progression);
          if (advancedChordCount < minimumAdvancedChords) {
            throw new APIValidationError(
              `includeTensions was enabled but only ${advancedChordCount} advanced chord(s) were returned. Expected at least ${minimumAdvancedChords}.`,
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
      maxDelay: 15000,    // Max 15 seconds
      backoffMultiplier: 1.5,
      jitterFactor: 0.2
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
      if (error.message.includes('Circuit breaker is OPEN')) {
        throw new Error("XAI API is temporarily unavailable (circuit breaker activated). Please try again later.");
      }
      if (error.message.includes('timed out')) {
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
  const cacheKey = `custom:${chords.join('-')}`;

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

  // Step 3: Build prompt for custom progression analysis
  const prompt = `You are a music theory expert specializing in jazz and contemporary guitar harmony.

TASK:
Analyze the following chord progression and provide:
1. Key detection: Determine the most likely key and mode (Major, Minor, Dorian, Mixolydian, etc.)
2. Musical analysis: Provide Roman numeral analysis for each chord
3. Alternative voicings: Suggest different fingerings/positions for each chord
4. Scale suggestions: Recommend compatible scales for improvisation

CHORD PROGRESSION:
${chords.map((chord, i) => `${i + 1}. ${chord}`).join('\n')}

CRITICAL REQUIREMENTS:
1. Detect the key and mode from the progression
   - Look for tonal center (most common root note)
   - Identify major vs minor characteristics
   - Detect modal progressions if applicable
   - Provide confidence level (high/medium/low) if ambiguous
   - NOTE: Ionian and Major are interchangeable (use 'Major' as canonical form)
   - NOTE: Aeolian and Minor are interchangeable (use 'Minor' as canonical form)

2. For each chord in the progression:
   - chordName: Use EXACT chord notation (e.g., 'Cmaj7', 'Am7', 'G7b9', 'D7alt', 'F#maj9')
   - musicalFunction: Detailed role (e.g., 'Tonic Major 7th', 'Dominant 7th with flat 9')
   - relationToKey: Roman numeral relative to detected key (e.g., 'Imaj7', 'V7', 'iim7', 'V7/ii')

3. Suggest ALL compatible scales:
   - Include every musically plausible compatible scale (do not limit to 2-3)
   - Primary scale MUST match the detected key/mode and MUST appear first
   - For modal progressions (Lydian, Dorian, Phrygian, Mixolydian, Locrian):
     * Include the detected mode at different root positions that appear in the progression
     * Example: For a Lydian progression, suggest Lydian scales at different chord roots
     * Prioritize modal scales at different roots over generic major/minor scales
   - Include additional compatible options such as pentatonic variants or related modes when they fit
   - Do not return duplicate scales (same root + descriptor)
   - Order scales from strongest fit to more color/optional choices
   - name: EXACT format - root note + mode name ONLY (e.g., 'C Major', 'A Dorian', 'G Mixolydian', 'C Minor Pentatonic', 'C Lydian')
     * DO NOT add words like "Natural", "Harmonic", "Melodic", or "Scale"
     * CORRECT: "E Minor", "G Major Pentatonic", "A Dorian", "C Lydian"
     * WRONG: "E Natural Minor", "G Harmonic Minor", "A Dorian Scale"
   - rootNote: The root note matching key signature preference

4. Ensure chord names match guitar voicing standards and respect key signature accidentals

Return ONLY valid JSON matching this schema:
{
  "detectedKey": "string (REQUIRED: The detected key center - e.g., 'C', 'G', 'Am', 'F#'. Include 'm' suffix for minor keys)",
  "detectedMode": "string (REQUIRED: The detected mode - must be exactly one of: 'Major', 'Minor', 'Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Locrian'. Note: Ionian and Major are interchangeable, use 'Major' as canonical form. Aeolian and Minor are interchangeable, use 'Minor' as canonical form.)",
  "progression": [
    {
      "chordName": "string (IMPORTANT: Use exact chord notation - e.g., 'Cmaj7', 'Am7', 'G7b9', 'D7alt', 'F#maj9')",
      "musicalFunction": "string (e.g., 'Tonic Major 7th', 'Dominant 7th with flat 9', 'Subdominant Major 7th')",
      "relationToKey": "string (Roman numeral like 'Imaj7', 'V7', 'iim7', 'V7/ii')"
    }
  ],
  "scales": [
    {
      "name": "string (EXACT FORMAT: root + mode name - e.g., 'G Major', 'A Dorian', 'C Minor Pentatonic', 'G Altered'. NO qualifiers like Natural/Harmonic/Melodic)",
      "rootNote": "string (e.g., 'G', 'A', 'C' - match the key signature accidental preference)"
    }
  ]
}

IMPORTANT: Return ONLY valid JSON, no additional text or markdown formatting.`;

  // Step 4: Create async operation
  const analyzeWithOptimizations = async (): Promise<ProgressionResultFromAPI> => {
    logger.info("Analyzing custom chord progression with XAI Grok API", { cacheKey, chordCount: chords.length });

    const openai = getOpenAI();

    return await xaiRequestLimiter.run(async () =>
      xaiCircuitBreaker.execute(async () => {
        const response = await openai.chat.completions.create({
          model: "grok-4-1-fast-non-reasoning",
          messages: [
            {
              role: "system",
              content: "You are a music theory expert. Always respond with valid JSON matching the exact schema provided."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 1500, // Increased for more detailed analysis
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
      jitterFactor: 0.2
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
      if (error.message.includes('Circuit breaker is OPEN')) {
        throw new Error("XAI API is temporarily unavailable (circuit breaker activated). Please try again later.");
      }
      if (error.message.includes('timed out')) {
        throw new Error("XAI API request timed out. The service may be busy.");
      }
      throw error;
    }

    throw new Error("Failed to analyze custom progression. The AI might be busy, or the request was invalid.");
  }
}
