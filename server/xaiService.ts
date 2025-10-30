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

    throw new Error("Failed to generate chord progression. The AI might be busy, or the request was invalid.");
  }
}
