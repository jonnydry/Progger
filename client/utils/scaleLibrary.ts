/**
 * Scale Library - Guitar Scale Patterns Database
 *
 * This file contains a comprehensive library of guitar scale fingering patterns.
 *
 * CRITICAL GUITAR CONVENTION:
 * All fingering arrays follow standard guitar string order:
 * fingering[0] = Low E (6th string)
 * fingering[1] = A (5th string)
 * fingering[2] = D (4th string)
 * fingering[3] = G (3rd string)
 * fingering[4] = B (2nd string)
 * fingering[5] = High E (1st string)
 *
 * Visual Representation:
 * ┌────────────┐
 * │ E (1st)    │ ← fingering[5] = [frets for high E]
 * │ B (2nd)    │ ← fingering[4] = [frets for B string]
 * │ G (3rd)    │ ← fingering[3] = [frets for G string]
 * │ D (4th)    │ ← fingering[2] = [frets for D string]
 * │ A (5th)    │ ← fingering[1] = [frets for A string]
 * │ E (6th)    │ ← fingering[0] = [frets for low E]
 * └────────────┘
 *   Thinnest       Thickest
 *
 * Each inner array contains fret numbers where scale notes appear on that string.
 *
 * Example - C Major Position 1:
 * fingering[0] = [8, 10, 12]  // Low E: C(8), D(10), E(12)
 * fingering[1] = [8, 10, 12]  // A string: C(8), D(10), E(12)
 * ...
 */

import { noteToValue, valueToNote, ALL_NOTES_SHARP, calculateSemitoneDistance } from './musicTheory';

export interface ScalePattern {
  intervals: number[];
  fingerings: number[][][];
  positions?: string[];
}

type ScaleLibrary = Record<string, ScalePattern>;

export const SCALE_LIBRARY: ScaleLibrary = {
  'major': {
    intervals: [0, 2, 4, 5, 7, 9, 11],
    fingerings: [
      [[8, 10, 12], [8, 10, 12], [9, 10, 12], [9, 10, 12], [10, 12, 13], [8, 10, 12]],
      [[3, 5, 7], [3, 5, 7], [4, 5, 7], [4, 5, 7], [5, 7, 8], [3, 5, 7]],
      [[0, 2, 3], [0, 2, 3], [0, 2, 4], [0, 2, 4], [0, 2, 3], [0, 2, 3]],
      [[5, 7, 8], [5, 7, 8], [5, 7, 9], [5, 7, 9], [7, 8, 10], [5, 7, 8]],
      [[10, 12, 14], [10, 12, 13], [10, 12, 14], [10, 12, 14], [12, 13, 15], [10, 12, 14]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },
  
  'ionian': {
    intervals: [0, 2, 4, 5, 7, 9, 11],
    fingerings: [
      [[8, 10, 12], [8, 10, 12], [9, 10, 12], [9, 10, 12], [10, 12, 13], [8, 10, 12]],
      [[3, 5, 7], [3, 5, 7], [4, 5, 7], [4, 5, 7], [5, 7, 8], [3, 5, 7]],
      [[0, 2, 3], [0, 2, 3], [0, 2, 4], [0, 2, 4], [0, 2, 3], [0, 2, 3]],
    ],
  },
  
  'dorian': {
    intervals: [0, 2, 3, 5, 7, 9, 10],
    fingerings: [
      [[10, 12, 13], [10, 12, 13], [10, 12, 14], [10, 12, 14], [10, 12, 13], [10, 12, 13]],
      [[5, 7, 8], [5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 7, 8], [5, 7, 8]],
      [[0, 2, 3], [0, 2, 3], [0, 2, 4], [0, 2, 4], [0, 2, 3], [0, 2, 3]],
    ],
  },
  
  'phrygian': {
    intervals: [0, 1, 3, 5, 7, 8, 10],
    fingerings: [
      [[8, 10, 11], [8, 10, 12], [9, 10, 12], [9, 10, 12], [8, 10, 12], [8, 10, 11]],
      [[3, 5, 6], [3, 5, 7], [4, 5, 7], [4, 5, 7], [3, 5, 7], [3, 5, 6]],
      [[0, 1, 3], [0, 2, 3], [0, 2, 4], [0, 2, 4], [0, 2, 3], [0, 1, 3]],
    ],
  },
  
  'lydian': {
    intervals: [0, 2, 4, 6, 7, 9, 11],
    fingerings: [
      [[7, 9, 11], [7, 9, 11], [8, 9, 11], [9, 11, 12], [9, 11, 12], [7, 9, 11]],
      [[2, 4, 6], [2, 4, 6], [3, 4, 6], [4, 6, 7], [4, 6, 7], [2, 4, 6]],
      [[0, 2, 4], [0, 2, 4], [1, 2, 4], [2, 4, 5], [2, 4, 5], [0, 2, 4]],
    ],
  },
  
  'mixolydian': {
    intervals: [0, 2, 4, 5, 7, 9, 10],
    fingerings: [
      [[10, 12, 14], [10, 12, 13], [10, 12, 14], [10, 12, 14], [10, 12, 13], [10, 12, 14]],
      [[5, 7, 9], [5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 7, 8], [5, 7, 9]],
      [[0, 2, 4], [0, 2, 3], [0, 2, 4], [0, 2, 4], [0, 2, 3], [0, 2, 4]],
    ],
  },
  
  'aeolian': {
    intervals: [0, 2, 3, 5, 7, 8, 10],
    fingerings: [
      [[5, 7, 8], [5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 7, 8], [5, 7, 8]],
      [[0, 2, 3], [0, 2, 3], [0, 2, 4], [0, 2, 4], [0, 2, 3], [0, 2, 3]],
      [[8, 10, 12], [8, 10, 11], [9, 10, 12], [9, 10, 12], [8, 10, 12], [8, 10, 12]],
    ],
  },
  
  'minor': {
    intervals: [0, 2, 3, 5, 7, 8, 10],
    fingerings: [
      [[5, 7, 8], [5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 7, 8], [5, 7, 8]],
      [[0, 2, 3], [0, 2, 3], [0, 2, 4], [0, 2, 4], [0, 2, 3], [0, 2, 3]],
      [[8, 10, 12], [8, 10, 11], [9, 10, 12], [9, 10, 12], [8, 10, 12], [8, 10, 12]],
      [[3, 5, 6], [3, 5, 6], [4, 5, 7], [4, 5, 7], [3, 5, 6], [3, 5, 6]],
      [[10, 12, 13], [10, 12, 13], [10, 12, 14], [10, 12, 14], [10, 12, 13], [10, 12, 13]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },
  
  'locrian': {
    intervals: [0, 1, 3, 5, 6, 8, 10],
    fingerings: [
      [[6, 8, 10], [7, 8, 10], [7, 9, 10], [7, 9, 10], [6, 8, 10], [6, 8, 10]],
      [[1, 3, 5], [2, 3, 5], [2, 4, 5], [2, 4, 5], [1, 3, 5], [1, 3, 5]],
      [[0, 1, 3], [0, 1, 3], [0, 2, 3], [0, 2, 3], [0, 1, 3], [0, 1, 3]],
    ],
  },
  
  'harmonic minor': {
    intervals: [0, 2, 3, 5, 7, 8, 11],
    fingerings: [
      [[5, 7, 8], [5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 8, 9], [5, 7, 8]],
      [[0, 2, 3], [0, 2, 3], [0, 2, 4], [0, 2, 4], [0, 3, 4], [0, 2, 3]],
      [[8, 10, 11], [8, 10, 11], [9, 10, 12], [9, 10, 12], [8, 11, 12], [8, 10, 11]],
    ],
  },
  
  'melodic minor': {
    intervals: [0, 2, 3, 5, 7, 9, 11],
    fingerings: [
      [[5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 7, 9], [5, 7, 9], [5, 7, 8]],
      [[0, 2, 3], [0, 2, 4], [0, 2, 4], [0, 2, 4], [0, 2, 4], [0, 2, 3]],
      [[8, 10, 12], [8, 10, 12], [9, 10, 12], [9, 10, 12], [8, 10, 12], [8, 10, 12]],
    ],
  },
  
  'pentatonic major': {
    intervals: [0, 2, 4, 7, 9],
    fingerings: [
      [[5, 7, 9], [5, 7, 9], [5, 7, 9], [5, 7, 9], [5, 7, 10], [5, 7, 9]],
      [[2, 4, 7], [2, 5, 7], [2, 4, 7], [2, 4, 7], [2, 5, 7], [2, 4, 7]],
      [[9, 12, 14], [10, 12, 14], [9, 12, 14], [9, 12, 14], [10, 12, 15], [9, 12, 14]],
      [[14, 17, 19], [15, 17, 19], [14, 17, 19], [14, 17, 19], [15, 17, 20], [14, 17, 19]],
      [[19, 21, 24], [19, 22, 24], [19, 21, 24], [19, 21, 24], [20, 22, 24], [19, 21, 24]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },
  
  'pentatonic minor': {
    intervals: [0, 3, 5, 7, 10],
    fingerings: [
      [[5, 8, 10], [5, 8, 10], [5, 7, 10], [5, 7, 10], [5, 8, 10], [5, 8, 10]],
      [[0, 3, 5], [0, 3, 5], [0, 2, 5], [0, 2, 5], [0, 3, 5], [0, 3, 5]],
      [[8, 10, 13], [8, 10, 13], [7, 10, 12], [7, 10, 12], [8, 10, 13], [8, 10, 13]],
      [[13, 15, 17], [13, 15, 17], [12, 15, 17], [12, 15, 17], [13, 15, 17], [13, 15, 17]],
      [[17, 20, 22], [17, 20, 22], [17, 19, 22], [17, 19, 22], [17, 20, 22], [17, 20, 22]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },
  
  'blues': {
    intervals: [0, 3, 5, 6, 7, 10],
    fingerings: [
      [[5, 8, 10], [5, 8, 10], [5, 7, 8], [5, 7, 8], [5, 8, 10], [5, 8, 10]],
      [[0, 3, 5], [0, 3, 5], [0, 2, 3], [0, 2, 3], [0, 3, 5], [0, 3, 5]],
      [[10, 13, 15], [10, 13, 15], [10, 12, 13], [10, 12, 13], [10, 13, 15], [10, 13, 15]],
    ],
  },
  
  'whole tone': {
    intervals: [0, 2, 4, 6, 8, 10],
    fingerings: [
      [[6, 8, 10], [6, 8, 10], [6, 8, 10], [7, 9, 11], [7, 9, 11], [6, 8, 10]],
      [[1, 3, 5], [1, 3, 5], [1, 3, 5], [2, 4, 6], [2, 4, 6], [1, 3, 5]],
    ],
  },
  
  'diminished': {
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
    fingerings: [
      [[6, 7, 9], [6, 8, 9], [6, 7, 9], [7, 8, 10], [6, 8, 9], [6, 7, 9]],
      [[1, 2, 4], [1, 3, 4], [1, 2, 4], [2, 3, 5], [1, 3, 4], [1, 2, 4]],
    ],
  },
  
  'altered': {
    intervals: [0, 1, 3, 4, 6, 8, 10],
    fingerings: [
      [[6, 7, 9], [7, 8, 10], [6, 8, 9], [7, 9, 10], [6, 8, 10], [6, 7, 9]],
      [[1, 2, 4], [2, 3, 5], [1, 3, 4], [2, 4, 5], [1, 3, 5], [1, 2, 4]],
    ],
  },
  
  'bebop dominant': {
    intervals: [0, 2, 4, 5, 7, 9, 10, 11],
    fingerings: [
      [[8, 10, 11], [8, 10, 12], [9, 10, 11], [9, 10, 12], [10, 11, 13], [8, 10, 11]],
      [[3, 5, 6], [3, 5, 7], [4, 5, 6], [4, 5, 7], [5, 6, 8], [3, 5, 6]],
    ],
  },
  
  'bebop major': {
    intervals: [0, 2, 4, 5, 7, 8, 9, 11],
    fingerings: [
      [[8, 9, 11], [8, 10, 12], [9, 10, 12], [9, 11, 12], [8, 10, 12], [8, 9, 11]],
      [[3, 4, 6], [3, 5, 7], [4, 5, 7], [4, 6, 7], [3, 5, 7], [3, 4, 6]],
    ],
  },
  
  'phrygian dominant': {
    intervals: [0, 1, 4, 5, 7, 8, 10],
    fingerings: [
      [[8, 9, 12], [8, 10, 12], [9, 10, 12], [9, 10, 12], [8, 10, 12], [8, 9, 12]],
      [[3, 4, 7], [3, 5, 7], [4, 5, 7], [4, 5, 7], [3, 5, 7], [3, 4, 7]],
    ],
  },
  
  'hungarian minor': {
    intervals: [0, 2, 3, 6, 7, 8, 11],
    fingerings: [
      [[5, 7, 8], [5, 7, 8], [5, 8, 9], [5, 7, 9], [5, 8, 9], [5, 7, 8]],
      [[0, 2, 3], [0, 2, 3], [0, 3, 4], [0, 2, 4], [0, 3, 4], [0, 2, 3]],
    ],
  },
  
  'gypsy': {
    intervals: [0, 2, 3, 6, 7, 8, 11],
    fingerings: [
      [[5, 7, 8], [5, 7, 8], [5, 8, 9], [5, 7, 9], [5, 8, 9], [5, 7, 8]],
      [[0, 2, 3], [0, 2, 3], [0, 3, 4], [0, 2, 4], [0, 3, 4], [0, 2, 3]],
    ],
  },
  
  'lydian dominant': {
    intervals: [0, 2, 4, 6, 7, 9, 10],
    fingerings: [
      [[7, 9, 11], [7, 9, 10], [8, 9, 11], [9, 11, 12], [9, 10, 12], [7, 9, 11]],
      [[2, 4, 6], [2, 4, 5], [3, 4, 6], [4, 6, 7], [4, 5, 7], [2, 4, 6]],
    ],
  },
  
  'super locrian': {
    intervals: [0, 1, 3, 4, 6, 8, 10],
    fingerings: [
      [[6, 7, 9], [7, 8, 10], [6, 8, 9], [7, 9, 10], [6, 8, 10], [6, 7, 9]],
      [[1, 2, 4], [2, 3, 5], [1, 3, 4], [2, 4, 5], [1, 3, 5], [1, 2, 4]],
    ],
  },
};

function extractRootFromScaleName(scaleName: string): string {
  const match = scaleName.match(/^([A-G][#b]?)/);
  return match ? match[1] : 'C';
}

/**
 * Detect the base root note of a scale fingering pattern
 * Analyzes the lowest fret on the low E string to determine the root
 *
 * @param fingering - 2D array representing frets for each string [lowE, A, D, G, B, highE]
 * @returns Root note name in sharp notation
 */
function detectFingeringBaseRoot(fingering: number[][]): string {
  // Validate fingering structure
  if (!fingering || fingering.length === 0 || !fingering[0] || fingering[0].length === 0) {
    console.warn('Invalid fingering pattern provided to detectFingeringBaseRoot - defaulting to C');
    return 'C';
  }

  // Get the lowest fret on the low E string (first element of fingering array)
  const lowestFret = Math.min(...fingering[0]);

  // Low E string open note is E, which has a note value of 4 in the chromatic scale (C=0)
  const STANDARD_TUNING_LOW_E = 4;
  const fretValue = (STANDARD_TUNING_LOW_E + lowestFret) % 12;

  // Use valueToNote from musicTheory for consistency
  return valueToNote(fretValue);
}

/**
 * Get scale fingering pattern transposed to the requested root note
 *
 * Process:
 * 1. Extracts or uses provided root note
 * 2. Normalizes scale name to match library keys
 * 3. Retrieves base fingering pattern (Position 1)
 * 4. Detects the base root of that pattern
 * 5. Transposes the pattern to match the requested root
 *
 * @param scaleName - Scale name (e.g., "C major", "D minor pentatonic")
 * @param rootNote - Optional explicit root note (extracted from name if not provided)
 * @returns 2D array of fret numbers for each string [lowE, A, D, G, B, highE]
 */
export function getScaleFingering(scaleName: string, rootNote?: string): number[][] {
  const root = rootNote || extractRootFromScaleName(scaleName);
  const targetRootValue = noteToValue(root);

  const normalized = normalizeScaleName(scaleName);
  const scaleData = SCALE_LIBRARY[normalized];

  let baseFingering: number[][] | undefined;

  // Try to find the scale in the library
  if (scaleData && scaleData.fingerings && scaleData.fingerings.length > 0) {
    baseFingering = scaleData.fingerings[0];  // Use Position 1
  } else {
    // Fallback: try fuzzy matching
    console.warn(`Scale "${normalized}" not found in library, attempting fuzzy match...`);
    for (const [key, data] of Object.entries(SCALE_LIBRARY)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        if (data.fingerings && data.fingerings.length > 0) {
          console.info(`Matched "${normalized}" to "${key}"`);
          baseFingering = data.fingerings[0];
          break;
        }
      }
    }
  }

  // Ultimate fallback: use major scale
  if (!baseFingering) {
    console.warn(`No fingering found for scale "${scaleName}" - using major scale pattern`);
    baseFingering = SCALE_LIBRARY['major'].fingerings[0];
  }

  // Detect the base root note of the pattern and transpose
  const baseRoot = detectFingeringBaseRoot(baseFingering);
  const semitones = calculateSemitoneDistance(baseRoot, root);

  if (semitones !== 0) {
    console.info(`Transposing ${normalized} scale from ${baseRoot} to ${root} (${semitones} semitones)`);
  }

  return transposeFingering(baseFingering, semitones);
}

/**
 * Transpose a fingering pattern by a number of semitones
 * Clamps frets to the valid range [0, 24]
 *
 * @param fingering - Original fingering pattern
 * @param semitones - Number of semitones to transpose (can be negative)
 * @returns Transposed fingering pattern
 */
function transposeFingering(fingering: number[][], semitones: number): number[][] {
  if (semitones === 0) return fingering;

  return fingering.map(stringFrets =>
    stringFrets.map(fret => {
      const newFret = fret + semitones;
      // Clamp to valid guitar fret range
      if (newFret < 0) return 0;
      if (newFret > 24) return 24;
      return newFret;
    })
  );
}

export function getScaleIntervals(scaleName: string): number[] {
  const normalized = normalizeScaleName(scaleName);
  const scaleData = SCALE_LIBRARY[normalized];
  
  if (scaleData) {
    return scaleData.intervals;
  }
  
  for (const [key, data] of Object.entries(SCALE_LIBRARY)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return data.intervals;
    }
  }
  
  return SCALE_LIBRARY['major'].intervals;
}

function normalizeScaleName(name: string): string {
  const lower = name.toLowerCase().trim();
  
  if (lower.includes('pentatonic')) {
    if (lower.includes('major')) return 'pentatonic major';
    if (lower.includes('minor')) return 'pentatonic minor';
  }
  
  if (lower.includes('blues')) return 'blues';
  
  if (lower.includes('harmonic') && lower.includes('minor')) return 'harmonic minor';
  if (lower.includes('melodic') && lower.includes('minor')) return 'melodic minor';
  
  if (lower.includes('whole tone')) return 'whole tone';
  if (lower.includes('diminished')) return 'diminished';
  if (lower.includes('altered')) return 'altered';
  
  if (lower.includes('bebop')) {
    if (lower.includes('dominant')) return 'bebop dominant';
    if (lower.includes('major')) return 'bebop major';
  }
  
  if (lower.includes('phrygian dominant')) return 'phrygian dominant';
  if (lower.includes('hungarian')) return 'hungarian minor';
  if (lower.includes('gypsy')) return 'gypsy';
  if (lower.includes('lydian dominant')) return 'lydian dominant';
  if (lower.includes('super locrian')) return 'super locrian';
  
  if (lower.includes('ionian')) return 'ionian';
  if (lower.includes('dorian')) return 'dorian';
  if (lower.includes('phrygian')) return 'phrygian';
  if (lower.includes('lydian')) return 'lydian';
  if (lower.includes('mixolydian')) return 'mixolydian';
  if (lower.includes('aeolian')) return 'aeolian';
  if (lower.includes('locrian')) return 'locrian';
  
  if (lower.includes('major')) return 'major';
  if (lower.includes('minor')) return 'minor';
  
  return 'major';
}

export function getScaleNotes(rootNote: string, scaleName: string): string[] {
  const intervals = getScaleIntervals(scaleName);
  const noteValue = noteToValue(rootNote);
  
  const notes: string[] = [];
  for (const interval of intervals) {
    const noteVal = (noteValue + interval) % 12;
    notes.push(valueToNote(noteVal));
  }
  
  return notes;
}
