import type { ChordInProgression, ProgressionResult, ScaleInfo } from '../types';
import { getChordVoicings, isMutedVoicing } from '../utils/chordLibrary';
import { getScaleFingering, getScaleNotes } from '../utils/scaleLibrary';
import {
  MusicTheoryError,
  APIUnavailableError,
  InvalidAPIResponseError,
  ProcessingPipelineError,
  ChordNotFoundError,
  ScaleNotSupportedError,
  isRecoverableError,
  getErrorSeverity,
  createErrorLog
} from '../utils/errors';
import { getProcessingConfig } from '../utils/processingConfig';

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

interface CacheEntry {
  data: ProgressionResult;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

const CACHE_TTL_24HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function getCacheKey(key: string, mode: string, includeTensions: boolean, numChords: number, selectedProgression: string): string {
  return `progression-${key}-${mode}-${includeTensions}-${numChords}-${selectedProgression}`;
}

function getFromCache(cacheKey: string): ProgressionResult | null {
  try {
    const cachedItem = localStorage.getItem(cacheKey);
    if (!cachedItem) return null;

    const entry: CacheEntry = JSON.parse(cachedItem);
    const now = Date.now();

    // Check if cache entry is still valid
    if (now - entry.timestamp < entry.ttl) {
      console.log("Serving from cache:", cacheKey);
      return entry.data;
    } else {
      // Remove expired cache entry
      localStorage.removeItem(cacheKey);
    }
  } catch (error) {
    console.warn("Could not read from localStorage", error);
  }
  return null;
}

function setCache(cacheKey: string, data: ProgressionResult): void {
  try {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: CACHE_TTL_24HOURS
    };
    localStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch (error) {
    console.warn("Could not write to localStorage", error);
  }
}

function clearExpiredCache(): void {
  try {
    const keys = Object.keys(localStorage);
    const now = Date.now();

    keys.forEach(key => {
      if (key.startsWith('progression-')) {
        try {
          const entry: CacheEntry = JSON.parse(localStorage.getItem(key)!);
          if (now - entry.timestamp >= entry.ttl) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          // If we can't parse it, remove it
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.warn("Error during cache cleanup", error);
  }
}

export async function generateChordProgression(key: string, mode: string, includeTensions: boolean, numChords: number, selectedProgression: string): Promise<ProgressionResult> {
  const config = getProcessingConfig();
  const cacheKey = getCacheKey(key, mode, includeTensions, numChords, selectedProgression);

  // Try to get from cache first
  const cachedResult = getFromCache(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }
  
  try {
    console.log("Fetching from backend API:", cacheKey);

    // Create a timeout promise that rejects after 30 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out after 30 seconds')), 30000);
    });

    // Race between the fetch and the timeout
    let response: Response;
    try {
      response = await Promise.race([
        fetch('/api/generate-progression', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key,
            mode,
            includeTensions,
            numChords,
            selectedProgression,
          }),
        }),
        timeoutPromise
      ]) as Response;
    } catch (error) {
      // Network-level failure
      throw new APIUnavailableError('/api/generate-progression', undefined);
    }

    if (!response.ok) {
      // API returned error status
      throw new APIUnavailableError('/api/generate-progression', response.status);
    }

    let resultFromApi: ProgressionResultFromAPI;
    try {
      resultFromApi = await response.json() as ProgressionResultFromAPI;

      // Validate API response structure
      if (!resultFromApi.progression || !resultFromApi.scales || !Array.isArray(resultFromApi.progression) || !Array.isArray(resultFromApi.scales)) {
          throw new Error("Invalid data structure received from API.");
      }
      if (resultFromApi.progression.some(p => !p.chordName || !p.musicalFunction || !p.relationToKey)) {
          throw new Error("API returned incomplete chord data (missing name, function, or relation to key).");
      }
      if (resultFromApi.scales.some(s => !s.name || !s.rootNote)) {
          throw new Error("API returned incomplete scale data (missing name or root note).");
      }
    } catch (parseError) {
      throw new InvalidAPIResponseError('Valid JSON matching API schema', `${parseError}`);
    }

    // Enhanced processing: Parallel computation of voicings and scale data
    console.log(`🎵 Processing ${resultFromApi.progression.length} chords and ${resultFromApi.scales.length} scales in parallel`);

    const [chordPromises, scalePromises] = await Promise.allSettled([
      // Parallel chord processing with enhanced error handling
      Promise.allSettled(
        resultFromApi.progression.map(async (chord) => {
          const voicings = getChordVoicings(chord.chordName);

          // Enhanced validation with smart fallback detection
          if (voicings.length === 1 && isMutedVoicing(voicings[0])) {
            console.warn(`🧠 Smart fallback used for chord: ${chord.chordName}`);
          }

          return {
            chordName: chord.chordName,
            musicalFunction: chord.musicalFunction,
            relationToKey: chord.relationToKey,
            voicings
          };
        })
      ),
      // Parallel scale processing
      Promise.allSettled(
        resultFromApi.scales.map(async (scale) => ({
          name: scale.name,
          rootNote: scale.rootNote,
          notes: getScaleNotes(scale.rootNote, scale.name),
          fingering: getScaleFingering(scale.name, scale.rootNote)
        }))
      )
    ]);

    // Resilience: Handle partial failures gracefully
    const progression: ChordInProgression[] = chordPromises.status === 'fulfilled'
      ? chordPromises.value.map(result =>
          result.status === 'fulfilled'
            ? result.value
            : {
                chordName: 'Unknown',
                musicalFunction: 'Unknown',
                relationToKey: 'unknown',
                voicings: [{ frets: ['x', 'x', 'x', 'x', 'x', 'x'], position: 'Error' }]
              }
        )
      : [];

    const scales: ScaleInfo[] = scalePromises.status === 'fulfilled'
      ? scalePromises.value.map(result =>
          result.status === 'fulfilled'
            ? result.value
            : {
                name: 'Unknown',
                rootNote: 'C',
                notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
                fingering: [[0, 2, 4, 5, 7, 9, 11]]
              }
        )
      : [];

    console.log(`✅ Processed ${progression.length} chords and ${scales.length} scales successfully`);

    const finalResult = { progression, scales };

    // Cache the result with 24-hour TTL
    setCache(cacheKey, finalResult);

    // Periodically clean up expired cache entries (1% chance on each request)
    if (Math.random() < 0.01) {
      clearExpiredCache();
    }

    return finalResult;
  } catch (error) {
    console.error("Error generating chord progression:", createErrorLog(error, { key, mode, cacheKey }));

    // Handle API response validation errors
    if (error instanceof Error && error.message.includes("Invalid data structure") ||
        error.message.includes("incomplete chord data") ||
        error.message.includes("incomplete scale data")) {
      throw new InvalidAPIResponseError(
        'ProgressionResult { progression: SimpleChord[], scales: SimpleScale[] }',
        error.message
      );
    }

    // Check if this is a recoverable error
    if (isRecoverableError(error)) {
      console.log(`🔄 Attempting automatic recovery for ${error.name}`);

      try {
        let recoveredResult;
        if (error instanceof APIUnavailableError) {
          recoveredResult = await error.recover(cacheKey);
        } else if (error instanceof InvalidAPIResponseError) {
          recoveredResult = await error.recover(key, numChords);
        } else {
          recoveredResult = await error.recover();
        }

        if (recoveredResult) {
          console.log(`✅ Successfully recovered from ${error.name}`);
          return recoveredResult;
        }
      } catch (recoveryError) {
        console.warn(`❌ Recovery failed for ${error.name}:`, recoveryError);
      }
    }

    // Re-throw the original error or create a user-friendly message
    if (error instanceof SyntaxError) {
      throw new InvalidAPIResponseError('Valid JSON', 'SyntaxError during JSON parsing');
    }

    if (error instanceof MusicTheoryError) {
      throw error; // Re-throw our custom errors
    }

    // Generic fallback for unexpected errors
    throw new Error("Failed to generate chord progression. The service may be temporarily unavailable.");
  }
}
