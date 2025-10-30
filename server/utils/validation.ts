// Validation utilities for API request validation

// Valid keys (matches client constants)
const KEYS = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
  'Db', 'Eb', 'Gb', 'Ab', 'Bb'
] as const;

// Valid modes (matches client constants)
const MODES = [
  'major', 'minor', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian',
  'Major', 'Minor', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Locrian' // Case variants
] as const;

export interface ProgressionRequest {
  key: string;
  mode: string;
  includeTensions: boolean;
  numChords: number;
  selectedProgression: string;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateProgressionRequest(body: unknown): ProgressionRequest {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Request body must be an object');
  }

  const req = body as Record<string, unknown>;

  // Validate key
  if (!req.key || typeof req.key !== 'string') {
    throw new ValidationError('Invalid or missing key parameter');
  }
  if (!KEYS.includes(req.key as any)) {
    throw new ValidationError(`Invalid key: ${req.key}. Must be one of: ${KEYS.join(', ')}`);
  }

  // Validate mode
  if (!req.mode || typeof req.mode !== 'string') {
    throw new ValidationError('Invalid or missing mode parameter');
  }
  const modeLower = req.mode.toLowerCase();
  const validModesLower = MODES.map(m => m.toLowerCase());
  if (!validModesLower.includes(modeLower)) {
    throw new ValidationError(`Invalid mode: ${req.mode}. Must be one of: major, minor, dorian, phrygian, lydian, mixolydian, locrian`);
  }

  // Validate includeTensions
  if (typeof req.includeTensions !== 'boolean') {
    throw new ValidationError('includeTensions must be a boolean');
  }

  // Validate numChords
  if (typeof req.numChords !== 'number' || !Number.isInteger(req.numChords)) {
    throw new ValidationError('numChords must be an integer');
  }
  if (req.numChords < 1 || req.numChords > 12) {
    throw new ValidationError('numChords must be between 1 and 12');
  }

  // Validate selectedProgression
  if (!req.selectedProgression || typeof req.selectedProgression !== 'string') {
    throw new ValidationError('Invalid or missing selectedProgression parameter');
  }
  if (req.selectedProgression.length > 100) {
    throw new ValidationError('selectedProgression must be 100 characters or less');
  }

  return {
    key: req.key,
    mode: req.mode,
    includeTensions: req.includeTensions,
    numChords: req.numChords,
    selectedProgression: req.selectedProgression,
  };
}

