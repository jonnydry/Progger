/**
 * Smart chord suggestion utilities for custom chord progressions
 * Implements context-aware defaults based on:
 * 1. Key detection from existing chords
 * 2. Common progression pattern recognition
 * 3. Last chord quality memory
 */

import { noteToValue, transposeNote, calculateSemitoneDistance } from './musicTheory';
import { ROOT_NOTES, CHORD_QUALITIES } from '@/constants';

export interface ChordInput {
  root: string;
  quality: string;
}

/**
 * Major and minor scale degree patterns
 * Each degree has typical chord qualities for that scale degree
 */
const MAJOR_SCALE_CHORDS = [
  ['major', 'maj7', '6', 'maj9', 'maj13', 'add9'], // I - tonic
  ['minor', 'min7', 'min9', 'min11'], // ii
  ['minor', 'min7', 'min9'], // iii
  ['major', 'maj7', '6', 'maj9'], // IV
  ['major', '7', '9', '13', '7sus4'], // V - dominant
  ['minor', 'min7', 'min9'], // vi
  ['dim', 'min7b5', 'dim7'], // vii°
];

const MINOR_SCALE_CHORDS = [
  ['minor', 'min7', 'min9', 'min11', 'min/maj7'], // i - tonic
  ['dim', 'min7b5'], // ii°
  ['major', 'maj7', 'maj9'], // III
  ['minor', 'min7', 'min9'], // iv
  ['minor', 'min7', '7'], // v (or V7 in harmonic minor)
  ['major', 'maj7'], // VI
  ['major', '7'], // VII
];

/**
 * Detect the most likely key from a set of chords
 * Uses a scoring system based on how well chords fit major/minor scale patterns
 */
export function detectKey(chords: ChordInput[]): { key: string; mode: 'major' | 'minor' } | null {
  if (chords.length === 0) return null;

  let bestScore = -1;
  let bestKey = 'C';
  let bestMode: 'major' | 'minor' = 'major';

  // Try each possible key (12 notes × 2 modes = 24 possibilities)
  for (const rootNote of ROOT_NOTES) {
    const rootValue = noteToValue(rootNote);

    // Try major mode
    const majorScore = scoreKeyFit(chords, rootNote, rootValue, 'major');
    if (majorScore > bestScore) {
      bestScore = majorScore;
      bestKey = rootNote;
      bestMode = 'major';
    }

    // Try minor mode
    const minorScore = scoreKeyFit(chords, rootNote, rootValue, 'minor');
    if (minorScore > bestScore) {
      bestScore = minorScore;
      bestKey = rootNote;
      bestMode = 'minor';
    }
  }

  // Only return a key if we have reasonable confidence (score > 0)
  return bestScore > 0 ? { key: bestKey, mode: bestMode } : null;
}

/**
 * Score how well a set of chords fits a particular key
 */
function scoreKeyFit(
  chords: ChordInput[],
  keyRoot: string,
  keyRootValue: number,
  mode: 'major' | 'minor'
): number {
  let score = 0;
  const scalePattern = mode === 'major' ? MAJOR_SCALE_CHORDS : MINOR_SCALE_CHORDS;
  const scaleIntervals = mode === 'major'
    ? [0, 2, 4, 5, 7, 9, 11] // Major scale intervals
    : [0, 2, 3, 5, 7, 8, 10]; // Natural minor scale intervals

  for (const chord of chords) {
    const chordRootValue = noteToValue(chord.root);
    const interval = (chordRootValue - keyRootValue + 12) % 12;

    // Check if this chord root is in the scale
    const degreeIndex = scaleIntervals.indexOf(interval);
    if (degreeIndex === -1) {
      // Chord root not in scale - small penalty
      score -= 1;
      continue;
    }

    // Check if the chord quality matches expected qualities for this scale degree
    const expectedQualities = scalePattern[degreeIndex];
    if (expectedQualities.includes(chord.quality)) {
      // Perfect match - strong positive score
      score += 3;
    } else if (isCompatibleQuality(chord.quality, expectedQualities)) {
      // Compatible quality (e.g., 'major' vs 'maj7') - moderate score
      score += 1;
    } else {
      // Unexpected quality for this scale degree - small penalty
      score -= 0.5;
    }
  }

  return score;
}

/**
 * Check if a chord quality is compatible with expected qualities
 * (e.g., 'major' is compatible with 'maj7', 'minor' with 'min7')
 */
function isCompatibleQuality(quality: string, expectedQualities: string[]): boolean {
  // Basic quality compatibility groups
  const qualityGroups = [
    ['major', 'maj7', 'maj9', 'maj11', 'maj13', '6', '6/9', 'add9', 'maj7#11'],
    ['minor', 'min7', 'min9', 'min11', 'min13', 'min6', 'madd9'],
    ['7', '9', '11', '13', '7sus4', '7b9', '7#9', '7b5', '7#5', '7alt'],
    ['dim', 'dim7', 'min7b5'],
    ['sus2', 'sus4', '9sus4'],
    ['aug', '7#5'],
  ];

  for (const group of qualityGroups) {
    if (group.includes(quality)) {
      return expectedQualities.some(eq => group.includes(eq));
    }
  }

  return false;
}

/**
 * Common progression patterns and their next chord suggestions
 * Format: [pattern, suggested next chord degree in major/minor]
 */
const COMMON_PATTERNS = [
  // Major key patterns
  { pattern: [0, 7, 9], next: 5, mode: 'major' as const }, // I-V-vi → IV
  { pattern: [0, 5, 7], next: 0, mode: 'major' as const }, // I-IV-V → I
  { pattern: [7, 5, 0], next: 7, mode: 'major' as const }, // V-IV-I → V (cycle)
  { pattern: [9, 5, 0], next: 7, mode: 'major' as const }, // vi-IV-I → V
  { pattern: [2, 7], next: 0, mode: 'major' as const }, // ii-V → I (jazz)
  { pattern: [0, 9, 2], next: 7, mode: 'major' as const }, // I-vi-ii → V (rhythm changes)

  // Minor key patterns
  { pattern: [0, 10, 8], next: 10, mode: 'minor' as const }, // i-VII-VI → VII (Andalusian)
  { pattern: [0, 8, 10], next: 7, mode: 'minor' as const }, // i-VI-VII → V (minor descent)
  { pattern: [2, 7], next: 0, mode: 'minor' as const }, // ii°-V → i (minor jazz)
];

/**
 * Suggest the next chord based on detected key and progression patterns
 */
export function suggestNextChord(
  existingChords: ChordInput[],
  detectedKey?: { key: string; mode: 'major' | 'minor' } | null
): ChordInput {
  if (existingChords.length === 0) {
    return { root: 'C', quality: 'major' };
  }

  // If no key detected, use last chord's quality as a starting point
  const lastChord = existingChords[existingChords.length - 1];
  if (!detectedKey) {
    return { root: 'C', quality: lastChord.quality };
  }

  const keyRootValue = noteToValue(detectedKey.key);

  // Convert existing chords to intervals relative to the key
  const intervals = existingChords.map(chord => {
    const chordValue = noteToValue(chord.root);
    return (chordValue - keyRootValue + 12) % 12;
  });

  // Check for matching patterns (look at last 2-3 chords)
  for (const { pattern, next, mode } of COMMON_PATTERNS) {
    if (mode !== detectedKey.mode) continue;

    const recentIntervals = intervals.slice(-pattern.length);
    if (arraysEqual(recentIntervals, pattern)) {
      // Found a matching pattern! Suggest the next chord
      const nextRoot = transposeNote(detectedKey.key, next);
      const nextQuality = suggestQualityForDegree(next, detectedKey.mode);
      return { root: nextRoot, quality: nextQuality };
    }
  }

  // No pattern match - suggest dominant (V) chord as it commonly follows many progressions
  const dominantInterval = 7; // Perfect 5th
  const dominantRoot = transposeNote(detectedKey.key, dominantInterval);
  const dominantQuality = detectedKey.mode === 'major' ? '7' : '7';

  return { root: dominantRoot, quality: dominantQuality };
}

/**
 * Suggest appropriate chord quality for a scale degree
 */
function suggestQualityForDegree(interval: number, mode: 'major' | 'minor'): string {
  const scalePattern = mode === 'major' ? MAJOR_SCALE_CHORDS : MINOR_SCALE_CHORDS;
  const scaleIntervals = mode === 'major'
    ? [0, 2, 4, 5, 7, 9, 11]
    : [0, 2, 3, 5, 7, 8, 10];

  const degreeIndex = scaleIntervals.indexOf(interval);
  if (degreeIndex === -1) return 'major'; // Fallback

  // Return the most common quality for this degree
  const qualities = scalePattern[degreeIndex];
  return qualities[0] || 'major';
}

/**
 * Get smart default chord when expanding progression
 * Priority:
 * 1. Common progression pattern (if detected)
 * 2. Key-appropriate dominant chord (V)
 * 3. Last chord's quality
 */
export function getSmartDefaultChord(existingChords: ChordInput[]): ChordInput {
  if (existingChords.length === 0) {
    return { root: 'C', quality: 'major' };
  }

  // Detect key from existing chords
  const detectedKey = detectKey(existingChords);

  // Suggest next chord based on patterns and key
  return suggestNextChord(existingChords, detectedKey);
}

/**
 * Helper to compare arrays for equality
 */
function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, idx) => val === b[idx]);
}
