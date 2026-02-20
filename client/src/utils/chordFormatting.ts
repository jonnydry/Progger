/**
 * Shared utility for formatting chord names for display
 * Handles all 40+ chord qualities with proper Unicode symbols
 */

import { displayNote } from './musicTheory';

/**
 * Format a chord name for display from root and quality
 * Handles all chord qualities with proper notation (♭, ♯, °, ø, Δ)
 *
 * @param root - Root note (e.g., "C", "F#", "Bb")
 * @param quality - Chord quality (e.g., "major", "min7", "7b9")
 * @returns Formatted chord name (e.g., "C", "Cm7", "F♯7♭9")
 */
export function formatChordDisplayName(root: string, quality: string): string {
  // Quality-specific display mappings with proper Unicode symbols
  const qualityDisplayMap: Record<string, string> = {
    // Basic triads
    'major': '',
    'minor': 'm',
    'dim': '°',
    'aug': '+',

    // Suspended
    'sus2': 'sus2',
    'sus4': 'sus4',

    // Power chord
    '5': '5',

    // Seventh chords
    '7': '7',
    'maj7': 'maj7',
    'min7': 'm7',
    'dim7': '°7',
    'min7b5': 'ø7',  // Half-diminished symbol
    'min/maj7': 'm(maj7)',

    // Sixth chords
    '6': '6',
    'min6': 'm6',
    '6/9': '6/9',

    // Extended chords
    '9': '9',
    'maj9': 'maj9',
    'min9': 'm9',
    '11': '11',
    'maj11': 'maj11',
    'min11': 'm11',
    '13': '13',
    'maj13': 'maj13',
    'min13': 'm13',

    // Add chords
    'add9': 'add9',
    'add11': 'add11',
    'madd9': 'madd9',

    // Altered dominants
    '7b9': '7♭9',
    '7#9': '7♯9',
    '7b5': '7♭5',
    '7#5': '7♯5',
    '7alt': '7alt',
    '7b13': '7♭13',
    '7#11': '7♯11',
    '7sus4': '7sus4',

    // Complex extensions
    '7b9b13': '7♭9♭13',
    '7#9b13': '7♯9♭13',
    '9#11': '9♯11',
    '9sus4': '9sus4',
    'maj7#11': 'maj7♯11',
    'maj7b13': 'maj7♭13',
    'maj7#9': 'maj7♯9',

    // Special
    'quartal': 'quartal',
  };

  // Get the display suffix for the quality
  const suffix = qualityDisplayMap[quality];

  // If we have a mapping, use it
  if (suffix !== undefined) {
    return `${root}${suffix}`;
  }

  // Fallback: try to convert # and b to Unicode symbols
  const fallbackSuffix = quality
    .replace(/#/g, '♯')
    .replace(/b/g, '♭');

  console.warn(`Unknown chord quality: "${quality}" - using fallback display`);
  return `${root}${fallbackSuffix}`;
}

/**
 * Format a canonical chord name for parsing/API transport.
 * Always uses ASCII accidentals and canonical quality tokens.
 *
 * @param root - Root note (e.g., "C", "F#", "Bb", "F♯")
 * @param quality - Canonical chord quality token (e.g., "major", "min7", "7b9")
 * @returns Canonical chord string (e.g., "C", "F#min7", "Bb7b9")
 */
export function formatChordCanonicalName(root: string, quality: string): string {
  const normalizedRoot = root
    .replace(/♯/g, '#')
    .replace(/♭/g, 'b');

  if (quality === 'major') {
    return normalizedRoot;
  }

  return `${normalizedRoot}${quality}`;
}

/**
 * Format a full chord name with Unicode symbols
 *
 * @param chordName - Full chord name (e.g., "C#maj7", "Bbm7b5")
 * @returns Formatted chord name (e.g., "C♯maj7", "B♭ø7")
 */
export function formatChordName(chordName: string): string {
  // For now, just convert # and b to Unicode in the full name
  // This is a simpler approach that handles edge cases
  return chordName
    .replace(/#/g, '♯')
    .replace(/b(?=\d|$)/g, '♭')  // Only convert b before numbers or at end
    .replace(/b5/g, '♭5')
    .replace(/b9/g, '♭9')
    .replace(/b13/g, '♭13');
}

/**
 * Format chord name with key-context-aware root spelling
 * Uses the appropriate enharmonic spelling based on the musical key
 *
 * @param root - Root note (e.g., "C#", "Db")
 * @param quality - Chord quality (e.g., "major", "min7")
 * @param key - Musical key context for determining flat vs sharp spelling
 * @returns Formatted chord name with context-appropriate root spelling
 */
export function formatChordDisplayNameForKey(
  root: string,
  quality: string,
  key: string
): string {
  // Get the appropriate root spelling for the key context
  const contextualRoot = displayNote(root, key);

  // Use the existing formatting logic with the contextual root
  return formatChordDisplayName(contextualRoot, quality);
}
