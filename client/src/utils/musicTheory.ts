/**
 * Shared music theory constants and utilities
 * Central location for chromatic scale definitions and note conversions
 */

/**
 * Chromatic scale using sharp notation
 * C=0, C#=1, D=2, D#=3, E=4, F=5, F#=6, G=7, G#=8, A=9, A#=10, B=11
 */
export const ALL_NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

/**
 * Chromatic scale using flat notation
 * C=0, Db=1, D=2, Eb=3, E=4, F=5, Gb=6, G=7, Ab=8, A=9, Bb=10, B=11
 */
export const ALL_NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const;

/**
 * Standard guitar tuning note values (chromatic scale values where C=0)
 * Ordered from low E string to high E string
 */
export const STANDARD_TUNING_VALUES = [4, 9, 2, 7, 11, 4] as const; // E, A, D, G, B, E

/**
 * Standard guitar tuning note names
 * Ordered from high E string to low E string (display order)
 */
export const STANDARD_TUNING_NAMES = ['E', 'B', 'G', 'D', 'A', 'E'] as const;

/**
 * Convert a note name to its chromatic scale value (0-11)
 * @param note - Note name (e.g., 'C', 'F#', 'Bb')
 * @param defaultValue - Value to return if note is invalid (default: 0 for C)
 * @returns Chromatic scale value 0-11, or defaultValue if invalid
 */
export function noteToValue(note: string, defaultValue: number = 0): number {
  if (!note || note.length === 0) return defaultValue;

  const normalizedNote = note.charAt(0).toUpperCase() + note.slice(1).toLowerCase();

  // Try sharp notation first
  let index = ALL_NOTES_SHARP.indexOf(normalizedNote as any);
  if (index !== -1) return index;

  // Try flat notation
  index = ALL_NOTES_FLAT.indexOf(normalizedNote as any);
  if (index !== -1) return index;

  return defaultValue;
}

/**
 * Convert a chromatic scale value to a note name (sharp notation)
 * @param value - Chromatic scale value (will be normalized to 0-11 range)
 * @returns Note name in sharp notation
 */
export function valueToNote(value: number): string {
  return ALL_NOTES_SHARP[((value % 12) + 12) % 12]; // Handle negative values
}

/**
 * Calculate the semitone distance from one note to another
 * @param fromNote - Starting note
 * @param toNote - Target note
 * @returns Semitone distance (0-11)
 */
export function calculateSemitoneDistance(fromNote: string, toNote: string): number {
  const fromValue = noteToValue(fromNote);
  const toValue = noteToValue(toNote);
  return ((toValue - fromValue) + 12) % 12;
}

/**
 * Transpose a note by a given number of semitones
 * @param note - Note to transpose
 * @param semitones - Number of semitones to transpose (can be negative)
 * @returns Transposed note name
 */
export function transposeNote(note: string, semitones: number): string {
  const noteValue = noteToValue(note);
  const transposedValue = ((noteValue + semitones) % 12 + 12) % 12;
  return valueToNote(transposedValue);
}

/**
 * Get the note at a specific fret on a given string
 * @param stringNote - The open string note
 * @param fret - Fret number (0-24)
 * @returns Note name at that fret
 */
export function getNoteAtFret(stringNote: string, fret: number): string {
  return transposeNote(stringNote, fret);
}

/**
 * Check if a note is enharmonically equivalent to another
 * @param note1 - First note
 * @param note2 - Second note
 * @returns True if notes are enharmonically equivalent
 */
export function areNotesEnharmonic(note1: string, note2: string): boolean {
  return noteToValue(note1) === noteToValue(note2);
}

/**
 * Define key signatures and their preferred accidental types
 * Sharp keys use flats when they contain fewer flats than sharps of the same key
 */
const KEY_ACCIDENTAL_PREFERENCES: Record<string, { type: 'sharp' | 'flat' | 'natural', flats: number, sharps: number }> = {
  'C': { type: 'natural', flats: 0, sharps: 0 },
  'G': { type: 'sharp', flats: 6, sharps: 1 },
  'D': { type: 'sharp', flats: 5, sharps: 2 },
  'A': { type: 'sharp', flats: 4, sharps: 3 },
  'E': { type: 'sharp', flats: 3, sharps: 4 },
  'B': { type: 'sharp', flats: 2, sharps: 5 },
  'F#': { type: 'sharp', flats: 1, sharps: 6 },
  'C#': { type: 'sharp', flats: 0, sharps: 7 },
  'F': { type: 'flat', flats: 1, sharps: 6 },
  'Bb': { type: 'flat', flats: 2, sharps: 5 },
  'Eb': { type: 'flat', flats: 3, sharps: 4 },
  'Ab': { type: 'flat', flats: 4, sharps: 3 },
  'Db': { type: 'flat', flats: 5, sharps: 2 },
  'Gb': { type: 'flat', flats: 6, sharps: 1 },
  'Cb': { type: 'flat', flats: 7, sharps: 0 }
};

/**
 * Sharp keys use sharps in their key signature
 * Flat keys use flats in their key signature
 */
const SHARP_KEYS = new Set(['G', 'D', 'A', 'E', 'B', 'F#', 'C#']);
const FLAT_KEYS = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb']);

/**
 * Determine if a key uses sharps or flats based on music theory
 * @param key - The musical key (e.g., 'C', 'G', 'F', 'Bb')
 * @returns 'sharp' if key uses sharps, 'flat' if key uses flats, 'natural' for C
 */
export function getKeyAccidentalType(key: string): 'sharp' | 'flat' | 'natural' {
  const normalizedKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();

  const keyInfo = KEY_ACCIDENTAL_PREFERENCES[normalizedKey];
  if (keyInfo) {
    return keyInfo.type;
  }

  // Fallback for unknown keys - prefer sharps
  return 'sharp';
}

/**
 * Display a note using the appropriate accidental based on the key context
 * @param note - The note to display (can be sharp or flat notation)
 * @param key - The musical key context (determines sharp vs flat preference)
 * @returns Note name with context-appropriate accidental
 */
export function displayNote(note: string, key: string): string {
  const noteValue = noteToValue(note);
  const accidentalType = getKeyAccidentalType(key);

  // For C major (natural keys), use conventional spellings:
  // C, C#, D, Eb, E, F, F#, G, Ab, A, Bb, B
  if (accidentalType === 'natural') {
    const cMajorSpellings = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    return cMajorSpellings[noteValue];
  }

  // For sharp keys, use sharp notation
  if (accidentalType === 'sharp') {
    return ALL_NOTES_SHARP[noteValue];
  }

  // For flat keys, use flat notation
  return ALL_NOTES_FLAT[noteValue];
}

/**
 * Transform a chord name to use the appropriate accidentals based on key context
 * @param chordName - The chord name (e.g., "C#maj7", "Gbmin")
 * @param key - The musical key context
 * @returns Chord name with context-appropriate accidental
 */
export function displayChordName(chordName: string, key: string): string {
  // Extract the root note (first letter plus optional sharp/flat)
  const match = chordName.match(/^([A-G][#b]?)(.*)/i);
  if (!match) return chordName;
  
  const [, root, quality] = match;
  const displayRoot = displayNote(root, key);
  
  return displayRoot + quality;
}

/**
 * Extract the root note from a chord name
 * @param chordName - The chord name (e.g., "Cmaj7", "F#m", "Bbdim")
 * @returns The root note (e.g., "C", "F#", "Bb")
 */
export function extractChordRoot(chordName: string): string {
  const match = chordName.match(/^([A-G][#b]?)/i);
  return match ? match[1] : chordName;
}

/**
 * Get the interval name between two chord roots
 * @param fromChord - The starting chord name
 * @param toChord - The target chord name
 * @returns The interval name (e.g., "P4", "m3", "M2")
 */
export function getIntervalBetweenChords(fromChord: string, toChord: string): string {
  const fromRoot = extractChordRoot(fromChord);
  const toRoot = extractChordRoot(toChord);
  const semitones = calculateSemitoneDistance(fromRoot, toRoot);
  
  const intervalNames: Record<number, string> = {
    0: 'P1',   // Perfect unison
    1: 'm2',   // Minor 2nd
    2: 'M2',   // Major 2nd
    3: 'm3',   // Minor 3rd
    4: 'M3',   // Major 3rd
    5: 'P4',   // Perfect 4th
    6: 'TT',   // Tritone
    7: 'P5',   // Perfect 5th
    8: 'm6',   // Minor 6th
    9: 'M6',   // Major 6th
    10: 'm7',  // Minor 7th
    11: 'M7',  // Major 7th
  };
  
  return intervalNames[semitones] || `${semitones}`;
}

/**
 * Get a human-readable interval description
 * @param fromChord - The starting chord name
 * @param toChord - The target chord name
 * @returns Human-readable interval (e.g., "4th", "3rd", "5th")
 */
export function getIntervalDescription(fromChord: string, toChord: string): string {
  const fromRoot = extractChordRoot(fromChord);
  const toRoot = extractChordRoot(toChord);
  const semitones = calculateSemitoneDistance(fromRoot, toRoot);
  
  const descriptions: Record<number, string> = {
    0: 'unison',
    1: 'min 2nd',
    2: 'maj 2nd',
    3: 'min 3rd',
    4: 'maj 3rd',
    5: '4th',
    6: 'tritone',
    7: '5th',
    8: 'min 6th',
    9: 'maj 6th',
    10: 'min 7th',
    11: 'maj 7th',
  };
  
  return descriptions[semitones] || `${semitones} semitones`;
}
