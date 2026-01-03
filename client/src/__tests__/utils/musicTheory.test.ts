import { describe, it, expect } from 'vitest';
import {
  noteToValue,
  valueToNote,
  calculateSemitoneDistance,
  transposeNote,
  getNoteAtFret,
  areNotesEnharmonic,
  getKeyAccidentalType,
  displayNote,
  displayChordName,
  ALL_NOTES_SHARP,
  ALL_NOTES_FLAT,
} from '@/utils/musicTheory';

describe('musicTheory', () => {
  describe('noteToValue', () => {
    it('should convert sharp notes to correct values', () => {
      expect(noteToValue('C')).toBe(0);
      expect(noteToValue('C#')).toBe(1);
      expect(noteToValue('D')).toBe(2);
      expect(noteToValue('F#')).toBe(6);
      expect(noteToValue('B')).toBe(11);
    });

    it('should convert flat notes to correct values', () => {
      expect(noteToValue('Db')).toBe(1);
      expect(noteToValue('Eb')).toBe(3);
      expect(noteToValue('Gb')).toBe(6);
      expect(noteToValue('Bb')).toBe(10);
    });

    it('should handle case insensitivity', () => {
      expect(noteToValue('c')).toBe(0);
      expect(noteToValue('c#')).toBe(1);
      expect(noteToValue('DB')).toBe(1);
    });

    it('should return default value for invalid notes', () => {
      expect(noteToValue('')).toBe(0);
      expect(noteToValue('X')).toBe(0);
      expect(noteToValue('invalid', 5)).toBe(5);
    });
  });

  describe('valueToNote', () => {
    it('should convert values to sharp note names', () => {
      expect(valueToNote(0)).toBe('C');
      expect(valueToNote(1)).toBe('C#');
      expect(valueToNote(6)).toBe('F#');
      expect(valueToNote(11)).toBe('B');
    });

    it('should handle negative values', () => {
      expect(valueToNote(-1)).toBe('B');
      expect(valueToNote(-12)).toBe('C');
    });

    it('should handle values greater than 11', () => {
      expect(valueToNote(12)).toBe('C');
      expect(valueToNote(13)).toBe('C#');
      expect(valueToNote(24)).toBe('C');
    });
  });

  describe('calculateSemitoneDistance', () => {
    it('should calculate correct semitone distances', () => {
      expect(calculateSemitoneDistance('C', 'D')).toBe(2);
      expect(calculateSemitoneDistance('C', 'C#')).toBe(1);
      expect(calculateSemitoneDistance('C', 'C')).toBe(0);
      expect(calculateSemitoneDistance('B', 'C')).toBe(1);
    });

    it('should handle enharmonic equivalents', () => {
      expect(calculateSemitoneDistance('C#', 'Db')).toBe(0);
      expect(calculateSemitoneDistance('F#', 'Gb')).toBe(0);
    });
  });

  describe('transposeNote', () => {
    it('should transpose notes up', () => {
      expect(transposeNote('C', 2)).toBe('D');
      expect(transposeNote('C', 7)).toBe('G');
      expect(transposeNote('E', 1)).toBe('F');
    });

    it('should transpose notes down', () => {
      expect(transposeNote('D', -2)).toBe('C');
      expect(transposeNote('C', -1)).toBe('B');
    });

    it('should handle octave wraps', () => {
      expect(transposeNote('B', 1)).toBe('C');
      expect(transposeNote('C', -1)).toBe('B');
    });
  });

  describe('getNoteAtFret', () => {
    it('should return correct note at fret', () => {
      expect(getNoteAtFret('E', 0)).toBe('E');
      expect(getNoteAtFret('E', 1)).toBe('F');
      expect(getNoteAtFret('A', 2)).toBe('B');
      expect(getNoteAtFret('D', 5)).toBe('G');
    });
  });

  describe('areNotesEnharmonic', () => {
    it('should identify enharmonic equivalents', () => {
      expect(areNotesEnharmonic('C#', 'Db')).toBe(true);
      expect(areNotesEnharmonic('F#', 'Gb')).toBe(true);
      expect(areNotesEnharmonic('E', 'Fb')).toBe(false); // E and Fb are not enharmonic
    });

    it('should return false for different notes', () => {
      expect(areNotesEnharmonic('C', 'D')).toBe(false);
      expect(areNotesEnharmonic('C', 'C#')).toBe(false);
    });
  });

  describe('getKeyAccidentalType', () => {
    it('should return sharp for sharp keys', () => {
      expect(getKeyAccidentalType('G')).toBe('sharp');
      expect(getKeyAccidentalType('D')).toBe('sharp');
      expect(getKeyAccidentalType('A')).toBe('sharp');
      expect(getKeyAccidentalType('F#')).toBe('sharp');
    });

    it('should return flat for flat keys', () => {
      expect(getKeyAccidentalType('F')).toBe('flat');
      expect(getKeyAccidentalType('Bb')).toBe('flat');
      expect(getKeyAccidentalType('Eb')).toBe('flat');
      expect(getKeyAccidentalType('Db')).toBe('flat');
    });

    it('should return natural for C major', () => {
      expect(getKeyAccidentalType('C')).toBe('natural');
    });

    it('should handle case insensitivity', () => {
      expect(getKeyAccidentalType('g')).toBe('sharp');
      expect(getKeyAccidentalType('BB')).toBe('flat');
    });
  });

  describe('displayNote', () => {
    it('should display notes with sharps in sharp keys', () => {
      expect(displayNote('Db', 'G')).toBe('C#');
      expect(displayNote('Gb', 'D')).toBe('F#');
    });

    it('should display notes with flats in flat keys', () => {
      expect(displayNote('C#', 'F')).toBe('Db');
      expect(displayNote('F#', 'Bb')).toBe('Gb');
    });

    it('should use conventional spellings for C major', () => {
      expect(displayNote('C#', 'C')).toBe('C#');
      expect(displayNote('Db', 'C')).toBe('C#'); // C major uses C# spelling for chromatic value 1
      expect(displayNote('D#', 'C')).toBe('Eb'); // C major uses Eb spelling for chromatic value 3
    });
  });

  describe('displayChordName', () => {
    it('should transform chord names based on key context', () => {
      expect(displayChordName('C#maj7', 'G')).toBe('C#maj7');
      expect(displayChordName('Gbmin', 'D')).toBe('F#min');
      expect(displayChordName('Db7', 'F')).toBe('Db7');
    });

    it('should preserve chord quality', () => {
      expect(displayChordName('C#maj7', 'F')).toBe('Dbmaj7');
      expect(displayChordName('Gbmin', 'D')).toBe('F#min');
    });

    it('should handle chords without accidentals', () => {
      expect(displayChordName('Cmaj7', 'G')).toBe('Cmaj7');
      expect(displayChordName('Am', 'D')).toBe('Am');
    });
  });
});

