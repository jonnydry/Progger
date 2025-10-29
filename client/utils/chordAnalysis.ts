/**
 * Chord Analysis Utilities
 * Provides comprehensive chord theory analysis and scale compatibility
 */

import { getScaleIntervals, getScaleNotes } from './scaleLibrary';
import { noteToValue, valueToNote, displayNote, transposeNote } from './musicTheory';

export interface ChordAnalysis {
  formula: string;
  intervals: string[];
  notes: string[];
  scaleDegrees: string[];
  compatibleScales: string[];
}

/**
 * Standard chord formulas mapping chord suffixes to interval patterns
 * relative to the root note (0 = root, 2 = major 2nd, etc.)
 */
const CHORD_FORMULAS: Record<string, { formula: string; intervals: number[] }> = {
  // Triads
  'major': { formula: '1-3-5', intervals: [0, 4, 7] },
  'minor': { formula: '1-♭3-5', intervals: [0, 3, 7] },
  'dim': { formula: '1-♭3-♭5', intervals: [0, 3, 6] },
  'aug': { formula: '1-3-#5', intervals: [0, 4, 8] },
  'sus2': { formula: '1-2-5', intervals: [0, 2, 7] },
  'sus4': { formula: '1-4-5', intervals: [0, 5, 7] },
  '5': { formula: '1-5', intervals: [0, 7] },

  // Seventh chords
  '7': { formula: '1-3-5-♭7', intervals: [0, 4, 7, 10] },
  'maj7': { formula: '1-3-5-7', intervals: [0, 4, 7, 11] },
  'min7': { formula: '1-♭3-5-♭7', intervals: [0, 3, 7, 10] },
  'dim7': { formula: '1-♭3-♭5-♭♭7', intervals: [0, 3, 6, 9] },
  'min7b5': { formula: '1-♭3-♭5-♭7', intervals: [0, 3, 6, 10] },

  // Extended chords
  '9': { formula: '1-3-5-♭7-9', intervals: [0, 4, 7, 10, 14] },
  'maj9': { formula: '1-3-5-7-9', intervals: [0, 4, 7, 11, 14] },
  'min9': { formula: '1-♭3-5-♭7-9', intervals: [0, 3, 7, 10, 14] },
  '11': { formula: '1-3-5-♭7-9-11', intervals: [0, 4, 7, 10, 14, 17] },
  'maj11': { formula: '1-3-5-7-9-11', intervals: [0, 4, 7, 11, 14, 17] },
  'min11': { formula: '1-♭3-5-♭7-9-11', intervals: [0, 3, 7, 10, 14, 17] },
  '13': { formula: '1-3-5-♭7-9-11-13', intervals: [0, 4, 7, 10, 14, 17, 21] },
  'maj13': { formula: '1-3-5-7-9-11-13', intervals: [0, 4, 7, 11, 14, 17, 21] },
  'min13': { formula: '1-♭3-5-♭7-9-11-13', intervals: [0, 3, 7, 10, 14, 17, 21] },

  // Altered chords
  '7b9': { formula: '1-3-5-♭7-♭9', intervals: [0, 4, 7, 10, 13] },
  '7#9': { formula: '1-3-5-♭7-#9', intervals: [0, 4, 7, 10, 15] },
  '7b5': { formula: '1-3-♭5-♭7', intervals: [0, 4, 6, 10] },
  '7#5': { formula: '1-3-#5-♭7', intervals: [0, 4, 8, 10] },
  '7alt': { formula: '1-3-♭5-♭7-♭9-#9', intervals: [0, 4, 6, 10, 13, 15] },

  // Add chords
  'add9': { formula: '1-3-5-9', intervals: [0, 4, 7, 14] },
  'add11': { formula: '1-3-5-11', intervals: [0, 4, 7, 17] },
  'madd9': { formula: '1-♭3-5-9', intervals: [0, 3, 7, 14] },
  '6': { formula: '1-3-5-6', intervals: [0, 4, 7, 9] },
  'min6': { formula: '1-♭3-5-6', intervals: [0, 3, 7, 9] },
  '6/9': { formula: '1-3-5-6-9', intervals: [0, 4, 7, 9, 14] },
  '7sus4': { formula: '1-4-5-♭7', intervals: [0, 5, 7, 10] },
  '9sus4': { formula: '1-4-5-♭7-9', intervals: [0, 5, 7, 10, 14] },
  '9#11': { formula: '1-3-5-♭7-9-#11', intervals: [0, 4, 7, 10, 14, 18] },

  // Complex compound extensions
  'maj7#11': { formula: '1-3-5-7-#11', intervals: [0, 4, 7, 11, 18] },
  'maj7b13': { formula: '1-3-5-7-♭13', intervals: [0, 4, 7, 11, 20] },
  'maj7#9': { formula: '1-3-5-7-#9', intervals: [0, 4, 7, 11, 15] },
  '7b9b13': { formula: '1-3-5-♭7-♭9-♭13', intervals: [0, 4, 7, 10, 13, 20] },
  '7#9b13': { formula: '1-3-5-♭7-#9-♭13', intervals: [0, 4, 7, 10, 15, 20] },
};

const INTERVAL_NAMES = [
  'R', // 0: Root
  'b2', // 1: Minor 2nd
  '2', // 2: Major 2nd
  'b3', // 3: Minor 3rd
  '3', // 4: Major 3rd
  '4', // 5: Perfect 4th
  'b5', // 6: Tritone/Diminished 5th
  '5', // 7: Perfect 5th
  '#5', // 8: Augmented 5th
  '6', // 9: Major 6th
  'b7', // 10: Minor 7th
  '7', // 11: Major 7th
  '8', // 12: Octave
  'b9', // 13: Minor 9th
  '9', // 14: Major 9th
  '#9', // 15: Augmented 9th
  'b11', // 17: Minor 11th
  '#11', // 18: Augmented 11th
  '12', // 19: Perfect 12th
  'b13', // 20: Minor 13th
  '13', // 21: Major 13th
];

const SCALE_DEGREES = [
  '1', // 0: Root
  'b2', // 1: Flat 2nd
  '2', // 2: 2nd
  'b3', // 3: Flat 3rd/minor
  '3', // 4: 3rd/major
  '4', // 5: 4th
  'b5', // 6: Flat 5th/diminished
  '5', // 7: 5th/perfect
  '#5', // 8: Sharp 5th/augmented
  '6', // 9: 6th
  'b7', // 10: Flat 7th
  '7', // 11: 7th
  '8', // 12: Octave
  'b9', // 13: Flat 9th
  '9', // 14: 9th
  '#9', // 15: Sharp 9th
  '10', // 16: 10th
  'b11', // 17: Flat 11th
  '11', // 18: 11th
  '#11', // 19: Sharp 11th
  '12', // 20: 12th
  'b13', // 21: Flat 13th
  '13', // 22: 13th
];

/**
 * Common scales and their interval formulas
 */
const COMMON_SCALES: Record<string, number[]> = {
  'major': [0, 2, 4, 5, 7, 9, 11],
  'minor': [0, 2, 3, 5, 7, 8, 10],
  'harmonic minor': [0, 2, 3, 5, 7, 8, 11],
  'melodic minor': [0, 2, 3, 5, 7, 9, 11],
  'dorian': [0, 2, 3, 5, 7, 9, 10],
  'phrygian': [0, 1, 3, 5, 7, 8, 10],
  'lydian': [0, 2, 4, 6, 7, 9, 11],
  'mixolydian': [0, 2, 4, 5, 7, 9, 10],
  'locrian': [0, 1, 3, 5, 6, 8, 10],
  'pentatonic major': [0, 2, 4, 7, 9],
  'pentatonic minor': [0, 3, 5, 7, 10],
  'blues': [0, 3, 5, 6, 7, 10],
  'whole tone': [0, 2, 4, 6, 8, 10],
  'diminished': [0, 2, 3, 5, 6, 8, 9, 11],
  'altered': [0, 1, 3, 4, 6, 8, 10],
  'bebop dominant': [0, 2, 4, 5, 7, 9, 10, 11],
};

/**
 * Extract root note and quality from chord name
 * @param chordName - Full chord name (e.g., "Cmaj7", "F#m7b5")
 * @returns Object with root and quality
 */
function parseChordName(chordName: string): { root: string; quality: string } {
  const match = chordName.match(/^([A-G][#b]?)(.*)/i);
  if (!match) return { root: 'C', quality: 'major' };
  return {
    root: match[1],
    quality: match[2].toLowerCase() || 'major'
  };
}

/**
 * Get the chord formula notation (1-3-5, etc.)
 * @param chordName - Full chord name
 * @returns Formula string or 'Unknown' if not found
 */
export function getChordFormula(chordName: string): string {
  const { quality } = parseChordName(chordName);
  const formulaData = CHORD_FORMULAS[quality];
  return formulaData?.formula || 'Unknown';
}

/**
 * Get the interval names for a chord (Major 3rd, Perfect 5th, etc.)
 * @param chordName - Full chord name
 * @returns Array of interval names
 */
export function getChordIntervals(chordName: string): string[] {
  const { quality } = parseChordName(chordName);
  const formulaData = CHORD_FORMULAS[quality];

  if (!formulaData) return ['Unknown chord quality'];

  return formulaData.intervals.map(interval => INTERVAL_NAMES[interval] || `Unknown (${interval})`);
}

/**
 * Get the actual note names in a chord
 * @param chordName - Full chord name (e.g., "Cmaj7")
 * @param rootOverride - Optional root note override for key context
 * @returns Array of note names
 */
export function getChordNotes(chordName: string, rootOverride?: string): string[] {
  const { root, quality } = parseChordName(chordName);
  const formulaData = CHORD_FORMULAS[quality];

  if (!formulaData) return [root]; // Fallback to just root note

  const effectiveRoot = rootOverride || root;
  const rootValue = noteToValue(effectiveRoot);

  return formulaData.intervals.map(interval => {
    const noteValue = (rootValue + interval) % 12;
    return valueToNote(noteValue);
  });
}

/**
 * Get scale degrees for a chord relative to a key
 * @param chordName - Full chord name
 * @param key - Musical key (e.g., "C", "F#")
 * @returns Array of scale degrees and interval descriptions
 */
export function getChordScaleDegrees(chordName: string, key: string): string[] {
  const { root } = parseChordName(chordName);
  const formulaData = CHORD_FORMULAS[parseChordName(chordName).quality];

  if (!formulaData) return ['Unknown'];

  const rootValue = noteToValue(root);
  const keyValue = noteToValue(key);
  const rootInKeyContext = (rootValue - keyValue + 12) % 12;

  return [SCALE_DEGREES[rootInKeyContext] || `Unknown (${rootInKeyContext})`];
}

/**
 * Find scales that contain all notes of a given chord
 * @param chordName - Full chord name
 * @param key - Musical key context (for prioritizing relevant scales)
 * @returns Array of scale names that contain the chord
 */
export function getScalesContainingChord(chordName: string, key?: string): string[] {
  const { quality } = parseChordName(chordName);
  const formulaData = CHORD_FORMULAS[quality];

  if (!formulaData) return [];

  const chordIntervals = new Set(formulaData.intervals);
  const matchingScales: string[] = [];

  for (const [scaleName, scaleIntervals] of Object.entries(COMMON_SCALES)) {
    // Check if the scale contains all chord intervals
    const scaleHasAllChordTones = formulaData.intervals.every(interval =>
      scaleIntervals.includes(interval % 12)
    );

    if (scaleHasAllChordTones) {
      matchingScales.push(scaleName);
    }
  }

  // Prioritize scales relevant to the key context
  if (key) {
    const keyModes: Record<string, string[]> = {
      'major': ['major', 'lydian', 'mixolydian'],
      'minor': ['minor', 'dorian', 'phrygian', 'aeolian'],
      'ionian': ['major'],
      'dorian': ['dorian'],
      'phrygian': ['phrygian'],
      'lydian': ['lydian'],
      'mixolydian': ['mixolydian'],
      'aeolian': ['minor'],
      'locrian': ['locrian'],
    };

    const relevantModes = keyModes[quality] || keyModes['major'];

    // Sort scales with key-relevant ones first
    matchingScales.sort((a, b) => {
      const aRelevant = relevantModes.includes(a);
      const bRelevant = relevantModes.includes(b);

      if (aRelevant && !bRelevant) return -1;
      if (!aRelevant && bRelevant) return 1;
      return 0;
    });
  }

  return matchingScales;
}

/**
 * Get comprehensive chord analysis
 * @param chordName - Full chord name
 * @param key - Musical key context
 * @returns Complete chord analysis object
 */
export function analyzeChord(chordName: string, key: string = 'C'): ChordAnalysis {
  const { root } = parseChordName(chordName);

  return {
    formula: getChordFormula(chordName),
    intervals: getChordIntervals(chordName),
    notes: getChordNotes(chordName, key),
    scaleDegrees: getChordScaleDegrees(chordName, key),
    compatibleScales: getScalesContainingChord(chordName, key).slice(0, 5) // Limit to top 5
  };
}
