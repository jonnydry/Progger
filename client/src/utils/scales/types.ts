/**
 * Scale library type definitions
 */

export interface ScalePattern {
  intervals: number[];
  fingerings: number[][][];
  positions?: string[];
}

export type ScaleLibrary = Record<string, ScalePattern>;

export type ScaleCategory =
  | 'major-modes'      // Major scale + modes (Ionian, Dorian, Phrygian, Lydian, Mixolydian, Locrian)
  | 'minor-scales'     // Natural minor (Aeolian), Harmonic minor, Melodic minor
  | 'pentatonic'       // Major pentatonic, Minor pentatonic, Blues
  | 'exotic'           // Whole tone, Diminished, Altered, Bebop, etc.
  ;
