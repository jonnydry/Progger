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
      // Position 1: C shape (8th fret on low E) - C D E F G A B
      [[8, 10, 12], [8, 10, 12], [9, 10, 12], [9, 10, 12], [10, 12, 13], [8, 10, 12]],
      // Position 2: A shape (5th fret on low E) - A B C# D E F# G#
      [[5, 7, 9], [5, 7, 9], [6, 7, 9], [6, 7, 9], [7, 9, 10], [5, 7, 9]],
      // Position 3: G shape (3rd fret on low E) - G A B C D E F#
      [[3, 5, 7], [3, 5, 7], [4, 5, 7], [4, 5, 7], [5, 7, 8], [3, 5, 7]],
      // Position 4: E shape (12th fret on low E) - E F# G# A B C# D#
      [[12, 14, 16], [12, 14, 16], [13, 14, 16], [13, 14, 16], [14, 16, 17], [12, 14, 16]],
      // Position 5: D shape (10th fret on low E) - D E F# G A B C#
      [[10, 12, 14], [10, 12, 14], [11, 12, 14], [11, 12, 14], [12, 14, 15], [10, 12, 14]],
    ],
    positions: ['Position 1 (C)', 'Position 2 (A)', 'Position 3 (G)', 'Position 4 (E)', 'Position 5 (D)'],
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
 * Detect the base root note of a fingering pattern
 * Analyzes the scale intervals applied to the low E string to find the true root
 *
 * @param fingering - 2D array representing frets for each string [lowE, A, D, G, B, highE]
 * @param scaleName - Scale name to get proper intervals
 * @returns Root note name in sharp notation
 */
function detectFingeringBaseRoot(fingering: number[][], scaleName?: string): string {
  // Validate fingering structure
  if (!fingering || fingering.length < 6 || !fingering[0] || fingering[0].length === 0) {
    console.warn('Invalid fingering pattern provided to detectFingeringBaseRoot - defaulting to C');
    return 'C';
  }

  // For scales, we need to look at the pattern's structure more carefully
  // The low E string usually contains the root note at some position
  const lowEString = fingering[0]; // Low E string

  // Standard guitar tuning - Low E = 4 (E in chromatic scale where C=0)
  const STANDARD_TUNING_LOW_E = 4;

  // For 3-note-per-string patterns (most common), the first note is typically the root
  // Get the minimum fret to determine the starting point
  const minFret = Math.min(...lowEString.filter(f => f >= 0));

  // The pattern should contain the root note somewhere on the low E string
  // For most scale patterns, the lowest note on the low E string represents the root
  const rootFret = minFret >= 0 ? minFret : lowEString.find(fret => fret >= 0) ?? 0;

  const rootValue = (STANDARD_TUNING_LOW_E + rootFret) % 12;

  // Use valueToNote from musicTheory for consistency
  return valueToNote(rootValue);
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
export function getScaleFingering(scaleName: string, rootNote?: string, positionIndex: number = 0): number[][] {
  const root = rootNote || extractRootFromScaleName(scaleName);
  const targetRootValue = noteToValue(root);

  const normalized = normalizeScaleName(scaleName);
  const scaleData = SCALE_LIBRARY[normalized];

  let baseFingering: number[][] | undefined;

  // Try to find the scale in the library
  if (scaleData && scaleData.fingerings && scaleData.fingerings.length > 0) {
    // Use the specified position index, clamping to available positions
    const safePositionIndex = Math.max(0, Math.min(positionIndex, scaleData.fingerings.length - 1));
    baseFingering = scaleData.fingerings[safePositionIndex];
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
  let semitones = calculateSemitoneDistance(baseRoot, root);

  // Choose the shortest transposition distance to keep patterns playable
  // If going up more than 6 semitones, go down instead (e.g., C to B: -1 instead of +11)
  if (semitones > 6) {
    semitones = semitones - 12; // Convert to negative (downward) transposition
  }

  if (semitones !== 0) {
    console.info(`Transposing ${normalized} scale from ${baseRoot} to ${root} (${semitones} semitones)`);
  }

  return transposeFingering(baseFingering, semitones);
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
