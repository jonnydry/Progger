import { describe, it, expect } from 'vitest';
import {
  getScaleFingering,
  getScaleIntervals,
  normalizeScaleName,
  getScaleNotes,
  SCALE_LIBRARY,
} from '@/utils/scaleLibrary';

describe('scaleLibrary', () => {
  describe('getScaleFingering', () => {
    it('should return fingering for major scale', () => {
      const fingering = getScaleFingering('major', 'C');
      expect(fingering).toBeDefined();
      expect(Array.isArray(fingering)).toBe(true);
      expect(fingering.length).toBe(6); // 6 strings
    });

    it('should return fingering for minor scale', () => {
      const fingering = getScaleFingering('minor', 'A');
      expect(fingering).toBeDefined();
      expect(fingering.length).toBe(6);
    });

    it('should handle different root notes', () => {
      const cMajor = getScaleFingering('major', 'C');
      const gMajor = getScaleFingering('major', 'G');
      expect(cMajor).toBeDefined();
      expect(gMajor).toBeDefined();
      // Fingering should be transposed based on root
      expect(cMajor).not.toEqual(gMajor);
    });

    it('should handle different position indices', () => {
      const pos1 = getScaleFingering('major', 'C', 0);
      const pos2 = getScaleFingering('major', 'C', 1);
      expect(pos1).toBeDefined();
      expect(pos2).toBeDefined();
      // Different positions should have different fingerings
      expect(pos1).not.toEqual(pos2);
    });

    it('should handle modal scales', () => {
      const dorian = getScaleFingering('dorian', 'D');
      const mixolydian = getScaleFingering('mixolydian', 'G');
      expect(dorian).toBeDefined();
      expect(mixolydian).toBeDefined();
    });

    it('should handle pentatonic scales', () => {
      const pentatonicMajor = getScaleFingering('pentatonic major', 'C');
      const pentatonicMinor = getScaleFingering('pentatonic minor', 'A');
      expect(pentatonicMajor).toBeDefined();
      expect(pentatonicMinor).toBeDefined();
    });

    it('should fallback to major for unknown scales', () => {
      const unknown = getScaleFingering('unknown scale', 'C');
      expect(unknown).toBeDefined();
      expect(unknown.length).toBe(6);
    });
  });

  describe('getScaleIntervals', () => {
    it('should return intervals for major scale', () => {
      const intervals = getScaleIntervals('major');
      expect(intervals).toEqual([0, 2, 4, 5, 7, 9, 11]);
    });

    it('should return intervals for minor scale', () => {
      const intervals = getScaleIntervals('minor');
      expect(intervals).toBeDefined();
      expect(Array.isArray(intervals)).toBe(true);
    });

    it('should handle modal scales', () => {
      const dorian = getScaleIntervals('dorian');
      const mixolydian = getScaleIntervals('mixolydian');
      expect(dorian).toBeDefined();
      expect(mixolydian).toBeDefined();
      expect(dorian).not.toEqual(mixolydian);
    });

    it('should fallback to major intervals for unknown scales', () => {
      const unknown = getScaleIntervals('unknown');
      expect(unknown).toEqual([0, 2, 4, 5, 7, 9, 11]);
    });
  });

  describe('normalizeScaleName', () => {
    it('should normalize major scale names', () => {
      expect(normalizeScaleName('Major')).toBe('major');
      expect(normalizeScaleName('MAJOR')).toBe('major');
      expect(normalizeScaleName('major scale')).toBe('major');
    });

    it('should normalize minor scale names', () => {
      expect(normalizeScaleName('Minor')).toBe('minor');
      expect(normalizeScaleName('minor scale')).toBe('minor');
    });

    it('should normalize pentatonic scales', () => {
      expect(normalizeScaleName('Pentatonic Major')).toBe('pentatonic major');
      expect(normalizeScaleName('pentatonic minor')).toBe('pentatonic minor');
    });

    it('should normalize modal scales', () => {
      expect(normalizeScaleName('Dorian')).toBe('dorian');
      expect(normalizeScaleName('Mixolydian')).toBe('mixolydian');
      expect(normalizeScaleName('Phrygian')).toBe('phrygian');
      expect(normalizeScaleName('Lydian')).toBe('lydian');
    });

    it('should normalize blues scale', () => {
      expect(normalizeScaleName('Blues')).toBe('blues');
      expect(normalizeScaleName('blues scale')).toBe('blues');
    });

    it('should default to major for unknown scales', () => {
      expect(normalizeScaleName('unknown')).toBe('major');
      expect(normalizeScaleName('random scale')).toBe('major');
    });
  });

  describe('getScaleNotes', () => {
    it('should return notes for C major', () => {
      const notes = getScaleNotes('C', 'major');
      expect(notes).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    });

    it('should return notes for A minor', () => {
      const notes = getScaleNotes('A', 'minor');
      expect(notes).toBeDefined();
      expect(notes.length).toBe(7);
      expect(notes[0]).toBe('A');
    });

    it('should handle different root notes', () => {
      const gMajor = getScaleNotes('G', 'major');
      expect(gMajor[0]).toBe('G');
      expect(gMajor.length).toBe(7);
    });

    it('should handle scales with sharps', () => {
      const dMajor = getScaleNotes('D', 'major');
      expect(dMajor).toBeDefined();
      expect(dMajor.length).toBe(7);
    });

    it('should handle scales with flats', () => {
      const fMajor = getScaleNotes('F', 'major');
      expect(fMajor).toBeDefined();
      expect(fMajor.length).toBe(7);
    });

    it('should wrap around octave correctly', () => {
      const bMajor = getScaleNotes('B', 'major');
      expect(bMajor).toBeDefined();
      expect(bMajor.length).toBe(7);
      // Should include notes that wrap to next octave
    });
  });

  describe('SCALE_LIBRARY', () => {
    it('should contain major scale', () => {
      expect(SCALE_LIBRARY.major).toBeDefined();
      expect(SCALE_LIBRARY.major.intervals).toBeDefined();
      expect(SCALE_LIBRARY.major.fingerings).toBeDefined();
    });

    it('should contain minor scale', () => {
      expect(SCALE_LIBRARY.minor).toBeDefined();
    });

    it('should contain modal scales', () => {
      expect(SCALE_LIBRARY.dorian).toBeDefined();
      expect(SCALE_LIBRARY.mixolydian).toBeDefined();
      expect(SCALE_LIBRARY.phrygian).toBeDefined();
    });

    it('should have consistent structure for all scales', () => {
      for (const [name, scale] of Object.entries(SCALE_LIBRARY)) {
        expect(scale.intervals).toBeDefined();
        expect(Array.isArray(scale.intervals)).toBe(true);
        expect(scale.fingerings).toBeDefined();
        expect(Array.isArray(scale.fingerings)).toBe(true);
        expect(scale.fingerings.length).toBeGreaterThan(0);
      }
    });
  });
});

