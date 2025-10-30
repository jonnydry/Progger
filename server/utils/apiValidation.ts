/**
 * Enhanced API response validation
 * Validates structure and format of responses from external APIs (xAI Grok)
 */

interface SimpleChord {
  chordName: string;
  musicalFunction: string;
  relationToKey: string;
}

interface SimpleScale {
  name: string;
  rootNote: string;
}

interface ProgressionResultFromAPI {
  progression: SimpleChord[];
  scales: SimpleScale[];
}

export class APIValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIValidationError';
  }
}

/**
 * Pattern to match valid chord names
 * Examples: C, Cmaj7, Am7, G7b9, D7alt, Bm7b5, F#maj9, Ab7sus4
 */
const CHORD_NAME_PATTERN = /^[A-G][#b]?(maj|min|dim|aug)?\d*(sus\d+)?(add\d+)?(b\d+|#\d+)?(\/[A-G][#b]?)?$/i;

/**
 * Pattern to match valid Roman numeral notation
 * Examples: I, Imaj7, ii, V7, ii°, V7/ii, bVII
 */
const ROMAN_NUMERAL_PATTERN = /^[b#]?[ivxlcdmIVXLCDM]+[°°]?(\/[b#]?[ivxlcdmIVXLCDM]+)?$/;

/**
 * Pattern to match valid scale names
 * Examples: "C major", "A minor", "G Dorian", "F# Pentatonic", "Bb Altered Scale"
 */
const SCALE_NAME_PATTERN = /^[A-G][#b]?\s+(major|minor|dorian|phrygian|lydian|mixolydian|locrian|pentatonic|blues|altered|harmonic|melodic)(\s+pentatonic|\s+scale)?$/i;

/**
 * Valid root notes
 */
const VALID_ROOT_NOTES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
  'Db', 'Eb', 'Gb', 'Ab', 'Bb'
];

/**
 * Validates a chord name format
 */
function validateChordName(chordName: string): void {
  if (!chordName || typeof chordName !== 'string') {
    throw new APIValidationError('Chord name is required and must be a string');
  }

  if (!CHORD_NAME_PATTERN.test(chordName.trim())) {
    throw new APIValidationError(
      `Invalid chord name format: "${chordName}". ` +
      'Expected format: root note (C-G) with optional accidentals (#/b), ' +
      'chord quality (maj/min/dim/aug), extensions (7, 9, 11, 13), ' +
      'and alterations (b9, #9, etc.)'
    );
  }
}

/**
 * Validates a Roman numeral notation
 */
function validateRomanNumeral(relationToKey: string): void {
  if (!relationToKey || typeof relationToKey !== 'string') {
    throw new APIValidationError('Relation to key is required and must be a string');
  }

  if (!ROMAN_NUMERAL_PATTERN.test(relationToKey.trim())) {
    throw new APIValidationError(
      `Invalid Roman numeral format: "${relationToKey}". ` +
      'Expected format: Roman numerals (I-VII) with optional quality indicators (maj7, min7, etc.)'
    );
  }
}

/**
 * Validates a scale name format
 */
function validateScaleName(scaleName: string): void {
  if (!scaleName || typeof scaleName !== 'string') {
    throw new APIValidationError('Scale name is required and must be a string');
  }

  if (!SCALE_NAME_PATTERN.test(scaleName.trim())) {
    throw new APIValidationError(
      `Invalid scale name format: "${scaleName}". ` +
      'Expected format: root note followed by scale type (e.g., "C major", "A minor pentatonic")'
    );
  }
}

/**
 * Validates a root note
 */
function validateRootNote(rootNote: string): void {
  if (!rootNote || typeof rootNote !== 'string') {
    throw new APIValidationError('Root note is required and must be a string');
  }

  if (!VALID_ROOT_NOTES.includes(rootNote.trim())) {
    throw new APIValidationError(
      `Invalid root note: "${rootNote}". ` +
      `Must be one of: ${VALID_ROOT_NOTES.join(', ')}`
    );
  }
}

/**
 * Enhanced validation for API responses
 * Validates structure, format, and data quality
 */
export function validateAPIResponse(result: unknown): ProgressionResultFromAPI {
  // Basic structure validation
  if (!result || typeof result !== 'object') {
    throw new APIValidationError('API response must be an object');
  }

  const apiResult = result as Record<string, unknown>;

  // Validate progression array exists
  if (!apiResult.progression || !Array.isArray(apiResult.progression)) {
    throw new APIValidationError('API response must contain a progression array');
  }

  // Validate scales array exists
  if (!apiResult.scales || !Array.isArray(apiResult.scales)) {
    throw new APIValidationError('API response must contain a scales array');
  }

  const progression = apiResult.progression as SimpleChord[];
  const scales = apiResult.scales as SimpleScale[];

  // Validate progression is not empty
  if (progression.length === 0) {
    throw new APIValidationError('Progression array cannot be empty');
  }

  // Validate scales is not empty
  if (scales.length === 0) {
    throw new APIValidationError('Scales array cannot be empty');
  }

  // Validate each chord in progression
  for (let i = 0; i < progression.length; i++) {
    const chord = progression[i];

    if (!chord || typeof chord !== 'object') {
      throw new APIValidationError(`Progression[${i}] must be an object`);
    }

    // Validate required fields exist
    if (!chord.chordName || typeof chord.chordName !== 'string') {
      throw new APIValidationError(`Progression[${i}].chordName is required and must be a string`);
    }

    if (!chord.musicalFunction || typeof chord.musicalFunction !== 'string') {
      throw new APIValidationError(`Progression[${i}].musicalFunction is required and must be a string`);
    }

    if (!chord.relationToKey || typeof chord.relationToKey !== 'string') {
      throw new APIValidationError(`Progression[${i}].relationToKey is required and must be a string`);
    }

    // Enhanced format validation
    try {
      validateChordName(chord.chordName);
      validateRomanNumeral(chord.relationToKey);
    } catch (error) {
      if (error instanceof APIValidationError) {
        throw new APIValidationError(`Progression[${i}]: ${error.message}`);
      }
      throw error;
    }
  }

  // Validate each scale
  for (let i = 0; i < scales.length; i++) {
    const scale = scales[i];

    if (!scale || typeof scale !== 'object') {
      throw new APIValidationError(`Scales[${i}] must be an object`);
    }

    // Validate required fields exist
    if (!scale.name || typeof scale.name !== 'string') {
      throw new APIValidationError(`Scales[${i}].name is required and must be a string`);
    }

    if (!scale.rootNote || typeof scale.rootNote !== 'string') {
      throw new APIValidationError(`Scales[${i}].rootNote is required and must be a string`);
    }

    // Enhanced format validation
    try {
      validateScaleName(scale.name);
      validateRootNote(scale.rootNote);
    } catch (error) {
      if (error instanceof APIValidationError) {
        throw new APIValidationError(`Scales[${i}]: ${error.message}`);
      }
      throw error;
    }
  }

  return { progression, scales };
}

