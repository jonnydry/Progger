/**
 * Chord Library - Guitar Chord Voicings Database
 *
 * This file contains a comprehensive library of guitar chord voicings.
 *
 * CRITICAL GUITAR CONVENTION:
 * All frets arrays follow standard guitar notation order:
 * [Low E (6th), A (5th), D (4th), G (3rd), B (2nd), High E (1st)]
 *
 * Visual Representation:
 * ┌─────────┐
 * │ E (1st) │ ← frets[5]
 * │ B (2nd) │ ← frets[4]
 * │ G (3rd) │ ← frets[3]
 * │ D (4th) │ ← frets[2]
 * │ A (5th) │ ← frets[1]
 * │ E (6th) │ ← frets[0]
 * └─────────┘
 *   Thinnest     Thickest
 *
 * Example: E major open = [0, 2, 2, 1, 0, 0]
 * Produces notes: E (low) - B - E - G# - B - E (high)
 */

import type { ChordVoicing } from '../types';

export interface ChordData {
  name: string;
  voicings: ChordVoicing[];
}

type ChordKey = `${string}_${string}`;

const CHORD_VOICINGS: Record<ChordKey, ChordVoicing[]> = {
  'C_major': [
    { frets: ['x', 3, 2, 0, 1, 0], position: 'Open' },
    { frets: ['x', 3, 5, 5, 5, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 8, position: 'Barre 8th' },
  ],
  'C_minor': [
    { frets: ['x', 3, 1, 0, 1, 3], position: 'Open' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 8, position: 'Barre 8th' },
  ],
  'C_7': [
    { frets: ['x', 3, 2, 3, 1, 0], position: 'Open' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 8, position: 'Barre 8th' },
  ],
  'C_maj7': [
    { frets: ['x', 3, 2, 0, 0, 0], position: 'Open' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 8, position: 'Barre 8th' },
  ],
  'C_min7': [
    { frets: ['x', 3, 1, 3, 1, 1], position: 'Open' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 8, position: 'Barre 8th' },
  ],
  'C_sus2': [
    { frets: ['x', 3, 0, 0, 3, 3], position: 'Open' },
    { frets: [1, 3, 3, 3, 1, 3], firstFret: 8, position: 'Barre 8th' },
  ],
  'C_sus4': [
    { frets: ['x', 3, 3, 0, 1, 1], position: 'Open' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 8, position: 'Barre 8th' },
  ],
  'C_dim': [
    { frets: ['x', 3, 1, 2, 1, 'x'], position: 'Partial' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 8, position: 'Interior' },
  ],
  'C_aug': [
    { frets: ['x', 3, 2, 1, 1, 0], position: 'Open' },
  ],
  'C_add9': [
    { frets: ['x', 3, 2, 0, 3, 0], position: 'Open' },
  ],
  'C_6': [
    { frets: ['x', 3, 2, 2, 1, 0], position: 'Open' },
  ],

  'D_major': [
    { frets: ['x', 'x', 0, 2, 3, 2], position: 'Open' },
    { frets: ['x', 5, 7, 7, 7, 5], firstFret: 5, position: 'Barre 5th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 10, position: 'Barre 10th' },
  ],
  'D_minor': [
    { frets: ['x', 'x', 0, 2, 3, 1], position: 'Open' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 10, position: 'Barre 10th' },
  ],
  'D_7': [
    { frets: ['x', 'x', 0, 2, 1, 2], position: 'Open' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 10, position: 'Barre 10th' },
  ],
  'D_maj7': [
    { frets: ['x', 'x', 0, 2, 2, 2], position: 'Open' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 10, position: 'Barre 10th' },
  ],
  'D_min7': [
    { frets: ['x', 'x', 0, 2, 1, 1], position: 'Open' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 10, position: 'Barre 10th' },
  ],
  'D_sus2': [
    { frets: ['x', 'x', 0, 2, 3, 0], position: 'Open' },
  ],
  'D_sus4': [
    { frets: ['x', 'x', 0, 2, 3, 3], position: 'Open' },
  ],

  'E_major': [
    { frets: [0, 2, 2, 1, 0, 0], position: 'Open' },
    { frets: ['x', 7, 9, 9, 9, 7], firstFret: 7, position: 'Barre 7th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 12, position: 'Barre 12th' },
  ],
  'E_minor': [
    { frets: [0, 2, 2, 0, 0, 0], position: 'Open' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 12, position: 'Barre 12th' },
  ],
  'E_7': [
    { frets: [0, 2, 0, 1, 0, 0], position: 'Open' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 12, position: 'Barre 12th' },
  ],
  'E_maj7': [
    { frets: [0, 2, 1, 1, 0, 0], position: 'Open' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 12, position: 'Barre 12th' },
  ],
  'E_min7': [
    { frets: [0, 2, 0, 0, 0, 0], position: 'Open' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 12, position: 'Barre 12th' },
  ],
  'E_sus2': [
    { frets: [0, 2, 2, 2, 0, 0], position: 'Open' },
  ],
  'E_sus4': [
    { frets: [0, 2, 2, 2, 5, 0], position: 'Open' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 7, position: 'Barre 7th' },
  ],

  'F_major': [
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 3, 2, 1, 1], firstFret: 1, position: 'Partial' },
    { frets: ['x', 8, 10, 10, 10, 8], firstFret: 8, position: 'Barre 8th' },
  ],
  'F_minor': [
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 3, 1, 1, 1], firstFret: 1, position: 'Partial' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 8, position: 'Barre 8th' },
  ],
  'F_7': [
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 3, 2, 1, 2], firstFret: 1, position: 'Partial' },
  ],
  'F_maj7': [
    { frets: [5, 7, 6, 6, 5, 5], firstFret: 5, position: 'Barre 5th' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 3, 2, 1, 0], position: 'Open' },
  ],
  'F_min7': [
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 3, 1, 1, 2], firstFret: 1, position: 'Partial' },
  ],
  'F_sus4': [
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 1, position: 'Barre 1st' },
  ],

  'G_major': [
    { frets: [3, 2, 0, 0, 0, 3], position: 'Open' },
    { frets: [3, 5, 5, 4, 3, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 10, 12, 12, 12, 10], firstFret: 10, position: 'Barre 10th' },
  ],
  'G_minor': [
    { frets: [3, 5, 5, 3, 3, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 10, position: 'Barre 10th' },
  ],
  'G_7': [
    { frets: [3, 2, 0, 0, 0, 1], position: 'Open' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 3, position: 'Barre 3rd' },
  ],
  'G_maj7': [
    { frets: [3, 2, 0, 0, 0, 2], position: 'Open' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 3, position: 'Barre 3rd' },
  ],
  'G_min7': [
    { frets: [3, 5, 3, 3, 3, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 10, position: 'Barre 10th' },
  ],

  'A_major': [
    { frets: ['x', 0, 2, 2, 2, 0], position: 'Open' },
    { frets: [5, 7, 7, 6, 5, 5], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 12, 14, 14, 14, 12], firstFret: 12, position: 'Barre 12th' },
  ],
  'A_minor': [
    { frets: ['x', 0, 2, 2, 1, 0], position: 'Open' },
    { frets: [5, 7, 7, 5, 5, 5], firstFret: 5, position: 'Barre 5th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 12, position: 'Barre 12th' },
  ],
  'A_7': [
    { frets: ['x', 0, 2, 0, 2, 0], position: 'Open' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 5, position: 'Barre 5th' },
  ],
  'A_maj7': [
    { frets: ['x', 0, 2, 1, 2, 0], position: 'Open' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 5, position: 'Barre 5th' },
  ],
  'A_min7': [
    { frets: ['x', 0, 2, 0, 1, 0], position: 'Open' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 5, position: 'Barre 5th' },
  ],
  'A_sus2': [
    { frets: ['x', 0, 2, 2, 0, 0], position: 'Open' },
  ],
  'A_sus4': [
    { frets: ['x', 0, 2, 2, 3, 0], position: 'Open' },
  ],

  'B_major': [
    { frets: ['x', 2, 4, 4, 4, 2], firstFret: 2, position: 'Barre 2nd' },
    { frets: [7, 9, 9, 8, 7, 7], firstFret: 7, position: 'Barre 7th' },
  ],
  'B_minor': [
    { frets: ['x', 2, 4, 4, 3, 2], firstFret: 2, position: 'Barre 2nd' },
    { frets: [7, 9, 9, 7, 7, 7], firstFret: 7, position: 'Barre 7th' },
  ],
  'B_7': [
    { frets: ['x', 2, 1, 2, 0, 2], position: 'Open' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 7, position: 'Barre 7th' },
  ],
  'B_maj7': [
    { frets: ['x', 2, 4, 3, 4, 2], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 7, position: 'Barre 7th' },
  ],
  'B_min7': [
    { frets: ['x', 2, 0, 2, 0, 2], position: 'Open' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 7, position: 'Barre 7th' },
  ],

  'Db_major': [
    { frets: ['x', 4, 6, 6, 6, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'Db_minor': [
    { frets: ['x', 4, 6, 6, 5, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'Db_7': [
    { frets: ['x', 4, 6, 4, 6, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'Db_maj7': [
    { frets: ['x', 4, 6, 5, 6, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'Db_min7': [
    { frets: ['x', 4, 6, 4, 5, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],

  'Eb_major': [
    { frets: ['x', 'x', 1, 3, 4, 3], position: 'Open' },
    { frets: ['x', 6, 8, 8, 8, 6], firstFret: 6, position: 'Barre 6th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'Eb_minor': [
    { frets: ['x', 'x', 1, 3, 4, 2], position: 'Open' },
    { frets: ['x', 6, 8, 8, 7, 6], firstFret: 6, position: 'Barre 6th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'Eb_7': [
    { frets: ['x', 'x', 1, 3, 2, 3], position: 'Open' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'Eb_maj7': [
    { frets: ['x', 'x', 1, 3, 3, 3], position: 'Open' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'Eb_min7': [
    { frets: ['x', 'x', 1, 3, 2, 2], position: 'Open' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],

  'F#_major': [
    { frets: [2, 4, 4, 3, 2, 2], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 9, 11, 11, 11, 9], firstFret: 9, position: 'Barre 9th' },
  ],
  'F#_minor': [
    { frets: [2, 4, 4, 2, 2, 2], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 9, 11, 11, 10, 9], firstFret: 9, position: 'Barre 9th' },
  ],
  'F#_7': [
    { frets: [2, 4, 2, 3, 2, 2], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'F#_maj7': [
    { frets: [2, 4, 3, 3, 2, 2], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'F#_min7': [
    { frets: [2, 4, 2, 2, 2, 2], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],

  'Gb_major': [
    { frets: [2, 4, 4, 3, 2, 2], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 9, 11, 11, 11, 9], firstFret: 9, position: 'Barre 9th' },
  ],
  'Gb_minor': [
    { frets: [2, 4, 4, 2, 2, 2], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 9, 11, 11, 10, 9], firstFret: 9, position: 'Barre 9th' },
  ],
  'Gb_7': [
    { frets: [2, 4, 2, 3, 2, 2], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'Gb_maj7': [
    { frets: [2, 4, 3, 3, 2, 2], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'Gb_min7': [
    { frets: [2, 4, 2, 2, 2, 2], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],

  'Ab_major': [
    { frets: [4, 6, 6, 5, 4, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 6, 5, 4, 4], firstFret: 4, position: 'Partial' },
  ],
  'Ab_minor': [
    { frets: [4, 6, 6, 4, 4, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 6, 4, 4, 4], firstFret: 4, position: 'Partial' },
  ],
  'Ab_7': [
    { frets: [4, 6, 4, 5, 4, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 1, 2], position: 'Open' },
  ],
  'Ab_maj7': [
    { frets: [4, 6, 5, 5, 4, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 1, 3], position: 'Open' },
  ],
  'Ab_min7': [
    { frets: [4, 6, 4, 4, 4, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],

  'Bb_major': [
    { frets: [6, 8, 8, 7, 6, 6], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 1, position: 'Barre 1st' },
  ],
  'Bb_minor': [
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: [6, 8, 8, 6, 6, 6], firstFret: 6, position: 'Barre 6th' },
  ],
  'Bb_7': [
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 6, position: 'Barre 6th' },
  ],
  'Bb_maj7': [
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 6, position: 'Barre 6th' },
  ],
  'Bb_min7': [
    { frets: ['x', 1, 3, 1, 2, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 6, position: 'Barre 6th' },
  ],
};

const GENERIC_BARRE_SHAPES: Record<string, ChordVoicing[]> = {
  // Basic triads
  'major': [{ frets: [1, 3, 3, 2, 1, 1], firstFret: 1, position: 'Barre' }],
  'minor': [{ frets: [1, 3, 3, 1, 1, 1], firstFret: 1, position: 'Barre' }],
  'dim': [{ frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Partial' }],
  'dim7': [{ frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Partial' }],
  'aug': [{ frets: ['x', 'x', 2, 1, 1, 4], firstFret: 1, position: 'Partial' }],

  // Suspended chords
  'sus2': [{ frets: [1, 3, 3, 3, 1, 3], firstFret: 1, position: 'Barre' }],
  'sus4': [{ frets: [1, 3, 3, 3, 1, 1], firstFret: 1, position: 'Barre' }],

  // Seventh chords
  '7': [{ frets: [1, 3, 1, 2, 1, 1], firstFret: 1, position: 'Barre' }],
  'maj7': [{ frets: [1, 3, 2, 2, 1, 1], firstFret: 1, position: 'Barre' }],
  'min7': [{ frets: [1, 3, 1, 1, 1, 1], firstFret: 1, position: 'Barre' }],
  'min7b5': [{ frets: ['x', 'x', 1, 2, 2, 2], firstFret: 1, position: 'Partial' }],

  // Altered dominant chords (tension chords)
  '7b9': [{ frets: [1, 3, 1, 2, 2, 'x'], firstFret: 1, position: 'Barre' }],
  '7#9': [{ frets: [1, 3, 1, 2, 4, 4], firstFret: 1, position: 'Barre' }],
  '7b5': [{ frets: [1, 2, 1, 2, 'x', 'x'], firstFret: 1, position: 'Partial' }],
  '7#5': [{ frets: [1, 'x', 1, 2, 2, 4], firstFret: 1, position: 'Partial' }],
  '7alt': [{ frets: [1, 3, 'x', 2, 4, 4], firstFret: 1, position: 'Barre' }],
  '7b13': [{ frets: [1, 3, 1, 2, 3, 'x'], firstFret: 1, position: 'Barre' }],
  '7#11': [{ frets: [1, 3, 1, 2, 4, 1], firstFret: 1, position: 'Barre' }],
  '7b9b13': [{ frets: [1, 3, 1, 2, 2, 3], firstFret: 1, position: 'Barre' }],
  '7#9b13': [{ frets: [1, 3, 1, 2, 4, 3], firstFret: 1, position: 'Barre' }],
  '7sus4': [{ frets: [1, 3, 1, 3, 1, 1], firstFret: 1, position: 'Barre' }],

  // Extended chords (9ths, 11ths, 13ths)
  '9': [{ frets: [1, 3, 1, 2, 1, 3], firstFret: 1, position: 'Barre' }],
  'maj9': [{ frets: [1, 3, 2, 2, 1, 3], firstFret: 1, position: 'Barre' }],
  'min9': [{ frets: [1, 3, 1, 1, 1, 3], firstFret: 1, position: 'Barre' }],
  '11': [{ frets: [1, 3, 1, 3, 1, 3], firstFret: 1, position: 'Barre' }],
  'maj11': [{ frets: [1, 3, 2, 3, 1, 3], firstFret: 1, position: 'Barre' }],
  'min11': [{ frets: [1, 3, 1, 3, 1, 3], firstFret: 1, position: 'Barre' }],
  '13': [{ frets: [1, 'x', 1, 2, 3, 3], firstFret: 1, position: 'Barre' }],
  'maj13': [{ frets: [1, 'x', 2, 2, 3, 3], firstFret: 1, position: 'Barre' }],
  'min13': [{ frets: [1, 'x', 1, 1, 3, 3], firstFret: 1, position: 'Barre' }],
  '9#11': [{ frets: [1, 3, 1, 2, 4, 3], firstFret: 1, position: 'Barre' }],
  '9sus4': [{ frets: [1, 3, 1, 3, 1, 3], firstFret: 1, position: 'Barre' }],

  // Sixth chords
  '6': [{ frets: [1, 3, 3, 2, 3, 1], firstFret: 1, position: 'Barre' }],
  'min6': [{ frets: [1, 3, 3, 1, 3, 1], firstFret: 1, position: 'Barre' }],
  '6/9': [{ frets: [1, 3, 3, 2, 3, 3], firstFret: 1, position: 'Barre' }],

  // Add chords
  'add9': [{ frets: [1, 3, 3, 2, 1, 3], firstFret: 1, position: 'Barre' }],
  'add11': [{ frets: [1, 3, 3, 2, 4, 1], firstFret: 1, position: 'Barre' }],
  'madd9': [{ frets: [1, 3, 3, 1, 1, 3], firstFret: 1, position: 'Barre' }],
};

// Map root notes to fret positions on the low E string (E=0)
// Includes both sharp and flat enharmonic equivalents for complete coverage
const ROOT_TO_FRET_FROM_E: Record<string, number> = {
  'C': 8, 'C#': 9, 'Db': 9,
  'D': 10, 'D#': 11, 'Eb': 11,
  'E': 0,
  'F': 1, 'F#': 2, 'Gb': 2,
  'G': 3, 'G#': 4, 'Ab': 4,
  'A': 5, 'A#': 6, 'Bb': 6,
  'B': 7
};

/**
 * Normalize root note to a consistent format for chord lookups
 * Standardizes enharmonic equivalents to match CHORD_VOICINGS keys
 * Note: F# and Gb are both kept as separate entries in voicings library
 */
function normalizeRoot(root: string): string {
  const upper = root.toUpperCase();

  // Map all sharp and flat variants to their standardized forms
  // Prioritizes flats for most notes (C#→Db, D#→Eb, etc.) for consistency
  // Exception: F# and Gb are both valid keys in the library
  const normalizedRoots: Record<string, string> = {
    'C': 'C',
    'C#': 'Db', 'DB': 'Db',
    'D': 'D',
    'D#': 'Eb', 'EB': 'Eb',
    'E': 'E',
    'F': 'F',
    'F#': 'F#', 'GB': 'Gb',  // Both variants exist in library
    'G': 'G',
    'G#': 'Ab', 'AB': 'Ab',
    'A': 'A',
    'A#': 'Bb', 'BB': 'Bb',
    'B': 'B'
  };

  const normalized = normalizedRoots[upper];
  if (!normalized) {
    console.warn(`Unknown root note: "${root}" - defaulting to C`);
    return 'C';
  }

  return normalized;
}

function normalizeQuality(quality: string): string {
  const q = quality.toLowerCase().replace(/\s+/g, '').trim();

  // Basic triads
  if (!q || q === 'maj' || q === 'major' || q === 'M') return 'major';
  if (q === 'm' || q === 'min' || q === 'minor' || q === '-') return 'minor';
  if (q === 'dim' || q === 'o' || q === '°') return 'dim';
  if (q === 'aug' || q === '+' || q === '#5') return 'aug';

  // Suspended chords
  if (q === 'sus2') return 'sus2';
  if (q === 'sus4' || q === 'sus') return 'sus4';

  // Seventh chords
  if (q === '7' || q === 'dom7' || q === 'dominant7') return '7';
  if (q === 'maj7' || q === 'major7' || q === 'M7' || q === 'Δ7' || q === 'Δ') return 'maj7';
  if (q === 'm7' || q === 'min7' || q === 'minor7' || q === '-7') return 'min7';
  if (q === 'dim7' || q === 'o7' || q === '°7') return 'dim7';
  if (q.startsWith('m7b5') || q === 'ø' || q === 'half-dim' || q === 'ø7') return 'min7b5';

  // Altered dominant chords (tension chords)
  if (q === '7b9' || q === '7(b9)') return '7b9';
  if (q === '7#9' || q === '7(#9)') return '7#9';
  if (q === '7b5' || q === '7(b5)' || q === '7-5') return '7b5';
  if (q === '7#5' || q === '7(#5)' || q === '7+5' || q === '7+') return '7#5';
  if (q === '7alt' || q === 'alt7' || q === '7altered') return '7alt';
  if (q === '7b13' || q === '7(b13)') return '7b13';
  if (q === '7#11' || q === '7(#11)') return '7#11';
  if (q === '7b9b13' || q === '7(b9,b13)') return '7b9b13';
  if (q === '7#9b13' || q === '7(#9,b13)') return '7#9b13';
  if (q === '7sus4' || q === '7sus') return '7sus4';

  // Extended chords (9ths, 11ths, 13ths)
  if (q === '9' || q === 'dom9') return '9';
  if (q === 'maj9' || q === 'M9' || q === 'Δ9') return 'maj9';
  if (q === 'm9' || q === 'min9' || q === '-9') return 'min9';
  if (q === '11' || q === 'dom11') return '11';
  if (q === 'maj11' || q === 'M11' || q === 'Δ11') return 'maj11';
  if (q === 'm11' || q === 'min11' || q === '-11') return 'min11';
  if (q === '13' || q === 'dom13') return '13';
  if (q === 'maj13' || q === 'M13' || q === 'Δ13') return 'maj13';
  if (q === 'm13' || q === 'min13' || q === '-13') return 'min13';
  if (q === '9#11' || q === '9(#11)') return '9#11';
  if (q === '9sus4' || q === '9sus') return '9sus4';

  // Sixth chords
  if (q === '6') return '6';
  if (q === 'm6' || q === 'min6' || q === '-6') return 'min6';
  if (q === '6/9' || q === '69') return '6/9';

  // Add chords
  if (q === 'add9') return 'add9';
  if (q === 'add11') return 'add11';
  if (q === 'madd9' || q === 'm(add9)') return 'madd9';

  // If nothing matches, log warning and return major as fallback
  if (q) {
    console.warn(`Unknown chord quality: "${quality}" - defaulting to major`);
  }
  return 'major';
}

function extractRootAndQuality(chordName: string): { root: string; quality: string } {
  const match = chordName.match(/^([A-G][#b]?)(.*)/i);
  if (!match) return { root: 'C', quality: 'major' };
  return { 
    root: normalizeRoot(match[1]), 
    quality: normalizeQuality(match[2]) 
  };
}

/**
 * Get the fret position for a root note on the low E string
 * @param root - Root note (should be normalized first)
 * @returns Fret number (0-11), defaults to 0 if not found
 */
function getFretOffset(root: string): number {
  const fretPosition = ROOT_TO_FRET_FROM_E[root];
  if (fretPosition === undefined) {
    console.warn(`Root note "${root}" not found in fret mapping - defaulting to fret 0 (E)`);
    return 0;
  }
  return fretPosition;
}

/**
 * Get chord voicings for a given chord name
 * 1. Tries to find specific voicings in CHORD_VOICINGS
 * 2. Falls back to generic barre shapes if available
 * 3. Returns "Unknown" voicing (all muted) as last resort
 * @param chordName - Chord name (e.g., "Cmaj7", "F#m", "Bb7")
 * @returns Array of chord voicings
 */
export function getChordVoicings(chordName: string): ChordVoicing[] {
  const { root, quality } = extractRootAndQuality(chordName);
  const key: ChordKey = `${root}_${quality}`;

  // Try to find specific voicing in library
  const voicings = CHORD_VOICINGS[key];
  if (voicings && voicings.length > 0) {
    return voicings;
  }

  // Fall back to generic barre shapes if quality is recognized
  const genericShapes = GENERIC_BARRE_SHAPES[quality];
  if (genericShapes && genericShapes.length > 0) {
    const fretPosition = getFretOffset(root);
    const adjustedFret = fretPosition === 0 ? 12 : fretPosition;

    console.info(`Using generic barre shape for ${chordName} (${key}) at fret ${adjustedFret}`);

    return genericShapes.map(shape => ({
      ...shape,
      firstFret: adjustedFret,
      position: `${root} ${quality}`
    }));
  }

  // No voicing found - return "unknown" placeholder
  console.warn(`⚠️ No voicing found for chord: ${chordName} (normalized to ${key}). This chord will display as all muted strings.`);
  return [{ frets: ['x', 'x', 'x', 'x', 'x', 'x'], position: 'Unknown' }];
}
