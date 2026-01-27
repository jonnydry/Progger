/**
 * Enhanced Error Classification System
 * Provides specific error types with targeted recovery strategies
 */

import type { ChordVoicing } from '../types';

// Base error class for music theory operations
export class MusicTheoryError extends Error {
  constructor(message: string, public readonly operation: string) {
    super(message);
    this.name = 'MusicTheoryError';
  }
}

// Specific chord-related errors
export class ChordNotFoundError extends MusicTheoryError {
  constructor(
    public readonly chordName: string,
    suggestions: string[] = []
  ) {
    super(
      `Chord "${chordName}" not found in library${suggestions.length > 0 ? `. Similar chords: ${suggestions.join(', ')}` : ''}`,
      'chord_lookup'
    );
    this.name = 'ChordNotFoundError';
  }

  // Recovery strategy: Try similar chords via async API
  async recover(): Promise<ChordVoicing[]> {
    const { getChordVoicingsAsync } = await import('./chords/index');
    return getChordVoicingsAsync(this.chordName);
  }
}

export class ChordParseError extends MusicTheoryError {
  constructor(
    public readonly chordString: string,
    public readonly parseError: string
  ) {
    super(`Cannot parse chord "${chordString}": ${parseError}`, 'chord_parsing');
    this.name = 'ChordParseError';
  }

  // Recovery strategy: Try basic triad
  async recover(): Promise<ChordVoicing[]> {
    // Extract root note from malformed chord
    const rootMatch = this.chordString.match(/^([A-G][#b]?)/i);
    const root = rootMatch ? rootMatch[1] : 'C';
    const { getChordVoicingsAsync } = await import('./chords/index');
    return getChordVoicingsAsync(`${root}major`);
  }
}

// Specific scale-related errors
export class ScaleNotSupportedError extends MusicTheoryError {
  constructor(
    public readonly scaleName: string,
    public readonly rootNote: string,
    availableScales: string[] = []
  ) {
    super(
      `Scale "${scaleName}" with root "${rootNote}" not supported${availableScales.length > 0 ? `. Available: ${availableScales.join(', ')}` : ''}`,
      'scale_generation'
    );
    this.name = 'ScaleNotSupportedError';
  }

  // Recovery strategy: Find closest supported scale
  async recover() {
    const { SCALE_LIBRARY } = await import('./scaleLibrary');
    const scaleNames = Object.keys(SCALE_LIBRARY);
    return scaleNames.find(scale =>
      scale.toLowerCase().includes('major') || scale.toLowerCase().includes('minor')
    ) || 'major';
  }
}

export class ScaleFingeringError extends MusicTheoryError {
  constructor(
    public readonly scaleName: string,
    public readonly rootNote: string,
    public readonly fingeringError: string
  ) {
    super(`Cannot generate fingering for scale "${scaleName}" (${rootNote}): ${fingeringError}`, 'scale_fingering');
    this.name = 'ScaleFingeringError';
  }

  // Recovery strategy: Return basic C major fingering
  async recover() {
    return {
      name: 'C major',
      rootNote: 'C',
      notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      fingering: [[8, 10, 12], [8, 10, 12], [9, 10, 12], [9, 10, 12], [10, 12, 13], [8, 10, 12]]
    };
  }
}

// Network and API errors
export class APIUnavailableError extends MusicTheoryError {
  constructor(
    public readonly endpoint: string,
    public readonly statusCode?: number
  ) {
    super(
      `API endpoint "${endpoint}" unavailable${statusCode ? ` (status: ${statusCode})` : ''}`,
      'api_call'
    );
    this.name = 'APIUnavailableError';
  }

  // Recovery strategy: Serve from cache if available
  async recover(cacheKey?: string) {
    if (cacheKey) {
      // Try to get from localStorage cache
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          return JSON.parse(cached).data;
        }
      } catch (error) {
        console.warn('Failed to recover from cache:', error);
      }
    }

    const { key, mode, numChords } = deriveFallbackParameters(cacheKey);
    return buildLocalFallbackProgression(key, numChords, mode);
  }
}

export class InvalidAPIResponseError extends MusicTheoryError {
  constructor(
    public readonly expectedFormat: string,
    public readonly receivedData: unknown
  ) {
    super(
      `Invalid API response format. Expected: ${expectedFormat}`,
      'api_validation'
    );
    this.name = 'InvalidAPIResponseError';
  }

  // Recovery strategy: Generate basic progression locally
  async recover(key: string = 'C', numChords: number = 4, mode: string = 'major') {
    return buildLocalFallbackProgression(key, numChords, mode);
  }
}

// Processing pipeline errors
export class ProcessingPipelineError extends MusicTheoryError {
  constructor(
    public readonly stage: 'chord_processing' | 'scale_processing' | 'validation',
    public readonly failedItems: string[],
    public readonly successCount: number
  ) {
    super(
      `Processing pipeline failed at stage "${stage}". ${failedItems.length} items failed, ${successCount} succeeded.`,
      'pipeline_processing'
    );
    this.name = 'ProcessingPipelineError';
  }

  // Recovery strategy: Return partial results
  async recover(successfulResults: unknown[]) {
    console.warn(`🔄 Processing pipeline error - returning ${successfulResults.length} successful results`);
    return successfulResults;
  }
}

// Utility functions for error handling
export function isRecoverableError(error: Error): error is MusicTheoryError & { recover: () => Promise<unknown> } {
  return error instanceof MusicTheoryError && 'recover' in error && typeof error.recover === 'function';
}

export function getErrorSeverity(error: Error): 'low' | 'medium' | 'high' {
  if (error instanceof APIUnavailableError || error instanceof InvalidAPIResponseError) {
    return 'high'; // System-level failures
  }
  if (error instanceof ChordNotFoundError || error instanceof ScaleNotSupportedError) {
    return 'low'; // Expected data issues with fallbacks
  }
  return 'medium'; // Other processing errors
}

export function createErrorLog(error: Error, context?: Record<string, any>): string {
  const logData = {
    name: error.name,
    message: error.message,
    timestamp: new Date().toISOString(),
    severity: getErrorSeverity(error),
    recoverable: isRecoverableError(error),
    context
  };

  return JSON.stringify(logData, null, 2);
}

function deriveFallbackParameters(cacheKey?: string): { key: string; mode: string; numChords: number } {
  const defaults = { key: 'C', mode: 'major', numChords: 4 };
  if (!cacheKey) {
    return defaults;
  }

  const parts = cacheKey.split(':');
  if (parts.length < 5) {
    return defaults;
  }

  const rawKey = parts[1];
  const rawMode = parts[2] || 'major';
  const parsedNumChords = parseInt(parts[4], 10);

  return {
    key: formatKeyToken(rawKey),
    mode: normalizeMode(rawMode),
    numChords: Number.isFinite(parsedNumChords) ? parsedNumChords : defaults.numChords
  };
}

function formatKeyToken(raw: string): string {
  if (!raw) return 'C';
  const upper = raw.toUpperCase();
  if (upper.length === 1) {
    return upper;
  }

  const first = upper.charAt(0);
  const rest = upper.slice(1);

  if (rest === '#') return `${first}#`;
  if (rest === 'B') return `${first}b`;

  return first + rest.toLowerCase();
}

async function buildLocalFallbackProgression(key: string, numChords: number, mode: string = 'ionian') {
  // Diatonic chord qualities for each mode (I through VII)
  // Each mode uses specific chord qualities based on its scale degrees
  // All seven modes share the same diatonic 7th chord pattern (rotated from Ionian):
  // Ionian chord pattern: maj7, m7, m7, maj7, 7, m7, m7b5
  // Each mode is the same pattern starting from a different degree
  const modeChordQualities: Record<string, string[]> = {
    // Ionian (I): maj7-m7-m7-maj7-7-m7-m7b5
    'ionian': ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7b5'],
    // Dorian (II): m7-m7-maj7-7-m7-m7b5-maj7
    'dorian': ['m7', 'm7', 'maj7', '7', 'm7', 'm7b5', 'maj7'],
    // Phrygian (III): m7-maj7-7-m7-m7b5-maj7-m7
    'phrygian': ['m7', 'maj7', '7', 'm7', 'm7b5', 'maj7', 'm7'],
    // Lydian (IV): maj7-7-m7-m7b5-maj7-m7-m7
    'lydian': ['maj7', '7', 'm7', 'm7b5', 'maj7', 'm7', 'm7'],
    // Mixolydian (V): 7-m7-m7b5-maj7-m7-m7-maj7
    'mixolydian': ['7', 'm7', 'm7b5', 'maj7', 'm7', 'm7', 'maj7'],
    // Aeolian (VI): m7-m7b5-maj7-m7-m7-maj7-7
    'aeolian': ['m7', 'm7b5', 'maj7', 'm7', 'm7', 'maj7', '7'],
    // Locrian (VII): m7b5-maj7-m7-m7-maj7-7-m7
    'locrian': ['m7b5', 'maj7', 'm7', 'm7', 'maj7', '7', 'm7']
  };

  // Mode scale intervals (semitones from root for each degree)
  const modeIntervals: Record<string, number[]> = {
    'ionian': [0, 2, 4, 5, 7, 9, 11],
    'dorian': [0, 2, 3, 5, 7, 9, 10],
    'phrygian': [0, 1, 3, 5, 7, 8, 10],
    'lydian': [0, 2, 4, 6, 7, 9, 11],
    'mixolydian': [0, 2, 4, 5, 7, 9, 10],
    'aeolian': [0, 2, 3, 5, 7, 8, 10],
    'locrian': [0, 1, 3, 5, 6, 8, 10]
  };

  // Characteristic progression patterns for each mode (scale degree indices 0-6)
  const modeProgressionPatterns: Record<string, number[]> = {
    'ionian': [0, 5, 3, 4, 1, 2, 0],      // I-vi-IV-V-ii-iii-I
    'dorian': [0, 3, 6, 4, 0, 3, 0],      // i-IV-bVII-v-i-IV-i (highlight major IV)
    'phrygian': [0, 1, 0, 3, 5, 1, 0],    // i-bII-i-iv-bVI-bII-i (highlight bII)
    'lydian': [0, 1, 4, 5, 0, 1, 0],      // I-II-V-vi-I-II-I (highlight II major)
    'mixolydian': [0, 6, 3, 4, 0, 6, 0],  // I-bVII-IV-v-I-bVII-I (highlight bVII)
    'aeolian': [0, 3, 6, 5, 4, 0, 3],     // i-iv-bVII-bVI-v-i-iv
    'locrian': [0, 1, 4, 5, 1, 0, 1]      // i°-bII-bV-bVI-bII-i°-bII
  };
  
  // Map mode names to scale library names
  const scaleNameMap: Record<string, string> = {
    'ionian': 'major',
    'dorian': 'dorian',
    'phrygian': 'phrygian',
    'lydian': 'lydian',
    'mixolydian': 'mixolydian',
    'aeolian': 'minor',
    'locrian': 'locrian'
  };

  const normalizedMode = mode.toLowerCase();
  const qualities = modeChordQualities[normalizedMode] || modeChordQualities['ionian'];
  const intervals = modeIntervals[normalizedMode] || modeIntervals['ionian'];
  const pattern = modeProgressionPatterns[normalizedMode] || modeProgressionPatterns['ionian'];
  
  // Build chord names from pattern
  const chordNames = pattern.map(degreeIndex => {
    const semitones = intervals[degreeIndex];
    const root = getRelativeNote(key, semitones);
    const quality = qualities[degreeIndex];
    return `${root}${quality}`;
  });
  
  const { getChordVoicingsAsync } = await import('./chords/index');
  const { getScaleFingering, getScaleNotes } = await import('./scaleLibrary');

  const scaleName = scaleNameMap[normalizedMode] || 'major';

  // Load voicings for all chords in parallel
  const voicingsPromises = chordNames.slice(0, numChords).map(chordName => 
    getChordVoicingsAsync(chordName)
  );
  const voicingsArrays = await Promise.all(voicingsPromises);

  return {
    progression: chordNames.slice(0, numChords).map((chordName, index) => ({
      chordName,
      musicalFunction: 'progression',
      relationToKey: 'chord',
      voicings: voicingsArrays[index]
    })),
    scales: [{
      name: `${key} ${scaleName}`,
      rootNote: key,
      notes: getScaleNotes(key, scaleName),
      fingering: getScaleFingering(scaleName, key)
    }]
  };
}

// Helper to get a note relative to root by semitones (with enharmonic normalization)
function getRelativeNote(root: string, semitones: number): string {
  // Use sharps for sharp keys, flats for flat keys
  const sharpNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const flatNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  
  // Determine if root is a flat key
  const flatKeys = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];
  const useFlats = flatKeys.includes(root) || root.includes('b');
  
  const noteOrder = useFlats ? flatNotes : sharpNotes;
  
  // Normalize root for lookup
  const enharmonicMap: Record<string, string> = {
    'Db': 'C#', 'Eb': 'D#', 'Fb': 'E', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#', 'Cb': 'B',
    'C#': 'C#', 'D#': 'D#', 'F#': 'F#', 'G#': 'G#', 'A#': 'A#'
  };
  
  const normalizedRoot = enharmonicMap[root] || root;
  const lookupNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const rootIndex = lookupNotes.indexOf(normalizedRoot);
  if (rootIndex === -1) return root;
  
  const targetIndex = (rootIndex + semitones) % 12;
  return noteOrder[targetIndex];
}

function normalizeMode(mode: string): string {
  const normalized = mode.toLowerCase();
  
  // Handle full mode names (e.g., "Ionian (Major)" -> "ionian")
  const modeMap: Record<string, string> = {
    'ionian': 'ionian',
    'dorian': 'dorian',
    'phrygian': 'phrygian',
    'lydian': 'lydian',
    'mixolydian': 'mixolydian',
    'aeolian': 'aeolian',
    'locrian': 'locrian',
    'major': 'ionian',
    'minor': 'aeolian',
    'natural minor': 'aeolian'
  };
  
  // Check for mode keywords in the string
  for (const [keyword, modeName] of Object.entries(modeMap)) {
    if (normalized.includes(keyword)) {
      return modeName;
    }
  }
  
  // Default to ionian/major if no match
  return 'ionian';
}

