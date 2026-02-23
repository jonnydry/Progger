import { splitChordName, isSupportedChordQuality } from '@shared/music/chordQualities';
import {
  normalizeScaleDescriptor,
  FALLBACK_SCALE_LIBRARY_KEYS,
  normalizeModeCanonical,
} from '@shared/music/scaleModes';
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
  detectedKey?: string;
  detectedMode?: string;
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
const SCALE_NAME_PATTERN = /^([A-G](?:[#b♯♭])?)(?:\s+)(.+)$/i;

/**
 * Valid root notes
 */
const VALID_ROOT_NOTES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
  'Db', 'Eb', 'Gb', 'Ab', 'Bb'
];

const ROOT_NOTE_TO_PITCH_CLASS: Record<string, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
};

/**
 * Validates a chord name format
 * Uses shared splitChordName function to avoid regex duplication
 */
function validateChordName(chordName: string): void {
  if (!chordName || typeof chordName !== 'string') {
    throw new APIValidationError('Chord name is required and must be a string');
  }

  // Use shared parsing logic instead of duplicating regex
  const parsed = splitChordName(chordName.trim());

  // splitChordName returns fallback {root: 'C', quality: 'major'} for invalid formats
  // If we get the fallback but input wasn't 'C' or 'Cmajor', it means parsing failed
  const isFallback = parsed.root === 'C' && parsed.quality === 'major' &&
    chordName.trim() !== 'C' && chordName.trim().toLowerCase() !== 'cmajor';

  if (isFallback) {
    throw new APIValidationError(
      `Invalid chord format: "${chordName}". Expected root note with optional quality and bass (e.g., "Cmaj7", "F#m7b5/A").`
    );
  }

  // Validate root note
  if (!VALID_ROOT_NOTES.includes(parsed.root)) {
    throw new APIValidationError(
      `Invalid chord root: "${parsed.root}". Must be one of: ${VALID_ROOT_NOTES.join(', ')}`
    );
  }

  // Validate bass note if present
  if (parsed.bass) {
    const normalizedBass = normalizeRootToken(parsed.bass);
    if (!VALID_ROOT_NOTES.includes(normalizedBass)) {
      throw new APIValidationError(
        `Invalid chord bass note: "${parsed.bass}". Must be one of: ${VALID_ROOT_NOTES.join(', ')}`
      );
    }
  }

  // Validate chord quality
  if (!isSupportedChordQuality(parsed.quality)) {
    throw new APIValidationError(
      `Unsupported chord quality in "${chordName}". Received "${parsed.quality}" but it does not match known qualities.`
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
  const match = trimmed.match(SCALE_NAME_PATTERN);
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

function extractScaleRoot(scaleName: string): string | null {
  const match = scaleName.trim().match(SCALE_NAME_PATTERN);
  if (!match) {
    return null;
  }
  return normalizeRootToken(match[1]);
}

function getPitchClass(root: string): number | null {
  const normalized = normalizeRootToken(root);
  if (!Object.prototype.hasOwnProperty.call(ROOT_NOTE_TO_PITCH_CLASS, normalized)) {
    return null;
  }
  return ROOT_NOTE_TO_PITCH_CLASS[normalized];
}

function rootsAreCompatible(scaleNameRoot: string, explicitRoot: string): boolean {
  const scaleRootPitchClass = getPitchClass(scaleNameRoot);
  const explicitRootPitchClass = getPitchClass(explicitRoot);

  return (
    scaleRootPitchClass !== null &&
    explicitRootPitchClass !== null &&
    scaleRootPitchClass === explicitRootPitchClass
  );
}

/**
 * Normalizes scale names to use canonical descriptors
 * Converts "C Ionian" → "C Major" and "C Aeolian" → "C Minor"
 */
function normalizeScaleName(scaleName: string): string {
  const trimmed = scaleName.trim();
  const match = trimmed.match(SCALE_NAME_PATTERN);
  
  if (!match) {
    return trimmed; // Return as-is if format doesn't match
  }
  
  const [, rootNote, descriptor] = match;
  const normalized = normalizeScaleDescriptor(descriptor);
  
  if (normalized) {
    // Use canonical form (Major/Minor instead of Ionian/Aeolian)
    return `${normalizeRootToken(rootNote)} ${normalized.canonical}`;
  }
  
  // If normalization fails, return original
  return trimmed;
}

/**
 * Enhanced validation for API responses
 * Validates structure, format, and data quality
 */
export function validateAPIResponse(result: unknown, expectedChordCount?: number): ProgressionResultFromAPI {
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

  // Validate progression length matches expected count
  if (expectedChordCount !== undefined && progression.length !== expectedChordCount) {
    throw new APIValidationError(
      `Expected ${expectedChordCount} chords but received ${progression.length}. ` +
      `The AI must generate exactly ${expectedChordCount} chords.`
    );
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

  // Validate and normalize each scale
  const normalizedScales: SimpleScale[] = [];
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

    const scaleNameRoot = extractScaleRoot(scale.name);
    if (!scaleNameRoot || !rootsAreCompatible(scaleNameRoot, scale.rootNote)) {
      throw new APIValidationError(
        `Scales[${i}]: scale name root "${scaleNameRoot ?? 'unknown'}" does not match rootNote "${scale.rootNote.trim()}".`
      );
    }
    
    // Normalize scale name to use canonical forms (Major/Minor instead of Ionian/Aeolian)
    const normalizedName = normalizeScaleName(scale.name);
    normalizedScales.push({
      name: normalizedName,
      rootNote: scale.rootNote.trim()
    });
  }

  // Validate detectedKey and detectedMode (optional fields)
  let detectedKey: string | undefined;
  let detectedMode: string | undefined;

  if (apiResult.detectedKey !== undefined) {
    if (typeof apiResult.detectedKey !== 'string') {
      throw new APIValidationError('detectedKey must be a string if provided');
    }
    detectedKey = apiResult.detectedKey.trim();

    // Validate key format (e.g., 'C', 'F#', 'Bb', 'Am')
    const keyMatch = detectedKey.match(/^([A-G][#b]?)(m?)$/i);
    if (!keyMatch) {
      throw new APIValidationError(
        `Invalid detectedKey format: "${detectedKey}". Expected format: root note with optional 'm' suffix (e.g., 'C', 'F#', 'Am')`
      );
    }

    const [, rootNote] = keyMatch;
    const normalizedRoot = normalizeRootToken(rootNote);
    if (!VALID_ROOT_NOTES.includes(normalizedRoot)) {
      throw new APIValidationError(
        `Invalid root note in detectedKey: "${rootNote}". Must be one of: ${VALID_ROOT_NOTES.join(', ')}`
      );
    }
  }

  if (apiResult.detectedMode !== undefined) {
    if (typeof apiResult.detectedMode !== 'string') {
      throw new APIValidationError('detectedMode must be a string if provided');
    }
    const rawDetectedMode = apiResult.detectedMode.trim();
    const normalizedDetectedMode = normalizeScaleDescriptor(rawDetectedMode);
    if (!normalizedDetectedMode) {
      throw new APIValidationError(
        `Invalid detectedMode: "${rawDetectedMode}". Must be a supported scale/mode descriptor.`
      );
    }

    detectedMode = normalizeModeCanonical(rawDetectedMode);
  }

  return { progression, scales: normalizedScales, detectedKey, detectedMode };
}
