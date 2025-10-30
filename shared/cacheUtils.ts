/**
 * Shared cache utility functions
 * Ensures cache keys are consistent between client and server
 */

/**
 * Generate a cache key for a chord progression request
 * This function must be identical in both client and server code
 * 
 * @param key - Musical key (e.g., 'C', 'F#', 'Bb')
 * @param mode - Mode (e.g., 'major', 'minor', 'dorian')
 * @param includeTensions - Whether to include tension chords
 * @param numChords - Number of chords in progression
 * @param selectedProgression - Progression pattern (e.g., 'auto', 'I-IV-V')
 * @returns Cache key string
 */
export function getProgressionCacheKey(
  key: string,
  mode: string,
  includeTensions: boolean,
  numChords: number,
  selectedProgression: string
): string {
  const semanticParts = [
    key.toLowerCase(),
    mode.toLowerCase(),
    includeTensions ? 'tensions' : 'no-tensions',
    numChords.toString(),
    selectedProgression.toLowerCase().replace(/[^a-z0-9]/g, '-')
  ];
  
  return `progression:${semanticParts.join(':')}`;
}

