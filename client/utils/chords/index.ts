/**
 * Async Chord Library API
 *
 * Provides async access to chord voicings with automatic lazy loading.
 * This is the recommended API for new code to benefit from code splitting.
 *
 * Migration from old API:
 * - getChordVoicings(name) → await getChordVoicingsAsync(name)
 * - Add preloadCommonKeys() call after app initialization
 */

import type { ChordVoicing } from '../../types';
import type { ChordKey } from './types';
import { loadChordsByRoot } from './loader';
import { normalizeChordQuality } from '@shared/music/chordQualities';

// Re-export loader utilities
export { preloadCommonKeys, getCacheStats, clearChordCache } from './loader';

/**
 * Enharmonic root normalization
 * Maps less common enharmonics to their primary spelling
 */
const ENHARMONIC_ROOTS: Record<string, string> = {
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#',
  // Uncommon enharmonics
  'Cb': 'B',
  'Fb': 'E',
  'B#': 'C',
  'E#': 'F',
};

/**
 * Normalize root note to canonical form
 */
export function normalizeRoot(root: string): string {
  const upper = root.toUpperCase();
  return ENHARMONIC_ROOTS[upper] || upper;
}

/**
 * Extract root and quality from chord name
 */
function extractRootAndQuality(chordName: string): { root: string; quality: string } {
  const match = chordName.match(/^([A-G][#b]?)(.*)/i);
  if (!match) return { root: 'C', quality: 'major' };

  const [, rawRoot, rawSuffix] = match;
  const qualitySegment = (rawSuffix || '').split('/')[0] ?? '';

  return {
    root: normalizeRoot(rawRoot),
    quality: normalizeChordQuality(qualitySegment)
  };
}

/**
 * Get chord voicings asynchronously
 *
 * @param chordName - Chord name (e.g., "Cmaj7", "F#m", "Bb7")
 * @returns Promise resolving to array of chord voicings
 *
 * @example
 * const voicings = await getChordVoicingsAsync('Cmaj7');
 * console.log(voicings); // [{ frets: [...], position: 'Open' }, ...]
 */
export async function getChordVoicingsAsync(chordName: string): Promise<ChordVoicing[]> {
  const { root, quality } = extractRootAndQuality(chordName);

  // Load chord data for this root
  const chordData = await loadChordsByRoot(root);

  // Look up the specific chord
  const key: ChordKey = `${root}_${quality}`;
  const voicings = chordData[key];

  if (voicings && voicings.length > 0) {
    // TODO: Handle slash bass chords if needed
    return voicings;
  }

  // Fallback: try to find similar chord in the same key
  const similarChord = findSimilarChord(chordData, quality);
  if (similarChord) {
    console.warn(`Chord "${chordName}" not found, using similar chord:`, similarChord);
    return chordData[similarChord];
  }

  // Last resort: return basic major triad
  const majorKey: ChordKey = `${root}_major`;
  if (chordData[majorKey]) {
    console.warn(`Chord "${chordName}" not found, falling back to ${root} major`);
    return chordData[majorKey];
  }

  // If even major doesn't exist, return empty (shouldn't happen)
  console.error(`No chords found for root "${root}"`);
  return [];
}

/**
 * Find a similar chord quality in the same key
 */
function findSimilarChord(chordData: Record<string, ChordVoicing[]>, targetQuality: string): string | null {
  const availableChords = Object.keys(chordData);

  // Try quality families
  const qualityFamilies: Record<string, string[]> = {
    'major': ['major', 'maj7', '6', 'add9', '9', '13'],
    'minor': ['minor', 'min7', 'min9', 'min11', 'min6'],
    'dominant': ['7', '9', '13', '7#9', '7b9', '7#5'],
    'diminished': ['dim', 'dim7', 'min7b5'],
    'augmented': ['aug', 'aug7', '7#5'],
  };

  // Find which family the target quality belongs to
  for (const [family, qualities] of Object.entries(qualityFamilies)) {
    if (qualities.includes(targetQuality)) {
      // Look for other chords in the same family
      for (const quality of qualities) {
        const match = availableChords.find(key => key.endsWith(`_${quality}`));
        if (match) return match;
      }
    }
  }

  // No similar chord found
  return null;
}

/**
 * Check if a voicing uses all muted strings (indicates missing/unknown chord)
 */
export function isMutedVoicing(voicing: ChordVoicing): boolean {
  return voicing.frets.every(fret => fret === 'x');
}

/**
 * Batch load multiple chords efficiently
 * Groups chords by root to minimize dynamic imports
 */
export async function loadMultipleChords(chordNames: string[]): Promise<Map<string, ChordVoicing[]>> {
  const result = new Map<string, ChordVoicing[]>();

  // Group chords by root to batch load
  const chordsByRoot = new Map<string, string[]>();

  for (const name of chordNames) {
    const { root } = extractRootAndQuality(name);
    const existing = chordsByRoot.get(root) || [];
    existing.push(name);
    chordsByRoot.set(root, existing);
  }

  // Load all roots in parallel
  const loadPromises = Array.from(chordsByRoot.entries()).map(async ([root, names]) => {
    const chordData = await loadChordsByRoot(root);

    for (const name of names) {
      const { root: chordRoot, quality } = extractRootAndQuality(name);
      const key: ChordKey = `${chordRoot}_${quality}`;
      const voicings = chordData[key] || [];
      result.set(name, voicings);
    }
  });

  await Promise.all(loadPromises);
  return result;
}

/**
 * Preload all chord data into memory
 * Call this on app init to enable synchronous access via getChordVoicingsSync
 */
export async function preloadAllChords(): Promise<void> {
  const allKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  await Promise.all(allKeys.map(key => loadChordsByRoot(key)));
  console.log('✅ All chord data preloaded');
}
