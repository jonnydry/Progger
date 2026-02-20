import { describe, it, expect } from 'vitest';
import { validateAPIResponse, APIValidationError } from '../utils/apiValidation';

describe('validateAPIResponse', () => {
  it('accepts complex chord voicings and advanced scale descriptors', () => {
    const payload = {
      progression: [
        {
          chordName: 'C7#9b13',
          musicalFunction: 'Altered dominant',
          relationToKey: 'V7b9'
        },
        {
          chordName: 'F#m7b5/A',
          musicalFunction: 'Secondary iiø7',
          relationToKey: 'iiø7/V'
        },
        {
          chordName: 'Cmin/maj7',
          musicalFunction: 'Tonic minor-major',
          relationToKey: 'iΔ7'
        }
      ],
      scales: [
        { name: 'G Lydian Dominant', rootNote: 'G' },
        { name: 'C Super Locrian', rootNote: 'C' },
        { name: 'Bb Blues', rootNote: 'Bb' }
      ]
    };

    expect(() => validateAPIResponse(payload)).not.toThrow();
  });

  it('rejects chords with invalid quality', () => {
    const payload = {
      progression: [
        {
          chordName: 'Cunknown',
          musicalFunction: 'Invalid',
          relationToKey: 'I'
        }
      ],
      scales: [{ name: 'C Major', rootNote: 'C' }]
    };

    expect(() => validateAPIResponse(payload)).toThrow(APIValidationError);
  });

  it('rejects scales with unsupported descriptors', () => {
    const payload = {
      progression: [
        {
          chordName: 'Cmaj7',
          musicalFunction: 'Tonic',
          relationToKey: 'Imaj7'
        }
      ],
      scales: [{ name: 'C Natural Minor', rootNote: 'C' }]
    };

    expect(() => validateAPIResponse(payload)).toThrow(APIValidationError);
  });

  it('rejects scales when name root conflicts with rootNote', () => {
    const payload = {
      progression: [
        {
          chordName: 'Cmaj7',
          musicalFunction: 'Tonic',
          relationToKey: 'Imaj7'
        }
      ],
      scales: [{ name: 'C Major', rootNote: 'D' }]
    };

    expect(() => validateAPIResponse(payload)).toThrow(APIValidationError);
  });

  it('accepts enharmonic scale root equivalents', () => {
    const payload = {
      progression: [
        {
          chordName: 'Cmaj7',
          musicalFunction: 'Tonic',
          relationToKey: 'Imaj7'
        }
      ],
      scales: [{ name: 'C# Major', rootNote: 'Db' }]
    };

    expect(() => validateAPIResponse(payload)).not.toThrow();
  });

  it('normalizes Ionian scale names to Major', () => {
    const payload = {
      progression: [
        {
          chordName: 'Cmaj7',
          musicalFunction: 'Tonic',
          relationToKey: 'Imaj7'
        }
      ],
      scales: [
        { name: 'C Ionian', rootNote: 'C' },
        { name: 'G Ionian', rootNote: 'G' }
      ]
    };

    const result = validateAPIResponse(payload);
    expect(result.scales[0].name).toBe('C Major');
    expect(result.scales[1].name).toBe('G Major');
  });

  it('normalizes Aeolian scale names to Minor', () => {
    const payload = {
      progression: [
        {
          chordName: 'Am7',
          musicalFunction: 'Tonic',
          relationToKey: 'im7'
        }
      ],
      scales: [
        { name: 'A Aeolian', rootNote: 'A' },
        { name: 'D Aeolian', rootNote: 'D' }
      ]
    };

    const result = validateAPIResponse(payload);
    expect(result.scales[0].name).toBe('A Minor');
    expect(result.scales[1].name).toBe('D Minor');
  });

  it('normalizes detectedMode Ionian to Major', () => {
    const payload = {
      progression: [
        {
          chordName: 'Cmaj7',
          musicalFunction: 'Tonic',
          relationToKey: 'Imaj7'
        }
      ],
      scales: [{ name: 'C Major', rootNote: 'C' }],
      detectedMode: 'Ionian'
    };

    const result = validateAPIResponse(payload);
    expect(result.detectedMode).toBe('Major');
  });

  it('normalizes detectedMode Aeolian to Minor', () => {
    const payload = {
      progression: [
        {
          chordName: 'Am7',
          musicalFunction: 'Tonic',
          relationToKey: 'im7'
        }
      ],
      scales: [{ name: 'A Minor', rootNote: 'A' }],
      detectedMode: 'Aeolian'
    };

    const result = validateAPIResponse(payload);
    expect(result.detectedMode).toBe('Minor');
  });
});
