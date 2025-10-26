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
  const normalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
  
  if (normalizedKey === 'C') return 'natural';
  if (SHARP_KEYS.has(normalizedKey)) return 'sharp';
  if (FLAT_KEYS.has(normalizedKey)) return 'flat';
  
  // Default to sharp for unknown keys
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
  
  // For natural keys (C major), prefer flats for Bb and sharps for F#
  if (accidentalType === 'natural') {
    return ALL_NOTES_FLAT[noteValue];
  }
  
  // Use sharps for sharp keys, flats for flat keys
  if (accidentalType === 'sharp') {
    return ALL_NOTES_SHARP[noteValue];
  } else {
    return ALL_NOTES_FLAT[noteValue];
  }
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
