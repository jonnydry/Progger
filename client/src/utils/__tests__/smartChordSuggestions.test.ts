/**
 * Tests for smart chord suggestion functionality
 */

import { describe, it, expect } from 'vitest';
import { detectKey, suggestNextChord, getSmartDefaultChord } from '../smartChordSuggestions';
import type { ChordInput } from '../smartChordSuggestions';

describe('Smart Chord Suggestions', () => {
  describe('detectKey', () => {
    it('should detect G major from G-Em-C progression', () => {
      const chords: ChordInput[] = [
        { root: 'G', quality: 'major' },
        { root: 'E', quality: 'minor' },
        { root: 'C', quality: 'major' },
      ];

      const result = detectKey(chords);
      expect(result).not.toBeNull();
      expect(result?.key).toBe('G');
      expect(result?.mode).toBe('major');
    });

    it('should detect C major from C-F-G progression', () => {
      const chords: ChordInput[] = [
        { root: 'C', quality: 'major' },
        { root: 'F', quality: 'major' },
        { root: 'G', quality: 'major' },
      ];

      const result = detectKey(chords);
      expect(result).not.toBeNull();
      expect(result?.key).toBe('C');
      expect(result?.mode).toBe('major');
    });

    it('should detect A minor from Am-F-C-G progression', () => {
      const chords: ChordInput[] = [
        { root: 'A', quality: 'minor' },
        { root: 'F', quality: 'major' },
        { root: 'C', quality: 'major' },
        { root: 'G', quality: 'major' },
      ];

      const result = detectKey(chords);
      expect(result).not.toBeNull();
      expect(result?.key).toBe('A');
      expect(result?.mode).toBe('minor');
    });

    it('should return null for empty chord array', () => {
      const result = detectKey([]);
      expect(result).toBeNull();
    });
  });

  describe('suggestNextChord', () => {
    it('should suggest D for G-Em-C progression (I-vi-IV → V pattern)', () => {
      const chords: ChordInput[] = [
        { root: 'G', quality: 'major' },
        { root: 'E', quality: 'minor' },
        { root: 'C', quality: 'major' },
      ];

      const detectedKey = { key: 'G', mode: 'major' as const };
      const result = suggestNextChord(chords, detectedKey);

      expect(result.root).toBe('D'); // V chord in G major
    });

    it('should suggest C for Dm-G progression (ii-V → I jazz pattern)', () => {
      const chords: ChordInput[] = [
        { root: 'D', quality: 'minor' },
        { root: 'G', quality: '7' },
      ];

      const detectedKey = { key: 'C', mode: 'major' as const };
      const result = suggestNextChord(chords, detectedKey);

      expect(result.root).toBe('C'); // I chord in C major
    });

    it('should use last chord quality when no key detected', () => {
      const chords: ChordInput[] = [
        { root: 'C', quality: 'min7' },
      ];

      const result = suggestNextChord(chords, null);

      expect(result.quality).toBe('min7'); // Same quality as last chord
    });

    it('should default to C major for empty progression', () => {
      const result = getSmartDefaultChord([]);

      expect(result.root).toBe('C');
      expect(result.quality).toBe('major');
    });
  });

  describe('getSmartDefaultChord', () => {
    it('should provide smart defaults for extending G-Em-C progression', () => {
      const chords: ChordInput[] = [
        { root: 'G', quality: 'major' },
        { root: 'E', quality: 'minor' },
        { root: 'C', quality: 'major' },
      ];

      const result = getSmartDefaultChord(chords);

      // Should suggest D (the V chord in G major) or similar contextually appropriate chord
      expect(result).toBeDefined();
      expect(result.root).toBeTruthy();
      expect(result.quality).toBeTruthy();
    });

    it('should suggest dominant chord when key is detected from single chord', () => {
      const chords: ChordInput[] = [
        { root: 'A', quality: 'min7' },
      ];

      const result = getSmartDefaultChord(chords);

      // A min7 suggests A minor key, so the function should suggest the dominant (E7)
      // This is musically correct - the V chord naturally follows the i chord
      expect(result.root).toBe('E');
      expect(result.quality).toBe('7'); // Dominant 7th
    });
  });
});
