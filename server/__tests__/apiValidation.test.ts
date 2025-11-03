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
});
