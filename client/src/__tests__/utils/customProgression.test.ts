import { describe, it, expect } from 'vitest';
import { toCanonicalChordNames } from '@/utils/customProgression';

describe('customProgression utils', () => {
  it('serializes custom progression chords to canonical ASCII chord names', () => {
    const result = toCanonicalChordNames([
      { root: 'F♯', quality: '7b9' },
      { root: 'Bb', quality: 'major' },
      { root: 'C', quality: 'min7' },
    ]);

    expect(result).toEqual(['F#7b9', 'Bb', 'Cmin7']);
  });
});
