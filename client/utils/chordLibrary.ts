export interface ChordVoicing {
  frets: (number | 'x')[];
  firstFret?: number;
  position?: string;
}

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
    { frets: [0, 2, 2, 2, 0, 0], position: 'Open' },
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
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 1, position: 'Barre 1st' },
    { frets: [6, 8, 8, 7, 6, 6], firstFret: 6, position: 'Barre 6th' },
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
  'major': [{ frets: [1, 3, 3, 2, 1, 1], firstFret: 1, position: 'Barre' }],
  'minor': [{ frets: [1, 3, 3, 1, 1, 1], firstFret: 1, position: 'Barre' }],
  '7': [{ frets: [1, 3, 1, 2, 1, 1], firstFret: 1, position: 'Barre' }],
  'maj7': [{ frets: [1, 3, 2, 2, 1, 1], firstFret: 1, position: 'Barre' }],
  'min7': [{ frets: [1, 3, 1, 1, 1, 1], firstFret: 1, position: 'Barre' }],
  'sus2': [{ frets: [1, 3, 3, 3, 1, 3], firstFret: 1, position: 'Barre' }],
  'sus4': [{ frets: [1, 3, 3, 3, 1, 1], firstFret: 1, position: 'Barre' }],
  'dim': [{ frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Partial' }],
  'dim7': [{ frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'Partial' }],
  'aug': [{ frets: ['x', 'x', 2, 1, 1, 4], firstFret: 1, position: 'Partial' }],
  'add9': [{ frets: [1, 3, 3, 2, 1, 3], firstFret: 1, position: 'Barre' }],
  '6': [{ frets: [1, 3, 3, 2, 3, 1], firstFret: 1, position: 'Barre' }],
  'min6': [{ frets: [1, 3, 3, 1, 3, 1], firstFret: 1, position: 'Barre' }],
  '9': [{ frets: [1, 3, 1, 2, 1, 3], firstFret: 1, position: 'Barre' }],
  'maj9': [{ frets: [1, 3, 2, 2, 1, 3], firstFret: 1, position: 'Barre' }],
  'min9': [{ frets: [1, 3, 1, 1, 1, 3], firstFret: 1, position: 'Barre' }],
  'min7b5': [{ frets: ['x', 'x', 1, 2, 2, 2], firstFret: 1, position: 'Partial' }],
};

const ROOT_TO_FRET_FROM_E: Record<string, number> = {
  'E': 0, 'F': 1, 'F#': 2, 'Gb': 2, 'G': 3, 
  'Ab': 4, 'G#': 4, 'A': 5, 'Bb': 6, 'A#': 6, 'B': 7,
  'C': 8, 'C#': 9, 'Db': 9, 'D': 10, 'Eb': 11, 'D#': 11
};

function normalizeRoot(root: string): string {
  const upper = root.toUpperCase();
  const sharpEquivalents: Record<string, string> = {
    'C': 'C', 'C#': 'Db', 'DB': 'Db',
    'D': 'D', 'D#': 'Eb', 'EB': 'Eb',
    'E': 'E',
    'F': 'F', 'F#': 'F#', 'GB': 'Gb',
    'G': 'G', 'G#': 'Ab', 'AB': 'Ab',
    'A': 'A', 'A#': 'Bb', 'BB': 'Bb',
    'B': 'B'
  };
  return sharpEquivalents[upper] || 'C';
}

function normalizeQuality(quality: string): string {
  const q = quality.toLowerCase().replace(/\s+/g, '').trim();
  
  if (!q || q === 'maj' || q === 'major' || q === 'M') return 'major';
  if (q === 'm' || q === 'min' || q === 'minor' || q === '-') return 'minor';
  if (q === '7' || q === 'dom7' || q === 'dominant7') return '7';
  if (q === 'maj7' || q === 'major7' || q === 'M7' || q === 'Δ7') return 'maj7';
  if (q === 'm7' || q === 'min7' || q === 'minor7' || q === '-7') return 'min7';
  if (q === 'dim' || q === 'o' || q === '°') return 'dim';
  if (q === 'dim7' || q === 'o7' || q === '°7') return 'dim7';
  if (q === 'aug' || q === '+' || q === '#5') return 'aug';
  if (q === 'sus2') return 'sus2';
  if (q === 'sus4' || q === 'sus') return 'sus4';
  if (q === '9' || q === 'dom9') return '9';
  if (q === 'maj9' || q === 'M9') return 'maj9';
  if (q === 'm9' || q === 'min9') return 'min9';
  if (q.startsWith('m7b5') || q === 'ø' || q === 'half-dim') return 'min7b5';
  if (q === 'add9') return 'add9';
  if (q === '6') return '6';
  if (q === 'm6' || q === 'min6') return 'min6';
  
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

function getFretOffset(root: string): number {
  return ROOT_TO_FRET_FROM_E[root] || 0;
}

export function getChordVoicings(chordName: string): ChordVoicing[] {
  const { root, quality } = extractRootAndQuality(chordName);
  const key: ChordKey = `${root}_${quality}`;
  
  const voicings = CHORD_VOICINGS[key];
  if (voicings && voicings.length > 0) {
    return voicings;
  }
  
  const genericShapes = GENERIC_BARRE_SHAPES[quality];
  if (genericShapes && genericShapes.length > 0) {
    const fretPosition = getFretOffset(root);
    const adjustedFret = fretPosition === 0 ? 12 : fretPosition;
    return genericShapes.map(shape => ({
      ...shape,
      firstFret: adjustedFret,
      position: `${root} ${quality}`
    }));
  }
  
  return [{ frets: ['x', 'x', 'x', 'x', 'x', 'x'], position: 'Unknown' }];
}
