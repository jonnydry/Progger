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

    // Return basic fallback progression
    return {
      progression: [{
        chordName: 'Cmaj7',
        musicalFunction: 'tonic',
        relationToKey: 'I',
        voicings: [{ frets: ['x', 3, 2, 0, 0, 0], position: 'Open' }]
      }],
      scales: [{
        name: 'C major',
        rootNote: 'C',
        notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        fingering: [[8, 10, 12]]
      }]
    };
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
  async recover(key: string = 'C', numChords: number = 4) {
    const basicProgressions: Record<string, string[]> = {
      'C': ['Cmaj7', 'Dm7', 'G7', 'Cmaj7'],
      'Dmaj7': ['Dmaj7', 'Em7', 'A7', 'Dmaj7'],
      'Em': ['Em', 'F#dim', 'G', 'Am', 'Bm', 'C', 'D', 'Em'],
    };

    const chordNames = basicProgressions[key] || basicProgressions['C'];
    const { getChordVoicings } = await import('./chordLibrary');
    const { getScaleFingering, getScaleNotes } = await import('./scaleLibrary');

    return {
      progression: chordNames.slice(0, numChords).map(chordName => ({
        chordName,
        musicalFunction: 'progression',
        relationToKey: 'chord',
        voicings: getChordVoicings(chordName)
      })),
      scales: [{
        name: `${key} major`,
        rootNote: key,
        notes: getScaleNotes(key, 'major'),
        fingering: getScaleFingering('major', key)
      }]
    };
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
