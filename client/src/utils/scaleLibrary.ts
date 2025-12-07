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

import { noteToValue, valueToNote } from './musicTheory';
import { normalizeScaleDescriptor, FALLBACK_SCALE_LIBRARY_KEYS } from '@shared/music/scaleModes';

export interface ScalePattern {
  intervals: number[];
  fingerings: number[][][];
  positions?: string[];
}

type ScaleLibrary = Record<string, ScalePattern>;

export const SCALE_LIBRARY: ScaleLibrary = {
  // Major scale (also known as Ionian mode)
  // Stored patterns are for C major - transposed to other keys automatically
  // C Major notes: C(0), D(2), E(4), F(5), G(7), A(9), B(11)
  // Standard tuning: Low E(4), A(9), D(2), G(7), B(11), High E(4)
  'major': {
    intervals: [0, 2, 4, 5, 7, 9, 11],
    fingerings: [
      // Position 1: Open position (frets 0-3) - CAGED "C shape"
      // Low E: E(0), F(1), G(3) | A: A(0), B(2), C(3) | D: D(0), E(2), F(3) | G: G(0), A(2), B(4) | B: C(1), D(3), E(5) | High E: E(0), F(1), G(3)
      [[0, 1, 3], [0, 2, 3], [0, 2, 3], [0, 2], [1, 3, 5], [0, 1, 3]],
      // Position 2: 5th position (frets 5-8) - CAGED "A shape"
      // Low E: A(5), B(7), C(8) | A: D(5), E(7), F(8) | D: G(5), A(7), B(9) | G: C(5), D(7), E(9) | B: F(6), G(8), A(10) | High E: A(5), B(7), C(8)
      [[5, 7, 8], [5, 7, 8], [5, 7, 9], [5, 7, 9], [6, 8, 10], [5, 7, 8]],
      // Position 3: 7th position (frets 7-10) - CAGED "G shape"
      // Low E: B(7), C(8), D(10) | A: E(7), F(8), G(10) | D: A(7), B(9), C(10) | G: D(7), E(9), F(10) | B: G(8), A(10), B(12) | High E: B(7), C(8), D(10)
      [[7, 8, 10], [7, 8, 10], [7, 9, 10], [7, 9, 10], [8, 10, 12], [7, 8, 10]],
      // Position 4: 8th position (frets 8-12) - CAGED "E shape"
      // Low E: C(8), D(10), E(12) | A: F(8), G(10), A(12) | D: B(9), C(10), D(12) | G: E(9), F(10), G(12) | B: A(10), B(12), C(13) | High E: C(8), D(10), E(12)
      [[8, 10, 12], [8, 10, 12], [9, 10, 12], [9, 10, 12], [10, 12, 13], [8, 10, 12]],
      // Position 5: 12th position (frets 12-15) - CAGED "D shape" (octave of open)
      // Same as position 1 but 12 frets higher
      [[12, 13, 15], [12, 14, 15], [12, 14, 15], [12, 14], [13, 15, 17], [12, 13, 15]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },
  
  'dorian': {
    // D Dorian: D E F G A B C - same notes as C major, rooted on D
    intervals: [0, 2, 3, 5, 7, 9, 10],
    fingerings: [
      // Position 1: Open position (frets 0-4)
      [[0, 1, 3], [0, 2, 3], [0, 2, 3], [0, 2, 4], [0, 1, 3], [0, 1, 3]],
      // Position 2: 3rd position (frets 3-7)
      [[3, 5, 7], [3, 5, 7], [3, 5, 7], [4, 5, 7], [3, 5, 6], [3, 5, 7]],
      // Position 3: 5th position (frets 5-9)
      [[5, 7, 8], [5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 6, 8], [5, 7, 8]],
      // Position 4: 7th position (frets 7-11)
      [[7, 8, 10], [7, 8, 10], [7, 9, 10], [7, 9, 10], [8, 10], [7, 8, 10]],
      // Position 5: 10th position (frets 10-14)
      [[10, 12, 13], [10, 12, 14], [10, 12, 14], [10, 12, 14], [10, 12, 13], [10, 12, 13]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },
  
  'phrygian': {
    // E Phrygian: E F G A B C D - same notes as C major, rooted on E
    intervals: [0, 1, 3, 5, 7, 8, 10],
    fingerings: [
      // Position 1: Open position (frets 0-4)
      [[0, 1, 3], [0, 2, 3], [0, 2, 3], [0, 2, 4], [0, 1, 3], [0, 1, 3]],
      // Position 2: 3rd position (frets 3-7)
      [[3, 5, 7], [3, 5, 7], [3, 5, 7], [4, 5, 7], [3, 5, 6], [3, 5, 7]],
      // Position 3: 5th position (frets 5-9)
      [[5, 7, 8], [5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 6, 8], [5, 7, 8]],
      // Position 4: 7th position (frets 7-11)
      [[7, 8, 10], [7, 8, 10], [7, 9, 10], [7, 9, 10], [8, 10], [7, 8, 10]],
      // Position 5: 10th position (frets 10-14)
      [[10, 12, 13], [10, 12, 14], [10, 12, 14], [10, 12, 14], [10, 12, 13], [10, 12, 13]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },
  
  'lydian': {
    // F Lydian: F G A B C D E - same notes as C major, rooted on F
    intervals: [0, 2, 4, 6, 7, 9, 11],
    fingerings: [
      // Position 1: Open position (frets 0-4)
      [[0, 1, 3], [0, 2, 3], [0, 2, 3], [0, 2, 4], [0, 1, 3], [0, 1, 3]],
      // Position 2: 3rd position (frets 3-7)
      [[3, 5, 7], [3, 5, 7], [3, 5, 7], [4, 5, 7], [3, 5, 6], [3, 5, 7]],
      // Position 3: 5th position (frets 5-9)
      [[5, 7, 8], [5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 6, 8], [5, 7, 8]],
      // Position 4: 7th position (frets 7-11)
      [[7, 8, 10], [7, 8, 10], [7, 9, 10], [7, 9, 10], [8, 10], [7, 8, 10]],
      // Position 5: 10th position (frets 10-14)
      [[10, 12, 13], [10, 12, 14], [10, 12, 14], [10, 12, 14], [10, 12, 13], [10, 12, 13]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },
  
  'mixolydian': {
    // G Mixolydian: G A B C D E F - same notes as C major, rooted on G
    intervals: [0, 2, 4, 5, 7, 9, 10],
    fingerings: [
      // Position 1: Open position (frets 0-4)
      [[0, 1, 3], [0, 2, 3], [0, 2, 3], [0, 2, 4], [0, 1, 3], [0, 1, 3]],
      // Position 2: 3rd position (frets 3-7)
      [[3, 5, 7], [3, 5, 7], [3, 5, 7], [4, 5, 7], [3, 5, 6], [3, 5, 7]],
      // Position 3: 5th position (frets 5-9)
      [[5, 7, 8], [5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 6, 8], [5, 7, 8]],
      // Position 4: 7th position (frets 7-11)
      [[7, 8, 10], [7, 8, 10], [7, 9, 10], [7, 9, 10], [8, 10], [7, 8, 10]],
      // Position 5: 10th position (frets 10-14)
      [[10, 12, 13], [10, 12, 14], [10, 12, 14], [10, 12, 14], [10, 12, 13], [10, 12, 13]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },
  
  // Minor scale (Natural Minor / Aeolian mode)
  // Stored patterns are for A minor (A B C D E F G) - transposed to other keys automatically
  'minor': {
    intervals: [0, 2, 3, 5, 7, 8, 10],
    fingerings: [
      // Position 1: Open position (frets 0-4)
      [[0, 1, 3], [0, 2, 3], [0, 2, 3], [0, 2, 4], [0, 1, 3], [0, 1, 3]],
      // Position 2: 3rd position (frets 3-7)
      [[3, 5, 7], [3, 5, 7], [3, 5, 7], [4, 5, 7], [3, 5, 6], [3, 5, 7]],
      // Position 3: 5th position (frets 5-9)
      [[5, 7, 8], [5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 6, 8], [5, 7, 8]],
      // Position 4: 7th position (frets 7-11)
      [[7, 8, 10], [7, 8, 10], [7, 9, 10], [7, 9, 10], [8, 10], [7, 8, 10]],
      // Position 5: 10th position (frets 10-14)
      [[10, 12, 13], [10, 12, 14], [10, 12, 14], [10, 12, 14], [10, 12, 13], [10, 12, 13]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },
  
  'locrian': {
    // B Locrian: B C D E F G A - same notes as C major, rooted on B
    intervals: [0, 1, 3, 5, 6, 8, 10],
    fingerings: [
      // Position 1: Open position (frets 0-4)
      [[0, 1, 3], [0, 2, 3], [0, 2, 3], [0, 2, 4], [0, 1, 3], [0, 1, 3]],
      // Position 2: 3rd position (frets 3-7)
      [[3, 5, 7], [3, 5, 7], [3, 5, 7], [4, 5, 7], [3, 5, 6], [3, 5, 7]],
      // Position 3: 5th position (frets 5-9)
      [[5, 7, 8], [5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 6, 8], [5, 7, 8]],
      // Position 4: 7th position (frets 7-11)
      [[7, 8, 10], [7, 8, 10], [7, 9, 10], [7, 9, 10], [8, 10], [7, 8, 10]],
      // Position 5: 10th position (frets 10-14)
      [[10, 12, 13], [10, 12, 14], [10, 12, 14], [10, 12, 14], [10, 12, 13], [10, 12, 13]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },
  
  'harmonic minor': {
    intervals: [0, 2, 3, 5, 7, 8, 11],
    fingerings: [
      [[5, 7, 8], [5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 8, 9], [5, 7, 8]],
      [[0, 2, 3], [0, 2, 3], [0, 2, 4], [0, 2, 4], [0, 3, 4], [0, 2, 3]],
      [[8, 10, 11], [8, 10, 11], [9, 10, 12], [9, 10, 12], [8, 11, 12], [8, 10, 11]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3'],
  },
  
  'melodic minor': {
    intervals: [0, 2, 3, 5, 7, 9, 11],
    fingerings: [
      [[5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 7, 9], [5, 7, 9], [5, 7, 8]],
      [[0, 2, 3], [0, 2, 4], [0, 2, 4], [0, 2, 4], [0, 2, 4], [0, 2, 3]],
      [[8, 10, 12], [8, 10, 12], [9, 10, 12], [9, 10, 12], [8, 10, 12], [8, 10, 12]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3'],
  },
  
  'pentatonic major': {
    // C Major Pentatonic: C D E G A
    intervals: [0, 2, 4, 7, 9],
    fingerings: [
      // Position 1: Open position (frets 0-4)
      [[0, 3], [0, 3], [0, 2], [0, 2], [1, 3], [0, 3]],
      // Position 2: 3rd position (frets 3-7)
      [[3, 5], [3, 5, 7], [5, 7], [5, 7], [3, 5], [3, 5]],
      // Position 3: 5th position (frets 5-9)
      [[5, 8], [5, 7], [5, 7], [5, 7, 9], [5, 8], [5, 8]],
      // Position 4: 7th position (frets 7-11)
      [[8, 10], [7, 10], [7, 10], [7, 9], [8, 10], [8, 10]],
      // Position 5: 10th position (frets 10-14)
      [[10, 12], [10, 12], [10, 12, 14], [12, 14], [10, 13], [10, 12]],
    ],
    positions: ['Position 1 (Box 1)', 'Position 2 (Box 2)', 'Position 3 (Box 3)', 'Position 4 (Box 4)', 'Position 5 (Box 5)'],
  },
  
  'pentatonic minor': {
    // A Minor Pentatonic: A C D E G
    intervals: [0, 3, 5, 7, 10],
    fingerings: [
      // Position 1: Open position (frets 0-4)
      [[0, 3], [0, 3], [0, 2], [0, 2], [1, 3], [0, 3]],
      // Position 2: 3rd position (frets 3-7)
      [[3, 5], [3, 5, 7], [5, 7], [5, 7], [3, 5], [3, 5]],
      // Position 3: 5th position (frets 5-9)
      [[5, 8], [5, 7], [5, 7], [5, 7, 9], [5, 8], [5, 8]],
      // Position 4: 7th position (frets 7-11)
      [[8, 10], [7, 10], [7, 10], [7, 9], [8, 10], [8, 10]],
      // Position 5: 10th position (frets 10-14)
      [[10, 12], [10, 12], [10, 12, 14], [12, 14], [10, 13], [10, 12]],
    ],
    positions: ['Position 1 (Box 1)', 'Position 2 (Box 2)', 'Position 3 (Box 3)', 'Position 4 (Box 4)', 'Position 5 (Box 5)'],
  },
  
  'blues': {
    intervals: [0, 3, 5, 6, 7, 10],
    fingerings: [
      [[5, 8, 10], [5, 8, 10], [5, 7, 8], [5, 7, 8], [5, 8, 10], [5, 8, 10]],
      [[0, 3, 5], [0, 3, 5], [0, 2, 3], [0, 2, 3], [0, 3, 5], [0, 3, 5]],
      [[10, 13, 15], [10, 13, 15], [10, 12, 13], [10, 12, 13], [10, 13, 15], [10, 13, 15]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3'],
  },
  
  'whole tone': {
    intervals: [0, 2, 4, 6, 8, 10],
    fingerings: [
      [[6, 8, 10], [6, 8, 10], [6, 8, 10], [7, 9, 11], [7, 9, 11], [6, 8, 10]],
      [[1, 3, 5], [1, 3, 5], [1, 3, 5], [2, 4, 6], [2, 4, 6], [1, 3, 5]],
    ],
    positions: ['Position 1', 'Position 2'],
  },
  
  'diminished': {
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
    fingerings: [
      [[6, 7, 9], [6, 8, 9], [6, 7, 9], [7, 8, 10], [6, 8, 9], [6, 7, 9]],
      [[1, 2, 4], [1, 3, 4], [1, 2, 4], [2, 3, 5], [1, 3, 4], [1, 2, 4]],
    ],
    positions: ['Position 1', 'Position 2'],
  },
  
  'altered': {
    intervals: [0, 1, 3, 4, 6, 8, 10],
    fingerings: [
      [[6, 7, 9], [7, 8, 10], [6, 8, 9], [7, 9, 10], [6, 8, 10], [6, 7, 9]],
      [[1, 2, 4], [2, 3, 5], [1, 3, 4], [2, 4, 5], [1, 3, 5], [1, 2, 4]],
    ],
    positions: ['Position 1', 'Position 2'],
  },
  
  'bebop dominant': {
    intervals: [0, 2, 4, 5, 7, 9, 10, 11],
    fingerings: [
      [[8, 10, 11], [8, 10, 12], [9, 10, 11], [9, 10, 12], [10, 11, 13], [8, 10, 11]],
      [[3, 5, 6], [3, 5, 7], [4, 5, 6], [4, 5, 7], [5, 6, 8], [3, 5, 6]],
    ],
    positions: ['Position 1', 'Position 2'],
  },
  
  'bebop major': {
    intervals: [0, 2, 4, 5, 7, 8, 9, 11],
    fingerings: [
      [[8, 9, 11], [8, 10, 12], [9, 10, 12], [9, 11, 12], [8, 10, 12], [8, 9, 11]],
      [[3, 4, 6], [3, 5, 7], [4, 5, 7], [4, 6, 7], [3, 5, 7], [3, 4, 6]],
    ],
    positions: ['Position 1', 'Position 2'],
  },
  
  'phrygian dominant': {
    intervals: [0, 1, 4, 5, 7, 8, 10],
    fingerings: [
      [[8, 9, 12], [8, 10, 12], [9, 10, 12], [9, 10, 12], [8, 10, 12], [8, 9, 12]],
      [[3, 4, 7], [3, 5, 7], [4, 5, 7], [4, 5, 7], [3, 5, 7], [3, 4, 7]],
    ],
    positions: ['Position 1', 'Position 2'],
  },
  
  'hungarian minor': {
    intervals: [0, 2, 3, 6, 7, 8, 11],
    fingerings: [
      [[5, 7, 8], [5, 7, 8], [5, 8, 9], [5, 7, 9], [5, 8, 9], [5, 7, 8]],
      [[0, 2, 3], [0, 2, 3], [0, 3, 4], [0, 2, 4], [0, 3, 4], [0, 2, 3]],
    ],
    positions: ['Position 1', 'Position 2'],
  },
  
  'gypsy': {
    intervals: [0, 2, 3, 6, 7, 8, 11],
    fingerings: [
      [[5, 7, 8], [5, 7, 8], [5, 8, 9], [5, 7, 9], [5, 8, 9], [5, 7, 8]],
      [[0, 2, 3], [0, 2, 3], [0, 3, 4], [0, 2, 4], [0, 3, 4], [0, 2, 3]],
    ],
    positions: ['Position 1', 'Position 2'],
  },
  
  'lydian dominant': {
    intervals: [0, 2, 4, 6, 7, 9, 10],
    fingerings: [
      [[7, 9, 11], [7, 9, 10], [8, 9, 11], [9, 11, 12], [9, 10, 12], [7, 9, 11]],
      [[2, 4, 6], [2, 4, 5], [3, 4, 6], [4, 6, 7], [4, 5, 7], [2, 4, 6]],
    ],
    positions: ['Position 1', 'Position 2'],
  },
  
  'super locrian': {
    intervals: [0, 1, 3, 4, 6, 8, 10],
    fingerings: [
      [[6, 7, 9], [7, 8, 10], [6, 8, 9], [7, 9, 10], [6, 8, 10], [6, 7, 9]],
      [[1, 2, 4], [2, 3, 5], [1, 3, 4], [2, 4, 5], [1, 3, 5], [1, 2, 4]],
    ],
    positions: ['Position 1', 'Position 2'],
  },
};

function extractRootFromScaleName(scaleName: string): string {
  const match = scaleName.match(/^([A-G][#b]?)/);
  return match ? match[1] : 'C';
}

/**
 * Get the root note that a stored pattern represents based on scale type
 * Stored patterns are typically for a canonical key (C for major, D for Dorian, etc.)
 * 
 * @param scaleKey - Normalized scale key (e.g., 'major', 'dorian', 'pentatonic minor')
 * @returns Root note that stored patterns for this scale represent
 */
function getStoredPatternRoot(scaleKey: string): string {
  // Mapping of scale types to the root note their stored patterns represent
  // Based on the comments in SCALE_LIBRARY
  // Note: 'ionian' normalizes to 'major', 'aeolian' normalizes to 'minor'
  const STORED_PATTERN_ROOTS: Record<string, string> = {
    'major': 'C',           // Major/Ionian patterns are for C major
    'dorian': 'D',         // Dorian patterns are for D Dorian
    'phrygian': 'E',       // Phrygian patterns are for E Phrygian
    'lydian': 'F',         // Lydian patterns are for F Lydian
    'mixolydian': 'G',     // Mixolydian patterns are for G Mixolydian
    'minor': 'A',          // Minor/Aeolian patterns are for A minor
    'locrian': 'B',        // Locrian patterns are for B Locrian
    'harmonic minor': 'A', // Harmonic minor patterns are for A harmonic minor
    'melodic minor': 'A',  // Melodic minor patterns are for A melodic minor
    'pentatonic major': 'C', // Pentatonic major patterns are for C
    'pentatonic minor': 'A', // Pentatonic minor patterns are for A minor pentatonic
    'blues': 'A',          // Blues patterns are for A blues
    'whole tone': 'C',     // Whole tone patterns are for C whole tone
    'diminished': 'C',     // Diminished patterns are for C diminished
    'altered': 'C',        // Altered patterns (default to C)
    'bebop dominant': 'C', // Bebop patterns (default to C)
    'bebop major': 'C',
    'phrygian dominant': 'E',
    'hungarian minor': 'A',
    'gypsy': 'A',
    'lydian dominant': 'C',
    'super locrian': 'B',
  };

  return STORED_PATTERN_ROOTS[scaleKey] || 'C';
}

/**
 * Helper to sort fingering patterns by their minimum fret position
 * Returns indices sorted from lowest to highest fret position
 */
function getSortedPatternIndices(fingerings: number[][][]): number[] {
  if (!fingerings || fingerings.length === 0) {
    return [];
  }
  
  const patternsWithMinFrets = fingerings.map((pattern, index) => {
    const allFrets = pattern.flat().filter(f => f >= 0);
    const minFret = allFrets.length > 0 ? Math.min(...allFrets) : 999;
    return { minFret, originalIndex: index };
  });
  
  // Sort by minimum fret (lowest first)
  patternsWithMinFrets.sort((a, b) => a.minFret - b.minFret);
  
  return patternsWithMinFrets.map(item => item.originalIndex);
}

/**
 * Get positions array sorted to match the fingerings order (by minimum fret)
 * This ensures position labels correctly reflect the displayed patterns
 * 
 * NOTE: Position labels are sorted based on the STORED patterns, not transposed patterns.
 * This is intentional - position labels like "Position 1", "Position 2" refer to the 
 * standard CAGED system positions, which stay consistent regardless of key.
 * 
 * @param scaleData - Scale pattern data from SCALE_LIBRARY
 * @returns Sorted positions array matching the fingerings order
 */
export function getSortedPositions(scaleData: ScalePattern): string[] {
  if (!scaleData.positions || scaleData.positions.length === 0) {
    return ['Position 1'];
  }
  
  if (!scaleData.fingerings || scaleData.fingerings.length === 0) {
    return scaleData.positions;
  }
  
  // Get sorted indices based on minimum fret
  const sortedIndices = getSortedPatternIndices(scaleData.fingerings);
  
  // Return position labels in sorted order
  return sortedIndices.map(index => scaleData.positions![index] || `Position ${index + 1}`);
}

/**
 * Validate a stored pattern against expected scale notes
 * Returns true if at least 90% of notes are correct scale tones
 */
function validateStoredPattern(
  pattern: number[][],
  rootNote: string,
  intervals: number[]
): boolean {
  const TUNING = [4, 9, 2, 7, 11, 4]; // Low E, A, D, G, B, High E
  const rootValue = noteToValue(rootNote);
  const expectedNotes = new Set(intervals.map(i => (rootValue + i) % 12));
  
  let totalNotes = 0;
  let correctNotes = 0;
  
  pattern.forEach((stringFrets, stringIndex) => {
    stringFrets.forEach(fret => {
      if (fret >= 0 && fret <= 24) {
        totalNotes++;
        const noteValue = (TUNING[stringIndex] + fret) % 12;
        if (expectedNotes.has(noteValue)) correctNotes++;
      }
    });
  });
  
  const accuracy = totalNotes > 0 ? correctNotes / totalNotes : 0;
  return accuracy >= 0.9; // Require 90% accuracy
}

/**
 * Get scale fingering pattern positioned at the correct location for the requested key
 *
 * Guitar scale positions are shapes that get moved up/down the neck to play different keys.
 * Each scale has multiple positions corresponding to different starting points on the neck.
 * The patterns are stored in SCALE_LIBRARY and transposed to the requested root note.
 *
 * Process:
 * 1. Extracts or uses provided root note
 * 2. Normalizes scale name to match library keys
 * 3. Gets the stored pattern for the requested position (sorted by minimum fret so position 0 is lowest)
 * 4. Validates the pattern produces correct scale notes
 * 5. Falls back to algorithmic generation if pattern is invalid
 * 6. Transposes the pattern to the requested root note
 *
 * @param scaleName - Scale name (e.g., "C major", "D minor pentatonic")
 * @param rootNote - Optional explicit root note (extracted from name if not provided)
 * @param positionIndex - Position index (0-4 for 5-position scales, fewer for limited scales)
 * @returns 2D array of fret numbers for each string [lowE, A, D, G, B, highE]
 */
export function getScaleFingering(scaleName: string, rootNote?: string, positionIndex: number = 0): number[][] {
  const root = rootNote || extractRootFromScaleName(scaleName);
  const normalized = normalizeScaleName(scaleName);
  const scaleData = SCALE_LIBRARY[normalized];

  // If no stored patterns exist, fall back to algorithmic generation
  if (!scaleData || !scaleData.fingerings || scaleData.fingerings.length === 0) {
    if (import.meta.env.DEV) {
      console.warn(`No stored patterns found for scale "${normalized}", using algorithmic generation`);
    }
    return generateFingeringAlgorithmically(scaleName, root, positionIndex);
  }

  // Map position index to stored pattern index
  // Position 0 should be the lowest position on the neck
  // We sort stored patterns by their minimum fret to ensure position 0 is lowest
  const availablePositions = scaleData.fingerings.length;
  const safePositionIndex = Math.max(0, Math.min(positionIndex, availablePositions - 1));
  
  // Use the same sorting helper as getSortedPositions for consistency
  const sortedIndices = getSortedPatternIndices(scaleData.fingerings);
  
  // Get the stored pattern index for the requested position
  const storedPatternIndex = sortedIndices[safePositionIndex] ?? safePositionIndex;

  // Get the stored pattern for this position
  const storedPattern = scaleData.fingerings[storedPatternIndex];
  if (!storedPattern || storedPattern.length !== 6) {
    if (import.meta.env.DEV) {
      console.warn(`Invalid stored pattern at position ${safePositionIndex} for scale "${normalized}"`);
    }
    return generateFingeringAlgorithmically(scaleName, root, positionIndex);
  }

  // Get the root note that stored patterns for this scale represent
  // Stored patterns are for canonical keys (C for major, D for Dorian, etc.)
  const storedRoot = getStoredPatternRoot(normalized);
  
  // Validate the stored pattern produces correct scale notes
  if (!validateStoredPattern(storedPattern, storedRoot, scaleData.intervals)) {
    if (import.meta.env.DEV) {
      console.warn(
        `⚠️ Scale pattern validation failed for "${normalized}" position ${safePositionIndex + 1}:\n` +
        `   Pattern contains incorrect notes. Using algorithmic generation.`
      );
    }
    return generateFingeringAlgorithmically(scaleName, root, positionIndex);
  }

  // Calculate semitone offset to transpose from stored root to requested root
  const storedRootValue = noteToValue(storedRoot);
  const requestedRootValue = noteToValue(root);
  const semitoneOffset = ((requestedRootValue - storedRootValue) + 12) % 12;

  // Transpose the stored pattern to the requested root
  // If no transposition needed, return a copy of the stored pattern
  if (semitoneOffset === 0) {
    return storedPattern.map(stringFrets => [...stringFrets]);
  }

  // Transpose using the existing transposeFingering function
  return transposeFingering(storedPattern, semitoneOffset);
}

/**
 * Fallback function to generate fingering algorithmically when stored patterns aren't available
 * This maintains backward compatibility for scales without stored patterns
 */
function generateFingeringAlgorithmically(scaleName: string, rootNote: string, positionIndex: number): number[][] {
  const normalized = normalizeScaleName(scaleName);
  const intervals = getScaleIntervals(scaleName);
  const rootValue = noteToValue(rootNote);

  // Position configurations - starting fret positions for different scale patterns
  // These represent the lowest fret where the pattern starts for each position
  const POSITION_START_FRETS = {
    major: [0, 2, 5, 7, 10],
    dorian: [0, 3, 5, 7, 10],
    phrygian: [0, 3, 5, 8, 10],
    lydian: [0, 2, 4, 7, 9],
    mixolydian: [0, 2, 5, 7, 10],
    locrian: [0, 3, 5, 8, 10],
    minor: [0, 3, 5, 7, 10],
    'harmonic minor': [0, 5, 10],
    'melodic minor': [0, 5, 10],
    'pentatonic major': [0, 2, 5, 7, 10],
    'pentatonic minor': [0, 3, 5, 8, 10],
    blues: [0, 3, 8],
    'whole tone': [0, 6],
    diminished: [0, 3]
  };

  // Standard guitar tuning values (chromatic scale where C=0)
  // Low E = 4 (E), A = 9 (A), D = 2 (D), G = 7 (G), B = 11 (B), High E = 4 (E)
  const tuning = [4, 9, 2, 7, 11, 4]; // Low E, A, D, G, B, High E

  const startFrets = POSITION_START_FRETS[normalized as keyof typeof POSITION_START_FRETS] || POSITION_START_FRETS.major;
  const safePositionIndex = Math.max(0, Math.min(positionIndex, startFrets.length - 1));
  
  // Calculate the base fret for this position based on the root note
  // Find where the root note falls on the low E string as a reference
  const rootOnLowE = (rootValue - tuning[0] + 12) % 12;
  const baseFret = rootOnLowE + startFrets[safePositionIndex];
  
  // Generate scale notes on each string within a reasonable fret range
  const fingerings = tuning.map(stringTuning => {
    const frets: number[] = [];
    
    // Generate notes within a 5-fret span from the base fret for this string
    // This creates a typical 3-notes-per-string pattern
    const stringStartFret = Math.max(0, baseFret - 2);
    const stringEndFret = stringStartFret + 6; // 6 fret span to capture 3 notes per string
    
    for (let fret = stringStartFret; fret <= stringEndFret && fret <= 24; fret++) {
      const noteValue = (stringTuning + fret) % 12;
      // Check if this note is in the scale
      const isScaleNote = intervals.some(interval => (rootValue + interval) % 12 === noteValue);
      if (isScaleNote) {
        frets.push(fret);
      }
    }
    
    return frets;
  });

  return fingerings;
}

/**
 * Transpose a fingering pattern by a number of semitones
 * Handles octave shifting to keep patterns playable instead of clamping
 *
 * @param fingering - Original fingering pattern
 * @param semitones - Number of semitones to transpose (can be negative)
 * @returns Transposed fingering pattern, with octave adjustment if needed
 */
function transposeFingering(fingering: number[][], semitones: number): number[][] {
  // Always return a copy to prevent mutation of SCALE_LIBRARY data
  if (semitones === 0) return fingering.map(stringFrets => [...stringFrets]);

  // Check if transposition would go out of bounds
  const allFrets = fingering.flat();
  if (allFrets.length === 0) {
    return fingering.map(stringFrets => [...stringFrets]);
  }
  
  const minFret = Math.min(...allFrets);
  const maxFret = Math.max(...allFrets);
  
  // Calculate the best octave adjustment to keep the pattern in a playable range
  let octaveAdjustment = 0;
  const targetMin = minFret + semitones;
  const targetMax = maxFret + semitones;
  
  // Prefer to keep patterns in the lower-middle range (frets 0-15) when possible
  if (targetMin < 0) {
    // Pattern would go below fret 0 - shift up by minimum necessary octaves
    octaveAdjustment = Math.ceil(Math.abs(targetMin) / 12) * 12;
  } else if (targetMax > 20) {
    // Pattern would be too high - try to shift down if it doesn't go negative
    const potentialShift = -Math.floor((targetMax - 12) / 12) * 12;
    if (targetMin + potentialShift >= 0) {
      octaveAdjustment = potentialShift;
    }
  }

  // Apply transposition with octave adjustment
  const adjustedSemitones = semitones + octaveAdjustment;
  let hasInvalidFrets = false;
  const invalidFretDetails: string[] = [];

  const result = fingering.map((stringFrets, stringIndex) =>
    stringFrets.map(fret => {
      const newFret = fret + adjustedSemitones;
      // Validate fret is in playable range
      if (newFret < 0) {
        hasInvalidFrets = true;
        invalidFretDetails.push(`string ${stringIndex + 1}: fret ${fret} -> ${newFret} (clamped to 0)`);
        return 0;
      }
      if (newFret > 24) {
        hasInvalidFrets = true;
        invalidFretDetails.push(`string ${stringIndex + 1}: fret ${fret} -> ${newFret} (clamped to 24)`);
        return 24;
      }
      return newFret;
    })
  );

  // Only log if there were issues
  if (octaveAdjustment !== 0) {
    console.debug(`Scale transposition: ${semitones} semitones + ${octaveAdjustment} octave adjustment = ${adjustedSemitones} total`);
  }

  if (hasInvalidFrets) {
    console.warn(`Scale transposition produced out-of-range frets (some notes clamped):`, invalidFretDetails);
  }

  return result;
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



function toScaleDescriptor(name: string): string {
  const trimmed = name.trim();
  const match = trimmed.match(/^([A-G][#b]?)(?:\s+)(.+)$/i);
  const descriptor = match ? match[2] : trimmed;
  return descriptor.replace(/\b(scale|mode)\b/gi, '').trim();
}

export function normalizeScaleName(name: string): string {
  const descriptor = toScaleDescriptor(name);
  const normalized = normalizeScaleDescriptor(descriptor);
  if (normalized) {
    return normalized.libraryKey;
  }

  const fallback = descriptor.toLowerCase().trim();
  if (SCALE_LIBRARY[fallback]) {
    return fallback;
  }

  const sanitized = descriptor.replace(/\s+|-/g, '').toLowerCase();
  const fallbackKey = FALLBACK_SCALE_LIBRARY_KEYS.get(sanitized);
  if (fallbackKey && SCALE_LIBRARY[fallbackKey]) {
    return fallbackKey;
  }

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

/**
 * Validate that a fingering pattern contains notes from the specified scale
 * 
 * @param fingering - The fingering pattern (2D array of fret numbers per string)
 * @param rootNote - The root note of the scale
 * @param scaleName - The scale name
 * @returns Object with validation results and details
 */
export function validateFingeringNotes(
  fingering: number[][],
  rootNote: string,
  scaleName: string
): { isValid: boolean; invalidNotes: string[]; coverage: number } {
  // Get expected scale notes (as chromatic values 0-11)
  const intervals = getScaleIntervals(scaleName);
  const rootValue = noteToValue(rootNote);
  const expectedNoteValues = new Set(intervals.map(i => (rootValue + i) % 12));
  
  // Standard guitar tuning values
  const tuning = [4, 9, 2, 7, 11, 4]; // Low E, A, D, G, B, High E
  
  const invalidNotes: string[] = [];
  let totalNotes = 0;
  let correctNotes = 0;
  
  fingering.forEach((stringFrets, stringIndex) => {
    const stringTuning = tuning[stringIndex];
    
    stringFrets.forEach(fret => {
      if (fret >= 0 && fret <= 24) {
        totalNotes++;
        const noteValue = (stringTuning + fret) % 12;
        
        if (expectedNoteValues.has(noteValue)) {
          correctNotes++;
        } else {
          const noteName = valueToNote(noteValue);
          invalidNotes.push(`String ${stringIndex + 1}, fret ${fret}: ${noteName}`);
        }
      }
    });
  });
  
  const coverage = totalNotes > 0 ? correctNotes / totalNotes : 0;
  
  return {
    isValid: invalidNotes.length === 0,
    invalidNotes,
    coverage
  };
}

/**
 * Get scale fingering with validation - logs warnings if notes don't match
 * This is a wrapper around getScaleFingering that adds validation
 * 
 * @param scaleName - Scale name (e.g., "C major", "D minor pentatonic")
 * @param rootNote - Optional explicit root note (extracted from name if not provided)
 * @param positionIndex - Position index (0-4 for 5-position scales, fewer for limited scales)
 * @returns 2D array of fret numbers for each string [lowE, A, D, G, B, highE]
 */
export function getValidatedScaleFingering(
  scaleName: string,
  rootNote?: string,
  positionIndex: number = 0
): number[][] {
  const root = rootNote || extractRootFromScaleName(scaleName);
  const fingering = getScaleFingering(scaleName, root, positionIndex);
  
  // Validate the fingering
  const validation = validateFingeringNotes(fingering, root, scaleName);
  
  if (!validation.isValid) {
    console.warn(
      `Scale fingering validation failed for "${scaleName}" (root: ${root}, position: ${positionIndex}):`,
      `\n  Coverage: ${(validation.coverage * 100).toFixed(1)}%`,
      `\n  Invalid notes: ${validation.invalidNotes.slice(0, 5).join(', ')}${validation.invalidNotes.length > 5 ? '...' : ''}`
    );
  }
  
  return fingering;
}
