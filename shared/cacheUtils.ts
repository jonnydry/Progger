/**
 * Shared cache utility functions
 * Ensures cache keys are consistent between client and server
 */

/**
 * Normalize a progression string for consistent caching
 * Removes whitespace, converts to lowercase, and removes special characters
 *
 * @param progression - Progression pattern (e.g., 'I-IV-V', 'i - iv - v', 'I - IV - V')
 * @returns Normalized progression string
 */
function normalizeProgression(progression: string): string {
  return progression
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "") // Remove all whitespace
    .replace(/[^a-z0-9]/g, "-"); // Replace special chars with dashes
}

/**
 * Generate a cache key for a chord progression request
 * This function must be identical in both client and server code
 *
 * Normalization ensures cache hits for similar requests:
 * - 'I-IV-V' === 'i-iv-v' === 'I - IV - V'
 * - 'C Major' === 'c major' === 'C  Major'
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
  selectedProgression: string,
): string {
  const semanticParts = [
    key.toLowerCase().trim(),
    mode.toLowerCase().trim(),
    includeTensions ? "tensions" : "no-tensions",
    numChords.toString(),
    normalizeProgression(selectedProgression),
  ];

  return `progression:${semanticParts.join(":")}`;
}
