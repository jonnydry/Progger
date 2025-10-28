import type { ChordInProgression, ProgressionResult, ScaleInfo } from '../types';
import { getChordVoicings } from '../utils/chordLibrary';
import { getScaleFingering, getScaleNotes } from '../utils/scaleLibrary';

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
    const response = await Promise.race([
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const resultFromApi = await response.json() as ProgressionResultFromAPI;
    
    if (!resultFromApi.progression || !resultFromApi.scales || !Array.isArray(resultFromApi.progression) || !Array.isArray(resultFromApi.scales)) {
        throw new Error("Invalid data structure received from API.");
    }
    if (resultFromApi.progression.some(p => !p.chordName || !p.musicalFunction || !p.relationToKey)) {
        throw new Error("API returned incomplete chord data (missing name, function, or relation to key).");
    }
    if (resultFromApi.scales.some(s => !s.name || !s.rootNote)) {
        throw new Error("API returned incomplete scale data (missing name or root note).");
    }

    const progression: ChordInProgression[] = resultFromApi.progression.map(chord => {
        const voicings = getChordVoicings(chord.chordName);

        // Validate that we have proper voicings (not just the "Unknown" fallback)
        if (voicings.length === 1 && voicings[0].frets.every(f => f === 'x')) {
            console.warn(`⚠️ No voicing found for chord: ${chord.chordName}. This chord may not display properly.`);
        }

        return {
            chordName: chord.chordName,
            musicalFunction: chord.musicalFunction,
            relationToKey: chord.relationToKey,
            voicings
        };
    });

    const scales: ScaleInfo[] = resultFromApi.scales.map(scale => ({
        name: scale.name,
        rootNote: scale.rootNote,
        notes: getScaleNotes(scale.rootNote, scale.name),
        fingering: getScaleFingering(scale.name, scale.rootNote)
    }));

    const finalResult = { progression, scales };

    // Cache the result with 24-hour TTL
    setCache(cacheKey, finalResult);

    // Periodically clean up expired cache entries (1% chance on each request)
    if (Math.random() < 0.01) {
      clearExpiredCache();
    }

    return finalResult;
  } catch (error) {
    console.error("Error generating chord progression:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse the response from the AI. The format was invalid.");
    }
    throw new Error("Failed to generate chord progression. The AI might be busy, or the request was invalid.");
  }
}
