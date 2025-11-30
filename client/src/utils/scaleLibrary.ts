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
  'major': {
    intervals: [0, 2, 4, 5, 7, 9, 11],
    fingerings: [
      // Position 1: 3-note-per-string pattern starting from root on low E string
      [[0, 2, 4], [0, 2, 4], [1, 2, 4], [1, 2, 4], [2, 4, 5], [0, 2, 4]],
      // Position 2: Shift up 12 frets for next octave
      [[12, 14, 16], [12, 14, 16], [13, 14, 16], [13, 14, 16], [14, 16, 17], [12, 14, 16]],
      // Position 3: Pentatonic overlap pattern
      [[7, 9, 11], [7, 9, 11], [8, 9, 11], [8, 9, 11], [9, 11, 12], [7, 9, 11]],
      // Position 4: Another octave shift
      [[5, 7, 9], [5, 7, 9], [6, 7, 9], [6, 7, 9], [7, 9, 10], [5, 7, 9]],
      // Position 5: Final position for complete neck coverage
      [[14, 16, 18], [14, 16, 18], [15, 16, 18], [15, 16, 18], [16, 18, 19], [14, 16, 18]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },
  
  'ionian': {
    intervals: [0, 2, 4, 5, 7, 9, 11],
    fingerings: [
      // Position 1: C shape (8th fret on low E)
      [[8, 10, 12], [8, 10, 12], [9, 10, 12], [9, 10, 12], [10, 12, 13], [8, 10, 12]],
      // Position 2: A shape (5th fret on low E)
      [[5, 7, 9], [5, 7, 9], [6, 7, 9], [6, 7, 9], [7, 9, 10], [5, 7, 9]],
      // Position 3: G shape (3rd fret on low E)
      [[3, 5, 7], [3, 5, 7], [4, 5, 7], [4, 5, 7], [5, 7, 8], [3, 5, 7]],
      // Position 4: E shape (12th fret on low E)
      [[12, 14, 16], [12, 14, 16], [13, 14, 16], [13, 14, 16], [14, 16, 17], [12, 14, 16]],
      // Position 5: D shape (10th fret on low E)
      [[10, 12, 14], [10, 12, 14], [11, 12, 14], [11, 12, 14], [12, 14, 15], [10, 12, 14]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },
  
  'dorian': {
    intervals: [0, 2, 3, 5, 7, 9, 10],
    fingerings: [
      // Position 1: D shape (10th fret on low E) - D E F G A B C
      [[10, 12, 13], [10, 12, 14], [10, 12, 14], [10, 12, 14], [10, 13, 15], [10, 12, 13]],
      // Position 2: C shape (8th fret on low E) - C D E F G A Bb
      [[8, 10, 12], [8, 10, 12], [8, 10, 12], [8, 10, 12], [8, 10, 13], [8, 10, 12]],
      // Position 3: A shape (5th fret on low E) - A B C D E F G
      [[5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 7, 9], [5, 8, 10], [5, 7, 8]],
      // Position 4: G shape (3rd fret on low E) - G A Bb C D E F
      [[3, 5, 7], [3, 5, 7], [3, 5, 7], [3, 5, 7], [3, 5, 8], [3, 5, 7]],
      // Position 5: E shape (12th fret on low E) - E F G A B C D
      [[12, 14, 15], [12, 14, 16], [12, 14, 16], [12, 14, 16], [12, 15, 17], [12, 14, 15]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },
  
  'phrygian': {
    intervals: [0, 1, 3, 5, 7, 8, 10],
    fingerings: [
      // Position 1: E shape (12th fret on low E) - E F G A B C D
      [[12, 13, 15], [12, 14, 15], [12, 14, 16], [12, 14, 16], [12, 15, 17], [12, 13, 15]],
      // Position 2: D shape (10th fret on low E) - D E F G A Bb C
      [[10, 12, 13], [10, 11, 13], [10, 12, 14], [10, 12, 14], [10, 13, 15], [10, 12, 13]],
      // Position 3: C shape (8th fret on low E) - C D Eb F G Ab Bb
      [[8, 10, 11], [8, 9, 11], [8, 10, 12], [8, 10, 12], [8, 11, 13], [8, 10, 11]],
      // Position 4: A shape (5th fret on low E) - A Bb C D E F G
      [[5, 6, 8], [5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 8, 10], [5, 6, 8]],
      // Position 5: G shape (3rd fret on low E) - G Ab Bb C D Eb F
      [[3, 4, 6], [3, 5, 6], [3, 5, 7], [3, 5, 7], [3, 6, 8], [3, 4, 6]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },
  
  'lydian': {
    intervals: [0, 2, 4, 6, 7, 9, 11],
    fingerings: [
      // Position 1: F shape (1st fret on low E) - F G A B C D E
      [[1, 3, 5], [1, 3, 5], [2, 3, 5], [2, 4, 5], [2, 4, 5], [1, 3, 5]],
      // Position 2: E shape (12th fret on low E) - E F# G# A# B C# D#
      [[12, 14, 16], [12, 14, 16], [13, 14, 16], [13, 15, 16], [13, 15, 16], [12, 14, 16]],
      // Position 3: D shape (10th fret on low E) - D E F# G# A B C#
      [[10, 12, 14], [10, 12, 14], [11, 12, 14], [11, 13, 14], [11, 13, 14], [10, 12, 14]],
      // Position 4: C shape (8th fret on low E) - C D E F# G A B
      [[8, 10, 12], [8, 10, 12], [9, 10, 12], [9, 11, 12], [9, 11, 12], [8, 10, 12]],
      // Position 5: A shape (5th fret on low E) - A B C# D# E F# G#
      [[5, 7, 9], [5, 7, 9], [6, 7, 9], [6, 8, 9], [6, 8, 9], [5, 7, 9]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },
  
  'mixolydian': {
    intervals: [0, 2, 4, 5, 7, 9, 10],
    fingerings: [
      // Position 1: G shape (3rd fret on low E) - G A B C D E F
      [[3, 5, 7], [3, 5, 6], [4, 5, 7], [4, 5, 7], [5, 7, 8], [3, 5, 7]],
      // Position 2: F shape (1st fret on low E) - F G A Bb C D Eb
      [[1, 3, 5], [1, 3, 4], [2, 3, 5], [2, 3, 5], [3, 5, 6], [1, 3, 5]],
      // Position 3: E shape (12th fret on low E) - E F# G# A B C# D
      [[12, 14, 16], [12, 14, 15], [13, 14, 16], [13, 14, 16], [14, 16, 17], [12, 14, 16]],
      // Position 4: D shape (10th fret on low E) - D E F# G A B C
      [[10, 12, 14], [10, 12, 13], [11, 12, 14], [11, 12, 14], [12, 14, 15], [10, 12, 14]],
      // Position 5: C shape (8th fret on low E) - C D E F G A Bb
      [[8, 10, 12], [8, 10, 11], [9, 10, 12], [9, 10, 12], [10, 12, 13], [8, 10, 12]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },
  
  'aeolian': {
    intervals: [0, 2, 3, 5, 7, 8, 10],
    fingerings: [
      // Position 1: A shape (5th fret on low E) - A B C D E F G
      [[5, 7, 8], [5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 8, 10], [5, 7, 8]],
      // Position 2: G shape (3rd fret on low E) - G A Bb C D Eb F
      [[3, 5, 7], [3, 5, 6], [3, 5, 7], [3, 5, 7], [3, 6, 8], [3, 5, 7]],
      // Position 3: E shape (12th fret on low E) - E F# G A B C D
      [[12, 14, 15], [12, 14, 15], [12, 14, 16], [12, 14, 16], [12, 15, 17], [12, 14, 15]],
      // Position 4: D shape (10th fret on low E) - D E F G A Bb C
      [[10, 12, 13], [10, 12, 13], [10, 12, 14], [10, 12, 14], [10, 13, 15], [10, 12, 13]],
      // Position 5: C shape (8th fret on low E) - C D Eb F G Ab Bb
      [[8, 10, 11], [8, 10, 11], [8, 10, 12], [8, 10, 12], [8, 11, 13], [8, 10, 11]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },

  'minor': {
    intervals: [0, 2, 3, 5, 7, 8, 10],
    fingerings: [
      // Position 1: A shape (5th fret on low E) - A B C D E F G
      [[5, 7, 8], [5, 7, 8], [5, 7, 9], [5, 7, 9], [5, 8, 10], [5, 7, 8]],
      // Position 2: G shape (3rd fret on low E) - G A Bb C D Eb F
      [[3, 5, 7], [3, 5, 6], [3, 5, 7], [3, 5, 7], [3, 6, 8], [3, 5, 7]],
      // Position 3: E shape (12th fret on low E) - E F# G A B C D
      [[12, 14, 15], [12, 14, 15], [12, 14, 16], [12, 14, 16], [12, 15, 17], [12, 14, 15]],
      // Position 4: D shape (10th fret on low E) - D E F G A Bb C
      [[10, 12, 13], [10, 12, 13], [10, 12, 14], [10, 12, 14], [10, 13, 15], [10, 12, 13]],
      // Position 5: C shape (8th fret on low E) - C D Eb F G Ab Bb
      [[8, 10, 11], [8, 10, 11], [8, 10, 12], [8, 10, 12], [8, 11, 13], [8, 10, 11]],
    ],
    positions: ['Position 1', 'Position 2', 'Position 3', 'Position 4', 'Position 5'],
  },
  
  'locrian': {
    intervals: [0, 1, 3, 5, 6, 8, 10],
    fingerings: [
      // Position 1: B shape (7th fret on low E) - B C D E F G A
      [[7, 8, 10], [7, 9, 10], [7, 9, 11], [7, 9, 10], [7, 10, 12], [7, 8, 10]],
      // Position 2: A shape (5th fret on low E) - A Bb C D Eb F G
      [[5, 6, 8], [5, 7, 8], [5, 7, 9], [5, 7, 8], [5, 8, 10], [5, 6, 8]],
      // Position 3: G shape (3rd fret on low E) - G Ab Bb C Db Eb F
      [[3, 4, 6], [3, 5, 6], [3, 5, 7], [3, 5, 6], [3, 6, 8], [3, 4, 6]],
      // Position 4: E shape (12th fret on low E) - E F G A Bb C D
      [[12, 13, 15], [12, 14, 15], [12, 14, 16], [12, 14, 15], [12, 15, 17], [12, 13, 15]],
      // Position 5: D shape (10th fret on low E) - D Eb F G Ab Bb C
      [[10, 11, 13], [10, 12, 13], [10, 12, 14], [10, 12, 13], [10, 13, 15], [10, 11, 13]],
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
    intervals: [0, 2, 4, 7, 9],
    fingerings: [
      // Position 1 (Box 1): E shape at 12th fret - E F# G# B C#
      [[12, 14], [12, 14], [11, 13], [12, 14], [12, 14], [12, 14]],
      // Position 2 (Box 2): D shape at 9-10th fret - D E F# A B
      [[10, 12], [9, 12], [9, 11], [9, 12], [10, 12], [10, 12]],
      // Position 3 (Box 3): C shape at 7-8th fret - C D E G A
      [[8, 10], [7, 10], [7, 9], [7, 9], [8, 10], [8, 10]],
      // Position 4 (Box 4): A shape at 5th fret - A B C# E F#
      [[5, 7], [5, 7], [4, 7], [5, 7], [5, 7], [5, 7]],
      // Position 5 (Box 5): G shape at 2-3rd fret - G A B D E
      [[3, 5], [2, 5], [2, 4], [2, 4], [3, 5], [3, 5]],
    ],
    positions: ['Position 1 (Box 1)', 'Position 2 (Box 2)', 'Position 3 (Box 3)', 'Position 4 (Box 4)', 'Position 5 (Box 5)'],
  },
  
  'pentatonic minor': {
    intervals: [0, 3, 5, 7, 10],
    fingerings: [
      // Position 1 (Box 1): E shape at 12th fret - E G A B D
      [[12, 15], [12, 15], [12, 14], [12, 14], [12, 15], [12, 15]],
      // Position 2 (Box 2): D shape at 10th fret - D F G A C
      [[10, 13], [10, 13], [10, 12], [10, 12], [10, 13], [10, 13]],
      // Position 3 (Box 3): C shape at 8th fret - C Eb F G Bb
      [[8, 11], [8, 11], [8, 10], [8, 10], [8, 11], [8, 11]],
      // Position 4 (Box 4): A shape at 5th fret - A C D E G
      [[5, 8], [5, 8], [5, 7], [5, 7], [5, 8], [5, 8]],
      // Position 5 (Box 5): G shape at 3rd fret - G Bb C D F
      [[3, 6], [3, 6], [3, 5], [3, 5], [3, 6], [3, 6]],
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
  const STORED_PATTERN_ROOTS: Record<string, string> = {
    'major': 'C',           // Ionian patterns are for C major
    'ionian': 'C',         // Same as major
    'dorian': 'D',         // Dorian patterns are for D Dorian
    'phrygian': 'E',       // Phrygian patterns are for E Phrygian
    'lydian': 'F',         // Lydian patterns are for F Lydian
    'mixolydian': 'G',     // Mixolydian patterns are for G Mixolydian
    'aeolian': 'A',        // Aeolian patterns are for A minor (natural minor)
    'minor': 'A',          // Minor patterns are for A minor
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
 * 4. Gets the root note that stored patterns for this scale represent (from static mapping)
 * 5. Transposes the pattern to the requested root note
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
    console.warn(`No stored patterns found for scale "${normalized}", falling back to algorithmic generation`);
    return generateFingeringAlgorithmically(scaleName, root, positionIndex);
  }

  // Map position index to stored pattern index
  // Position 0 should be the lowest position on the neck
  // We sort stored patterns by their minimum fret to ensure position 0 is lowest
  const availablePositions = scaleData.fingerings.length;
  const safePositionIndex = Math.max(0, Math.min(positionIndex, availablePositions - 1));
  
  // Find the minimum fret for each stored pattern to determine ordering
  const patternsWithMinFrets = scaleData.fingerings.map((pattern, index) => {
    const allFrets = pattern.flat().filter(f => f >= 0);
    const minFret = allFrets.length > 0 ? Math.min(...allFrets) : 999;
    return { pattern, minFret, originalIndex: index };
  });
  
  // Sort by minimum fret (lowest first) to ensure position 0 is the lowest position
  patternsWithMinFrets.sort((a, b) => a.minFret - b.minFret);
  
  // Get the stored pattern index for the requested position
  const storedPatternIndex = patternsWithMinFrets[safePositionIndex]?.originalIndex ?? safePositionIndex;

  // Get the stored pattern for this position
  const storedPattern = scaleData.fingerings[storedPatternIndex];
  if (!storedPattern || storedPattern.length !== 6) {
    console.warn(`Invalid stored pattern at position ${safePositionIndex} for scale "${normalized}"`);
    return generateFingeringAlgorithmically(scaleName, root, positionIndex);
  }

  // Get the root note that stored patterns for this scale represent
  // Stored patterns are for canonical keys (C for major, D for Dorian, etc.)
  const storedRoot = getStoredPatternRoot(normalized);

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

  // Position configurations - relative start positions for different scale patterns
  const POSITION_OFFSETS = {
    major: [8, 4, 0, 5, 9],
    dorian: [10, 7, 3, 0, 4],
    phrygian: [12, 8, 4, 1, 5],
    lydian: [7, 11, 2, 6, 9],
    mixolydian: [3, 10, 6, 0, 7],
    aeolian: [5, 9, 2, 6, 10],
    locrian: [7, 11, 3, 8, 0],
    minor: [5, 9, 2, 6, 10],
    'harmonic minor': [0, 7, 2],
    'melodic minor': [0, 7, 2],
    'pentatonic major': [0, 7, 5, 9, 2],
    'pentatonic minor': [5, 0, 7, 3, 10],
    blues: [0, 7, 2],
    'whole tone': [0, 6],
    diminished: [0, 3]
  };

  const offsets = POSITION_OFFSETS[normalized as keyof typeof POSITION_OFFSETS] || POSITION_OFFSETS.major;
  const safePositionIndex = Math.max(0, Math.min(positionIndex, offsets.length - 1));
  const rootOffset = offsets[safePositionIndex] || 0;
  const positionRootValue = (rootValue + rootOffset) % 12;

  // Standard guitar tuning values (chromatic scale where C=0)
  const tuning = [4, 9, 2, 7, 11, 4]; // Low E, A, D, G, B, High E

  // Generate scale shape from root on each string
  const fingerings = tuning.map(stringTuning => {
    const rootFret = (positionRootValue - stringTuning + 12) % 12;
    return intervals.map(interval => (rootFret + interval) % 12).sort((a, b) => a - b);
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

  // First, try the direct transposition
  let octaveAdjustment = 0;
  let needsAdjustment = false;

  // Check if transposition would go out of bounds
  const minFret = Math.min(...fingering.flat());
  const maxFret = Math.max(...fingering.flat());

  if (minFret + semitones < 0) {
    // Would go below fret 0 - shift up by octave (12 frets)
    octaveAdjustment = 12;
    needsAdjustment = true;
  } else if (maxFret + semitones > 24) {
    // Would go above fret 24 - shift down by octave (12 frets)
    octaveAdjustment = -12;
    needsAdjustment = true;
  }

  // Apply transposition with octave adjustment
  const adjustedSemitones = semitones + octaveAdjustment;
  let hasClampedFrets = false;

  const result = fingering.map(stringFrets =>
    stringFrets.map(fret => {
      const newFret = fret + adjustedSemitones;
      // Final safety check - clamp only if still out of range after octave adjustment
      if (newFret < 0) {
        hasClampedFrets = true;
        return 0;
      }
      if (newFret > 24) {
        hasClampedFrets = true;
        return 24;
      }
      return newFret;
    })
  );

  if (needsAdjustment) {
    console.info(`Scale transposition adjusted by ${octaveAdjustment > 0 ? '+' : ''}${octaveAdjustment} frets (${Math.abs(octaveAdjustment / 12)} octave${Math.abs(octaveAdjustment) !== 12 ? 's' : ''}) to keep pattern playable`);
  }

  if (hasClampedFrets) {
    console.warn(`Scale transposition by ${adjustedSemitones} semitones still exceeded playable range (0-24 frets) after octave adjustment. Some notes were clamped and may be incorrect.`);
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
