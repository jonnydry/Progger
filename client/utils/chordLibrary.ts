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
import { normalizeChordQuality } from '@shared/music/chordQualities';

export interface ChordData {
  name: string;
  voicings: ChordVoicing[];
}

type ChordKey = `${string}_${string}`;

const CHORD_VOICINGS: Record<ChordKey, ChordVoicing[]> = {
  'C_major': [
    { frets: ['x', 3, 2, 0, 1, 0], position: 'Open' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 3, position: 'Barre 3rd' },
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
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 5, position: 'Barre 5th' },
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
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 7, position: 'Barre 7th' },
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
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 8, position: 'Barre 8th' },
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
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 5, position: 'Barre 5th' },
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
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 10, position: 'Barre 10th' },
  ],
  'G_minor': [
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 3, position: 'Barre 3rd' },
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
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 10, position: 'Barre 10th' },
  ],

  'A_major': [
    { frets: ['x', 0, 2, 2, 2, 0], position: 'Open' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 12, position: 'Barre 12th' },
  ],
  'A_minor': [
    { frets: ['x', 0, 2, 2, 1, 0], position: 'Open' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 5, position: 'Barre 5th' },
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
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 7, position: 'Barre 7th' },
  ],
  'B_minor': [
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 7, position: 'Barre 7th' },
  ],
  'B_7': [
    { frets: ['x', 2, 1, 2, 0, 2], position: 'Open' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 7, position: 'Barre 7th' },
  ],
  'B_maj7': [
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 7, position: 'Barre 7th' },
  ],
  'B_min7': [
    { frets: ['x', 2, 0, 2, 0, 2], position: 'Open' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 7, position: 'Barre 7th' },
  ],

  'Db_major': [
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'Db_minor': [
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'Db_7': [
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'Db_maj7': [
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'Db_min7': [
    { frets: ['x', 1, 3, 1, 2, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],

  'Eb_major': [
    { frets: ['x', 'x', 1, 3, 4, 3], position: 'Open' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'Eb_minor': [
    { frets: ['x', 'x', 1, 3, 4, 2], position: 'Open' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 6, position: 'Barre 6th' },
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
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'F#_minor': [
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'F#_7': [
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'F#_maj7': [
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'F#_min7': [
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],

  'Gb_major': [
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'Gb_minor': [
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'Gb_7': [
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'Gb_maj7': [
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'Gb_min7': [
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],

  'Ab_major': [
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 3, 2, 1, 1], firstFret: 4, position: 'Partial' },
  ],
  'Ab_minor': [
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 3, 1, 1, 1], firstFret: 4, position: 'Partial' },
  ],
  'Ab_7': [
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 1, 2], position: 'Open' },
  ],
  'Ab_maj7': [
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 1, 3], position: 'Open' },
  ],
  'Ab_min7': [
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],

  'Bb_major': [
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 1, position: 'Barre 1st' },
  ],
  'Bb_minor': [
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 6, position: 'Barre 6th' },
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

  // Add missing common chords
  'C_9': [
    { frets: ['x', 3, 2, 3, 3, 0], position: 'Open' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 8, position: 'Barre 8th' },
  ],
  'G_9': [
    { frets: [3, 0, 0, 0, 0, 1], position: 'Open' },
  ],
  'D_9': [
    { frets: ['x', 'x', 0, 2, 1, 0], position: 'Open' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 10, position: 'Barre 10th' },
  ],
  'A_9': [
    { frets: ['x', 0, 2, 0, 0, 0], position: 'Open' },
  ],
  'E_9': [
    { frets: [0, 2, 0, 1, 0, 2], position: 'Open' },
  ],

  // Add power chords (5)
  'C_5': [
    { frets: ['x', 1, 3, 3, 'x', 'x'], firstFret: 3, position: 'Barre 3rd' },
    { frets: [1, 3, 3, 'x', 'x', 'x'], firstFret: 8, position: 'Barre 8th' },
  ],
  'G_5': [
    { frets: [1, 3, 3, 'x', 'x', 'x'], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 5, 4, 'x', 'x'], firstFret: 10, position: 'Interior' },
  ],
  'D_5': [
    { frets: ['x', 'x', 0, 2, 3, 'x'], position: 'Open' },
    { frets: [1, 3, 3, 'x', 'x', 'x'], firstFret: 5, position: 'Barre 5th' },
  ],
  'A_5': [
    { frets: ['x', 0, 2, 2, 'x', 'x'], position: 'Open' },
    { frets: [1, 3, 3, 'x', 'x', 'x'], firstFret: 5, position: 'Barre 5th' },
  ],
  'E_5': [
    { frets: [0, 2, 2, 'x', 'x', 'x'], position: 'Open' },
    { frets: [0, 2, 2, 'x', 'x', 'x'], firstFret: 12, position: 'Barre 12th' },
  ],

  // A-string root voicings - chords that position root notes on the A string (fret 1)
  // These provide alternative voicings with the root emphasized on the A string

  // E root on A string (fret 7) - E is fret 7 on A string
  'E_major_Aroot': [
    { frets: [1, 4, 6, 6, 6, 4], firstFret: 4, position: 'A-string Root' },
  ],
  'E_minor_Aroot': [
    { frets: [1, 4, 6, 6, 5, 4], firstFret: 4, position: 'A-string Root' },
  ],

  // F root on A string (fret 8) - F is fret 8 on A string
  'F_major_Aroot': [
    { frets: [1, 4, 6, 6, 6, 4], firstFret: 5, position: 'A-string Root' },
  ],
  'F_minor_Aroot': [
    { frets: [1, 4, 6, 6, 5, 4], firstFret: 5, position: 'A-string Root' },
  ],

  // F# root on A string (fret 9) - F# is fret 9 on A string
  'F#_major_Aroot': [
    { frets: [1, 4, 6, 6, 6, 4], firstFret: 6, position: 'A-string Root' },
  ],
  'F#_minor_Aroot': [
    { frets: [1, 4, 6, 6, 5, 4], firstFret: 6, position: 'A-string Root' },
  ],

  // G root on A string (fret 10) - G is fret 10 on A string
  'G_major_Aroot': [
    { frets: [1, 4, 6, 6, 6, 4], firstFret: 7, position: 'A-string Root' },
  ],
  'G_minor_Aroot': [
    { frets: [1, 4, 6, 6, 5, 4], firstFret: 7, position: 'A-string Root' },
  ],

  // A# root on A string (fret 11) - A# is fret 11 on A string
  'A#_major_Aroot': [
    { frets: [1, 4, 6, 6, 6, 4], firstFret: 8, position: 'A-string Root' },
  ],
  'A#_minor_Aroot': [
    { frets: [1, 4, 6, 6, 5, 4], firstFret: 8, position: 'A-string Root' },
  ],

  // B root on A string (fret 12) - B is fret 12 on A string
  'B_major_Aroot': [
    { frets: [1, 4, 6, 6, 6, 4], firstFret: 9, position: 'A-string Root' },
  ],
  'B_minor_Aroot': [
    { frets: [1, 4, 6, 6, 5, 4], firstFret: 9, position: 'A-string Root' },
  ],

  // C# root on A string (fret 13) - C# is fret 13 on A string
  'C#_major_Aroot': [
    { frets: [1, 4, 6, 6, 6, 4], firstFret: 10, position: 'A-string Root' },
  ],
  'C#_minor_Aroot': [
    { frets: [1, 4, 6, 6, 5, 4], firstFret: 10, position: 'A-string Root' },
  ],

  // D# root on A string (fret 14) - D# is fret 14 on A string
  'D#_major_Aroot': [
    { frets: [1, 4, 6, 6, 6, 4], firstFret: 11, position: 'A-string Root' },
  ],
  'D#_minor_Aroot': [
    { frets: [1, 4, 6, 6, 5, 4], firstFret: 11, position: 'A-string Root' },
  ],

  // Additional A-string root voicings for lower frets
  // These are partial chords that emphasize the A string root

  // A root on A string (fret 0) - simplified power chord form
  'A_power_Aroot': [
    { frets: ['x', 0, 2, 2, 'x', 'x'], position: 'A-string Root' },
  ],

  // E root on A string (alternative voicing)
  'E_power_Aroot': [
    { frets: ['x', 1, 3, 3, 'x', 'x'], firstFret: 7, position: 'A-string Root' },
  ],

  // D root on A string (partial chord)
  'D_power_Aroot': [
    { frets: ['x', 'x', 7, 7, 'x', 'x'], firstFret: 10, position: 'A-string Root' },
  ],

  // G root on A string (partial chord alternative)
  'G_power_Aroot': [
    { frets: ['x', 1, 3, 3, 'x', 'x'], firstFret: 10, position: 'A-string Root' },
  ],

  // Minor/Major Seventh Chords (min/maj7) - hybrid chords with minor triad + major 7th
  'C_min/maj7': [
    { frets: ['x', 3, 2, 0, 0, 0], position: 'Open' },
    { frets: [3, 1, 2, 0, 'x', 'x'], firstFret: 8, position: 'Barre 8th' },
  ],
  'F_min/maj7': [
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 5, position: 'Barre 5th' },
  ],
  'G_min/maj7': [
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 3, position: 'Barre 3rd' },
  ],
  'A_min/maj7': [
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 5, position: 'Barre 5th' },
  ],
  'D_min/maj7': [
    { frets: ['x', 'x', 0, 2, 1, 2], position: 'Open' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 10, position: 'Barre 10th' },
  ],
  'E_min/maj7': [
    { frets: [0, 2, 1, 1, 0, 0], position: 'Open' },
  ],
  'Bb_min/maj7': [
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 6, position: 'Barre 6th' },
  ],
  'Eb_min/maj7': [
    { frets: ['x', 'x', 1, 3, 1, 3], position: 'Open' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'Ab_min/maj7': [
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 4, position: 'Barre 4th' },
  ],
  'Db_min/maj7': [
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 4, position: 'Barre 4th' },
  ],
  'F#_min/maj7': [
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 2, position: 'Barre 2nd' },
  ],
  'Gb_min/maj7': [
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 2, position: 'Barre 2nd' },
  ],

  // Complex Extension Voicings - specific jazz chords with concrete fingerings
  // Dominant 7#9 chords (Hendrix favorite, tritone + augmented 9th)
  'C_7#9': [
    { frets: [1, 3, 1, 2, 4, 4], firstFret: 8, position: 'Barre 8th' },
  ],
  'G_7#9': [
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 3, position: 'Barre 3rd' },
  ],
  'F_7#9': [
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 8, position: 'Barre 8th' },
  ],
  'Bb_7#9': [
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 6, position: 'Barre 6th' },
  ],
  'Eb_7#9': [
    { frets: ['x', 'x', 1, 3, 2, 4], position: 'Open' },
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'Ab_7#9': [
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 4, position: 'Barre 4th' },
  ],

  // Dominant 7#11 chords (#11 is the same as b5, creates Lydian dominant sound)
  'C_7#11': [
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 8, position: 'Barre 8th' },
  ],
  'G_7#11': [
    { frets: [1, 3, 1, 2, 3, 1], firstFret: 3, position: 'Barre 3rd' },
  ],
  'F_7#11': [
    { frets: [1, 3, 2, 2, 2, 1], firstFret: 8, position: 'Barre 8th' },
  ],
  'D_7#11': [
    { frets: ['x', 'x', 0, 2, 3, 1], position: 'Open' },
  ],
  'Bb_7#11': [
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 6, position: 'Barre 6th' },
  ],
  'Eb_7#11': [
    { frets: ['x', 'x', 1, 3, 4, 2], position: 'Open' },
  ],

  // Dominant 7b9b13 chords (super alteration with both flat 9th and flat 13th)
  'C_7b9b13': [
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 8, position: 'Barre 8th' },
  ],
  'G_7b9b13': [
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 3, position: 'Barre 3rd' },
  ],
  'F_7b9b13': [
    { frets: [1, 3, 1, 2, 0, 3], firstFret: 8, position: 'Barre 8th' },
  ],
  'Bb_7b9b13': [
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 6, position: 'Barre 6th' },
  ],
  'Eb_7b9b13': [
    { frets: ['x', 'x', 1, 3, 2, 0], position: 'Partial' },
  ],
  'Ab_7b9b13': [
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 4, position: 'Barre 4th' },
  ],

  // Dominant 7#9b13 chords (Modern jazz sound, #9 + flat 13)
  'C_7#9b13': [
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 8, position: 'Barre 8th' },
  ],
  'G_7#9b13': [
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 3, position: 'Barre 3rd' },
  ],
  'F_7#9b13': [
    { frets: [1, 3, 1, 2, 4, 2], firstFret: 8, position: 'Barre 8th' },
  ],
  'Bb_7#9b13': [
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 6, position: 'Barre 6th' },
  ],
  'Eb_7#9b13': [
    { frets: ['x', 'x', 1, 3, 4, 3], position: 'Open' },
  ],
  'Ab_7#9b13': [
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 4, position: 'Barre 4th' },
  ],

  // Additional complex jazz extensions on other common roots
  'A_7#9': [
    { frets: ['x', 0, 2, 0, 2, 3], position: 'Open' },
  ],
  'A_7#11': [
    { frets: ['x', 0, 2, 2, 1, 4], position: 'Open' },
  ],
  'B_7#9': [
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 2, position: 'Barre 2nd' },
  ],
  'B_7#11': [
    { frets: ['x', 2, 0, 2, 1, 2], position: 'Open' },
  ],

  // Quartal Chords - Built in Perfect Fourths (Classic Quartal Harmony)
  // C quartal stack: C-F-Bb-Eb (fundamental quartal voicing)
  'C_quartal': [
    { frets: [1, 1, 3, 3, 3, 1], firstFret: 8, position: 'Quartal Stack' },
    { frets: [1, 1, 3, 3, 3, 1], firstFret: 8, position: 'Compact Quartal' },
  ],
  // F quartal stack: F-Bb-Eb-Ab (simple quartal voicing)
  'F_quartal': [
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 8, position: 'Quartal Stack' },
  ],
  // G quartal stack: G-C-F-Bb (jazzy quartal voicing)
  'G_quartal': [
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 3, position: 'Quartal Stack' },
  ],
  // A quartal stack: A-D-G-C (modern quartal voicing)
  'A_quartal': [
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 5, position: 'Quartal Stack' },
  ],
  // Bb quartal stack: Bb-Eb-Ab-Db (dark quartal voicing)
  'Bb_quartal': [
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 6, position: 'Quartal Stack' },
  ],
  // Eb quartal stack: Eb-Ab-Db-Gb (extended quartal voicing)
  'Eb_quartal': [
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 11, position: 'Quartal Stack' },
  ],
  // D quartal stack: D-G-C-F (bright quartal voicing)
  'D_quartal': [
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 10, position: 'Quartal Stack' },
  ],
  // E quartal stack: E-A-D-G (open quartal voicing)
  'E_quartal': [
    { frets: [0, 0, 2, 2, 0, 0], position: 'Open Quartal' },
    { frets: [0, 2, 2, 1, 0, 0], position: 'Open Quartal Variant' },
  ],
  // B quartal stack: B-E-A-D (upper register quartal)
  'B_quartal': [
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 7, position: 'Quartal Stack' },
  ],
  // Ab quartal stack: Ab-Db-Gb-B (avant-garde quartal)
  'Ab_quartal': [
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 4, position: 'Quartal Stack' },
  ],
  // Db quartal stack: Db-Gb-B-E (aztec quartal)
  'Db_quartal': [
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 9, position: 'Quartal Stack' },
  ],
  // F# quartal stack: F#-B-E-A (sharp quartal)
  'F#_quartal': [
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 2, position: 'Quartal Stack' },
  ],
  'Gb_quartal': [
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 2, position: 'Quartal Stack' },
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
  'min/maj7': [{ frets: [1, 3, 2, 1, 1, 1], firstFret: 1, position: 'Barre' }],
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

const ENHARMONIC_ROOTS: Record<string, string> = {
  'A#': 'Bb',
  'B#': 'C',
  'C#': 'Db',
  'D#': 'Eb',
  'E#': 'F',
  'F#': 'Gb',
  'G#': 'Ab',
  'Cb': 'B',
  'Fb': 'E'
};

import { noteToValue, STANDARD_TUNING_VALUES } from './musicTheory';

/**
 * Normalize root note to a consistent format for chord lookups
 * Chooses the enharmonic spelling that exists in the chord library
 * Preserves F#/Gb and C#/Db distinctions when both forms exist in library
 */
export function normalizeRoot(root: string): string {
  const enharmonic = ENHARMONIC_ROOTS[root.toUpperCase()];
  if (enharmonic) {
    return enharmonic;
  }

  const upper = root.toLowerCase(); // normalize case

  // Create a mapping that prioritizes the form that exists in our library
  // Check if both sharp and flat forms exist, and choose the primary one
  const enharmonicMap: Record<string, string[]> = {
    'c': ['C'],
    'c#': ['C#', 'Db'],
    'db': ['Db', 'C#'],
    'd': ['D'],
    'd#': ['D#', 'Eb'],
    'eb': ['Eb', 'D#'],
    'e': ['E'],
    'f': ['F'],
    'f#': ['F#', 'Gb'],
    'gb': ['Gb', 'F#'],
    'g': ['G'],
    'g#': ['G#', 'Ab'],
    'ab': ['Ab', 'G#'],
    'a': ['A'],
    'a#': ['A#', 'Bb'],
    'bb': ['Bb', 'A#'],
    'b': ['B']
  };

  // Get possible enharmonic spellings
  const possibilities = enharmonicMap[upper] || [upper.charAt(0).toUpperCase() + upper.slice(1)];

  // For each possibility, check if it exists in our chord library
  for (const possibility of possibilities) {
    // Check if this root has any chords in the library
    const hasChords = Object.keys(CHORD_VOICINGS).some(key => key.startsWith(possibility + '_'));
    if (hasChords) {
      return possibility;
    }
  }

  // If none of the enharmonic equivalents exist, default to the first one
  const firstPossibility = possibilities[0];
  if (!firstPossibility) {
    console.warn(`Unknown root note: "${root}" - defaulting to C`);
    return 'C';
  }

  console.warn(`Root note "${root}" normalized to "${firstPossibility}" (no chords found for this or enharmonic equivalents)`);
  return firstPossibility;
}

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
/**
 * Find the closest matching chord when exact chord is not found
 * Prioritizes chords with same root note, then similar chord qualities
 */
export function findClosestChordVoicings(chordName: string): ChordVoicing[] {
  const slashMatch = chordName.match(/^(.*?)(?:\/([A-G][#b]?))?$/i);
  const slashBass = slashMatch?.[2] ? normalizeRoot(slashMatch[2]) : undefined;

  const { root, quality } = extractRootAndQuality(chordName);
  const targetKey: ChordKey = `${root}_${quality}`;

  // If exact match exists, return it
  if (CHORD_VOICINGS[targetKey] && CHORD_VOICINGS[targetKey].length > 0) {
    return CHORD_VOICINGS[targetKey];
  }

  const candidates: Array<{ key: string; voicings: ChordVoicing[]; similarity: number }> = [];

  // Build similarity scoring system
  for (const [key, voicings] of Object.entries(CHORD_VOICINGS)) {
    const [chordRoot, chordQuality] = key.split('_') as [string, string];
    let similarity = 0;

    // Same root note = high similarity (50 points)
    if (chordRoot === root) {
      similarity += 50;

      // Quality similarity scoring
      const qualityMap: Record<string, string[]> = {
        'major': ['major', '6', 'add9', '7'],
        'minor': ['minor', 'min7', '6'],
        'dim': ['dim', 'dim7', 'min7b5'],
        'aug': ['aug', '7#5'],
        '7': ['7', '9', 'maj7'],
        'maj7': ['maj7', '9', 'maj9'],
        'min7': ['min7', 'min9', 'min11']
      };

      const relatedQualities = qualityMap[quality] || [];
      if (chordQuality === quality) {
        similarity += 40; // Exact quality match
      } else if (relatedQualities.includes(chordQuality)) {
        similarity += 20; // Related quality
      } else {
        similarity += 5; // Same root, different quality
      }
    } else {
      // Different root - lower similarity based on chromatic distance
      const targetValue = noteToValue(root);
      const candidateValue = noteToValue(chordRoot);
      const distance = Math.min(
        Math.abs(targetValue - candidateValue),
        12 - Math.abs(targetValue - candidateValue) // Account for octave equivalence
      );
      similarity = Math.max(5, 25 - distance * 2); // 5-25 points based on distance
    }

    if (similarity > 10) { // Only consider reasonably similar chords
      candidates.push({ key, voicings, similarity });
    }
  }

  // Sort by similarity (highest first) and return the best match
  candidates.sort((a, b) => b.similarity - a.similarity);

  if (candidates.length > 0) {
    const bestMatch = candidates[0];
    console.info(`🧠 Smart fallback: "${chordName}" (${targetKey}) → "${bestMatch.key}" (similarity: ${bestMatch.similarity})`);
    return adjustVoicingsForSlashBass(bestMatch.voicings, slashBass);
  }

  // Ultimate fallback - use generic barre shape
  console.warn(`🤔 No good chord match found for "${chordName}", using generic barre shape`);
  return adjustVoicingsForSlashBass(getGenericBarreVoicings(chordName), slashBass);
}

/**
 * Generate theoretical voicings using barre chord shapes when no specific chord found
 */
function getGenericBarreVoicings(chordName: string): ChordVoicing[] {
  const { root, quality } = extractRootAndQuality(chordName);

  // Try generic shapes first
  const genericShapes = GENERIC_BARRE_SHAPES[quality];
  if (genericShapes && genericShapes.length > 0) {
    const fretPosition = getFretOffset(root);
    const adjustedFret = fretPosition === 0 ? 12 : fretPosition;

    console.info(`Using generic barre shape for ${chordName} (${quality}) at fret ${adjustedFret}`);

    return genericShapes.map(shape => ({
      ...shape,
      firstFret: adjustedFret,
      position: `${root} ${quality} (theoretical)`
    }));
  }

  // Last resort - basic major chord shape as template
  console.warn(`⚠️ Using basic major chord template for "${chordName}"`);
  const fretPosition = getFretOffset(root);
  const majorTemplate: ChordVoicing[] = [
    { frets: [1, 3, 3, 2, 1, 1], firstFret: fretPosition, position: `${root} (adapted)` }
  ];

  return majorTemplate;
}

/**
 * Check if a voicing is just muted strings (our old "unknown" fallback)
 */
export function isMutedVoicing(voicing: ChordVoicing): boolean {
  return voicing.frets.every(fret => fret === 'x');
}

/**
 * Validate chord voicing format consistency
 * IMPORTANT: Barre chords (firstFret > 1) MUST use relative format where:
 * - 1 = at the barre position
 * - 2 = one fret above barre
 * - 3 = two frets above barre, etc.
 * 
 * This function detects if a voicing is using absolute fret positions instead.
 */
export function validateVoicingFormat(voicing: ChordVoicing, chordName: string): boolean {
  if (!voicing.frets || voicing.frets.length !== 6) {
    console.error(`❌ Invalid voicing format for "${chordName}": expected 6 frets, received ${voicing.frets?.length ?? 0}`);
    return false;
  }

  if (!voicing.firstFret || voicing.firstFret <= 1) {
    return true;
  }

  const numericFrets = voicing.frets
    .filter((f): f is number => typeof f === 'number' && f > 0);
  
  if (numericFrets.length === 0) {
    return true;
  }

  const minFret = Math.min(...numericFrets);
  const maxFret = Math.max(...numericFrets);

  if (minFret !== 1 && minFret >= voicing.firstFret - 1) {
    console.error(
      `❌ CHORD FORMAT ERROR: "${chordName}" at firstFret ${voicing.firstFret} uses ABSOLUTE format!\n` +
      `   Frets: [${voicing.frets.join(', ')}]\n` +
      `   Expected: Barre chords must use RELATIVE format where 1 = barre position.\n` +
      `   Min fret value: ${minFret} (should be 1 for barre chords)\n` +
      `   This will cause incorrect rendering. Please convert to relative format.`
    );
    return false;
  }

  if (maxFret > 12) {
    console.warn(
      `⚠️ Suspicious fret value in "${chordName}": max fret = ${maxFret}\n` +
      `   This might indicate absolute format instead of relative.`
    );
    return false;
  }

  return true;
}

/**
 * Validate all chord voicings in the library (development only)
 * Run this during development to ensure all chords use correct format
 */
export function validateChordLibrary(): void {
  if (import.meta.env.PROD) return;

  console.log('🔍 Validating chord library format...');
  let errors = 0;

  for (const [key, voicings] of Object.entries(CHORD_VOICINGS)) {
    for (const voicing of voicings) {
      if (!validateVoicingFormat(voicing, key)) {
        errors++;
      }
    }
  }

  if (errors > 0) {
    console.error(`❌ Found ${errors} chord format errors! See console for details.`);
  } else {
    console.log('✅ All chord voicings use correct format!');
  }
}

export function getChordVoicings(chordName: string): ChordVoicing[] {
  const { root, quality } = extractRootAndQuality(chordName);
  const key: ChordKey = `${root}_${quality}`;

  // Try to find specific voicing in library
  const voicings = CHORD_VOICINGS[key];
  if (voicings && voicings.length > 0) {
    const slashMatch = chordName.match(/^(.*?)(?:\/([A-G][#b]?))?$/i);
    const slashBass = slashMatch?.[2] ? normalizeRoot(slashMatch[2]) : undefined;
    return adjustVoicingsForSlashBass(voicings, slashBass);
  }

  // Smart fallback: find closest match instead of muted strings
  return findClosestChordVoicings(chordName);
}

function adjustVoicingsForSlashBass(voicings: ChordVoicing[], slashBass?: string): ChordVoicing[] {
  if (!slashBass) {
    return voicings;
  }

  const bassValue = noteToValue(slashBass);
  return voicings.map((voicing) => {
    const noteValues = voicing.frets.map((fret, index) => {
      if (typeof fret !== 'number') {
        return null;
      }
      const absoluteFret = voicing.firstFret && voicing.firstFret > 1
        ? voicing.firstFret + fret - 1
        : fret;
      return (STANDARD_TUNING_VALUES[index] + absoluteFret) % 12;
    });

    const lowestSoundingIndex = noteValues.findIndex((value, idx) => value !== null && voicing.frets[idx] !== 'x');
    if (lowestSoundingIndex === -1) {
      return voicing;
    }

    if (noteValues[lowestSoundingIndex] === bassValue) {
      return voicing;
    }

    const targetIndex = noteValues.findIndex((value) => value === bassValue);
    if (targetIndex === -1) {
      return voicing;
    }

    const updatedFrets = voicing.frets.map((fret, idx) =>
      idx < targetIndex ? 'x' : fret
    );

    return {
      ...voicing,
      frets: updatedFrets,
      position: `${voicing.position || 'Adjusted'} (/${slashBass})`
    };
  });
}
