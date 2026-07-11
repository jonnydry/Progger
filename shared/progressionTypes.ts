/**
 * Shared AI progression DTOs used by client enrichment and server validation.
 */

export interface SimpleChord {
  chordName: string;
  musicalFunction: string;
  relationToKey: string;
}

export interface SimpleScale {
  name: string;
  rootNote: string;
}

export interface ProgressionResultFromAPI {
  progression: SimpleChord[];
  scales: SimpleScale[];
  detectedKey?: string;
  detectedMode?: string;
}
