/**
 * Represents the fingering for a single way to play a chord
 *
 * STRING ORDERING CONVENTION:
 * The frets array is ordered from LOW E (6th string) to HIGH E (1st string):
 * Index: [0,       1,  2,  3,  4,      5]
 * String: [Low E,  A,  D,  G,  B,   High E]
 * Number: [6th,   5th, 4th, 3rd, 2nd, 1st]
 *
 * Example - E major open chord:
 * frets: [0, 2, 2, 1, 0, 0]
 *        └─ Low E (open)
 *           └─ A string (2nd fret = B note)
 *              └─ D string (2nd fret = E note)
 *                 └─ G string (1st fret = G# note)
 *                    └─ B string (open)
 *                       └─ High E (open)
 */
export interface ChordVoicing {
  /**
   * Fret numbers for each string, or 'x' for muted strings
   * Array order: [Low E, A, D, G, B, High E]
   */
  frets: (number | 'x')[];

  /**
   * The fret number where the diagram starts (for barre chords)
   * If not specified, defaults to 1 (open position)
   *
   * Example: firstFret: 5 means frets array values are relative to fret 5
   * So frets: [1, 3, 3, 2, 1, 1] with firstFret: 5 means:
   * - Low E at fret 5, A at fret 7, D at fret 7, etc.
   */
  firstFret?: number;

  /**
   * Human-readable position name (e.g., 'Open', 'Barre 3rd', 'Partial')
   */
  position?: string;
}

// Represents one chord in the progression, which has multiple voicings
export interface ChordInProgression {
  chordName: string;
  voicings: ChordVoicing[];
  musicalFunction: string;
  relationToKey: string;
}

/**
 * Represents scale fingering information
 *
 * STRING ORDERING CONVENTION FOR FINGERING:
 * The fingering 2D array is ordered from LOW E (6th string) to HIGH E (1st string):
 * fingering[0] = Low E string (6th) fret positions
 * fingering[1] = A string (5th) fret positions
 * fingering[2] = D string (4th) fret positions
 * fingering[3] = G string (3rd) fret positions
 * fingering[4] = B string (2nd) fret positions
 * fingering[5] = High E string (1st) fret positions
 *
 * Each string's array contains the fret numbers where scale notes appear.
 *
 * Example - C major scale Position 1:
 * fingering: [
 *   [8, 10, 12],  // Low E string: C (8th), D (10th), E (12th)
 *   [8, 10, 12],  // A string: C (8th), D (10th), E (12th)
 *   ...
 * ]
 */
export interface ScaleInfo {
  /** Scale name with root (e.g., "C major", "A minor pentatonic") */
  name: string;

  /** Root note of the scale (e.g., "C", "F#", "Bb") */
  rootNote: string;

  /** Array of note names in the scale (e.g., ["C", "D", "E", "F", "G", "A", "B"]) */
  notes: string[];

  /**
   * 2D array of fret positions for the scale pattern
   * Outer array: strings from Low E to High E [6th, 5th, 4th, 3rd, 2nd, 1st]
   * Inner array: fret numbers where scale notes appear on that string
   */
  fingering: number[][];
}

export interface CustomChordInput {
  id: string;
  root: string;
  quality: string;
}

// The full result from the API
export interface ProgressionResult {
  progression: ChordInProgression[];
  scales: ScaleInfo[];
  detectedKey?: string;
  detectedMode?: string;
}

// Stash-related types
export interface StashItemData {
  id: string;
  userId: string;
  name: string;
  key: string;
  mode: string;
  progressionData: ProgressionResult;
  createdAt: string;
}

export interface CreateStashItemRequest {
  name: string;
  key: string;
  mode: string;
  progressionData: ProgressionResult;
}
