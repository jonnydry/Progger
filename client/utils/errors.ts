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

  // Recovery strategy: Try similar chords
  async recover(): Promise<ChordVoicing[]> {
    const { findClosestChordVoicings } = await import('./chordLibrary');
    return findClosestChordVoicings(this.chordName);
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
    const { getChordVoicings } = await import('./chordLibrary');
    return getChordVoicings(`${root}major`);
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
    public readonly receivedData: any
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
  async recover(successfulResults: any[]) {
    console.warn(`🔄 Processing pipeline error - returning ${successfulResults.length} successful results`);
    return successfulResults;
  }
}

// Utility functions for error handling
export function isRecoverableError(error: Error): error is MusicTheoryError & { recover: () => Promise<any> } {
  return error instanceof MusicTheoryError && 'recover' in error && typeof (error as any).recover === 'function';
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

async function buildLocalFallbackProgression(key: string, numChords: number, mode: string = 'major') {
  const majorProgressions: Record<string, string[]> = {
    'C': ['Cmaj7', 'Dm7', 'G7', 'Cmaj7'],
    'Db': ['Dbmaj7', 'Ebm7', 'Ab7', 'Dbmaj7'],
    'D': ['Dmaj7', 'Em7', 'A7', 'Dmaj7'],
    'Eb': ['Ebmaj7', 'Fm7', 'Bb7', 'Ebmaj7'],
    'E': ['Emaj7', 'F#m7', 'B7', 'Emaj7'],
    'F': ['Fmaj7', 'Gm7', 'C7', 'Fmaj7'],
    'Gb': ['Gbmaj7', 'Abm7', 'Db7', 'Gbmaj7'],
    'G': ['Gmaj7', 'Am7', 'D7', 'Gmaj7'],
    'Ab': ['Abmaj7', 'Bbm7', 'Eb7', 'Abmaj7'],
    'A': ['Amaj7', 'Bm7', 'E7', 'Amaj7'],
    'Bb': ['Bbmaj7', 'Cm7', 'F7', 'Bbmaj7'],
    'B': ['Bmaj7', 'C#m7', 'F#7', 'Bmaj7']
  };

  const minorProgressions: Record<string, string[]> = {
    'C': ['Cm7', 'Fm7', 'G7', 'Cm7'],
    'C#': ['C#m7', 'F#m7', 'G#7', 'C#m7'],
    'Db': ['Dbm7', 'Gbm7', 'Ab7', 'Dbm7'],
    'D': ['Dm7', 'Gm7', 'A7', 'Dm7'],
    'Eb': ['Ebm7', 'Abm7', 'Bb7', 'Ebm7'],
    'E': ['Em7', 'Am7', 'B7', 'Em7'],
    'F': ['Fm7', 'Bbm7', 'C7', 'Fm7'],
    'F#': ['F#m7', 'Bm7', 'C#7', 'F#m7'],
    'G': ['Gm7', 'Cm7', 'D7', 'Gm7'],
    'Ab': ['Abm7', 'Dbm7', 'Eb7', 'Abm7'],
    'A': ['Am7', 'Dm7', 'E7', 'Am7'],
    'Bb': ['Bbm7', 'Ebm7', 'F7', 'Bbm7'],
    'B': ['Bm7', 'Em7', 'F#7', 'Bm7']
  };

  const source = mode === 'minor' ? minorProgressions : majorProgressions;
  const normalizedKey = resolveEnharmonicKey(key, source);
  const chordNames = source[normalizedKey];
  const { getChordVoicings } = await import('./chordLibrary');
  const { getScaleFingering, getScaleNotes } = await import('./scaleLibrary');

  const scaleMode = mode === 'minor' ? 'minor' : 'major';

  return {
    progression: chordNames.slice(0, numChords).map(chordName => ({
      chordName,
      musicalFunction: 'progression',
      relationToKey: 'chord',
      voicings: getChordVoicings(chordName)
    })),
    scales: [{
      name: `${normalizedKey} ${scaleMode}`,
      rootNote: normalizedKey,
      notes: getScaleNotes(normalizedKey, scaleMode),
      fingering: getScaleFingering(scaleMode, normalizedKey)
    }]
  };
}

function normalizeMode(mode: string): string {
  const normalized = mode.toLowerCase();
  if (normalized.includes('min')) {
    return 'minor';
  }
  return 'major';
}

function resolveEnharmonicKey(key: string, source: Record<string, string[]>): string {
  if (source[key]) {
    return key;
  }

  const enharmonicMap: Record<string, string> = {
    'C#': 'Db',
    'D#': 'Eb',
    'F#': 'Gb',
    'G#': 'Ab',
    'A#': 'Bb',
    'Cb': 'B',
    'B#': 'C',
    'E#': 'F',
    'Fb': 'E'
  };

  const mapped = enharmonicMap[key];
  if (mapped && source[mapped]) {
    return mapped;
  }

  return 'C';
}
