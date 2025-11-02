import OpenAI from "openai";
import { redisCache, getProgressionCacheKey } from './cache';
import { pendingRequests } from './pendingRequests';
import { buildOptimizedPrompt, createPromptFingerprint, estimateTokenUsage, type ProgressionRequest } from './promptOptimization';
import { withRetry, xaiCircuitBreaker } from './retryLogic';
import { logger } from './utils/logger';
import { validateAPIResponse, APIValidationError } from './utils/apiValidation';

const getOpenAI = () => {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error("XAI_API_KEY environment variable is not set.");
  }
  return new OpenAI({
    baseURL: "https://api.x.ai/v1",
    apiKey: apiKey,
  });
};

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
}

export async function generateChordProgression(
  key: string,
  mode: string,
  includeTensions: boolean,
  numChords: number,
  selectedProgression: string
): Promise<ProgressionResultFromAPI> {
  // Create cache key using semantic fingerprinting
  const cacheKey = getProgressionCacheKey(key, mode, includeTensions, numChords, selectedProgression);

  // Step 1: Check if we have a similar request already pending (deduplication)
  const pending = pendingRequests.get(cacheKey);
  if (pending) {
    logger.debug("Returning pending request", { cacheKey });
    return pending;
  }

  // Step 2: Check Redis cache for existing result
  const cachedResult = await redisCache.get<ProgressionResultFromAPI>(cacheKey);
  if (cachedResult) {
    logger.debug("Cache hit", { cacheKey });
    return cachedResult;
  }

  // Create request object for optimization
  const request: ProgressionRequest = {
    key,
    mode,
    includeTensions,
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

    return await xaiCircuitBreaker.execute(async () => {
      const response = await openai.chat.completions.create({
        model: "grok-4-fast-reasoning",
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
        max_tokens: 1000,
      });

      const jsonText = response.choices[0].message.content?.trim();
      if (!jsonText) {
        throw new Error("Empty response from API");
      }

      const parsedResult = JSON.parse(jsonText);

      // Enhanced validation with format checking
      const resultFromApi = validateAPIResponse(parsedResult);

      logger.debug("API response validated successfully", {
        chordCount: resultFromApi.progression.length,
        scaleCount: resultFromApi.scales.length,
      });

      return resultFromApi;
    });
  };

  // Step 5: Register pending request for deduplication
  pendingRequests.set(cacheKey, generateWithOptimizations());

  try {
    // Step 6: Execute with intelligent retry logic
    const result = await withRetry(
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

2. For each chord in the progression:
   - chordName: Use EXACT chord notation (e.g., 'Cmaj7', 'Am7', 'G7b9', 'D7alt', 'F#maj9')
   - musicalFunction: Detailed role (e.g., 'Tonic Major 7th', 'Dominant 7th with flat 9')
   - relationToKey: Roman numeral relative to detected key (e.g., 'Imaj7', 'V7', 'iim7', 'V7/ii')

3. Suggest 2 to 3 compatible scales:
   - Primary scale should match the detected key/mode
   - Additional scales can include pentatonic variants, altered scales, or related modes
   - name: Full scale name (e.g., 'C Major', 'A Dorian', 'G Mixolydian', 'C Minor Pentatonic')
   - rootNote: The root note matching key signature preference

4. Ensure chord names match guitar voicing standards and respect key signature accidentals

Return ONLY valid JSON matching this schema:
{
  "progression": [
    {
      "chordName": "string (IMPORTANT: Use exact chord notation - e.g., 'Cmaj7', 'Am7', 'G7b9', 'D7alt', 'F#maj9')",
      "musicalFunction": "string (e.g., 'Tonic Major 7th', 'Dominant 7th with flat 9', 'Subdominant Major 7th')",
      "relationToKey": "string (Roman numeral like 'Imaj7', 'V7', 'iim7', 'V7/ii')"
    }
  ],
  "scales": [
    {
      "name": "string (full scale name like 'G Major', 'A Dorian', 'C Minor Pentatonic', 'G Altered')",
      "rootNote": "string (e.g., 'G', 'A', 'C' - match the key signature accidental preference)"
    }
  ]
}

IMPORTANT: Return ONLY valid JSON, no additional text or markdown formatting.`;

  // Step 4: Create async operation
  const analyzeWithOptimizations = async (): Promise<ProgressionResultFromAPI> => {
    logger.info("Analyzing custom chord progression with XAI Grok API", { cacheKey, chordCount: chords.length });

    const openai = getOpenAI();

    return await xaiCircuitBreaker.execute(async () => {
      const response = await openai.chat.completions.create({
        model: "grok-4-fast-reasoning",
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

      const jsonText = response.choices[0].message.content?.trim();
      if (!jsonText) {
        throw new Error("Empty response from API");
      }

      const parsedResult = JSON.parse(jsonText);

      // Enhanced validation with format checking
      const resultFromApi = validateAPIResponse(parsedResult);

      logger.debug("Custom progression analysis validated successfully", {
        chordCount: resultFromApi.progression.length,
        scaleCount: resultFromApi.scales.length,
      });

      return resultFromApi;
    });
  };

  // Step 5: Register pending request for deduplication
  pendingRequests.set(cacheKey, analyzeWithOptimizations());

  try {
    // Step 6: Execute with intelligent retry logic
    const result = await withRetry(
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
