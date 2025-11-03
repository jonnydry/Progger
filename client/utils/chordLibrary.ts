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
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 3, position: 'Partial 5th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 10, position: 'High Partial' },
  ],
  'C_minor': [
    { frets: ['x', 3, 1, 0, 1, 3], position: 'Open' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 3, 1, 1, 1], firstFret: 3, position: 'Partial 5th' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 8, position: 'Barre 8th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 8, position: 'Barre 8th Alt' },
  ],
  'C#_minor': [
    { frets: ['x', 'x', 2, 1, 2, 0], position: 'Open Partial' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 4, position: 'Barre 4th Alt' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 9, position: 'Barre 9th Alt' },
  ],
  'C#_7': [
    { frets: ['x', 'x', 3, 4, 2, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 11, position: 'Rootless' },
  ],
  'C#_maj7': [
    { frets: ['x', 'x', 3, 1, 2, 1], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 11, position: 'Rootless 11th' },
  ],
  'C_7': [
    { frets: ['x', 3, 2, 3, 1, 0], position: 'Open' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 3, 3, 1, 3], firstFret: 3, position: 'Partial 5th' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 10, position: 'Rootless' },
  ],
  'C_maj7': [
    { frets: ['x', 3, 2, 0, 0, 0], position: 'Open' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 1, 1, 1, 3], firstFret: 5, position: 'Partial 7th' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 10, position: 'Rootless 10th' },
  ],
  'C_min7': [
    { frets: ['x', 3, 1, 3, 1, 1], position: 'Open' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 3, 1, 1, 2], firstFret: 3, position: 'Partial 5th' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 10, position: 'Rootless 10th' },
  ],
  'C_min7b5': [
    { frets: ['x', 3, 1, 3, 1, 2], position: 'Open' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 2, position: 'Half-dim 2nd' },
    { frets: ['x', 'x', 1, 2, 2, 1], firstFret: 5, position: 'Partial 5th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 8, position: 'Half-dim 8th' },
  ],
  'C_min/maj7': [
    { frets: ['x', 3, 1, 0, 0, 3], position: 'Open' },
    { frets: ['x', 'x', 1, 4, 4, 3], firstFret: 3, position: 'Partial 5th' },
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 10, position: 'Rootless 10th' },
  ],
  'C#_min7': [
    { frets: ['x', 'x', 2, 4, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 2, 1], firstFret: 4, position: 'Barre 4th Alt' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 11, position: 'Rootless 11th' },
  ],
  'C#_min7b5': [
    { frets: ['x', 'x', 2, 3, 2, 3], position: 'Open Partial' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Half-dim 3rd' },
    { frets: ['x', 1, 2, 1, 2, 'x'], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 9, position: 'Half-dim 9th' },
  ],
  'Db_min7b5': [
    { frets: ['x', 'x', 2, 3, 2, 3], position: 'Open Partial' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Half-dim 3rd' },
    { frets: ['x', 1, 2, 1, 2, 'x'], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 9, position: 'Half-dim 9th' },
  ],
  'C#_min/maj7': [
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 6, position: 'Rootless 6th' },
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'Db_min/maj7': [
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 6, position: 'Rootless 6th' },
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'C#_sus2': [
    { frets: ['x', 'x', 1, 1, 2, 2], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 3, 3, 1, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 3, 0, 1, 3], firstFret: 4, position: 'Partial 6th' },
  ],
  'Db_sus2': [
    { frets: ['x', 'x', 1, 1, 2, 2], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 3, 3, 1, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 3, 0, 1, 3], firstFret: 4, position: 'Partial 6th' },
  ],
  'C#_sus4': [
    { frets: ['x', 'x', 3, 3, 4, 1], firstFret: 2, position: 'Partial 4th' },
    { frets: ['x', 'x', 3, 3, 1, 1], firstFret: 4, position: 'Partial 6th' },
    { frets: ['x', 1, 3, 3, 4, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'Db_sus4': [
    { frets: ['x', 'x', 3, 3, 4, 1], firstFret: 2, position: 'Partial 4th' },
    { frets: ['x', 'x', 3, 3, 1, 1], firstFret: 4, position: 'Partial 6th' },
    { frets: ['x', 1, 3, 3, 4, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'C#_dim': [
    { frets: ['x', 'x', 2, 3, 2, 3], position: 'Partial 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Dim7 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 9, position: 'Dim7 9th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 12, position: 'Dim7 12th' },
  ],
  'Db_dim': [
    { frets: ['x', 'x', 2, 3, 2, 3], position: 'Partial 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Dim7 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 9, position: 'Dim7 9th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 12, position: 'Dim7 12th' },
  ],
  'C#_aug': [
    { frets: ['x', 'x', 3, 2, 2, 1], position: 'Partial 3rd' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 4, position: 'Partial 6th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 8, position: 'Partial 10th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 12, position: 'Partial 14th' },
  ],
  'Db_aug': [
    { frets: ['x', 'x', 3, 2, 2, 1], position: 'Partial 3rd' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 4, position: 'Partial 6th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 8, position: 'Partial 10th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 12, position: 'Partial 14th' },
  ],
  'C#_dim7': [
    { frets: ['x', 'x', 2, 3, 2, 3], position: 'Open Partial' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Dim7 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 9, position: 'Dim7 9th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 12, position: 'Dim7 12th' },
  ],
  'Db_dim7': [
    { frets: ['x', 'x', 2, 3, 2, 3], position: 'Open Partial' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Dim7 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 9, position: 'Dim7 9th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 12, position: 'Dim7 12th' },
  ],
  'C#_add9': [
    { frets: ['x', 'x', 3, 2, 1, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 2, 0, 3, 0], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 11, position: 'Partial 11th' },
  ],
  'Db_add9': [
    { frets: ['x', 'x', 3, 2, 1, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 2, 0, 3, 0], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 11, position: 'Partial 11th' },
  ],
  'C#_madd9': [
    { frets: ['x', 'x', 2, 1, 2, 4], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 0, 1, 3], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 3, 1, 1, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 11, position: 'Partial 11th' },
  ],
  'Db_madd9': [
    { frets: ['x', 'x', 2, 1, 2, 4], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 0, 1, 3], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 3, 1, 1, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 11, position: 'Partial 11th' },
  ],
  'C#_6': [
    { frets: ['x', 'x', 3, 3, 2, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 1, 1], firstFret: 11, position: 'Partial 11th' },
  ],
  'Db_6': [
    { frets: ['x', 'x', 3, 3, 2, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 1, 1], firstFret: 11, position: 'Partial 11th' },
  ],
  'C#_min6': [
    { frets: ['x', 'x', 2, 1, 2, 0], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 2], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 11, position: 'Partial 11th' },
  ],
  'Db_min6': [
    { frets: ['x', 'x', 2, 1, 2, 0], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 2], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 11, position: 'Partial 11th' },
  ],
  'C#_6/9': [
    { frets: ['x', 'x', 3, 3, 4, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 11, position: 'Rootless 11th' },
  ],
  'Db_6/9': [
    { frets: ['x', 'x', 3, 3, 4, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 11, position: 'Rootless 11th' },
  ],
  'C_sus2': [
    { frets: ['x', 3, 0, 0, 3, 3], position: 'Open' },
    { frets: ['x', 'x', 3, 0, 1, 3], firstFret: 3, position: 'Partial 5th' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: [1, 3, 3, 3, 1, 3], firstFret: 8, position: 'Barre 8th' },
  ],
  'C_sus4': [
    { frets: ['x', 3, 3, 0, 1, 1], position: 'Open' },
    { frets: ['x', 'x', 3, 3, 1, 1], firstFret: 3, position: 'Partial 5th' },
    { frets: ['x', 1, 3, 3, 4, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 8, position: 'Barre 8th' },
  ],
  'C_dim': [
    { frets: ['x', 3, 1, 2, 1, 'x'], position: 'Partial' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 2, position: 'Dim7 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 8, position: 'Dim7 8th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 11, position: 'Dim7 11th' },
  ],
  'C_aug': [
    { frets: ['x', 3, 2, 1, 1, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 3, position: 'Partial 5th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 7, position: 'Partial 9th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 11, position: 'Partial 13th' },
  ],
  'C_dim7': [
    { frets: ['x', 3, 1, 2, 1, 2], position: 'Open' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 2, position: 'Dim7 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 8, position: 'Dim7 8th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 11, position: 'Dim7 11th' },
  ],
  'C_add9': [
    { frets: ['x', 3, 2, 0, 3, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 0, 3, 0], position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 10, position: 'Partial 10th' },
  ],
  'C_madd9': [
    { frets: ['x', 3, 1, 0, 3, 3], position: 'Open' },
    { frets: ['x', 'x', 2, 0, 1, 3], firstFret: 3, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 1, 1, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 10, position: 'Partial 10th' },
  ],
  'C_6': [
    { frets: ['x', 3, 2, 2, 1, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 3, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 2, 1, 1], firstFret: 10, position: 'Partial 10th' },
  ],
  'C_min6': [
    { frets: ['x', 3, 1, 2, 1, 3], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 1, 2], firstFret: 3, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 10, position: 'Partial 10th' },
  ],
  'C_6/9': [
    { frets: ['x', 3, 2, 2, 3, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 3, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 10, position: 'Rootless 10th' },
  ],

  'D_major': [
    { frets: ['x', 'x', 0, 2, 3, 2], position: 'Open' },
    { frets: ['x', 'x', 0, 7, 7, 7], position: 'Partial 7th' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 1, 3, 4, 3], firstFret: 12, position: 'High Partial' },
  ],
  'D_minor': [
    { frets: ['x', 'x', 0, 2, 3, 1], position: 'Open' },
    { frets: ['x', 'x', 0, 5, 6, 5], position: 'Partial 5th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 10, position: 'Barre 10th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 10, position: 'Barre 10th Alt' },
  ],
  'D#_minor': [
    { frets: ['x', 'x', 1, 3, 4, 2], position: 'Open Partial' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 6, position: 'Barre 6th Alt' },
    { frets: ['x', 'x', 4, 3, 4, 2], firstFret: 8, position: 'Partial 11th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'D#_7': [
    { frets: ['x', 'x', 1, 3, 2, 3], position: 'Open' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Rootless' },
  ],
  'D#_maj7': [
    { frets: ['x', 'x', 1, 3, 3, 3], position: 'Open' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 8, position: 'Partial 10th' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'D_7': [
    { frets: ['x', 'x', 0, 2, 1, 2], position: 'Open' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 0, 5, 5, 5], position: 'Partial 7th' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 12, position: 'Rootless' },
  ],
  'D_maj7': [
    { frets: ['x', 'x', 0, 2, 2, 2], position: 'Open' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 7, position: 'Partial 9th' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 12, position: 'Rootless 12th' },
  ],
  'D_min7': [
    { frets: ['x', 'x', 0, 2, 1, 1], position: 'Open' },
    { frets: ['x', 'x', 0, 5, 6, 5], position: 'Partial 7th' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 12, position: 'Rootless 12th' },
  ],
  'D_min7b5': [
    { frets: ['x', 'x', 0, 1, 1, 1], position: 'Open' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 5, position: 'Half-dim 5th' },
    { frets: ['x', 1, 2, 1, 2, 'x'], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 11, position: 'Half-dim 11th' },
  ],
  'D_min/maj7': [
    { frets: ['x', 'x', 0, 2, 2, 1], position: 'Open' },
    { frets: ['x', 'x', 3, 6, 6, 5], firstFret: 5, position: 'Partial 7th' },
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 12, position: 'Rootless 12th' },
  ],
  'D#_min7': [
    { frets: ['x', 'x', 1, 3, 2, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 1, 3, 1, 2, 1], firstFret: 6, position: 'Barre 6th Alt' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 1, position: 'Rootless 1st' },
  ],
  'D#_min7b5': [
    { frets: ['x', 'x', 1, 2, 2, 2], position: 'Open Partial' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Half-dim 6th' },
    { frets: ['x', 1, 2, 1, 2, 'x'], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 12, position: 'Half-dim 12th' },
  ],
  'Eb_min7b5': [
    { frets: ['x', 'x', 1, 2, 2, 2], position: 'Open Partial' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Half-dim 6th' },
    { frets: ['x', 1, 2, 1, 2, 'x'], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 12, position: 'Half-dim 12th' },
  ],
  'D#_min/maj7': [
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 8, position: 'Rootless 8th' },
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 13, position: 'Barre 13th' },
  ],
  'Eb_min/maj7': [
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 8, position: 'Rootless 8th' },
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 13, position: 'Barre 13th' },
  ],
  'D#_sus2': [
    { frets: ['x', 'x', 1, 3, 4, 1], position: 'Partial 1st' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: [1, 3, 3, 3, 1, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 3, 0, 1, 3], firstFret: 6, position: 'Partial 8th' },
  ],
  'Eb_sus2': [
    { frets: ['x', 'x', 1, 3, 4, 1], position: 'Partial 1st' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: [1, 3, 3, 3, 1, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 3, 0, 1, 3], firstFret: 6, position: 'Partial 8th' },
  ],
  'D#_sus4': [
    { frets: ['x', 'x', 1, 3, 4, 4], position: 'Partial 1st' },
    { frets: ['x', 'x', 3, 3, 1, 1], firstFret: 6, position: 'Partial 8th' },
    { frets: ['x', 1, 3, 3, 4, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'Eb_sus4': [
    { frets: ['x', 'x', 1, 3, 4, 4], position: 'Partial 1st' },
    { frets: ['x', 'x', 3, 3, 1, 1], firstFret: 6, position: 'Partial 8th' },
    { frets: ['x', 1, 3, 3, 4, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'D#_dim': [
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 4, position: 'Dim7 4th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 10, position: 'Dim7 10th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Dim7 1st' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 7, position: 'Dim7 7th' },
  ],
  'Eb_dim': [
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 4, position: 'Dim7 4th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 10, position: 'Dim7 10th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Dim7 1st' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 7, position: 'Dim7 7th' },
  ],
  'D#_aug': [
    { frets: ['x', 'x', 1, 0, 0, 3], position: 'Partial Open' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 6, position: 'Partial 8th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 10, position: 'Partial 12th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 2, position: 'Partial 4th' },
  ],
  'Eb_aug': [
    { frets: ['x', 'x', 1, 0, 0, 3], position: 'Partial Open' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 6, position: 'Partial 8th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 10, position: 'Partial 12th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 2, position: 'Partial 4th' },
  ],
  'D#_dim7': [
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 4, position: 'Dim7 4th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 10, position: 'Dim7 10th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Dim7 1st' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 7, position: 'Dim7 7th' },
  ],
  'Eb_dim7': [
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 4, position: 'Dim7 4th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 10, position: 'Dim7 10th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Dim7 1st' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 7, position: 'Dim7 7th' },
  ],
  'D#_add9': [
    { frets: ['x', 'x', 1, 3, 4, 1], position: 'Partial 1st' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 2, 0, 3, 0], firstFret: 6, position: 'Partial 6th' },
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 1, position: 'Partial 1st' },
  ],
  'Eb_add9': [
    { frets: ['x', 'x', 1, 3, 4, 1], position: 'Partial 1st' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 2, 0, 3, 0], firstFret: 6, position: 'Partial 6th' },
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 1, position: 'Partial 1st' },
  ],
  'D#_madd9': [
    { frets: ['x', 'x', 1, 3, 4, 2], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 0, 1, 3], firstFret: 6, position: 'Partial 6th' },
    { frets: ['x', 1, 3, 1, 1, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 1, position: 'Partial 1st' },
  ],
  'Eb_madd9': [
    { frets: ['x', 'x', 1, 3, 4, 2], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 0, 1, 3], firstFret: 6, position: 'Partial 6th' },
    { frets: ['x', 1, 3, 1, 1, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 1, position: 'Partial 1st' },
  ],
  'D#_6': [
    { frets: ['x', 'x', 1, 3, 1, 3], position: 'Partial 1st' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 6, position: 'Partial 6th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 1, 1], firstFret: 1, position: 'Partial 1st' },
  ],
  'Eb_6': [
    { frets: ['x', 'x', 1, 3, 1, 3], position: 'Partial 1st' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 6, position: 'Partial 6th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 1, 1], firstFret: 1, position: 'Partial 1st' },
  ],
  'D#_min6': [
    { frets: ['x', 'x', 1, 3, 2, 3], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 2], firstFret: 6, position: 'Partial 6th' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 1, position: 'Partial 1st' },
  ],
  'Eb_min6': [
    { frets: ['x', 'x', 1, 3, 2, 3], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 2], firstFret: 6, position: 'Partial 6th' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 1, position: 'Partial 1st' },
  ],
  'D#_6/9': [
    { frets: ['x', 'x', 1, 3, 1, 1], position: 'Partial 1st' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 6, position: 'Partial 6th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Eb_6/9': [
    { frets: ['x', 'x', 1, 3, 1, 1], position: 'Partial 1st' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 6, position: 'Partial 6th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 1, position: 'Rootless 1st' },
  ],
  'D_sus2': [
    { frets: ['x', 'x', 0, 2, 3, 0], position: 'Open' },
    { frets: ['x', 'x', 0, 2, 3, 5], position: 'Open Ext' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: [1, 3, 3, 3, 1, 3], firstFret: 10, position: 'Barre 10th' },
  ],
  'D_sus4': [
    { frets: ['x', 'x', 0, 2, 3, 3], position: 'Open' },
    { frets: ['x', 'x', 3, 3, 1, 1], firstFret: 5, position: 'Partial 7th' },
    { frets: ['x', 1, 3, 3, 4, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 10, position: 'Barre 10th' },
  ],
  'D_dim': [
    { frets: ['x', 'x', 0, 1, 0, 1], position: 'Open' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 5, position: 'Dim7 5th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 11, position: 'Dim7 11th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 2, position: 'Dim7 2nd' },
  ],
  'D_aug': [
    { frets: ['x', 'x', 0, 3, 3, 2], position: 'Open' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 5, position: 'Partial 7th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 9, position: 'Partial 11th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 1, position: 'Partial 3rd' },
  ],
  'D_dim7': [
    { frets: ['x', 'x', 0, 1, 0, 1], position: 'Open' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 5, position: 'Dim7 5th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 11, position: 'Dim7 11th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 2, position: 'Dim7 2nd' },
  ],
  'D_add9': [
    { frets: ['x', 'x', 0, 2, 3, 0], position: 'Open' },
    { frets: ['x', 'x', 4, 2, 3, 5], firstFret: 5, position: 'Partial 7th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 12, position: 'Partial 12th' },
  ],
  'D_madd9': [
    { frets: ['x', 'x', 0, 2, 3, 1], position: 'Open' },
    { frets: ['x', 'x', 2, 0, 1, 3], firstFret: 5, position: 'Partial 5th' },
    { frets: ['x', 1, 3, 1, 1, 3], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 12, position: 'Partial 12th' },
  ],
  'D_6': [
    { frets: ['x', 'x', 0, 2, 0, 2], position: 'Open' },
    { frets: ['x', 'x', 4, 4, 3, 5], firstFret: 5, position: 'Partial 7th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 1, 2, 1, 1], firstFret: 12, position: 'Partial 12th' },
  ],
  'D_min6': [
    { frets: ['x', 'x', 0, 2, 0, 1], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 1, 2], firstFret: 5, position: 'Partial 5th' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 12, position: 'Partial 12th' },
  ],
  'D_6/9': [
    { frets: ['x', 'x', 0, 2, 0, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 5, position: 'Partial 5th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 12, position: 'Rootless 12th' },
  ],

  'E_major': [
    { frets: [0, 2, 2, 1, 0, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 5, 4], position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 1, 3, 4, 3], firstFret: 9, position: 'Partial 9th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 12, position: 'Barre 12th' },
  ],
  'E_minor': [
    { frets: [0, 2, 2, 0, 0, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 0, 0, 0], position: 'Partial 2nd' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 2, 4, 5, 3], firstFret: 7, position: 'Partial 9th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 12, position: 'Barre 12th' },
  ],
  'E_7': [
    { frets: [0, 2, 0, 1, 0, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 3, 4], position: 'Partial 4th' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 2, position: 'Rootless' },
  ],
  'E_maj7': [
    { frets: [0, 2, 1, 1, 0, 0], position: 'Open' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 2, 4, 4, 4], position: 'Partial 4th' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 2, position: 'Rootless 2nd' },
  ],
  'E_min7': [
    { frets: [0, 2, 0, 0, 0, 0], position: 'Open' },
    { frets: [0, 2, 2, 0, 3, 0], position: 'Open Alt' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 2, 4, 3, 3], firstFret: 7, position: 'Partial 9th' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 12, position: 'Barre 12th' },
  ],
  'E_min7b5': [
    { frets: [0, 1, 0, 0, 3, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 3, 3, 3], position: 'Open Partial' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 7, position: 'Half-dim 7th' },
    { frets: ['x', 1, 2, 1, 2, 'x'], firstFret: 7, position: 'Barre 7th' },
  ],
  'E_min/maj7': [
    { frets: [0, 2, 1, 0, 0, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 4, 3], position: 'Open Partial' },
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 2, position: 'Rootless 2nd' },
  ],
  'E_sus2': [
    { frets: [0, 2, 2, 2, 0, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 5, 2], position: 'Partial 2nd' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: [1, 3, 3, 3, 1, 3], firstFret: 12, position: 'Barre 12th' },
  ],
  'E_sus4': [
    { frets: [0, 2, 2, 2, 0, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 5, 5], position: 'Partial 2nd' },
    { frets: ['x', 1, 3, 3, 4, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 12, position: 'Barre 12th' },
  ],
  'E_dim': [
    { frets: ['x', 'x', 2, 3, 2, 3], position: 'Partial 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Dim7 6th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 12, position: 'Dim7 12th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Dim7 3rd' },
  ],
  'E_aug': [
    { frets: [0, 3, 2, 1, 1, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 7, position: 'Partial 9th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 11, position: 'Partial 13th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 3, position: 'Partial 5th' },
  ],
  'E_dim7': [
    { frets: [0, 1, 2, 0, 2, 0], position: 'Open' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Dim7 6th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 12, position: 'Dim7 12th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Dim7 3rd' },
  ],
  'E_add9': [
    { frets: [0, 2, 2, 1, 0, 2], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 5, 2], position: 'Partial 2nd' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 2, position: 'Partial 2nd' },
  ],
  'E_madd9': [
    { frets: [0, 2, 2, 0, 0, 2], position: 'Open' },
    { frets: ['x', 'x', 2, 0, 1, 3], firstFret: 7, position: 'Partial 7th' },
    { frets: ['x', 1, 3, 1, 1, 3], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 2, position: 'Partial 2nd' },
  ],
  'E_6': [
    { frets: [0, 2, 2, 1, 2, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 4, 4], position: 'Partial 2nd' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 'x', 1, 2, 1, 1], firstFret: 2, position: 'Partial 2nd' },
  ],
  'E_min6': [
    { frets: [0, 2, 2, 0, 2, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 1, 2], firstFret: 7, position: 'Partial 7th' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 2, position: 'Partial 2nd' },
  ],
  'E_6/9': [
    { frets: [0, 2, 2, 1, 2, 2], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 7, position: 'Partial 7th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 2, position: 'Rootless 2nd' },
  ],

  'F_major': [
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 3, 2, 1, 1], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 5, position: 'Partial 5th' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 8, position: 'Barre 8th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 13, position: 'Barre 13th' },
  ],
  'F_minor': [
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 3, 1, 1, 1], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 1, position: 'Barre 1st Alt' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 8, position: 'Barre 8th Alt' },
  ],
  'F#_minor': [
    { frets: ['x', 'x', 4, 2, 2, 2], position: 'Partial 4th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 2, position: 'Barre 2nd Alt' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 9, position: 'Barre 9th Alt' },
  ],
  'Gb_minor': [
    { frets: ['x', 'x', 4, 2, 2, 2], position: 'Partial 4th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 2, position: 'Barre 2nd Alt' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 9, position: 'Barre 9th Alt' },
  ],
  'F_7': [
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 3, 2, 1, 2], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 8, position: 'Barre 8th' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 13, position: 'Barre 13th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Rootless' },
  ],
  'F_maj7': [
    { frets: ['x', 'x', 3, 2, 1, 0], position: 'Open' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 10, position: 'Partial 12th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'F_min7': [
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 3, 1, 1, 2], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 1, 2, 1], firstFret: 1, position: 'Barre 1st Alt' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'F_min7b5': [
    { frets: ['x', 'x', 3, 4, 4, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Half-dim 1st' },
    { frets: ['x', 1, 2, 1, 2, 'x'], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 7, position: 'Half-dim 7th' },
  ],
  'F_min/maj7': [
    { frets: ['x', 'x', 3, 1, 1, 0], position: 'Open Partial' },
    { frets: ['x', 'x', 1, 4, 4, 3], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'F#_min7': [
    { frets: ['x', 'x', 2, 2, 2, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 2, 1], firstFret: 2, position: 'Barre 2nd Alt' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 4, position: 'Rootless 4th' },
  ],
  'F#_min7b5': [
    { frets: ['x', 'x', 1, 2, 2, 2], firstFret: 5, position: 'Partial 5th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 2, position: 'Half-dim 2nd' },
    { frets: ['x', 1, 2, 1, 2, 'x'], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 8, position: 'Half-dim 8th' },
  ],
  'Gb_min7b5': [
    { frets: ['x', 'x', 1, 2, 2, 2], firstFret: 5, position: 'Partial 5th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 2, position: 'Half-dim 2nd' },
    { frets: ['x', 1, 2, 1, 2, 'x'], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 8, position: 'Half-dim 8th' },
  ],
  'F#_min/maj7': [
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 4, position: 'Rootless 4th' },
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'Gb_min/maj7': [
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 4, position: 'Rootless 4th' },
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'F#_sus2': [
    { frets: ['x', 'x', 4, 1, 2, 4], position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 3, 3, 1, 3], firstFret: 2, position: 'Barre 2nd Alt' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'Gb_sus2': [
    { frets: ['x', 'x', 4, 1, 2, 4], position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 3, 3, 1, 3], firstFret: 2, position: 'Barre 2nd Alt' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'F#_sus4': [
    { frets: ['x', 'x', 4, 4, 2, 2], position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 4, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 2, position: 'Barre 2nd Alt' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'Gb_sus4': [
    { frets: ['x', 'x', 4, 4, 2, 2], position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 4, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 2, position: 'Barre 2nd Alt' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 9, position: 'Barre 9th' },
  ],
  'F#_dim': [
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 7, position: 'Dim7 7th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Dim7 1st' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 4, position: 'Dim7 4th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 10, position: 'Dim7 10th' },
  ],
  'Gb_dim': [
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 7, position: 'Dim7 7th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Dim7 1st' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 4, position: 'Dim7 4th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 10, position: 'Dim7 10th' },
  ],
  'F#_aug': [
    { frets: ['x', 'x', 4, 3, 3, 2], position: 'Partial 4th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 2, position: 'Partial 4th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 6, position: 'Partial 8th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 10, position: 'Partial 12th' },
  ],
  'Gb_aug': [
    { frets: ['x', 'x', 4, 3, 3, 2], position: 'Partial 4th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 2, position: 'Partial 4th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 6, position: 'Partial 8th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 10, position: 'Partial 12th' },
  ],
  'F#_dim7': [
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 7, position: 'Dim7 7th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Dim7 1st' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 4, position: 'Dim7 4th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 10, position: 'Dim7 10th' },
  ],
  'Gb_dim7': [
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 7, position: 'Dim7 7th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Dim7 1st' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 4, position: 'Dim7 4th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 10, position: 'Dim7 10th' },
  ],
  'F#_add9': [
    { frets: ['x', 'x', 4, 3, 2, 4], position: 'Open Partial' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 2, 0, 3, 0], firstFret: 9, position: 'Partial 9th' },
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 4, position: 'Partial 4th' },
  ],
  'Gb_add9': [
    { frets: ['x', 'x', 4, 3, 2, 4], position: 'Open Partial' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 2, 0, 3, 0], firstFret: 9, position: 'Partial 9th' },
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 4, position: 'Partial 4th' },
  ],
  'F#_madd9': [
    { frets: ['x', 'x', 4, 2, 2, 4], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 0, 1, 3], firstFret: 2, position: 'Partial 2nd' },
    { frets: ['x', 1, 3, 1, 1, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 4, position: 'Partial 4th' },
  ],
  'Gb_madd9': [
    { frets: ['x', 'x', 4, 2, 2, 4], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 0, 1, 3], firstFret: 2, position: 'Partial 2nd' },
    { frets: ['x', 1, 3, 1, 1, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 4, position: 'Partial 4th' },
  ],
  'F#_6': [
    { frets: ['x', 'x', 4, 3, 4, 2], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 2, position: 'Partial 2nd' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 1], firstFret: 4, position: 'Partial 4th' },
  ],
  'Gb_6': [
    { frets: ['x', 'x', 4, 3, 4, 2], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 2, position: 'Partial 2nd' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 1], firstFret: 4, position: 'Partial 4th' },
  ],
  'F#_min6': [
    { frets: ['x', 'x', 4, 2, 4, 2], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 2], firstFret: 2, position: 'Partial 2nd' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 4, position: 'Partial 4th' },
  ],
  'Gb_min6': [
    { frets: ['x', 'x', 4, 2, 4, 2], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 2], firstFret: 2, position: 'Partial 2nd' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 4, position: 'Partial 4th' },
  ],
  'F#_6/9': [
    { frets: ['x', 'x', 4, 3, 4, 4], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 2, position: 'Partial 2nd' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 4, position: 'Rootless 4th' },
  ],
  'Gb_6/9': [
    { frets: ['x', 'x', 4, 3, 4, 4], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 2, position: 'Partial 2nd' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 4, position: 'Rootless 4th' },
  ],
  'F_sus2': [
    { frets: ['x', 'x', 3, 0, 1, 3], position: 'Open Partial' },
    { frets: [1, 3, 3, 3, 1, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 1, position: 'Barre 1st Alt' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 8, position: 'Barre 8th' },
  ],
  'F_sus4': [
    { frets: ['x', 'x', 3, 3, 1, 1], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 1, 3, 3, 4, 1], firstFret: 1, position: 'Barre 1st Alt' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 8, position: 'Barre 8th' },
  ],
  'F_dim': [
    { frets: ['x', 'x', 3, 1, 0, 1], position: 'Open Partial' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Dim7 6th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 12, position: 'Dim7 12th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Dim7 3rd' },
  ],
  'F_aug': [
    { frets: ['x', 'x', 3, 2, 2, 1], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 5, position: 'Partial 7th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 9, position: 'Partial 11th' },
  ],
  'F_dim7': [
    { frets: ['x', 'x', 3, 1, 0, 1], position: 'Open Partial' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Dim7 6th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 12, position: 'Dim7 12th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Dim7 3rd' },
  ],
  'F_add9': [
    { frets: ['x', 'x', 3, 2, 1, 3], position: 'Open Partial' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 2, 0, 3, 0], firstFret: 8, position: 'Partial 8th' },
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 3, position: 'Partial 3rd' },
  ],
  'F_madd9': [
    { frets: ['x', 'x', 3, 1, 1, 3], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 0, 1, 3], firstFret: 1, position: 'Partial 1st' },
    { frets: ['x', 1, 3, 1, 1, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 3, position: 'Partial 3rd' },
  ],
  'F_6': [
    { frets: ['x', 'x', 3, 2, 3, 1], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 1, position: 'Partial 1st' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 1, 2, 1, 1], firstFret: 3, position: 'Partial 3rd' },
  ],
  'F_min6': [
    { frets: ['x', 'x', 3, 1, 3, 1], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 2], firstFret: 1, position: 'Partial 1st' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 3, position: 'Partial 3rd' },
  ],
  'F_6/9': [
    { frets: ['x', 'x', 3, 2, 3, 3], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 1, position: 'Partial 1st' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 3, position: 'Rootless 3rd' },
  ],

  'G_major': [
    { frets: [3, 2, 0, 0, 0, 3], position: 'Open' },
    { frets: ['x', 'x', 5, 4, 3, 3], position: 'Partial 5th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 7, position: 'Partial 7th' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 10, position: 'Barre 10th' },
  ],
  'G_minor': [
    { frets: ['x', 'x', 5, 3, 3, 3], position: 'Partial 5th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 3, position: 'Barre 3rd Alt' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 10, position: 'Barre 10th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 10, position: 'Barre 10th Alt' },
  ],
  'G#_minor': [
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 6, 4, 4, 4], position: 'Partial 6th' },
    { frets: ['x', 'x', 3, 1, 1, 1], firstFret: 4, position: 'Partial 6th Alt' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 11, position: 'Barre 11th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 11, position: 'Barre 11th Alt' },
  ],
  'G#_7': [
    { frets: ['x', 'x', 1, 1, 1, 2], position: 'Open' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 6, 6, 6, 7], position: 'Partial 6th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Rootless' },
  ],
  'G#_maj7': [
    { frets: ['x', 'x', 1, 1, 1, 3], position: 'Open' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 6, 5, 4, 3], position: 'Partial 8th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 6, position: 'Rootless 6th' },
  ],
  'G_7': [
    { frets: [3, 2, 0, 0, 0, 1], position: 'Open' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 5, 7, 6, 7], position: 'Partial 7th' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 5, position: 'Rootless' },
  ],
  'G_maj7': [
    { frets: [3, 2, 0, 0, 0, 2], position: 'Open' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 5, 4, 3, 2], position: 'Partial 7th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 5, position: 'Rootless 5th' },
  ],
  'G_min7': [
    { frets: ['x', 'x', 3, 3, 3, 3], position: 'Open Partial' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 1, 2, 1], firstFret: 3, position: 'Barre 3rd Alt' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 5, position: 'Rootless 5th' },
  ],
  'G_min7b5': [
    { frets: ['x', 'x', 3, 4, 4, 4], position: 'Open Partial' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Half-dim 3rd' },
    { frets: ['x', 1, 2, 1, 2, 'x'], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 9, position: 'Half-dim 9th' },
  ],
  'G_min/maj7': [
    { frets: ['x', 'x', 3, 3, 3, 2], position: 'Open Partial' },
    { frets: ['x', 'x', 1, 4, 4, 3], firstFret: 7, position: 'Partial 7th' },
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 5, position: 'Rootless 5th' },
  ],
  'G#_min7': [
    { frets: ['x', 'x', 4, 4, 4, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 2, 1], firstFret: 4, position: 'Barre 4th Alt' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 6, position: 'Rootless 6th' },
  ],
  'G#_min7b5': [
    { frets: ['x', 'x', 4, 5, 5, 5], position: 'Open Partial' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 4, position: 'Half-dim 4th' },
    { frets: ['x', 1, 2, 1, 2, 'x'], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 10, position: 'Half-dim 10th' },
  ],
  'Ab_min7b5': [
    { frets: ['x', 'x', 4, 5, 5, 5], position: 'Open Partial' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 4, position: 'Half-dim 4th' },
    { frets: ['x', 1, 2, 1, 2, 'x'], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 10, position: 'Half-dim 10th' },
  ],
  'G#_min/maj7': [
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 6, position: 'Rootless 6th' },
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'Ab_min/maj7': [
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 6, position: 'Rootless 6th' },
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'G_sus2': [
    { frets: [3, 0, 0, 0, 3, 3], position: 'Open' },
    { frets: ['x', 'x', 5, 0, 3, 5], position: 'Partial Open' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: [1, 3, 3, 3, 1, 3], firstFret: 10, position: 'Barre 10th' },
  ],
  'G_sus4': [
    { frets: [3, 3, 0, 0, 1, 3], position: 'Open' },
    { frets: ['x', 'x', 5, 5, 3, 3], position: 'Partial 5th' },
    { frets: ['x', 1, 3, 3, 4, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 10, position: 'Barre 10th' },
  ],
  'G_dim': [
    { frets: ['x', 'x', 5, 6, 5, 6], position: 'Partial 5th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 8, position: 'Dim7 8th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 2, position: 'Dim7 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 5, position: 'Dim7 5th' },
  ],
  'G_aug': [
    { frets: ['x', 'x', 5, 4, 4, 3], position: 'Partial 5th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 3, position: 'Partial 5th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 7, position: 'Partial 9th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 11, position: 'Partial 13th' },
  ],
  'G_dim7': [
    { frets: ['x', 'x', 5, 6, 5, 6], position: 'Partial 5th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 8, position: 'Dim7 8th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 2, position: 'Dim7 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 5, position: 'Dim7 5th' },
  ],
  'G_add9': [
    { frets: [3, 0, 0, 0, 0, 3], position: 'Open' },
    { frets: ['x', 'x', 5, 4, 3, 5], position: 'Partial 5th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 5, position: 'Partial 5th' },
  ],
  'G_madd9': [
    { frets: [3, 0, 0, 0, 3, 3], position: 'Open' },
    { frets: ['x', 'x', 2, 0, 1, 3], firstFret: 3, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 1, 1, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 5, position: 'Partial 5th' },
  ],
  'G_6': [
    { frets: [3, 2, 0, 0, 0, 0], position: 'Open' },
    { frets: ['x', 'x', 5, 4, 5, 3], position: 'Partial 5th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 1], firstFret: 5, position: 'Partial 5th' },
  ],
  'G_min6': [
    { frets: [3, 1, 0, 0, 3, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 1, 2], firstFret: 3, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 5, position: 'Partial 5th' },
  ],
  'G_6/9': [
    { frets: [3, 2, 0, 2, 0, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 3, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 5, position: 'Rootless 5th' },
  ],
  'G#_sus2': [
    { frets: ['x', 'x', 6, 6, 4, 4], position: 'Partial 6th' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 3, 3, 1, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 3, 0, 1, 3], firstFret: 8, position: 'Partial 10th' },
  ],
  'Ab_sus2': [
    { frets: ['x', 'x', 6, 6, 4, 4], position: 'Partial 6th' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 3, 3, 1, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 3, 0, 1, 3], firstFret: 8, position: 'Partial 10th' },
  ],
  'G#_sus4': [
    { frets: ['x', 'x', 6, 6, 4, 1], position: 'Partial 6th' },
    { frets: ['x', 'x', 3, 3, 1, 1], firstFret: 8, position: 'Partial 10th' },
    { frets: ['x', 1, 3, 3, 4, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'Ab_sus4': [
    { frets: ['x', 'x', 6, 6, 4, 1], position: 'Partial 6th' },
    { frets: ['x', 'x', 3, 3, 1, 1], firstFret: 8, position: 'Partial 10th' },
    { frets: ['x', 1, 3, 3, 4, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'G#_dim': [
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 9, position: 'Dim7 9th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Dim7 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Dim7 6th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 12, position: 'Dim7 12th' },
  ],
  'Ab_dim': [
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 9, position: 'Dim7 9th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Dim7 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Dim7 6th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 12, position: 'Dim7 12th' },
  ],
  'G#_aug': [
    { frets: ['x', 'x', 6, 5, 5, 4], position: 'Partial 6th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 4, position: 'Partial 6th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 8, position: 'Partial 10th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 12, position: 'Partial 14th' },
  ],
  'Ab_aug': [
    { frets: ['x', 'x', 6, 5, 5, 4], position: 'Partial 6th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 4, position: 'Partial 6th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 8, position: 'Partial 10th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 12, position: 'Partial 14th' },
  ],
  'G#_dim7': [
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 9, position: 'Dim7 9th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Dim7 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Dim7 6th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 12, position: 'Dim7 12th' },
  ],
  'Ab_dim7': [
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 9, position: 'Dim7 9th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Dim7 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Dim7 6th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 12, position: 'Dim7 12th' },
  ],
  'G#_add9': [
    { frets: ['x', 'x', 6, 5, 4, 6], position: 'Open Partial' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 2, 0, 3, 0], firstFret: 11, position: 'Partial 11th' },
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 6, position: 'Partial 6th' },
  ],
  'Ab_add9': [
    { frets: ['x', 'x', 6, 5, 4, 6], position: 'Open Partial' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 2, 0, 3, 0], firstFret: 11, position: 'Partial 11th' },
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 6, position: 'Partial 6th' },
  ],
  'G#_madd9': [
    { frets: ['x', 'x', 6, 4, 4, 6], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 0, 1, 3], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 3, 1, 1, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 6, position: 'Partial 6th' },
  ],
  'Ab_madd9': [
    { frets: ['x', 'x', 6, 4, 4, 6], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 0, 1, 3], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 3, 1, 1, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 6, position: 'Partial 6th' },
  ],
  'G#_6': [
    { frets: ['x', 'x', 6, 5, 6, 4], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 1, 1], firstFret: 6, position: 'Partial 6th' },
  ],
  'Ab_6': [
    { frets: ['x', 'x', 6, 5, 6, 4], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 1, 1], firstFret: 6, position: 'Partial 6th' },
  ],
  'G#_min6': [
    { frets: ['x', 'x', 6, 4, 6, 4], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 2], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 6, position: 'Partial 6th' },
  ],
  'Ab_min6': [
    { frets: ['x', 'x', 6, 4, 6, 4], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 2], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 6, position: 'Partial 6th' },
  ],
  'G#_6/9': [
    { frets: ['x', 'x', 6, 5, 6, 6], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 6, position: 'Rootless 6th' },
  ],
  'Ab_6/9': [
    { frets: ['x', 'x', 6, 5, 6, 6], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 6, position: 'Rootless 6th' },
  ],

  'A_major': [
    { frets: ['x', 0, 2, 2, 2, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 2, 5], position: 'Partial 2nd' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 9, position: 'Partial 9th' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 12, position: 'Barre 12th' },
  ],
  'A_minor': [
    { frets: ['x', 0, 2, 2, 1, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 1, 0], position: 'Partial 2nd' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 5, position: 'Barre 5th Alt' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 12, position: 'Barre 12th' },
  ],
  'A#_minor': [
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 6, position: 'Barre 6th Alt' },
    { frets: ['x', 'x', 3, 3, 2, 1], firstFret: 6, position: 'Partial 8th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 13, position: 'Barre 13th' },
  ],
  'A#_7': [
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 3, 3, 3, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 13, position: 'Barre 13th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 8, position: 'Rootless' },
  ],
  'A#_maj7': [
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 3, 2, 3, 5], position: 'Partial 3rd' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 8, position: 'Partial 10th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'A_7': [
    { frets: ['x', 0, 2, 0, 2, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 2, 3], position: 'Partial 2nd' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 7, position: 'Rootless' },
  ],
  'A_maj7': [
    { frets: ['x', 0, 2, 1, 2, 0], position: 'Open' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 'x', 2, 2, 2, 2], position: 'Partial 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 7, position: 'Rootless 7th' },
  ],
  'A_min7': [
    { frets: ['x', 0, 2, 0, 1, 0], position: 'Open' },
    { frets: ['x', 0, 2, 2, 1, 3], position: 'Open Alt' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 10, position: 'Partial 12th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 7, position: 'Rootless 7th' },
  ],
  'A_min7b5': [
    { frets: ['x', 0, 1, 0, 1, 0], position: 'Open' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 5, position: 'Half-dim 5th' },
    { frets: ['x', 1, 2, 1, 2, 'x'], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 11, position: 'Half-dim 11th' },
  ],
  'A_min/maj7': [
    { frets: ['x', 0, 2, 1, 1, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 2, 1], position: 'Open Partial' },
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 7, position: 'Rootless 7th' },
  ],
  'A#_min7': [
    { frets: ['x', 1, 3, 1, 2, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 3, 2, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 13, position: 'Barre 13th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 8, position: 'Rootless 8th' },
  ],
  'A#_min7b5': [
    { frets: ['x', 'x', 1, 2, 2, 2], firstFret: 5, position: 'Partial 5th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Half-dim 6th' },
    { frets: ['x', 1, 2, 1, 2, 'x'], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 12, position: 'Half-dim 12th' },
  ],
  'Bb_min7b5': [
    { frets: ['x', 'x', 1, 2, 2, 2], firstFret: 5, position: 'Partial 5th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Half-dim 6th' },
    { frets: ['x', 1, 2, 1, 2, 'x'], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 12, position: 'Half-dim 12th' },
  ],
  'A#_min/maj7': [
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 3, position: 'Rootless 3rd' },
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 8, position: 'Barre 8th' },
  ],
  'Bb_min/maj7': [
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 3, position: 'Rootless 3rd' },
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 8, position: 'Barre 8th' },
  ],
  'A_sus2': [
    { frets: ['x', 0, 2, 2, 0, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 5, 2], position: 'Partial 2nd' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: [1, 3, 3, 3, 1, 3], firstFret: 12, position: 'Barre 12th' },
  ],
  'A_sus4': [
    { frets: ['x', 0, 2, 2, 3, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 5, 5], position: 'Partial 2nd' },
    { frets: ['x', 1, 3, 3, 4, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 12, position: 'Barre 12th' },
  ],
  'A_dim': [
    { frets: ['x', 0, 1, 2, 1, 'x'], position: 'Open' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 7, position: 'Dim7 7th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Dim7 1st' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 10, position: 'Dim7 10th' },
  ],
  'A_aug': [
    { frets: ['x', 0, 3, 2, 2, 1], position: 'Open' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 5, position: 'Partial 7th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 9, position: 'Partial 11th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 1, position: 'Partial 3rd' },
  ],
  'A_dim7': [
    { frets: ['x', 0, 1, 2, 1, 'x'], position: 'Open' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 7, position: 'Dim7 7th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Dim7 1st' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 10, position: 'Dim7 10th' },
  ],
  'A_add9': [
    { frets: ['x', 0, 2, 4, 2, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 5, 2], position: 'Partial 2nd' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 7, position: 'Partial 7th' },
  ],
  'A_madd9': [
    { frets: ['x', 0, 2, 4, 1, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 0, 1, 3], firstFret: 5, position: 'Partial 5th' },
    { frets: ['x', 1, 3, 1, 1, 3], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 7, position: 'Partial 7th' },
  ],
  'A_6': [
    { frets: ['x', 0, 2, 2, 2, 2], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 4, 4], position: 'Partial 2nd' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 1, 2, 1, 1], firstFret: 7, position: 'Partial 7th' },
  ],
  'A_min6': [
    { frets: ['x', 0, 2, 2, 1, 2], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 1, 2], firstFret: 5, position: 'Partial 5th' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 7, position: 'Partial 7th' },
  ],
  'A_6/9': [
    { frets: ['x', 0, 2, 4, 2, 2], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 5, position: 'Partial 5th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 7, position: 'Rootless 7th' },
  ],
  'A#_sus2': [
    { frets: ['x', 'x', 3, 5, 6, 3], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: [1, 3, 3, 3, 1, 3], firstFret: 13, position: 'Barre 13th' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 1, position: 'Barre 1st' },
  ],
  'Bb_sus2': [
    { frets: ['x', 'x', 3, 5, 6, 3], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: [1, 3, 3, 3, 1, 3], firstFret: 13, position: 'Barre 13th' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 1, position: 'Barre 1st' },
  ],
  'A#_sus4': [
    { frets: ['x', 'x', 3, 5, 6, 6], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 3, 4, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 13, position: 'Barre 13th' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 1, position: 'Barre 1st' },
  ],
  'Bb_sus4': [
    { frets: ['x', 'x', 3, 5, 6, 6], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 3, 4, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 13, position: 'Barre 13th' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 1, position: 'Barre 1st' },
  ],
  'A#_dim': [
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 8, position: 'Dim7 8th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 2, position: 'Dim7 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 5, position: 'Dim7 5th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 11, position: 'Dim7 11th' },
  ],
  'Bb_dim': [
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 8, position: 'Dim7 8th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 2, position: 'Dim7 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 5, position: 'Dim7 5th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 11, position: 'Dim7 11th' },
  ],
  'A#_aug': [
    { frets: ['x', 'x', 1, 0, 0, 3], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 6, position: 'Partial 8th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 10, position: 'Partial 12th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 2, position: 'Partial 4th' },
  ],
  'Bb_aug': [
    { frets: ['x', 'x', 1, 0, 0, 3], position: 'Open Partial' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 6, position: 'Partial 8th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 10, position: 'Partial 12th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 2, position: 'Partial 4th' },
  ],
  'A#_dim7': [
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 8, position: 'Dim7 8th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 2, position: 'Dim7 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 5, position: 'Dim7 5th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 11, position: 'Dim7 11th' },
  ],
  'Bb_dim7': [
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 8, position: 'Dim7 8th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 2, position: 'Dim7 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 5, position: 'Dim7 5th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 11, position: 'Dim7 11th' },
  ],
  'A#_add9': [
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 1, position: 'Partial 1st' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 2, 0, 3, 0], firstFret: 1, position: 'Partial 1st' },
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 8, position: 'Partial 8th' },
  ],
  'Bb_add9': [
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 1, position: 'Partial 1st' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 2, 0, 3, 0], firstFret: 1, position: 'Partial 1st' },
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 8, position: 'Partial 8th' },
  ],
  'A#_madd9': [
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 1, position: 'Partial 1st' },
    { frets: ['x', 'x', 2, 0, 1, 3], firstFret: 6, position: 'Partial 6th' },
    { frets: ['x', 1, 3, 1, 1, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 8, position: 'Partial 8th' },
  ],
  'Bb_madd9': [
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 1, position: 'Partial 1st' },
    { frets: ['x', 'x', 2, 0, 1, 3], firstFret: 6, position: 'Partial 6th' },
    { frets: ['x', 1, 3, 1, 1, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 8, position: 'Partial 8th' },
  ],
  'A#_6': [
    { frets: ['x', 'x', 3, 3, 3, 5], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 1, position: 'Partial 1st' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 1, 1], firstFret: 8, position: 'Partial 8th' },
  ],
  'Bb_6': [
    { frets: ['x', 'x', 3, 3, 3, 5], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 1, position: 'Partial 1st' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 1, 1], firstFret: 8, position: 'Partial 8th' },
  ],
  'A#_min6': [
    { frets: ['x', 'x', 3, 3, 3, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 2, 2, 1, 2], firstFret: 1, position: 'Partial 1st' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 8, position: 'Partial 8th' },
  ],
  'Bb_min6': [
    { frets: ['x', 'x', 3, 3, 3, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 2, 2, 1, 2], firstFret: 1, position: 'Partial 1st' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 8, position: 'Partial 8th' },
  ],
  'A#_6/9': [
    { frets: ['x', 'x', 3, 3, 3, 3], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 1, position: 'Partial 1st' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Bb_6/9': [
    { frets: ['x', 'x', 3, 3, 3, 3], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 1, position: 'Partial 1st' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 8, position: 'Rootless 8th' },
  ],

  'B_major': [
    { frets: ['x', 'x', 4, 4, 4, 7], position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 11, position: 'Partial 11th' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 14, position: 'Barre 14th' },
  ],
  'B_minor': [
    { frets: ['x', 'x', 4, 4, 3, 2], position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 4, 2, 3, 2], firstFret: 7, position: 'Partial 11th' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 14, position: 'Barre 14th' },
  ],
  'B_7': [
    { frets: ['x', 2, 1, 2, 0, 2], position: 'Open' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 4, 4, 4, 5], position: 'Partial 4th' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 9, position: 'Rootless' },
  ],
  'B_maj7': [
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 4, 3, 4, 4], position: 'Partial 4th' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 9, position: 'Partial 11th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 9, position: 'Rootless 9th' },
  ],
  'B_min7': [
    { frets: ['x', 2, 0, 2, 0, 2], position: 'Open' },
    { frets: ['x', 2, 4, 2, 3, 2], position: 'Open Alt' },
    { frets: ['x', 1, 3, 1, 2, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 9, position: 'Rootless 9th' },
  ],
  'B_min7b5': [
    { frets: ['x', 2, 0, 2, 0, 1], position: 'Open' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 7, position: 'Half-dim 7th' },
    { frets: ['x', 1, 2, 1, 2, 'x'], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 4, 5, 5, 5], firstFret: 7, position: 'Partial 9th' },
  ],
  'B_min/maj7': [
    { frets: ['x', 2, 0, 3, 0, 2], position: 'Open' },
    { frets: ['x', 'x', 4, 4, 4, 3], position: 'Open Partial' },
    { frets: ['x', 1, 3, 2, 2, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 9, position: 'Rootless 9th' },
  ],
  'B_sus2': [
    { frets: ['x', 2, 4, 4, 2, 2], position: 'Open' },
    { frets: ['x', 'x', 4, 6, 7, 4], position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 1, 3, 3, 1, 1], firstFret: 2, position: 'Barre 2nd' },
  ],
  'B_sus4': [
    { frets: ['x', 2, 4, 4, 5, 2], position: 'Open' },
    { frets: ['x', 'x', 4, 6, 7, 7], position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 4, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 2, position: 'Barre 2nd' },
  ],
  'B_dim': [
    { frets: ['x', 2, 0, 1, 0, 1], position: 'Open' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 9, position: 'Dim7 9th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Dim7 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Dim7 6th' },
  ],
  'B_aug': [
    { frets: ['x', 2, 1, 0, 0, 3], position: 'Open' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 7, position: 'Partial 9th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 11, position: 'Partial 13th' },
    { frets: ['x', 'x', 2, 1, 1, 4], firstFret: 3, position: 'Partial 5th' },
  ],
  'B_dim7': [
    { frets: ['x', 2, 0, 1, 0, 1], position: 'Open' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 9, position: 'Dim7 9th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Dim7 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Dim7 6th' },
  ],
  'B_add9': [
    { frets: ['x', 2, 4, 4, 4, 2], position: 'Open' },
    { frets: ['x', 'x', 4, 6, 7, 4], position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 9, position: 'Partial 9th' },
  ],
  'B_madd9': [
    { frets: ['x', 2, 4, 4, 3, 2], position: 'Open' },
    { frets: ['x', 'x', 2, 0, 1, 3], firstFret: 7, position: 'Partial 7th' },
    { frets: ['x', 1, 3, 1, 1, 3], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 3, 1, 1, 3], firstFret: 9, position: 'Partial 9th' },
  ],
  'B_6': [
    { frets: ['x', 2, 4, 4, 4, 4], position: 'Open' },
    { frets: ['x', 'x', 4, 6, 6, 6], position: 'Partial 4th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 1, 2, 1, 1], firstFret: 9, position: 'Partial 9th' },
  ],
  'B_min6': [
    { frets: ['x', 2, 4, 4, 3, 4], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 1, 2], firstFret: 7, position: 'Partial 7th' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 9, position: 'Partial 9th' },
  ],
  'B_6/9': [
    { frets: ['x', 2, 1, 1, 2, 2], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 7, position: 'Partial 7th' },
    { frets: ['x', 1, 3, 3, 3, 3], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 9, position: 'Rootless 9th' },
  ],

  'Db_major': [
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 3, 2, 1, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 3, 4, 3], firstFret: 11, position: 'High Partial' },
  ],
  'C#_major': [
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 3, 2, 1, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 3, 4, 3], firstFret: 11, position: 'High Partial' },
  ],
  'Db_minor': [
    { frets: ['x', 'x', 2, 1, 2, 0], position: 'Open Partial' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 4, position: 'Barre 4th Alt' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 9, position: 'Barre 9th Alt' },
  ],
  'Db_7': [
    { frets: ['x', 'x', 3, 4, 2, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 11, position: 'Rootless' },
  ],
  'Db_maj7': [
    { frets: ['x', 'x', 3, 1, 2, 1], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 11, position: 'Rootless 11th' },
  ],
  'Db_min7': [
    { frets: ['x', 'x', 2, 4, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 2, 1], firstFret: 4, position: 'Barre 4th Alt' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 11, position: 'Rootless 11th' },
  ],

  'Eb_major': [
    { frets: ['x', 'x', 1, 3, 4, 3], position: 'Open Partial' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 8, position: 'Partial 8th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'D#_major': [
    { frets: ['x', 'x', 1, 3, 4, 3], position: 'Open Partial' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 8, position: 'Partial 8th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'Eb_minor': [
    { frets: ['x', 'x', 1, 3, 4, 2], position: 'Open Partial' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 6, position: 'Barre 6th Alt' },
    { frets: ['x', 'x', 4, 3, 4, 2], firstFret: 8, position: 'Partial 11th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'Eb_7': [
    { frets: ['x', 'x', 1, 3, 2, 3], position: 'Open' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Rootless' },
  ],
  'Eb_maj7': [
    { frets: ['x', 'x', 1, 3, 3, 3], position: 'Open' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 8, position: 'Partial 10th' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'Eb_min7': [
    { frets: ['x', 'x', 1, 3, 2, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 1, 3, 1, 2, 1], firstFret: 6, position: 'Barre 6th Alt' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 1, position: 'Rootless 1st' },
  ],

  'F#_major': [
    { frets: ['x', 'x', 4, 3, 2, 2], position: 'Partial 4th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 6, position: 'Partial 6th' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 14, position: 'Barre 14th' },
  ],
  'F#_7': [
    { frets: ['x', 'x', 4, 3, 2, 0], position: 'Partial 4th' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 14, position: 'Barre 14th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 4, position: 'Rootless' },
  ],
  'F#_maj7': [
    { frets: ['x', 'x', 4, 3, 2, 1], position: 'Partial 4th' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 11, position: 'Partial 13th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 4, position: 'Rootless 4th' },
  ],
  'Gb_major': [
    { frets: ['x', 'x', 4, 3, 2, 2], position: 'Partial 4th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 6, position: 'Partial 6th' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 14, position: 'Barre 14th' },
  ],
  'Gb_7': [
    { frets: ['x', 'x', 4, 3, 2, 0], position: 'Partial 4th' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 14, position: 'Barre 14th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 4, position: 'Rootless' },
  ],
  'Gb_maj7': [
    { frets: ['x', 'x', 4, 3, 2, 1], position: 'Partial 4th' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 11, position: 'Partial 13th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 4, position: 'Rootless 4th' },
  ],
  'Gb_min7': [
    { frets: ['x', 'x', 2, 2, 2, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 2, 1], firstFret: 2, position: 'Barre 2nd Alt' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 4, position: 'Rootless 4th' },
  ],

  'Ab_major': [
    { frets: ['x', 'x', 1, 1, 1, 4], position: 'Open Partial' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 3, 2, 1, 1], firstFret: 4, position: 'Partial 6th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 8, position: 'Partial 8th' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'G#_major': [
    { frets: ['x', 'x', 1, 1, 1, 4], position: 'Open Partial' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 3, 2, 1, 1], firstFret: 4, position: 'Partial 6th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 8, position: 'Partial 8th' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 11, position: 'Barre 11th' },
  ],
  'Ab_minor': [
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 6, 4, 4, 4], position: 'Partial 6th' },
    { frets: ['x', 'x', 3, 1, 1, 1], firstFret: 4, position: 'Partial 6th Alt' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 11, position: 'Barre 11th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 11, position: 'Barre 11th Alt' },
  ],
  'Ab_7': [
    { frets: ['x', 'x', 1, 1, 1, 2], position: 'Open' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 6, 6, 6, 7], position: 'Partial 6th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Rootless' },
  ],
  'Ab_maj7': [
    { frets: ['x', 'x', 1, 1, 1, 3], position: 'Open' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 6, 5, 4, 3], position: 'Partial 8th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 6, position: 'Rootless 6th' },
  ],
  'Ab_min7': [
    { frets: ['x', 'x', 1, 1, 1, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 2, 1], firstFret: 4, position: 'Barre 4th Alt' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 6, position: 'Rootless 6th' },
  ],

  'Bb_major': [
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 3, 2, 1, 1], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 10, position: 'Partial 10th' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 13, position: 'Barre 13th' },
  ],
  'A#_major': [
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 3, 2, 1, 1], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 10, position: 'Partial 10th' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 13, position: 'Barre 13th' },
  ],
  'Bb_minor': [
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 6, position: 'Barre 6th Alt' },
    { frets: ['x', 'x', 3, 3, 2, 1], firstFret: 6, position: 'Partial 8th' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 13, position: 'Barre 13th' },
  ],
  'Bb_7': [
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 3, 3, 3, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 13, position: 'Barre 13th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 8, position: 'Rootless' },
  ],
  'Bb_maj7': [
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 'x', 3, 2, 3, 5], position: 'Partial 3rd' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 8, position: 'Partial 10th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Bb_min7': [
    { frets: ['x', 1, 3, 1, 2, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 3, 2, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 13, position: 'Barre 13th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 8, position: 'Rootless 8th' },
  ],

  // DOMINANT 9TH CHORDS - All 12 keys with comprehensive voicings
  'C_9': [
    { frets: ['x', 3, 2, 3, 3, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 1, 3, 3], firstFret: 2, position: 'Partial 3rd' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 10, position: 'Rootless 10th' },
  ],
  'C#_9': [
    { frets: ['x', 'x', 2, 1, 3, 3], firstFret: 4, position: 'Partial 4th' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 11, position: 'Rootless 11th' },
  ],
  'Db_9': [
    { frets: ['x', 'x', 2, 1, 3, 3], firstFret: 4, position: 'Partial 4th' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 11, position: 'Rootless 11th' },
  ],
  'D_9': [
    { frets: ['x', 'x', 0, 2, 1, 0], position: 'Open' },
    { frets: ['x', 'x', 4, 2, 1, 0], firstFret: 4, position: 'Partial 5th' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 5, position: 'Barre 5th' },
  ],
  'D#_9': [
    { frets: ['x', 'x', 1, 3, 2, 1], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Eb_9': [
    { frets: ['x', 'x', 1, 3, 2, 1], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Rootless 1st' },
  ],
  'E_9': [
    { frets: [0, 2, 0, 1, 0, 2], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 3, 2], position: 'Partial 2nd' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 7, position: 'Barre 7th' },
  ],
  'F_9': [
    { frets: ['x', 'x', 3, 2, 4, 3], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'F#_9': [
    { frets: ['x', 'x', 4, 3, 2, 0], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 4, position: 'Rootless 4th' },
  ],
  'Gb_9': [
    { frets: ['x', 'x', 4, 3, 2, 0], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 4, position: 'Rootless 4th' },
  ],
  'G_9': [
    { frets: [3, 0, 0, 0, 0, 1], position: 'Open' },
    { frets: ['x', 'x', 5, 4, 3, 5], position: 'Partial 5th' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 10, position: 'Barre 10th' },
  ],
  'G#_9': [
    { frets: ['x', 'x', 1, 1, 1, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Rootless 6th' },
  ],
  'Ab_9': [
    { frets: ['x', 'x', 1, 1, 1, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Rootless 6th' },
  ],
  'A_9': [
    { frets: ['x', 0, 2, 0, 0, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 2, 3], firstFret: 10, position: 'Partial 12th' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 12, position: 'Barre 12th' },
  ],
  'A#_9': [
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 2, 4, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Bb_9': [
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 2, 4, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 8, position: 'Rootless 8th' },
  ],
  'B_9': [
    { frets: ['x', 2, 1, 2, 2, 2], position: 'Open' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 9, position: 'Rootless 9th' },
  ],

  // MAJOR 9TH CHORDS - All 12 keys with comprehensive voicings
  'C_maj9': [
    { frets: ['x', 3, 2, 0, 0, 3], position: 'Open' },
    { frets: ['x', 'x', 1, 3, 2, 2], firstFret: 3, position: 'Partial 3rd' },
    { frets: [1, 3, 2, 2, 1, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 1, 1, 3], firstFret: 10, position: 'Rootless 10th' },
  ],
  'C#_maj9': [
    { frets: ['x', 'x', 3, 1, 4, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 2, 2, 1, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 2, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 1, 3], firstFret: 11, position: 'Rootless 11th' },
  ],
  'Db_maj9': [
    { frets: ['x', 'x', 3, 1, 4, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 2, 2, 1, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 2, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 1, 3], firstFret: 11, position: 'Rootless 11th' },
  ],
  'D_maj9': [
    { frets: ['x', 'x', 0, 2, 2, 0], position: 'Open' },
    { frets: ['x', 'x', 4, 2, 2, 0], firstFret: 4, position: 'Partial 5th' },
    { frets: [1, 3, 2, 2, 1, 3], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 1, 3, 2, 3, 3], firstFret: 5, position: 'Barre 5th' },
  ],
  'D#_maj9': [
    { frets: ['x', 'x', 1, 3, 3, 1], position: 'Open Partial' },
    { frets: [1, 3, 2, 2, 1, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 2, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 1, 3], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Eb_maj9': [
    { frets: ['x', 'x', 1, 3, 3, 1], position: 'Open Partial' },
    { frets: [1, 3, 2, 2, 1, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 2, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 1, 3], firstFret: 1, position: 'Rootless 1st' },
  ],
  'E_maj9': [
    { frets: [0, 2, 1, 1, 0, 2], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 4, 2], position: 'Partial 2nd' },
    { frets: [1, 3, 2, 2, 1, 3], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 1, 3, 2, 3, 3], firstFret: 7, position: 'Barre 7th' },
  ],
  'F_maj9': [
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 2, 2, 1, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 1, 3, 2, 3, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 1, 1, 3], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'F#_maj9': [
    { frets: ['x', 'x', 4, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 2, 2, 1, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 2, 3, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 1, 3], firstFret: 4, position: 'Rootless 4th' },
  ],
  'Gb_maj9': [
    { frets: ['x', 'x', 4, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 2, 2, 1, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 2, 3, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 1, 3], firstFret: 4, position: 'Rootless 4th' },
  ],
  'G_maj9': [
    { frets: [3, 2, 0, 0, 0, 2], position: 'Open' },
    { frets: ['x', 'x', 5, 4, 3, 2], position: 'Partial 5th' },
    { frets: [1, 3, 2, 2, 1, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 2, 3, 3], firstFret: 10, position: 'Barre 10th' },
  ],
  'G#_maj9': [
    { frets: ['x', 'x', 1, 1, 1, 3], position: 'Open' },
    { frets: [1, 3, 2, 2, 1, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 2, 3, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 1, 3], firstFret: 6, position: 'Rootless 6th' },
  ],
  'Ab_maj9': [
    { frets: ['x', 'x', 1, 1, 1, 3], position: 'Open' },
    { frets: [1, 3, 2, 2, 1, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 2, 3, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 1, 3], firstFret: 6, position: 'Rootless 6th' },
  ],
  'A_maj9': [
    { frets: ['x', 0, 2, 1, 0, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 2, 4], firstFret: 10, position: 'Partial 12th' },
    { frets: [1, 3, 2, 2, 1, 3], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 2, 3, 3], firstFret: 12, position: 'Barre 12th' },
  ],
  'A#_maj9': [
    { frets: ['x', 1, 3, 2, 3, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 2, 2, 1, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 2, 3, 5], position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 1, 1, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Bb_maj9': [
    { frets: ['x', 1, 3, 2, 3, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 2, 2, 1, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 2, 3, 5], position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 1, 1, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'B_maj9': [
    { frets: ['x', 2, 1, 3, 2, 2], position: 'Open' },
    { frets: [1, 3, 2, 2, 1, 3], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 1, 3, 2, 3, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 1, 1, 3], firstFret: 9, position: 'Rootless 9th' },
  ],

  // MINOR 9TH CHORDS - All 12 keys with comprehensive voicings
  'C_min9': [
    { frets: ['x', 3, 1, 3, 3, 3], position: 'Open' },
    { frets: ['x', 'x', 2, 1, 3, 3], firstFret: 2, position: 'Partial 3rd' },
    { frets: [1, 3, 1, 1, 1, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 1, 1, 2], firstFret: 10, position: 'Rootless 10th' },
  ],
  'C#_min9': [
    { frets: ['x', 'x', 2, 4, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 1, 1, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 1, 2, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 1, 2], firstFret: 11, position: 'Rootless 11th' },
  ],
  'Db_min9': [
    { frets: ['x', 'x', 2, 4, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 1, 1, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 1, 2, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 1, 2], firstFret: 11, position: 'Rootless 11th' },
  ],
  'D_min9': [
    { frets: ['x', 'x', 0, 2, 1, 0], position: 'Open' },
    { frets: ['x', 'x', 3, 2, 1, 0], firstFret: 4, position: 'Partial 5th' },
    { frets: [1, 3, 1, 1, 1, 3], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 1, 3, 1, 2, 3], firstFret: 5, position: 'Barre 5th' },
  ],
  'D#_min9': [
    { frets: ['x', 'x', 1, 3, 2, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 1, 1, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 1, 2, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 1, 2], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Eb_min9': [
    { frets: ['x', 'x', 1, 3, 2, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 1, 1, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 1, 2, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 1, 2], firstFret: 1, position: 'Rootless 1st' },
  ],
  'E_min9': [
    { frets: [0, 2, 0, 0, 0, 2], position: 'Open' },
    { frets: ['x', 'x', 2, 0, 3, 2], position: 'Partial 2nd' },
    { frets: [1, 3, 1, 1, 1, 3], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 1, 3, 1, 2, 3], firstFret: 7, position: 'Barre 7th' },
  ],
  'F_min9': [
    { frets: ['x', 'x', 3, 1, 4, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 1, 1, 1, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 1, 3, 1, 2, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 1, 1, 2], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'F#_min9': [
    { frets: ['x', 'x', 2, 2, 2, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 1, 1, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 2, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 1, 2], firstFret: 4, position: 'Rootless 4th' },
  ],
  'Gb_min9': [
    { frets: ['x', 'x', 2, 2, 2, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 1, 1, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 2, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 1, 2], firstFret: 4, position: 'Rootless 4th' },
  ],
  'G_min9': [
    { frets: ['x', 'x', 3, 3, 3, 3], position: 'Open Partial' },
    { frets: ['x', 'x', 5, 3, 3, 5], position: 'Partial 5th' },
    { frets: [1, 3, 1, 1, 1, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 1, 2, 3], firstFret: 10, position: 'Barre 10th' },
  ],
  'G#_min9': [
    { frets: ['x', 'x', 4, 4, 4, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 1, 1, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 2, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 1, 2], firstFret: 6, position: 'Rootless 6th' },
  ],
  'Ab_min9': [
    { frets: ['x', 'x', 4, 4, 4, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 1, 1, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 2, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 1, 2], firstFret: 6, position: 'Rootless 6th' },
  ],
  'A_min9': [
    { frets: ['x', 0, 2, 0, 0, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 10, position: 'Partial 12th' },
    { frets: [1, 3, 1, 1, 1, 3], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 1, 2, 3], firstFret: 12, position: 'Barre 12th' },
  ],
  'A#_min9': [
    { frets: ['x', 1, 3, 1, 2, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 1, 1, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 3, 2, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 1, 1, 2], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Bb_min9': [
    { frets: ['x', 1, 3, 1, 2, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 1, 1, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 3, 2, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 1, 1, 2], firstFret: 8, position: 'Rootless 8th' },
  ],
  'B_min9': [
    { frets: ['x', 2, 0, 2, 2, 2], position: 'Open' },
    { frets: [1, 3, 1, 1, 1, 3], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 1, 3, 1, 2, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 1, 1, 2], firstFret: 9, position: 'Rootless 9th' },
  ],

  // DOMINANT 11TH CHORDS - All 12 keys with comprehensive voicings
  'C_11': [
    { frets: ['x', 3, 3, 3, 3, 3], position: 'Open' },
    { frets: ['x', 'x', 1, 1, 2, 1], firstFret: 5, position: 'Partial 5th' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 1, 2, 1], firstFret: 10, position: 'Rootless 10th' },
  ],
  'C#_11': [
    { frets: ['x', 'x', 4, 4, 2, 4], firstFret: 4, position: 'Partial 4th' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 3, 4, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 2, 1], firstFret: 11, position: 'Rootless 11th' },
  ],
  'Db_11': [
    { frets: ['x', 'x', 4, 4, 2, 4], firstFret: 4, position: 'Partial 4th' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 3, 4, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 2, 1], firstFret: 11, position: 'Rootless 11th' },
  ],
  'D_11': [
    { frets: ['x', 'x', 0, 2, 1, 1], position: 'Open' },
    { frets: ['x', 'x', 4, 2, 3, 3], firstFret: 5, position: 'Partial 5th' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 1, 3, 3, 4, 3], firstFret: 5, position: 'Barre 5th' },
  ],
  'D#_11': [
    { frets: ['x', 'x', 1, 3, 2, 3], position: 'Open' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 3, 4, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 2, 1], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Eb_11': [
    { frets: ['x', 'x', 1, 3, 2, 3], position: 'Open' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 3, 4, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 2, 1], firstFret: 1, position: 'Rootless 1st' },
  ],
  'E_11': [
    { frets: [0, 2, 0, 2, 0, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 3, 3], position: 'Partial 2nd' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 1, 3, 3, 4, 3], firstFret: 7, position: 'Barre 7th' },
  ],
  'F_11': [
    { frets: ['x', 'x', 3, 3, 1, 1], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 1, 3, 3, 4, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 1, 2, 1], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'F#_11': [
    { frets: ['x', 'x', 4, 4, 2, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 3, 4, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 2, 1], firstFret: 4, position: 'Rootless 4th' },
  ],
  'Gb_11': [
    { frets: ['x', 'x', 4, 4, 2, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 3, 4, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 2, 1], firstFret: 4, position: 'Rootless 4th' },
  ],
  'G_11': [
    { frets: [3, 3, 0, 0, 1, 1], position: 'Open' },
    { frets: ['x', 'x', 5, 5, 3, 3], position: 'Partial 5th' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 3, 4, 3], firstFret: 10, position: 'Barre 10th' },
  ],
  'G#_11': [
    { frets: ['x', 'x', 1, 1, 1, 2], position: 'Open' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 3, 4, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 2, 1], firstFret: 6, position: 'Rootless 6th' },
  ],
  'Ab_11': [
    { frets: ['x', 'x', 1, 1, 1, 2], position: 'Open' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 3, 4, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 2, 1], firstFret: 6, position: 'Rootless 6th' },
  ],
  'A_11': [
    { frets: ['x', 0, 0, 0, 2, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 1, 1], firstFret: 10, position: 'Partial 12th' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 3, 4, 3], firstFret: 12, position: 'Barre 12th' },
  ],
  'A#_11': [
    { frets: ['x', 1, 3, 3, 4, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 3, 3, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 1, 2, 1], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Bb_11': [
    { frets: ['x', 1, 3, 3, 4, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 3, 3, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 1, 2, 1], firstFret: 8, position: 'Rootless 8th' },
  ],
  'B_11': [
    { frets: ['x', 2, 2, 2, 0, 0], position: 'Open' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 1, 3, 3, 4, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 1, 2, 1], firstFret: 9, position: 'Rootless 9th' },
  ],

  // MAJOR 11TH CHORDS - All 12 keys with comprehensive voicings
  'C_maj11': [
    { frets: ['x', 3, 2, 0, 1, 0], position: 'Open' },
    { frets: ['x', 'x', 1, 2, 1, 1], firstFret: 5, position: 'Partial 5th' },
    { frets: [1, 3, 2, 3, 1, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 10, position: 'Rootless 10th' },
  ],
  'C#_maj11': [
    { frets: ['x', 'x', 3, 1, 4, 1], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 2, 3, 1, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 2, 4, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 11, position: 'Rootless 11th' },
  ],
  'Db_maj11': [
    { frets: ['x', 'x', 3, 1, 4, 1], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 2, 3, 1, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 2, 4, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 11, position: 'Rootless 11th' },
  ],
  'D_maj11': [
    { frets: ['x', 'x', 0, 2, 2, 1], position: 'Open' },
    { frets: ['x', 'x', 4, 2, 3, 2], firstFret: 5, position: 'Partial 5th' },
    { frets: [1, 3, 2, 3, 1, 3], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 1, 3, 2, 4, 3], firstFret: 5, position: 'Barre 5th' },
  ],
  'D#_maj11': [
    { frets: ['x', 'x', 1, 3, 3, 2], position: 'Open Partial' },
    { frets: [1, 3, 2, 3, 1, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 2, 4, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Eb_maj11': [
    { frets: ['x', 'x', 1, 3, 3, 2], position: 'Open Partial' },
    { frets: [1, 3, 2, 3, 1, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 2, 4, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 1, position: 'Rootless 1st' },
  ],
  'E_maj11': [
    { frets: [0, 2, 2, 1, 0, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 4, 3], position: 'Partial 2nd' },
    { frets: [1, 3, 2, 3, 1, 3], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 1, 3, 2, 4, 3], firstFret: 7, position: 'Barre 7th' },
  ],
  'F_maj11': [
    { frets: ['x', 'x', 3, 2, 1, 1], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 2, 3, 1, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 1, 3, 2, 4, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'F#_maj11': [
    { frets: ['x', 'x', 4, 3, 2, 2], position: 'Open Partial' },
    { frets: [1, 3, 2, 3, 1, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 2, 4, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 4, position: 'Rootless 4th' },
  ],
  'Gb_maj11': [
    { frets: ['x', 'x', 4, 3, 2, 2], position: 'Open Partial' },
    { frets: [1, 3, 2, 3, 1, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 2, 4, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 4, position: 'Rootless 4th' },
  ],
  'G_maj11': [
    { frets: [3, 2, 0, 0, 1, 3], position: 'Open' },
    { frets: ['x', 'x', 5, 4, 3, 3], position: 'Partial 5th' },
    { frets: [1, 3, 2, 3, 1, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 2, 4, 3], firstFret: 10, position: 'Barre 10th' },
  ],
  'G#_maj11': [
    { frets: ['x', 'x', 1, 1, 1, 3], position: 'Open' },
    { frets: [1, 3, 2, 3, 1, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 2, 4, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 6, position: 'Rootless 6th' },
  ],
  'Ab_maj11': [
    { frets: ['x', 'x', 1, 1, 1, 3], position: 'Open' },
    { frets: [1, 3, 2, 3, 1, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 2, 4, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 6, position: 'Rootless 6th' },
  ],
  'A_maj11': [
    { frets: ['x', 0, 2, 1, 2, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 2, 2], position: 'Partial 2nd' },
    { frets: [1, 3, 2, 3, 1, 3], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 2, 4, 3], firstFret: 12, position: 'Barre 12th' },
  ],
  'A#_maj11': [
    { frets: ['x', 1, 3, 2, 4, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 2, 3, 1, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 2, 3, 3], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Bb_maj11': [
    { frets: ['x', 1, 3, 2, 4, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 2, 3, 1, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 2, 3, 3], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 8, position: 'Rootless 8th' },
  ],
  'B_maj11': [
    { frets: ['x', 2, 1, 3, 2, 0], position: 'Open' },
    { frets: [1, 3, 2, 3, 1, 3], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 1, 3, 2, 4, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 9, position: 'Rootless 9th' },
  ],

  // MINOR 11TH CHORDS - All 12 keys with comprehensive voicings
  'C_min11': [
    { frets: ['x', 3, 1, 3, 3, 1], position: 'Open' },
    { frets: ['x', 'x', 3, 1, 4, 3], firstFret: 3, position: 'Partial 5th' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 10, position: 'Rootless 10th' },
  ],
  'C#_min11': [
    { frets: ['x', 'x', 2, 4, 2, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 1, 4, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 11, position: 'Rootless 11th' },
  ],
  'Db_min11': [
    { frets: ['x', 'x', 2, 4, 2, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 1, 4, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 11, position: 'Rootless 11th' },
  ],
  'D_min11': [
    { frets: ['x', 'x', 0, 2, 1, 1], position: 'Open' },
    { frets: ['x', 'x', 3, 2, 3, 3], firstFret: 5, position: 'Partial 5th' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 1, 3, 1, 4, 3], firstFret: 5, position: 'Barre 5th' },
  ],
  'D#_min11': [
    { frets: ['x', 'x', 1, 3, 2, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 1, 4, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Eb_min11': [
    { frets: ['x', 'x', 1, 3, 2, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 1, 4, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 1, position: 'Rootless 1st' },
  ],
  'E_min11': [
    { frets: [0, 2, 0, 0, 0, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 0, 3, 3], position: 'Partial 2nd' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 1, 3, 1, 4, 3], firstFret: 7, position: 'Barre 7th' },
  ],
  'F_min11': [
    { frets: ['x', 'x', 3, 1, 1, 1], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 1, 3, 1, 4, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'F#_min11': [
    { frets: ['x', 'x', 2, 2, 2, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 4, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 4, position: 'Rootless 4th' },
  ],
  'Gb_min11': [
    { frets: ['x', 'x', 2, 2, 2, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 4, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 4, position: 'Rootless 4th' },
  ],
  'G_min11': [
    { frets: ['x', 'x', 3, 3, 3, 3], position: 'Open Partial' },
    { frets: ['x', 'x', 5, 3, 3, 3], position: 'Partial 5th' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 1, 4, 3], firstFret: 10, position: 'Barre 10th' },
  ],
  'G#_min11': [
    { frets: ['x', 'x', 4, 4, 4, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 4, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 6, position: 'Rootless 6th' },
  ],
  'Ab_min11': [
    { frets: ['x', 'x', 4, 4, 4, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 4, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 6, position: 'Rootless 6th' },
  ],
  'A_min11': [
    { frets: ['x', 0, 0, 0, 1, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 1, 1], firstFret: 10, position: 'Partial 12th' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 1, 4, 3], firstFret: 12, position: 'Barre 12th' },
  ],
  'A#_min11': [
    { frets: ['x', 1, 3, 1, 4, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 3, 2, 2], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Bb_min11': [
    { frets: ['x', 1, 3, 1, 4, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 3, 2, 2], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 8, position: 'Rootless 8th' },
  ],
  'B_min11': [
    { frets: ['x', 2, 0, 2, 0, 0], position: 'Open' },
    { frets: [1, 3, 1, 3, 1, 3], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 1, 3, 1, 4, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 1, 1, 1], firstFret: 9, position: 'Rootless 9th' },
  ],

  // DOMINANT 13TH CHORDS - All 12 keys with comprehensive voicings
  'C_13': [
    { frets: ['x', 3, 2, 3, 5, 5], position: 'Open' },
    { frets: ['x', 'x', 1, 2, 2, 4], firstFret: 3, position: 'Partial 3rd' },
    { frets: [1, 'x', 1, 2, 3, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 2, 3, 3], firstFret: 10, position: 'Rootless 10th' },
  ],
  'C#_13': [
    { frets: ['x', 'x', 1, 2, 2, 4], firstFret: 5, position: 'Partial 5th' },
    { frets: [1, 'x', 1, 2, 3, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 2, 4, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 3, 3], firstFret: 11, position: 'Rootless 11th' },
  ],
  'Db_13': [
    { frets: ['x', 'x', 1, 2, 2, 4], firstFret: 5, position: 'Partial 5th' },
    { frets: [1, 'x', 1, 2, 3, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 2, 4, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 3, 3], firstFret: 11, position: 'Rootless 11th' },
  ],
  'D_13': [
    { frets: ['x', 'x', 0, 2, 1, 2], position: 'Open' },
    { frets: ['x', 'x', 4, 3, 2, 3], firstFret: 5, position: 'Partial 5th' },
    { frets: [1, 'x', 1, 2, 3, 3], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 1, 3, 2, 4, 4], firstFret: 5, position: 'Barre 5th' },
  ],
  'D#_13': [
    { frets: ['x', 'x', 1, 3, 2, 3], position: 'Open' },
    { frets: [1, 'x', 1, 2, 3, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 2, 4, 4], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 3, 3], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Eb_13': [
    { frets: ['x', 'x', 1, 3, 2, 3], position: 'Open' },
    { frets: [1, 'x', 1, 2, 3, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 2, 4, 4], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 3, 3], firstFret: 1, position: 'Rootless 1st' },
  ],
  'E_13': [
    { frets: [0, 2, 0, 1, 2, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 3, 4], position: 'Partial 2nd' },
    { frets: [1, 'x', 1, 2, 3, 3], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 1, 3, 2, 4, 4], firstFret: 7, position: 'Barre 7th' },
  ],
  'F_13': [
    { frets: ['x', 'x', 3, 2, 3, 5], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 'x', 1, 2, 3, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 1, 3, 2, 4, 4], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 2, 3, 3], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'F#_13': [
    { frets: ['x', 'x', 4, 3, 4, 6], position: 'Open Partial' },
    { frets: [1, 'x', 1, 2, 3, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 2, 4, 4], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 3, 3], firstFret: 4, position: 'Rootless 4th' },
  ],
  'Gb_13': [
    { frets: ['x', 'x', 4, 3, 4, 6], position: 'Open Partial' },
    { frets: [1, 'x', 1, 2, 3, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 2, 4, 4], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 3, 3], firstFret: 4, position: 'Rootless 4th' },
  ],
  'G_13': [
    { frets: [3, 2, 0, 0, 0, 1], position: 'Open' },
    { frets: ['x', 'x', 5, 5, 5, 7], position: 'Partial 5th' },
    { frets: [1, 'x', 1, 2, 3, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 2, 4, 4], firstFret: 10, position: 'Barre 10th' },
  ],
  'G#_13': [
    { frets: ['x', 'x', 1, 1, 1, 2], position: 'Open' },
    { frets: [1, 'x', 1, 2, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 2, 4, 4], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 3, 3], firstFret: 6, position: 'Rootless 6th' },
  ],
  'Ab_13': [
    { frets: ['x', 'x', 1, 1, 1, 2], position: 'Open' },
    { frets: [1, 'x', 1, 2, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 2, 4, 4], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 3, 3], firstFret: 6, position: 'Rootless 6th' },
  ],
  'A_13': [
    { frets: ['x', 0, 2, 0, 2, 2], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 2, 4], firstFret: 10, position: 'Partial 12th' },
    { frets: [1, 'x', 1, 2, 3, 3], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 2, 4, 4], firstFret: 12, position: 'Barre 12th' },
  ],
  'A#_13': [
    { frets: ['x', 1, 3, 2, 4, 4], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 'x', 1, 2, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 3, 3, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 3, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Bb_13': [
    { frets: ['x', 1, 3, 2, 4, 4], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 'x', 1, 2, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 3, 3, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 3, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'B_13': [
    { frets: ['x', 2, 1, 2, 0, 2], position: 'Open' },
    { frets: [1, 'x', 1, 2, 3, 3], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 1, 3, 2, 4, 4], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 2, 3, 3], firstFret: 9, position: 'Rootless 9th' },
  ],

  // MAJOR 13TH CHORDS - All 12 keys with comprehensive voicings
  'C_maj13': [
    { frets: ['x', 3, 2, 0, 0, 0], position: 'Open' },
    { frets: ['x', 'x', 1, 3, 2, 4], firstFret: 3, position: 'Partial 3rd' },
    { frets: [1, 'x', 2, 2, 3, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 2, 3, 3], firstFret: 10, position: 'Rootless 10th' },
  ],
  'C#_maj13': [
    { frets: ['x', 'x', 3, 1, 4, 6], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 'x', 2, 2, 3, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 2, 4, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 11, position: 'Rootless 11th' },
  ],
  'Db_maj13': [
    { frets: ['x', 'x', 3, 1, 4, 6], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 'x', 2, 2, 3, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 2, 4, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 11, position: 'Rootless 11th' },
  ],
  'D_maj13': [
    { frets: ['x', 'x', 0, 2, 2, 2], position: 'Open' },
    { frets: ['x', 'x', 4, 3, 2, 3], firstFret: 5, position: 'Partial 5th' },
    { frets: [1, 'x', 2, 2, 3, 3], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 1, 3, 2, 3, 4], firstFret: 5, position: 'Barre 5th' },
  ],
  'D#_maj13': [
    { frets: ['x', 'x', 1, 3, 3, 3], position: 'Open' },
    { frets: [1, 'x', 2, 2, 3, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 2, 3, 4], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Eb_maj13': [
    { frets: ['x', 'x', 1, 3, 3, 3], position: 'Open' },
    { frets: [1, 'x', 2, 2, 3, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 2, 3, 4], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 1, position: 'Rootless 1st' },
  ],
  'E_maj13': [
    { frets: [0, 2, 1, 1, 2, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 4, 4, 4], position: 'Partial 2nd' },
    { frets: [1, 'x', 2, 2, 3, 3], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 1, 3, 2, 3, 4], firstFret: 7, position: 'Barre 7th' },
  ],
  'F_maj13': [
    { frets: ['x', 'x', 3, 2, 1, 0], position: 'Open' },
    { frets: [1, 'x', 2, 2, 3, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 1, 3, 2, 3, 4], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'F#_maj13': [
    { frets: ['x', 'x', 4, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 'x', 2, 2, 3, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 2, 3, 4], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 4, position: 'Rootless 4th' },
  ],
  'Gb_maj13': [
    { frets: ['x', 'x', 4, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 'x', 2, 2, 3, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 2, 3, 4], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 4, position: 'Rootless 4th' },
  ],
  'G_maj13': [
    { frets: [3, 2, 0, 0, 0, 2], position: 'Open' },
    { frets: ['x', 'x', 5, 4, 3, 2], position: 'Partial 5th' },
    { frets: [1, 'x', 2, 2, 3, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 2, 3, 4], firstFret: 10, position: 'Barre 10th' },
  ],
  'G#_maj13': [
    { frets: ['x', 'x', 1, 1, 1, 3], position: 'Open' },
    { frets: [1, 'x', 2, 2, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 2, 3, 4], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 6, position: 'Rootless 6th' },
  ],
  'Ab_maj13': [
    { frets: ['x', 'x', 1, 1, 1, 3], position: 'Open' },
    { frets: [1, 'x', 2, 2, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 2, 3, 4], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 6, position: 'Rootless 6th' },
  ],
  'A_maj13': [
    { frets: ['x', 0, 2, 1, 2, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 2, 2], position: 'Partial 2nd' },
    { frets: [1, 'x', 2, 2, 3, 3], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 2, 3, 4], firstFret: 12, position: 'Barre 12th' },
  ],
  'A#_maj13': [
    { frets: ['x', 1, 3, 2, 3, 4], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 'x', 2, 2, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 2, 3, 5], position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Bb_maj13': [
    { frets: ['x', 1, 3, 2, 3, 4], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 'x', 2, 2, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 2, 3, 5], position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'B_maj13': [
    { frets: ['x', 2, 1, 3, 2, 2], position: 'Open' },
    { frets: [1, 'x', 2, 2, 3, 3], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 1, 3, 2, 3, 4], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 9, position: 'Rootless 9th' },
  ],

  // MINOR 13TH CHORDS - All 12 keys with comprehensive voicings
  'C_min13': [
    { frets: ['x', 3, 1, 3, 3, 5], position: 'Open' },
    { frets: ['x', 'x', 2, 1, 3, 5], firstFret: 2, position: 'Partial 3rd' },
    { frets: [1, 'x', 1, 1, 3, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 10, position: 'Rootless 10th' },
  ],
  'C#_min13': [
    { frets: ['x', 'x', 2, 4, 2, 6], position: 'Open Partial' },
    { frets: [1, 'x', 1, 1, 3, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 11, position: 'Rootless 11th' },
  ],
  'Db_min13': [
    { frets: ['x', 'x', 2, 4, 2, 6], position: 'Open Partial' },
    { frets: [1, 'x', 1, 1, 3, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 11, position: 'Rootless 11th' },
  ],
  'D_min13': [
    { frets: ['x', 'x', 0, 2, 1, 2], position: 'Open' },
    { frets: ['x', 'x', 3, 2, 1, 3], firstFret: 5, position: 'Partial 5th' },
    { frets: [1, 'x', 1, 1, 3, 3], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 5, position: 'Barre 5th' },
  ],
  'D#_min13': [
    { frets: ['x', 'x', 1, 3, 2, 3], position: 'Open Partial' },
    { frets: [1, 'x', 1, 1, 3, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Eb_min13': [
    { frets: ['x', 'x', 1, 3, 2, 3], position: 'Open Partial' },
    { frets: [1, 'x', 1, 1, 3, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 1, position: 'Rootless 1st' },
  ],
  'E_min13': [
    { frets: [0, 2, 0, 0, 2, 0], position: 'Open' },
    { frets: ['x', 'x', 2, 0, 3, 4], position: 'Partial 2nd' },
    { frets: [1, 'x', 1, 1, 3, 3], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 7, position: 'Barre 7th' },
  ],
  'F_min13': [
    { frets: ['x', 'x', 3, 1, 1, 5], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 'x', 1, 1, 3, 3], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'F#_min13': [
    { frets: ['x', 'x', 2, 2, 2, 4], position: 'Open Partial' },
    { frets: [1, 'x', 1, 1, 3, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 4, position: 'Rootless 4th' },
  ],
  'Gb_min13': [
    { frets: ['x', 'x', 2, 2, 2, 4], position: 'Open Partial' },
    { frets: [1, 'x', 1, 1, 3, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 4, position: 'Rootless 4th' },
  ],
  'G_min13': [
    { frets: ['x', 'x', 3, 3, 3, 5], position: 'Open Partial' },
    { frets: ['x', 'x', 5, 3, 3, 5], position: 'Partial 5th' },
    { frets: [1, 'x', 1, 1, 3, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 10, position: 'Barre 10th' },
  ],
  'G#_min13': [
    { frets: ['x', 'x', 4, 4, 4, 6], position: 'Open Partial' },
    { frets: [1, 'x', 1, 1, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 6, position: 'Rootless 6th' },
  ],
  'Ab_min13': [
    { frets: ['x', 'x', 4, 4, 4, 6], position: 'Open Partial' },
    { frets: [1, 'x', 1, 1, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 6, position: 'Rootless 6th' },
  ],
  'A_min13': [
    { frets: ['x', 0, 2, 0, 1, 2], position: 'Open' },
    { frets: ['x', 'x', 2, 2, 1, 3], firstFret: 10, position: 'Partial 12th' },
    { frets: [1, 'x', 1, 1, 3, 3], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 12, position: 'Barre 12th' },
  ],
  'A#_min13': [
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 'x', 1, 1, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 3, 2, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Bb_min13': [
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 'x', 1, 1, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 3, 2, 4], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'B_min13': [
    { frets: ['x', 2, 0, 2, 0, 2], position: 'Open' },
    { frets: [1, 'x', 1, 1, 3, 3], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 1, 2, 3], firstFret: 9, position: 'Rootless 9th' },
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

  // ============================================================================
  // QUARTAL CHORDS - Built in Perfect Fourths (Classic Quartal Harmony)
  // ============================================================================
  // Quartal voicings create an ambiguous, open sound used in contemporary jazz
  // and modern music. These are built from stacked 4ths instead of 3rds.
  
  // C quartal stack: C-F-Bb-Eb (fundamental quartal voicing)
  'C_quartal': [
    { frets: ['x', 'x', 3, 5, 3, 5], position: 'Low Quartal' },
    { frets: [1, 1, 3, 3, 3, 1], firstFret: 8, position: 'Mid Quartal Stack' },
    { frets: ['x', 'x', 1, 3, 1, 3], firstFret: 10, position: 'High Quartal' },
  ],
  
  // C# quartal stack: C#-F#-B-E
  'C#_quartal': [
    { frets: ['x', 'x', 1, 3, 1, 3], firstFret: 4, position: 'Low Quartal' },
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 9, position: 'Mid Quartal Stack' },
    { frets: ['x', 'x', 3, 5, 3, 5], firstFret: 9, position: 'High Quartal' },
  ],
  
  // Db quartal stack: Db-Gb-B-E
  'Db_quartal': [
    { frets: ['x', 'x', 1, 3, 1, 3], firstFret: 4, position: 'Low Quartal' },
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 9, position: 'Mid Quartal Stack' },
    { frets: ['x', 'x', 3, 5, 3, 5], firstFret: 9, position: 'High Quartal' },
  ],
  
  // D quartal stack: D-G-C-F (bright quartal voicing)
  'D_quartal': [
    { frets: ['x', 'x', 0, 2, 3, 3], position: 'Open Quartal' },
    { frets: ['x', 'x', 1, 3, 1, 3], firstFret: 5, position: 'Low Quartal' },
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 10, position: 'Mid Quartal Stack' },
  ],
  
  // D# quartal stack: D#-G#-C#-F#
  'D#_quartal': [
    { frets: ['x', 'x', 1, 3, 1, 3], firstFret: 6, position: 'Low Quartal' },
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 11, position: 'Mid Quartal Stack' },
    { frets: ['x', 'x', 3, 5, 3, 5], firstFret: 11, position: 'High Quartal' },
  ],
  
  // Eb quartal stack: Eb-Ab-Db-Gb (extended quartal voicing)
  'Eb_quartal': [
    { frets: ['x', 'x', 1, 3, 1, 3], firstFret: 6, position: 'Low Quartal' },
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 11, position: 'Mid Quartal Stack' },
    { frets: ['x', 'x', 3, 5, 3, 5], firstFret: 11, position: 'High Quartal' },
  ],
  
  // E quartal stack: E-A-D-G (open quartal voicing)
  'E_quartal': [
    { frets: [0, 0, 2, 2, 0, 0], position: 'Open Quartal' },
    { frets: [0, 2, 2, 4, 0, 0], position: 'Open Quartal Alt' },
    { frets: ['x', 'x', 1, 3, 1, 3], firstFret: 7, position: 'Mid Quartal' },
  ],
  
  // F quartal stack: F-Bb-Eb-Ab (simple quartal voicing)
  'F_quartal': [
    { frets: ['x', 'x', 3, 5, 1, 1], position: 'Low Quartal' },
    { frets: ['x', 'x', 1, 3, 1, 3], firstFret: 8, position: 'Mid Quartal' },
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 1, position: 'Barre Quartal' },
  ],
  
  // F# quartal stack: F#-B-E-A (sharp quartal)
  'F#_quartal': [
    { frets: ['x', 'x', 4, 6, 2, 2], position: 'Low Quartal' },
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 2, position: 'Barre Quartal' },
    { frets: ['x', 'x', 1, 3, 1, 3], firstFret: 9, position: 'Mid Quartal' },
  ],
  
  // Gb quartal stack: Gb-B-E-A
  'Gb_quartal': [
    { frets: ['x', 'x', 4, 6, 2, 2], position: 'Low Quartal' },
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 2, position: 'Barre Quartal' },
    { frets: ['x', 'x', 1, 3, 1, 3], firstFret: 9, position: 'Mid Quartal' },
  ],
  
  // G quartal stack: G-C-F-Bb (jazzy quartal voicing)
  'G_quartal': [
    { frets: [3, 'x', 0, 0, 3, 3], position: 'Open Quartal' },
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 3, position: 'Low Quartal Stack' },
    { frets: ['x', 'x', 1, 3, 1, 3], firstFret: 10, position: 'High Quartal' },
  ],
  
  // G# quartal stack: G#-C#-F#-B
  'G#_quartal': [
    { frets: ['x', 'x', 1, 3, 1, 3], firstFret: 1, position: 'Low Quartal' },
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 4, position: 'Mid Quartal Stack' },
    { frets: ['x', 'x', 3, 5, 3, 5], firstFret: 6, position: 'High Quartal' },
  ],
  
  // Ab quartal stack: Ab-Db-Gb-B (avant-garde quartal)
  'Ab_quartal': [
    { frets: ['x', 'x', 1, 3, 1, 3], firstFret: 1, position: 'Low Quartal' },
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 4, position: 'Mid Quartal Stack' },
    { frets: ['x', 'x', 3, 5, 3, 5], firstFret: 6, position: 'High Quartal' },
  ],
  
  // A quartal stack: A-D-G-C (modern quartal voicing)
  'A_quartal': [
    { frets: ['x', 0, 2, 2, 3, 0], position: 'Open Quartal' },
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 5, position: 'Mid Quartal Stack' },
    { frets: ['x', 'x', 1, 3, 1, 3], firstFret: 12, position: 'High Quartal' },
  ],
  
  // A# quartal stack: A#-D#-G#-C#
  'A#_quartal': [
    { frets: ['x', 'x', 1, 3, 1, 3], firstFret: 3, position: 'Low Quartal' },
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 6, position: 'Mid Quartal Stack' },
    { frets: ['x', 'x', 3, 5, 3, 5], firstFret: 8, position: 'High Quartal' },
  ],
  
  // Bb quartal stack: Bb-Eb-Ab-Db (dark quartal voicing)
  'Bb_quartal': [
    { frets: ['x', 'x', 1, 3, 1, 3], firstFret: 3, position: 'Low Quartal' },
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 6, position: 'Mid Quartal Stack' },
    { frets: ['x', 'x', 3, 5, 3, 5], firstFret: 8, position: 'High Quartal' },
  ],
  
  // B quartal stack: B-E-A-D (upper register quartal)
  'B_quartal': [
    { frets: ['x', 2, 4, 4, 0, 0], position: 'Open Quartal' },
    { frets: [1, 1, 3, 3, 1, 1], firstFret: 7, position: 'Mid Quartal Stack' },
    { frets: ['x', 'x', 1, 3, 1, 3], firstFret: 2, position: 'Low Quartal Alt' },
  ],

  // ============================================================================
  // ALTERED DOMINANT CHORDS - Comprehensive voicings for all 12 keys
  // ============================================================================
  
  // DOMINANT 7b9 CHORDS - Flat 9 creates tension (1-3-5-b7-b9)
  'C_7b9': [
    { frets: ['x', 3, 2, 3, 2, 'x'], position: 'Open Partial' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 3, position: 'Barre 3rd' },
    { frets: [1, 3, 1, 2, 2, 'x'], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 10, position: 'Rootless 10th' },
  ],
  'C#_7b9': [
    { frets: ['x', 'x', 2, 3, 1, 2], position: 'Partial 2nd' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 1, 2, 2, 'x'], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 11, position: 'Rootless 11th' },
  ],
  'Db_7b9': [
    { frets: ['x', 'x', 2, 3, 1, 2], position: 'Partial 2nd' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 3, 1, 2, 2, 'x'], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 11, position: 'Rootless 11th' },
  ],
  'D_7b9': [
    { frets: ['x', 'x', 0, 2, 1, 2], position: 'Open' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 5, position: 'Barre 5th' },
    { frets: [1, 3, 1, 2, 2, 'x'], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 12, position: 'Rootless 12th' },
  ],
  'D#_7b9': [
    { frets: ['x', 'x', 1, 3, 2, 3], position: 'Open Partial' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 6, position: 'Barre 6th' },
    { frets: [1, 3, 1, 2, 2, 'x'], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Eb_7b9': [
    { frets: ['x', 'x', 1, 3, 2, 3], position: 'Open Partial' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 6, position: 'Barre 6th' },
    { frets: [1, 3, 1, 2, 2, 'x'], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Rootless 1st' },
  ],
  'E_7b9': [
    { frets: [0, 2, 0, 1, 3, 2], position: 'Open' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 7, position: 'Barre 7th' },
    { frets: [1, 3, 1, 2, 2, 'x'], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 2, position: 'Rootless 2nd' },
  ],
  'F_7b9': [
    { frets: ['x', 'x', 3, 5, 4, 5], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 1, 2, 2, 'x'], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'F#_7b9': [
    { frets: ['x', 'x', 4, 3, 2, 0], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 2, 'x'], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 4, position: 'Rootless 4th' },
  ],
  'Gb_7b9': [
    { frets: ['x', 'x', 4, 3, 2, 0], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 2, 'x'], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 4, position: 'Rootless 4th' },
  ],
  'G_7b9': [
    { frets: [3, 2, 3, 1, 3, 'x'], position: 'Open' },
    { frets: [1, 3, 1, 2, 2, 'x'], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 5, position: 'Rootless 5th' },
  ],
  'G#_7b9': [
    { frets: ['x', 'x', 1, 2, 1, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 2, 'x'], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Rootless 6th' },
  ],
  'Ab_7b9': [
    { frets: ['x', 'x', 1, 2, 1, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 2, 'x'], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 6, position: 'Rootless 6th' },
  ],
  'A_7b9': [
    { frets: ['x', 0, 2, 0, 2, 3], position: 'Open' },
    { frets: [1, 3, 1, 2, 2, 'x'], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 7, position: 'Rootless 7th' },
  ],
  'A#_7b9': [
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 2, 2, 'x'], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 2, 4, 5], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Bb_7b9': [
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 2, 2, 'x'], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 2, 4, 5], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 8, position: 'Rootless 8th' },
  ],
  'B_7b9': [
    { frets: ['x', 2, 1, 2, 0, 2], position: 'Open' },
    { frets: [1, 3, 1, 2, 2, 'x'], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 9, position: 'Rootless 9th' },
  ],

  // DOMINANT 7b5 CHORDS - Flat 5 (1-3-b5-b7)
  'C_7b5': [
    { frets: ['x', 3, 2, 3, 1, 'x'], position: 'Open Partial' },
    { frets: ['x', 1, 2, 1, 3, 'x'], firstFret: 3, position: 'Barre 3rd' },
    { frets: [1, 2, 1, 2, 'x', 'x'], firstFret: 8, position: 'Partial 8th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 7, position: 'Rootless 7th' },
  ],
  'C#_7b5': [
    { frets: ['x', 'x', 2, 3, 1, 'x'], position: 'Partial 2nd' },
    { frets: ['x', 1, 2, 1, 3, 'x'], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 2, 1, 2, 'x', 'x'], firstFret: 9, position: 'Partial 9th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Db_7b5': [
    { frets: ['x', 'x', 2, 3, 1, 'x'], position: 'Partial 2nd' },
    { frets: ['x', 1, 2, 1, 3, 'x'], firstFret: 4, position: 'Barre 4th' },
    { frets: [1, 2, 1, 2, 'x', 'x'], firstFret: 9, position: 'Partial 9th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'D_7b5': [
    { frets: ['x', 'x', 0, 1, 1, 2], position: 'Open' },
    { frets: ['x', 1, 2, 1, 3, 'x'], firstFret: 5, position: 'Barre 5th' },
    { frets: [1, 2, 1, 2, 'x', 'x'], firstFret: 10, position: 'Partial 10th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 9, position: 'Rootless 9th' },
  ],
  'D#_7b5': [
    { frets: ['x', 'x', 1, 2, 2, 3], position: 'Open Partial' },
    { frets: ['x', 1, 2, 1, 3, 'x'], firstFret: 6, position: 'Barre 6th' },
    { frets: [1, 2, 1, 2, 'x', 'x'], firstFret: 11, position: 'Partial 11th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 10, position: 'Rootless 10th' },
  ],
  'Eb_7b5': [
    { frets: ['x', 'x', 1, 2, 2, 3], position: 'Open Partial' },
    { frets: ['x', 1, 2, 1, 3, 'x'], firstFret: 6, position: 'Barre 6th' },
    { frets: [1, 2, 1, 2, 'x', 'x'], firstFret: 11, position: 'Partial 11th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 10, position: 'Rootless 10th' },
  ],
  'E_7b5': [
    { frets: [0, 1, 0, 1, 3, 0], position: 'Open' },
    { frets: ['x', 1, 2, 1, 3, 'x'], firstFret: 7, position: 'Barre 7th' },
    { frets: [1, 2, 1, 2, 'x', 'x'], firstFret: 12, position: 'Partial 12th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 11, position: 'Rootless 11th' },
  ],
  'F_7b5': [
    { frets: ['x', 'x', 3, 4, 4, 5], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 2, 1, 2, 'x', 'x'], firstFret: 1, position: 'Partial 1st' },
    { frets: ['x', 1, 2, 1, 3, 'x'], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 12, position: 'Rootless 12th' },
  ],
  'F#_7b5': [
    { frets: ['x', 'x', 4, 3, 2, 'x'], position: 'Partial 4th' },
    { frets: [1, 2, 1, 2, 'x', 'x'], firstFret: 2, position: 'Partial 2nd' },
    { frets: ['x', 1, 2, 1, 3, 'x'], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Gb_7b5': [
    { frets: ['x', 'x', 4, 3, 2, 'x'], position: 'Partial 4th' },
    { frets: [1, 2, 1, 2, 'x', 'x'], firstFret: 2, position: 'Partial 2nd' },
    { frets: ['x', 1, 2, 1, 3, 'x'], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 1, position: 'Rootless 1st' },
  ],
  'G_7b5': [
    { frets: [3, 'x', 3, 4, 'x', 'x'], position: 'Partial Open' },
    { frets: [1, 2, 1, 2, 'x', 'x'], firstFret: 3, position: 'Partial 3rd' },
    { frets: ['x', 1, 2, 1, 3, 'x'], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 2, position: 'Rootless 2nd' },
  ],
  'G#_7b5': [
    { frets: ['x', 'x', 1, 2, 1, 3], position: 'Open Partial' },
    { frets: [1, 2, 1, 2, 'x', 'x'], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 2, 1, 3, 'x'], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'Ab_7b5': [
    { frets: ['x', 'x', 1, 2, 1, 3], position: 'Open Partial' },
    { frets: [1, 2, 1, 2, 'x', 'x'], firstFret: 4, position: 'Partial 4th' },
    { frets: ['x', 1, 2, 1, 3, 'x'], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'A_7b5': [
    { frets: ['x', 0, 1, 0, 2, 0], position: 'Open' },
    { frets: [1, 2, 1, 2, 'x', 'x'], firstFret: 5, position: 'Partial 5th' },
    { frets: ['x', 1, 2, 1, 3, 'x'], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 4, position: 'Rootless 4th' },
  ],
  'A#_7b5': [
    { frets: ['x', 1, 2, 1, 3, 'x'], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 2, 1, 2, 'x', 'x'], firstFret: 6, position: 'Partial 6th' },
    { frets: ['x', 'x', 3, 4, 4, 5], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 5, position: 'Rootless 5th' },
  ],
  'Bb_7b5': [
    { frets: ['x', 1, 2, 1, 3, 'x'], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 2, 1, 2, 'x', 'x'], firstFret: 6, position: 'Partial 6th' },
    { frets: ['x', 'x', 3, 4, 4, 5], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 5, position: 'Rootless 5th' },
  ],
  'B_7b5': [
    { frets: ['x', 2, 3, 2, 4, 'x'], position: 'Open Partial' },
    { frets: [1, 2, 1, 2, 'x', 'x'], firstFret: 7, position: 'Partial 7th' },
    { frets: ['x', 1, 2, 1, 3, 'x'], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 6, position: 'Rootless 6th' },
  ],

  // DOMINANT 7#5 CHORDS - Sharp 5 (1-3-#5-b7)
  'C_7#5': [
    { frets: ['x', 3, 2, 3, 4, 'x'], position: 'Open Partial' },
    { frets: ['x', 1, 'x', 1, 2, 2], firstFret: 3, position: 'Partial 3rd' },
    { frets: [1, 'x', 1, 2, 2, 4], firstFret: 8, position: 'Alt 8th' },
    { frets: ['x', 'x', 2, 3, 1, 4], firstFret: 7, position: 'Rootless 7th' },
  ],
  'C#_7#5': [
    { frets: ['x', 'x', 2, 3, 3, 'x'], position: 'Partial 2nd' },
    { frets: ['x', 1, 'x', 1, 2, 2], firstFret: 4, position: 'Partial 4th' },
    { frets: [1, 'x', 1, 2, 2, 4], firstFret: 9, position: 'Alt 9th' },
    { frets: ['x', 'x', 2, 3, 1, 4], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Db_7#5': [
    { frets: ['x', 'x', 2, 3, 3, 'x'], position: 'Partial 2nd' },
    { frets: ['x', 1, 'x', 1, 2, 2], firstFret: 4, position: 'Partial 4th' },
    { frets: [1, 'x', 1, 2, 2, 4], firstFret: 9, position: 'Alt 9th' },
    { frets: ['x', 'x', 2, 3, 1, 4], firstFret: 8, position: 'Rootless 8th' },
  ],
  'D_7#5': [
    { frets: ['x', 'x', 0, 1, 1, 2], position: 'Open' },
    { frets: ['x', 1, 'x', 1, 2, 2], firstFret: 5, position: 'Partial 5th' },
    { frets: [1, 'x', 1, 2, 2, 4], firstFret: 10, position: 'Alt 10th' },
    { frets: ['x', 'x', 2, 3, 1, 4], firstFret: 9, position: 'Rootless 9th' },
  ],
  'D#_7#5': [
    { frets: ['x', 'x', 1, 2, 2, 3], position: 'Open Partial' },
    { frets: ['x', 1, 'x', 1, 2, 2], firstFret: 6, position: 'Partial 6th' },
    { frets: [1, 'x', 1, 2, 2, 4], firstFret: 11, position: 'Alt 11th' },
    { frets: ['x', 'x', 2, 3, 1, 4], firstFret: 10, position: 'Rootless 10th' },
  ],
  'Eb_7#5': [
    { frets: ['x', 'x', 1, 2, 2, 3], position: 'Open Partial' },
    { frets: ['x', 1, 'x', 1, 2, 2], firstFret: 6, position: 'Partial 6th' },
    { frets: [1, 'x', 1, 2, 2, 4], firstFret: 11, position: 'Alt 11th' },
    { frets: ['x', 'x', 2, 3, 1, 4], firstFret: 10, position: 'Rootless 10th' },
  ],
  'E_7#5': [
    { frets: [0, 'x', 0, 1, 1, 0], position: 'Open' },
    { frets: ['x', 1, 'x', 1, 2, 2], firstFret: 7, position: 'Partial 7th' },
    { frets: [1, 'x', 1, 2, 2, 4], firstFret: 12, position: 'Alt 12th' },
    { frets: ['x', 'x', 2, 3, 1, 4], firstFret: 11, position: 'Rootless 11th' },
  ],
  'F_7#5': [
    { frets: ['x', 'x', 3, 4, 5, 6], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 'x', 1, 2, 2, 4], firstFret: 1, position: 'Alt 1st' },
    { frets: ['x', 1, 'x', 1, 2, 2], firstFret: 8, position: 'Partial 8th' },
    { frets: ['x', 'x', 2, 3, 1, 4], firstFret: 12, position: 'Rootless 12th' },
  ],
  'F#_7#5': [
    { frets: ['x', 'x', 4, 5, 6, 7], position: 'Partial 4th' },
    { frets: [1, 'x', 1, 2, 2, 4], firstFret: 2, position: 'Alt 2nd' },
    { frets: ['x', 1, 'x', 1, 2, 2], firstFret: 9, position: 'Partial 9th' },
    { frets: ['x', 'x', 2, 3, 1, 4], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Gb_7#5': [
    { frets: ['x', 'x', 4, 5, 6, 7], position: 'Partial 4th' },
    { frets: [1, 'x', 1, 2, 2, 4], firstFret: 2, position: 'Alt 2nd' },
    { frets: ['x', 1, 'x', 1, 2, 2], firstFret: 9, position: 'Partial 9th' },
    { frets: ['x', 'x', 2, 3, 1, 4], firstFret: 1, position: 'Rootless 1st' },
  ],
  'G_7#5': [
    { frets: [3, 'x', 3, 4, 4, 'x'], position: 'Partial Open' },
    { frets: [1, 'x', 1, 2, 2, 4], firstFret: 3, position: 'Alt 3rd' },
    { frets: ['x', 1, 'x', 1, 2, 2], firstFret: 10, position: 'Partial 10th' },
    { frets: ['x', 'x', 2, 3, 1, 4], firstFret: 2, position: 'Rootless 2nd' },
  ],
  'G#_7#5': [
    { frets: ['x', 'x', 1, 2, 2, 'x'], position: 'Open Partial' },
    { frets: [1, 'x', 1, 2, 2, 4], firstFret: 4, position: 'Alt 4th' },
    { frets: ['x', 1, 'x', 1, 2, 2], firstFret: 11, position: 'Partial 11th' },
    { frets: ['x', 'x', 2, 3, 1, 4], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'Ab_7#5': [
    { frets: ['x', 'x', 1, 2, 2, 'x'], position: 'Open Partial' },
    { frets: [1, 'x', 1, 2, 2, 4], firstFret: 4, position: 'Alt 4th' },
    { frets: ['x', 1, 'x', 1, 2, 2], firstFret: 11, position: 'Partial 11th' },
    { frets: ['x', 'x', 2, 3, 1, 4], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'A_7#5': [
    { frets: ['x', 0, 'x', 0, 2, 1], position: 'Open' },
    { frets: [1, 'x', 1, 2, 2, 4], firstFret: 5, position: 'Alt 5th' },
    { frets: ['x', 1, 'x', 1, 2, 2], firstFret: 12, position: 'Partial 12th' },
    { frets: ['x', 'x', 2, 3, 1, 4], firstFret: 4, position: 'Rootless 4th' },
  ],
  'A#_7#5': [
    { frets: ['x', 1, 'x', 1, 3, 2], firstFret: 1, position: 'Partial 1st' },
    { frets: [1, 'x', 1, 2, 2, 4], firstFret: 6, position: 'Alt 6th' },
    { frets: ['x', 'x', 3, 4, 5, 6], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 2, 3, 1, 4], firstFret: 5, position: 'Rootless 5th' },
  ],
  'Bb_7#5': [
    { frets: ['x', 1, 'x', 1, 3, 2], firstFret: 1, position: 'Partial 1st' },
    { frets: [1, 'x', 1, 2, 2, 4], firstFret: 6, position: 'Alt 6th' },
    { frets: ['x', 'x', 3, 4, 5, 6], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 2, 3, 1, 4], firstFret: 5, position: 'Rootless 5th' },
  ],
  'B_7#5': [
    { frets: ['x', 2, 'x', 2, 4, 3], position: 'Open Partial' },
    { frets: [1, 'x', 1, 2, 2, 4], firstFret: 7, position: 'Alt 7th' },
    { frets: ['x', 1, 'x', 1, 2, 2], firstFret: 2, position: 'Partial 2nd' },
    { frets: ['x', 'x', 2, 3, 1, 4], firstFret: 6, position: 'Rootless 6th' },
  ],

  // DOMINANT 7alt CHORDS - Altered dominant (combines alterations, often b9, #9, b5, #5)
  'C_7alt': [
    { frets: ['x', 3, 2, 3, 4, 'x'], position: 'Open Partial' },
    { frets: [1, 3, 'x', 2, 4, 4], firstFret: 8, position: 'Alt 8th' },
    { frets: ['x', 1, 2, 'x', 3, 4], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 7, position: 'Rootless 7th' },
  ],
  'C#_7alt': [
    { frets: ['x', 'x', 2, 3, 2, 3], position: 'Partial 2nd' },
    { frets: [1, 3, 'x', 2, 4, 4], firstFret: 9, position: 'Alt 9th' },
    { frets: ['x', 1, 2, 'x', 3, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Db_7alt': [
    { frets: ['x', 'x', 2, 3, 2, 3], position: 'Partial 2nd' },
    { frets: [1, 3, 'x', 2, 4, 4], firstFret: 9, position: 'Alt 9th' },
    { frets: ['x', 1, 2, 'x', 3, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'D_7alt': [
    { frets: ['x', 'x', 0, 1, 1, 2], position: 'Open' },
    { frets: [1, 3, 'x', 2, 4, 4], firstFret: 10, position: 'Alt 10th' },
    { frets: ['x', 1, 2, 'x', 3, 4], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 9, position: 'Rootless 9th' },
  ],
  'D#_7alt': [
    { frets: ['x', 'x', 1, 2, 1, 2], position: 'Open Partial' },
    { frets: [1, 3, 'x', 2, 4, 4], firstFret: 11, position: 'Alt 11th' },
    { frets: ['x', 1, 2, 'x', 3, 4], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 10, position: 'Rootless 10th' },
  ],
  'Eb_7alt': [
    { frets: ['x', 'x', 1, 2, 1, 2], position: 'Open Partial' },
    { frets: [1, 3, 'x', 2, 4, 4], firstFret: 11, position: 'Alt 11th' },
    { frets: ['x', 1, 2, 'x', 3, 4], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 10, position: 'Rootless 10th' },
  ],
  'E_7alt': [
    { frets: [0, 1, 0, 1, 3, 2], position: 'Open' },
    { frets: [1, 3, 'x', 2, 4, 4], firstFret: 12, position: 'Alt 12th' },
    { frets: ['x', 1, 2, 'x', 3, 4], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 11, position: 'Rootless 11th' },
  ],
  'F_7alt': [
    { frets: ['x', 'x', 3, 4, 4, 5], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 'x', 2, 4, 4], firstFret: 1, position: 'Alt 1st' },
    { frets: ['x', 1, 2, 'x', 3, 4], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 12, position: 'Rootless 12th' },
  ],
  'F#_7alt': [
    { frets: ['x', 'x', 4, 3, 2, 3], position: 'Partial 4th' },
    { frets: [1, 3, 'x', 2, 4, 4], firstFret: 2, position: 'Alt 2nd' },
    { frets: ['x', 1, 2, 'x', 3, 4], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Gb_7alt': [
    { frets: ['x', 'x', 4, 3, 2, 3], position: 'Partial 4th' },
    { frets: [1, 3, 'x', 2, 4, 4], firstFret: 2, position: 'Alt 2nd' },
    { frets: ['x', 1, 2, 'x', 3, 4], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 1, position: 'Rootless 1st' },
  ],
  'G_7alt': [
    { frets: [3, 'x', 3, 4, 'x', 4], position: 'Partial Open' },
    { frets: [1, 3, 'x', 2, 4, 4], firstFret: 3, position: 'Alt 3rd' },
    { frets: ['x', 1, 2, 'x', 3, 4], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 2, position: 'Rootless 2nd' },
  ],
  'G#_7alt': [
    { frets: ['x', 'x', 1, 2, 1, 2], position: 'Open Partial' },
    { frets: [1, 3, 'x', 2, 4, 4], firstFret: 4, position: 'Alt 4th' },
    { frets: ['x', 1, 2, 'x', 3, 4], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'Ab_7alt': [
    { frets: ['x', 'x', 1, 2, 1, 2], position: 'Open Partial' },
    { frets: [1, 3, 'x', 2, 4, 4], firstFret: 4, position: 'Alt 4th' },
    { frets: ['x', 1, 2, 'x', 3, 4], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'A_7alt': [
    { frets: ['x', 0, 1, 0, 2, 1], position: 'Open' },
    { frets: [1, 3, 'x', 2, 4, 4], firstFret: 5, position: 'Alt 5th' },
    { frets: ['x', 1, 2, 'x', 3, 4], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 4, position: 'Rootless 4th' },
  ],
  'A#_7alt': [
    { frets: ['x', 1, 2, 'x', 3, 4], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 'x', 2, 4, 4], firstFret: 6, position: 'Alt 6th' },
    { frets: ['x', 'x', 3, 4, 4, 5], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 5, position: 'Rootless 5th' },
  ],
  'Bb_7alt': [
    { frets: ['x', 1, 2, 'x', 3, 4], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 'x', 2, 4, 4], firstFret: 6, position: 'Alt 6th' },
    { frets: ['x', 'x', 3, 4, 4, 5], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 5, position: 'Rootless 5th' },
  ],
  'B_7alt': [
    { frets: ['x', 2, 3, 2, 4, 3], position: 'Open Partial' },
    { frets: [1, 3, 'x', 2, 4, 4], firstFret: 7, position: 'Alt 7th' },
    { frets: ['x', 1, 2, 'x', 3, 4], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 6, position: 'Rootless 6th' },
  ],

  // DOMINANT 7b13 CHORDS - Flat 13 (1-3-5-b7-b13)
  'C_7b13': [
    { frets: ['x', 3, 2, 3, 1, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 3, 'x'], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 10, position: 'Rootless 10th' },
  ],
  'C#_7b13': [
    { frets: ['x', 'x', 2, 3, 2, 3], position: 'Partial 2nd' },
    { frets: [1, 3, 1, 2, 3, 'x'], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 11, position: 'Rootless 11th' },
  ],
  'Db_7b13': [
    { frets: ['x', 'x', 2, 3, 2, 3], position: 'Partial 2nd' },
    { frets: [1, 3, 1, 2, 3, 'x'], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 11, position: 'Rootless 11th' },
  ],
  'D_7b13': [
    { frets: ['x', 'x', 0, 2, 1, 3], position: 'Open' },
    { frets: [1, 3, 1, 2, 3, 'x'], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 12, position: 'Rootless 12th' },
  ],
  'D#_7b13': [
    { frets: ['x', 'x', 1, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 3, 'x'], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Eb_7b13': [
    { frets: ['x', 'x', 1, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 3, 'x'], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 1, position: 'Rootless 1st' },
  ],
  'E_7b13': [
    { frets: [0, 2, 0, 1, 3, 0], position: 'Open' },
    { frets: [1, 3, 1, 2, 3, 'x'], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 2, position: 'Rootless 2nd' },
  ],
  'F_7b13': [
    { frets: ['x', 'x', 3, 5, 4, 6], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 1, 2, 3, 'x'], firstFret: 1, position: 'Barre 1st' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'F#_7b13': [
    { frets: ['x', 'x', 4, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 3, 'x'], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 4, position: 'Rootless 4th' },
  ],
  'Gb_7b13': [
    { frets: ['x', 'x', 4, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 3, 'x'], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 4, position: 'Rootless 4th' },
  ],
  'G_7b13': [
    { frets: [3, 2, 3, 4, 'x', 'x'], position: 'Partial Open' },
    { frets: [1, 3, 1, 2, 3, 'x'], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 5, position: 'Rootless 5th' },
  ],
  'G#_7b13': [
    { frets: ['x', 'x', 1, 2, 1, 3], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 3, 'x'], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 6, position: 'Rootless 6th' },
  ],
  'Ab_7b13': [
    { frets: ['x', 'x', 1, 2, 1, 3], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 3, 'x'], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 6, position: 'Rootless 6th' },
  ],
  'A_7b13': [
    { frets: ['x', 0, 2, 0, 2, 1], position: 'Open' },
    { frets: [1, 3, 1, 2, 3, 'x'], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 7, position: 'Rootless 7th' },
  ],
  'A#_7b13': [
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 2, 3, 'x'], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 5, 4, 6], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Bb_7b13': [
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 2, 3, 'x'], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 5, 4, 6], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'B_7b13': [
    { frets: ['x', 2, 1, 2, 0, 2], position: 'Open' },
    { frets: [1, 3, 1, 2, 3, 'x'], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 1, 3, 1, 3, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 3], firstFret: 9, position: 'Rootless 9th' },
  ],

  // DOMINANT 7#9 CHORDS - Sharp 9 "Hendrix Chord" (1-3-5-b7-#9)
  'C_7#9': [
    { frets: ['x', 3, 2, 3, 3, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 4], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 4], firstFret: 10, position: 'Rootless 10th' },
  ],
  'C#_7#9': [
    { frets: ['x', 'x', 2, 3, 3, 4], position: 'Partial 2nd' },
    { frets: [1, 3, 1, 2, 4, 4], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 1, 4], firstFret: 11, position: 'Rootless 11th' },
  ],
  'Db_7#9': [
    { frets: ['x', 'x', 2, 3, 3, 4], position: 'Partial 2nd' },
    { frets: [1, 3, 1, 2, 4, 4], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 1, 4], firstFret: 11, position: 'Rootless 11th' },
  ],
  'D_7#9': [
    { frets: ['x', 'x', 0, 2, 1, 4], position: 'Open' },
    { frets: [1, 3, 1, 2, 4, 4], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 1, 2, 1, 4], firstFret: 12, position: 'Rootless 12th' },
  ],
  'D#_7#9': [
    { frets: ['x', 'x', 1, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 4], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 1, 4], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Eb_7#9': [
    { frets: ['x', 'x', 1, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 4], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 1, 4], firstFret: 1, position: 'Rootless 1st' },
  ],
  'E_7#9': [
    { frets: [0, 2, 0, 1, 3, 4], position: 'Open' },
    { frets: [1, 3, 1, 2, 4, 4], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 1, 2, 1, 4], firstFret: 2, position: 'Rootless 2nd' },
  ],
  'F_7#9': [
    { frets: ['x', 'x', 3, 5, 4, 6], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 8, position: 'Barre 8th Alt' },
    { frets: ['x', 'x', 1, 2, 1, 4], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'F#_7#9': [
    { frets: ['x', 'x', 4, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 4], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 1, 4], firstFret: 4, position: 'Rootless 4th' },
  ],
  'Gb_7#9': [
    { frets: ['x', 'x', 4, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 4], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 1, 4], firstFret: 4, position: 'Rootless 4th' },
  ],
  'G_7#9': [
    { frets: [3, 2, 3, 4, 'x', 4], position: 'Partial Open' },
    { frets: [1, 3, 1, 2, 4, 4], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 1, 2, 1, 4], firstFret: 5, position: 'Rootless 5th' },
  ],
  'G#_7#9': [
    { frets: ['x', 'x', 1, 2, 1, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 1, 4], firstFret: 6, position: 'Rootless 6th' },
  ],
  'Ab_7#9': [
    { frets: ['x', 'x', 1, 2, 1, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 1, 4], firstFret: 6, position: 'Rootless 6th' },
  ],
  'A_7#9': [
    { frets: ['x', 0, 2, 0, 2, 3], position: 'Open' },
    { frets: [1, 3, 1, 2, 4, 4], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 'x', 1, 2, 1, 4], firstFret: 7, position: 'Rootless 7th' },
  ],
  'A#_7#9': [
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 2, 4, 4], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 5, 4, 6], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 4], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Bb_7#9': [
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 2, 4, 4], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 5, 4, 6], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 1, 4], firstFret: 8, position: 'Rootless 8th' },
  ],
  'B_7#9': [
    { frets: ['x', 2, 1, 2, 0, 4], position: 'Open' },
    { frets: [1, 3, 1, 2, 4, 4], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 2, 1, 4], firstFret: 9, position: 'Rootless 9th' },
  ],

  // DOMINANT 7#11 CHORDS - Sharp 11 Lydian Dominant (1-3-5-b7-#11)
  'C_7#11': [
    { frets: ['x', 3, 2, 3, 4, 0], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 1, 2, 3, 4], firstFret: 10, position: 'Rootless 10th' },
  ],
  'C#_7#11': [
    { frets: ['x', 'x', 2, 3, 4, 1], position: 'Partial 2nd' },
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 3, 4], firstFret: 11, position: 'Rootless 11th' },
  ],
  'Db_7#11': [
    { frets: ['x', 'x', 2, 3, 4, 1], position: 'Partial 2nd' },
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 3, 4], firstFret: 11, position: 'Rootless 11th' },
  ],
  'D_7#11': [
    { frets: ['x', 'x', 0, 2, 3, 1], position: 'Open' },
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 1, 2, 3, 4], firstFret: 12, position: 'Rootless 12th' },
  ],
  'D#_7#11': [
    { frets: ['x', 'x', 1, 3, 4, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 3, 4], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Eb_7#11': [
    { frets: ['x', 'x', 1, 3, 4, 2], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 3, 4], firstFret: 1, position: 'Rootless 1st' },
  ],
  'E_7#11': [
    { frets: [0, 2, 0, 1, 4, 0], position: 'Open' },
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 1, 2, 3, 4], firstFret: 2, position: 'Rootless 2nd' },
  ],
  'F_7#11': [
    { frets: ['x', 'x', 3, 5, 6, 3], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 2, 2, 2, 1], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 8, position: 'Barre 8th Alt' },
    { frets: ['x', 'x', 1, 2, 3, 4], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'F#_7#11': [
    { frets: ['x', 'x', 4, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 3, 4], firstFret: 4, position: 'Rootless 4th' },
  ],
  'Gb_7#11': [
    { frets: ['x', 'x', 4, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 3, 4], firstFret: 4, position: 'Rootless 4th' },
  ],
  'G_7#11': [
    { frets: [3, 2, 3, 4, 0, 1], position: 'Partial Open' },
    { frets: [1, 3, 1, 2, 3, 1], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 1, 2, 3, 4], firstFret: 5, position: 'Rootless 5th' },
  ],
  'G#_7#11': [
    { frets: ['x', 'x', 1, 2, 3, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 3, 4], firstFret: 6, position: 'Rootless 6th' },
  ],
  'Ab_7#11': [
    { frets: ['x', 'x', 1, 2, 3, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 3, 4], firstFret: 6, position: 'Rootless 6th' },
  ],
  'A_7#11': [
    { frets: ['x', 0, 2, 2, 1, 4], position: 'Open' },
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 'x', 1, 2, 3, 4], firstFret: 7, position: 'Rootless 7th' },
  ],
  'A#_7#11': [
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 5, 6, 3], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 3, 4], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Bb_7#11': [
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 5, 6, 3], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 3, 4], firstFret: 8, position: 'Rootless 8th' },
  ],
  'B_7#11': [
    { frets: ['x', 2, 0, 2, 1, 2], position: 'Open' },
    { frets: [1, 3, 1, 2, 4, 1], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 2, 3, 4], firstFret: 9, position: 'Rootless 9th' },
  ],

  // DOMINANT 7b9b13 CHORDS - Double alteration (1-3-5-b7-b9-b13)
  'C_7b9b13': [
    { frets: ['x', 3, 2, 3, 2, 3], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 10, position: 'Rootless 10th' },
  ],
  'C#_7b9b13': [
    { frets: ['x', 'x', 2, 3, 1, 3], position: 'Partial 2nd' },
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 11, position: 'Rootless 11th' },
  ],
  'Db_7b9b13': [
    { frets: ['x', 'x', 2, 3, 1, 3], position: 'Partial 2nd' },
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 11, position: 'Rootless 11th' },
  ],
  'D_7b9b13': [
    { frets: ['x', 'x', 0, 2, 1, 3], position: 'Open' },
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 12, position: 'Rootless 12th' },
  ],
  'D#_7b9b13': [
    { frets: ['x', 'x', 1, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Eb_7b9b13': [
    { frets: ['x', 'x', 1, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 1, position: 'Rootless 1st' },
  ],
  'E_7b9b13': [
    { frets: [0, 2, 0, 1, 3, 1], position: 'Open' },
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 2, position: 'Rootless 2nd' },
  ],
  'F_7b9b13': [
    { frets: ['x', 'x', 3, 5, 4, 6], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 1, 2, 0, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 8, position: 'Barre 8th Alt' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'F#_7b9b13': [
    { frets: ['x', 'x', 4, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 4, position: 'Rootless 4th' },
  ],
  'Gb_7b9b13': [
    { frets: ['x', 'x', 4, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 4, position: 'Rootless 4th' },
  ],
  'G_7b9b13': [
    { frets: [3, 2, 3, 4, 'x', 4], position: 'Partial Open' },
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 5, position: 'Rootless 5th' },
  ],
  'G#_7b9b13': [
    { frets: ['x', 'x', 1, 2, 2, 3], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 6, position: 'Rootless 6th' },
  ],
  'Ab_7b9b13': [
    { frets: ['x', 'x', 1, 2, 2, 3], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 6, position: 'Rootless 6th' },
  ],
  'A_7b9b13': [
    { frets: ['x', 0, 2, 0, 2, 1], position: 'Open' },
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 7, position: 'Rootless 7th' },
  ],
  'A#_7b9b13': [
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 5, 4, 6], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Bb_7b9b13': [
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 5, 4, 6], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'B_7b9b13': [
    { frets: ['x', 2, 1, 2, 0, 2], position: 'Open' },
    { frets: [1, 3, 1, 2, 2, 3], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 9, position: 'Rootless 9th' },
  ],

  // DOMINANT 7#9b13 CHORDS - Sharp 9 with flat 13 (1-3-5-b7-#9-b13)
  'C_7#9b13': [
    { frets: ['x', 3, 2, 3, 4, 3], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 'x', 1, 2, 4, 3], firstFret: 10, position: 'Rootless 10th' },
  ],
  'C#_7#9b13': [
    { frets: ['x', 'x', 2, 3, 4, 3], position: 'Partial 2nd' },
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 4, 3], firstFret: 11, position: 'Rootless 11th' },
  ],
  'Db_7#9b13': [
    { frets: ['x', 'x', 2, 3, 4, 3], position: 'Partial 2nd' },
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 'x', 1, 2, 4, 3], firstFret: 11, position: 'Rootless 11th' },
  ],
  'D_7#9b13': [
    { frets: ['x', 'x', 0, 2, 4, 3], position: 'Open' },
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 'x', 1, 2, 4, 3], firstFret: 12, position: 'Rootless 12th' },
  ],
  'D#_7#9b13': [
    { frets: ['x', 'x', 1, 3, 4, 3], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 4, 3], firstFret: 1, position: 'Rootless 1st' },
  ],
  'Eb_7#9b13': [
    { frets: ['x', 'x', 1, 3, 4, 3], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 1, 2, 4, 3], firstFret: 1, position: 'Rootless 1st' },
  ],
  'E_7#9b13': [
    { frets: [0, 2, 0, 1, 4, 3], position: 'Open' },
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 'x', 1, 2, 4, 3], firstFret: 2, position: 'Rootless 2nd' },
  ],
  'F_7#9b13': [
    { frets: ['x', 'x', 3, 5, 6, 5], firstFret: 1, position: 'Partial 3rd' },
    { frets: [1, 3, 1, 2, 4, 2], firstFret: 8, position: 'Barre 8th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 8, position: 'Barre 8th Alt' },
    { frets: ['x', 'x', 1, 2, 4, 3], firstFret: 3, position: 'Rootless 3rd' },
  ],
  'F#_7#9b13': [
    { frets: ['x', 'x', 4, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 4, 3], firstFret: 4, position: 'Rootless 4th' },
  ],
  'Gb_7#9b13': [
    { frets: ['x', 'x', 4, 3, 2, 4], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 9, position: 'Barre 9th' },
    { frets: ['x', 'x', 1, 2, 4, 3], firstFret: 4, position: 'Rootless 4th' },
  ],
  'G_7#9b13': [
    { frets: [3, 2, 3, 4, 'x', 4], position: 'Partial Open' },
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 3, position: 'Barre 3rd' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 10, position: 'Barre 10th' },
    { frets: ['x', 'x', 1, 2, 4, 3], firstFret: 5, position: 'Rootless 5th' },
  ],
  'G#_7#9b13': [
    { frets: ['x', 'x', 1, 2, 4, 3], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 4, 3], firstFret: 6, position: 'Rootless 6th' },
  ],
  'Ab_7#9b13': [
    { frets: ['x', 'x', 1, 2, 4, 3], position: 'Open Partial' },
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 4, position: 'Barre 4th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 11, position: 'Barre 11th' },
    { frets: ['x', 'x', 1, 2, 4, 3], firstFret: 6, position: 'Rootless 6th' },
  ],
  'A_7#9b13': [
    { frets: ['x', 0, 2, 0, 4, 3], position: 'Open' },
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 5, position: 'Barre 5th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 12, position: 'Barre 12th' },
    { frets: ['x', 'x', 1, 2, 4, 3], firstFret: 7, position: 'Rootless 7th' },
  ],
  'A#_7#9b13': [
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 5, 6, 5], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 4, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'Bb_7#9b13': [
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 1, position: 'Barre 1st' },
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 6, position: 'Barre 6th' },
    { frets: ['x', 'x', 3, 5, 6, 5], firstFret: 1, position: 'Partial 3rd' },
    { frets: ['x', 'x', 1, 2, 4, 3], firstFret: 8, position: 'Rootless 8th' },
  ],
  'B_7#9b13': [
    { frets: ['x', 2, 1, 2, 4, 3], position: 'Open' },
    { frets: [1, 3, 1, 2, 4, 3], firstFret: 7, position: 'Barre 7th' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 2, position: 'Barre 2nd' },
    { frets: ['x', 'x', 1, 2, 4, 3], firstFret: 9, position: 'Rootless 9th' },
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
