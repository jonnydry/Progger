import { resolveChordQuality } from '@shared/music/chordQualities';
import { normalizeScaleDescriptor, FALLBACK_SCALE_LIBRARY_KEYS } from '@shared/music/scaleModes';
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
 * Pattern to validate individual Roman numeral components (including alterations)
 */
const ROMAN_NUMERAL_COMPONENT_PATTERN = /^[b#]?[IVXLCDMivxlcdm]+[a-zA-Z0-9#b°øΔ]*$/;

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

  const match = chordName.trim().match(/^([A-G][#b]?)(.*?)(?:\/([A-G][#b]?))?$/i);
  if (!match) {
    throw new APIValidationError(
      `Invalid chord format: "${chordName}". Expected root note with optional quality and bass (e.g., "Cmaj7", "F#m7b5/A").`
    );
  }

  const [, rawRoot, rawQuality = '', rawBass] = match;
  const root = normalizeRootToken(rawRoot);

  if (!VALID_ROOT_NOTES.includes(root)) {
    throw new APIValidationError(
      `Invalid chord root: "${root}". Must be one of: ${VALID_ROOT_NOTES.join(', ')}`
    );
  }

  if (rawBass) {
    const bass = normalizeRootToken(rawBass);
    if (!VALID_ROOT_NOTES.includes(bass)) {
      throw new APIValidationError(
        `Invalid chord bass note: "${bass}". Must be one of: ${VALID_ROOT_NOTES.join(', ')}`
      );
    }
  }

  const { recognized } = resolveChordQuality(rawQuality);
  if (!recognized) {
    throw new APIValidationError(
      `Unsupported chord quality in "${chordName}". Received "${rawQuality || 'major'}" but it does not match known qualities.`
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

  const parts = relationToKey.split('/');
  for (const part of parts) {
    if (!ROMAN_NUMERAL_COMPONENT_PATTERN.test(part)) {
      throw new APIValidationError(
        `Invalid Roman numeral component: "${part}" in "${relationToKey}".`
      );
    }
  }
}

/**
 * Validates a scale name format
 */
function validateScaleName(scaleName: string): void {
  if (!scaleName || typeof scaleName !== 'string') {
    throw new APIValidationError('Scale name is required and must be a string');
  }

  const trimmed = scaleName.trim();
  const match = trimmed.match(/^([A-G][#b]?)(?:\s+)(.+)$/i);
  if (!match) {
    throw new APIValidationError(
      `Invalid scale name: "${scaleName}". Expected format: root + descriptor (e.g., "C Major").`
    );
  }

  const [, rootNote, descriptor] = match;
  validateRootNote(normalizeRootToken(rootNote));

  const normalized = normalizeScaleDescriptor(descriptor);
  if (!normalized) {
    const sanitized = descriptor.replace(/\s+|-/g, '').toLowerCase();
    if (!FALLBACK_SCALE_LIBRARY_KEYS.has(sanitized)) {
      throw new APIValidationError(
        `Unsupported scale descriptor: "${descriptor}" in "${scaleName}".`
      );
    }
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

function normalizeRootToken(token: string): string {
  const trimmed = token.trim();
  if (trimmed.length <= 1) {
    return trimmed.toUpperCase();
  }

  const first = trimmed.charAt(0).toUpperCase();
  const second = trimmed.charAt(1);

  if (second === '#' || second === '♯') {
    return `${first}#`;
  }

  if (second === 'b' || second === '♭' || second === 'B') {
    return `${first}b`;
  }

  return first + second.toLowerCase();
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

