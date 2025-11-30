import { describe, it, expect } from 'vitest';
import {
  getChordVoicingsAsync,
  isMutedVoicing,
  normalizeRoot,
} from '@/utils/chords/index';
import {
  validateVoicingFormat,
  validateChordLibrary,
} from '@/utils/chordLibrary';
import type { ChordVoicing } from '@/types';

describe('chordLibrary (Async API)', () => {
  describe('getChordVoicingsAsync', () => {
    it('should return voicings for common chords', async () => {
      const cMajor = await getChordVoicingsAsync('C');
      expect(cMajor).toBeDefined();
      expect(cMajor.length).toBeGreaterThan(0);
      expect(cMajor[0]).toHaveProperty('frets');
      expect(cMajor[0]).toHaveProperty('position');
    });

    it('should handle major chords', async () => {
      const gMajor = await getChordVoicingsAsync('G');
      expect(gMajor.length).toBeGreaterThan(0);
    });

    it('should handle minor chords', async () => {
      const am = await getChordVoicingsAsync('Am');
      expect(am.length).toBeGreaterThan(0);
    });

    it('should handle 7th chords', async () => {
      const c7 = await getChordVoicingsAsync('C7');
      expect(c7.length).toBeGreaterThan(0);
    });

    it('should handle maj7 chords', async () => {
      const cmaj7 = await getChordVoicingsAsync('Cmaj7');
      expect(cmaj7.length).toBeGreaterThan(0);
    });

    it('should handle min7 chords', async () => {
      const am7 = await getChordVoicingsAsync('Am7');
      expect(am7.length).toBeGreaterThan(0);
    });

    it('should handle sus2 and sus4 chords', async () => {
      const csus2 = await getChordVoicingsAsync('Csus2');
      const csus4 = await getChordVoicingsAsync('Csus4');
      expect(csus2.length).toBeGreaterThan(0);
      expect(csus4.length).toBeGreaterThan(0);
    });

    it('should handle chords with sharps', async () => {
      const cSharp = await getChordVoicingsAsync('C#');
      expect(cSharp.length).toBeGreaterThan(0);
    });

    it('should handle chords with flats', async () => {
      const bb = await getChordVoicingsAsync('Bb');
      expect(bb.length).toBeGreaterThan(0);
    });

    it('should handle complex dominant alterations', async () => {
      const altered = await getChordVoicingsAsync('C7#9b13');
      expect(altered.length).toBeGreaterThan(0);
    });

    it('should handle slash chord voicings', async () => {
      const slash = await getChordVoicingsAsync('F#m7b5/A');
      expect(slash.length).toBeGreaterThan(0);
    });

    it('should return fallback voicings for unknown chords', async () => {
      const unknown = await getChordVoicingsAsync('Xmaj13#11');
      expect(unknown.length).toBeGreaterThan(0);
    });

    it('should use mathematical transposition for missing chords', async () => {
      // Test transposition fallback - try a chord that might not exist in all roots
      const transposed = await getChordVoicingsAsync('D#maj7');
      expect(transposed.length).toBeGreaterThan(0);
    });
  });

  describe('isMutedVoicing', () => {
    it('should identify muted voicings', () => {
      const muted: ChordVoicing = {
        frets: ['x', 'x', 'x', 'x', 'x', 'x'],
        position: 'Muted',
      };
      expect(isMutedVoicing(muted)).toBe(true);
    });

    it('should identify non-muted voicings', () => {
      const normal: ChordVoicing = {
        frets: ['x', 3, 2, 0, 1, 0],
        position: 'Open',
      };
      expect(isMutedVoicing(normal)).toBe(false);
    });

    it('should handle partial muted voicings', () => {
      const partial: ChordVoicing = {
        frets: ['x', 3, 2, 0, 'x', 'x'],
        position: 'Partial',
      };
      expect(isMutedVoicing(partial)).toBe(false);
    });
  });

  describe('validateVoicingFormat', () => {
    it('should validate correct voicing format', () => {
      const voicing: ChordVoicing = {
        frets: ['x', 3, 2, 0, 1, 0],
        position: 'Open',
      };
      expect(validateVoicingFormat(voicing, 'C')).toBe(true);
    });

    it('should validate voicings with firstFret', () => {
      const voicing: ChordVoicing = {
        frets: [1, 3, 3, 2, 1, 1],
        firstFret: 8,
        position: 'Barre 8th',
      };
      expect(validateVoicingFormat(voicing, 'C')).toBe(true);
    });

    it('should reject voicings with invalid fret count', () => {
      const voicing: ChordVoicing = {
        frets: [1, 3, 2], // Too few frets
        position: 'Invalid',
      };
      expect(validateVoicingFormat(voicing, 'C')).toBe(false);
    });
  });

  describe('validateChordLibrary', () => {
    it('should validate the entire chord library without errors', () => {
      expect(() => validateChordLibrary()).not.toThrow();
    });
  });

  describe('normalizeRoot', () => {
    it('should map enharmonic equivalents to primary spelling', () => {
      // Async API maps to primary spelling (sharp notation)
      expect(normalizeRoot('Db')).toBe('C#');
      expect(normalizeRoot('Eb')).toBe('D#');
      expect(normalizeRoot('Gb')).toBe('F#');
      expect(normalizeRoot('Ab')).toBe('G#');
      expect(normalizeRoot('Bb')).toBe('A#');
      // Sharps stay as sharps
      expect(normalizeRoot('C#')).toBe('C#');
      expect(normalizeRoot('A#')).toBe('A#');
    });
  });
});

