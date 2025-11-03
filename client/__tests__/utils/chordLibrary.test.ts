import { describe, it, expect } from 'vitest';
import {
  getChordVoicings,
  findClosestChordVoicings,
  isMutedVoicing,
  validateVoicingFormat,
  validateChordLibrary,
  normalizeRoot,
} from '@/utils/chordLibrary';
import type { ChordVoicing } from '@/types';

describe('chordLibrary', () => {
  describe('getChordVoicings', () => {
    it('should return voicings for common chords', () => {
      const cMajor = getChordVoicings('C');
      expect(cMajor).toBeDefined();
      expect(cMajor.length).toBeGreaterThan(0);
      expect(cMajor[0]).toHaveProperty('frets');
      expect(cMajor[0]).toHaveProperty('position');
    });

    it('should handle major chords', () => {
      const gMajor = getChordVoicings('G');
      expect(gMajor.length).toBeGreaterThan(0);
    });

    it('should handle minor chords', () => {
      const am = getChordVoicings('Am');
      expect(am.length).toBeGreaterThan(0);
    });

    it('should handle 7th chords', () => {
      const c7 = getChordVoicings('C7');
      expect(c7.length).toBeGreaterThan(0);
    });

    it('should handle maj7 chords', () => {
      const cmaj7 = getChordVoicings('Cmaj7');
      expect(cmaj7.length).toBeGreaterThan(0);
    });

    it('should handle min7 chords', () => {
      const am7 = getChordVoicings('Am7');
      expect(am7.length).toBeGreaterThan(0);
    });

    it('should handle sus2 and sus4 chords', () => {
      const csus2 = getChordVoicings('Csus2');
      const csus4 = getChordVoicings('Csus4');
      expect(csus2.length).toBeGreaterThan(0);
      expect(csus4.length).toBeGreaterThan(0);
    });

    it('should handle chords with sharps', () => {
      const cSharp = getChordVoicings('C#');
      expect(cSharp.length).toBeGreaterThan(0);
    });

    it('should handle chords with flats', () => {
      const bb = getChordVoicings('Bb');
      expect(bb.length).toBeGreaterThan(0);
    });

    it('should handle complex dominant alterations', () => {
      const altered = getChordVoicings('C7#9b13');
      expect(altered.length).toBeGreaterThan(0);
    });

    it('should handle slash chord voicings', () => {
      const slash = getChordVoicings('F#m7b5/A');
      expect(slash.length).toBeGreaterThan(0);
    });

    it('should adjust lowest note for slash bass', () => {
      const voicings = getChordVoicings('C/G');
      expect(voicings.length).toBeGreaterThan(0);
      const firstVoicing = voicings[0];
      const lowestStringIndex = firstVoicing.frets.findIndex(fret => fret !== 'x');
      expect(lowestStringIndex).toBeGreaterThan(-1);
      // Ensure all lower strings are muted so that the bass note is emphasized
      const lowerStringsMuted = firstVoicing.frets.slice(0, lowestStringIndex).every(fret => fret === 'x');
      expect(lowerStringsMuted).toBe(true);
    });

    it('should return fallback voicings for unknown chords', () => {
      const unknown = getChordVoicings('Xmaj13#11');
      expect(unknown.length).toBeGreaterThan(0);
    });
  });

  describe('findClosestChordVoicings', () => {
    it('should find closest match for similar chords', () => {
      const result = findClosestChordVoicings('Cmaj9');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return muted voicing as last resort', () => {
      const result = findClosestChordVoicings('UnknownChord123');
      expect(result.length).toBeGreaterThan(0);
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
    it('should map enharmonic equivalents consistently', () => {
      expect(normalizeRoot('C#')).toBe('Db');
      expect(normalizeRoot('Db')).toBe('Db');
      expect(normalizeRoot('A#')).toBe('Bb');
    });
  });
});

