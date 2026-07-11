/**
 * Shared music theory constants and utilities
 * Central location for chromatic scale definitions and note conversions
 */

/**
 * Chromatic scale using sharp notation
 * C=0, C#=1, D=2, D#=3, E=4, F=5, F#=6, G=7, G#=8, A=9, A#=10, B=11
 */
export const ALL_NOTES_SHARP = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

/**
 * Chromatic scale using flat notation
 * C=0, Db=1, D=2, Eb=3, E=4, F=5, Gb=6, G=7, Ab=8, A=9, Bb=10, B=11
 */
export const ALL_NOTES_FLAT = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
] as const;

/**
 * Standard guitar tuning note values (chromatic scale values where C=0)
 * Ordered from low E string to high E string
 */
export const STANDARD_TUNING_VALUES = [4, 9, 2, 7, 11, 4] as const; // E, A, D, G, B, E

/**
 * Standard guitar tuning note names
 * Ordered from high E string to low E string (display order)
 */
export const STANDARD_TUNING_NAMES = ["E", "B", "G", "D", "A", "E"] as const;

/**
 * Convert a note name to its chromatic scale value (0-11)
 * @param note - Note name (e.g., 'C', 'F#', 'Bb')
 * @param defaultValue - Value to return if note is invalid (default: 0 for C)
 * @returns Chromatic scale value 0-11, or defaultValue if invalid
 */
export function noteToValue(note: string, defaultValue: number = 0): number {
  if (!note || note.length === 0) return defaultValue;

  const ascii = note.replace(/♯/g, "#").replace(/♭/g, "b");
  const normalizedNote = ascii.charAt(0).toUpperCase() + ascii.slice(1).toLowerCase();

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
  return (toValue - fromValue + 12) % 12;
}

/**
 * Transpose a note by a given number of semitones
 * @param note - Note to transpose
 * @param semitones - Number of semitones to transpose (can be negative)
 * @returns Transposed note name
 */
export function transposeNote(note: string, semitones: number): string {
  const noteValue = noteToValue(note);
  const transposedValue = (((noteValue + semitones) % 12) + 12) % 12;
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
 * Define key signatures and their preferred accidental types.
 * Values are for MAJOR keys (or the major key whose signature a mode inherits).
 */
const KEY_ACCIDENTAL_PREFERENCES: Record<
  string,
  { type: "sharp" | "flat" | "natural"; flats: number; sharps: number }
> = {
  C: { type: "natural", flats: 0, sharps: 0 },
  G: { type: "sharp", flats: 6, sharps: 1 },
  D: { type: "sharp", flats: 5, sharps: 2 },
  A: { type: "sharp", flats: 4, sharps: 3 },
  E: { type: "sharp", flats: 3, sharps: 4 },
  B: { type: "sharp", flats: 2, sharps: 5 },
  "F#": { type: "sharp", flats: 1, sharps: 6 },
  "C#": { type: "sharp", flats: 0, sharps: 7 },
  F: { type: "flat", flats: 1, sharps: 6 },
  Bb: { type: "flat", flats: 2, sharps: 5 },
  Eb: { type: "flat", flats: 3, sharps: 4 },
  Ab: { type: "flat", flats: 4, sharps: 3 },
  Db: { type: "flat", flats: 5, sharps: 2 },
  Gb: { type: "flat", flats: 6, sharps: 1 },
  Cb: { type: "flat", flats: 7, sharps: 0 },
};

/** Relative major for natural minor tonics (guitar key-signature spelling). */
const MINOR_TO_RELATIVE_MAJOR: Record<string, string> = {
  A: "C",
  E: "G",
  B: "D",
  "F#": "A",
  "C#": "E",
  "G#": "B",
  "D#": "F#",
  "A#": "C#",
  D: "F",
  G: "Bb",
  C: "Eb",
  F: "Ab",
  Bb: "Db",
  Eb: "Gb",
  Ab: "Cb",
};

/**
 * Normalize a key token for signature lookup (Bb not BB; strip trailing "m").
 */
function normalizeKeyToken(key: string): { tonic: string; impliedMinor: boolean } {
  const ascii = key.replace(/♯/g, "#").replace(/♭/g, "b").trim();
  const impliedMinor = /m$/i.test(ascii) || /\bminor\b/i.test(ascii);
  const stripped = ascii
    .replace(/\s*(natural|harmonic|melodic)?\s*minor\s*$/i, "")
    .replace(/m$/i, "")
    .trim();
  if (!stripped) {
    return { tonic: "C", impliedMinor };
  }
  const tonic =
    stripped.length <= 1
      ? stripped.toUpperCase()
      : stripped.charAt(0).toUpperCase() + stripped.slice(1).toLowerCase();
  // BB from legacy uppercase bugs → Bb
  const fixed = tonic === "BB" ? "Bb" : tonic === "EB" ? "Eb" : tonic === "AB" ? "Ab" : tonic === "DB" ? "Db" : tonic === "GB" ? "Gb" : tonic;
  return { tonic: fixed, impliedMinor };
}

/**
 * Major-system mode → semitone shift from mode tonic to parent major tonic.
 * Matches shared/music/scaleModes MAJOR_SYSTEM_MODE_PROFILES.parentMajorShift.
 */
const MODE_TO_PARENT_MAJOR_SHIFT: Record<string, number> = {
  major: 0,
  ionian: 0,
  dorian: 10, // -2 mod 12: D dorian → C
  phrygian: 8, // -4
  lydian: 7, // -5
  mixolydian: 5, // -7
  minor: 3,
  aeolian: 3,
  locrian: 1,
};

/**
 * Map scale-library names (e.g. "pentatonic minor") to a diatonic mode
 * used only for guitar key-signature / accidental spelling on the neck.
 */
export function resolveSpellingMode(scaleOrMode: string): string {
  const key = scaleOrMode.trim().toLowerCase();
  if (MODE_TO_PARENT_MAJOR_SHIFT[key] !== undefined) {
    return key;
  }

  if (/\bdorian\b/.test(key)) return "dorian";
  if (/\bphrygian\b/.test(key) && !/\bdominant\b/.test(key)) return "phrygian";
  if (/\blydian\b/.test(key) && !/\bdominant\b/.test(key)) return "lydian";
  if (/\bmixolydian\b/.test(key) || key === "lydian dominant" || key === "bebop dominant") {
    return "mixolydian";
  }
  if (/\blocrian\b/.test(key) || key === "super locrian" || key === "altered") {
    return "locrian";
  }
  if (
    /\bminor\b/.test(key) ||
    key === "blues" ||
    key === "gypsy" ||
    key === "phrygian dominant"
  ) {
    return "minor";
  }
  if (/\bmajor\b/.test(key) || key === "whole tone" || key === "diminished" || key === "ionian") {
    return "major";
  }

  return "major";
}

function parentMajorForMode(tonic: string, mode: string): string {
  const modeKey = resolveSpellingMode(mode);
  const shift = MODE_TO_PARENT_MAJOR_SHIFT[modeKey];
  if (shift === undefined) {
    return tonic;
  }
  if (modeKey === "minor" || modeKey === "aeolian") {
    return MINOR_TO_RELATIVE_MAJOR[tonic] ?? valueToNote((noteToValue(tonic) + 3) % 12);
  }
  if (shift === 0) {
    return tonic;
  }
  const parentPc = (noteToValue(tonic) + shift) % 12;
  // Prefer a spelling that exists in our key-signature table
  const sharp = ALL_NOTES_SHARP[parentPc];
  const flat = ALL_NOTES_FLAT[parentPc];
  if (KEY_ACCIDENTAL_PREFERENCES[sharp]) return sharp;
  if (KEY_ACCIDENTAL_PREFERENCES[flat]) return flat;
  return sharp;
}

/**
 * Determine if a key uses sharps or flats based on guitar key signatures.
 * Optional mode uses the parent-major signature (e.g. A minor → C = naturals).
 * Scale-library names (e.g. "pentatonic minor") are mapped via resolveSpellingMode.
 */
export function getKeyAccidentalType(
  key: string,
  mode?: string
): "sharp" | "flat" | "natural" {
  const { tonic, impliedMinor } = normalizeKeyToken(key);
  const effectiveMode = resolveSpellingMode(mode?.trim() || (impliedMinor ? "minor" : "major"));
  const signatureTonic = parentMajorForMode(tonic, effectiveMode);

  const keyInfo = KEY_ACCIDENTAL_PREFERENCES[signatureTonic];
  if (keyInfo) {
    return keyInfo.type;
  }

  // Enharmonic fallback (e.g. C# vs Db)
  const pc = noteToValue(signatureTonic);
  for (const [name, info] of Object.entries(KEY_ACCIDENTAL_PREFERENCES)) {
    if (noteToValue(name) === pc) {
      return info.type;
    }
  }

  return "sharp";
}

/**
 * Display a note using the appropriate accidental based on the key/mode context
 * (guitar neck labels should match the key signature the player is in).
 */
export function displayNote(note: string, key: string, mode?: string): string {
  const noteValue = noteToValue(note);
  const accidentalType = getKeyAccidentalType(key, mode);

  // For C major / A minor (natural keys), use conventional mixed spellings:
  // C, C#, D, Eb, E, F, F#, G, Ab, A, Bb, B
  if (accidentalType === "natural") {
    const cMajorSpellings = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
    return cMajorSpellings[noteValue];
  }

  if (accidentalType === "sharp") {
    return ALL_NOTES_SHARP[noteValue];
  }

  return ALL_NOTES_FLAT[noteValue];
}

/**
 * Transform a chord name to use the appropriate accidentals based on key/mode context
 */
export function displayChordName(chordName: string, key: string, mode?: string): string {
  const match = chordName.match(/^([A-G][#b]?)(.*)/i);
  if (!match) return chordName;

  const [, root, quality] = match;
  const displayRoot = displayNote(root, key, mode);

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
    0: "P1", // Perfect unison
    1: "m2", // Minor 2nd
    2: "M2", // Major 2nd
    3: "m3", // Minor 3rd
    4: "M3", // Major 3rd
    5: "P4", // Perfect 4th
    6: "TT", // Tritone
    7: "P5", // Perfect 5th
    8: "m6", // Minor 6th
    9: "M6", // Major 6th
    10: "m7", // Minor 7th
    11: "M7", // Major 7th
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
    0: "unison",
    1: "min 2nd",
    2: "maj 2nd",
    3: "min 3rd",
    4: "maj 3rd",
    5: "4th",
    6: "tritone",
    7: "5th",
    8: "min 6th",
    9: "maj 6th",
    10: "min 7th",
    11: "maj 7th",
  };

  return descriptions[semitones] || `${semitones} semitones`;
}
