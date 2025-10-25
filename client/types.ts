// Represents the fingering for a single way to play a chord
export interface ChordVoicing {
  frets: (number | 'x')[];
  firstFret?: number;
}

// Represents one chord in the progression, which has multiple voicings
export interface ChordInProgression {
  chordName: string;
  voicings: ChordVoicing[];
  musicalFunction: string;
  relationToKey: string;
}

export interface ScaleInfo {
  name: string;
  rootNote: string;
  notes: string[];
  fingering: number[][];
}

// The full result from the API
export interface ProgressionResult {
  progression: ChordInProgression[];
  scales: ScaleInfo[];
}