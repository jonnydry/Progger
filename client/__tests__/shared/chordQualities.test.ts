import { describe, it, expect } from 'vitest';
import { resolveChordQuality } from '@shared/music/chordQualities';

describe('shared/music/chordQualities', () => {
  it('normalizes complex dominant alterations', () => {
    const result = resolveChordQuality('7#9b13');
    expect(result.normalized).toBe('7#9b13');
    expect(result.recognized).toBe(true);
  });

  it('normalizes minor major seventh hybrids', () => {
    const result = resolveChordQuality('min/maj7');
    expect(result.normalized).toBe('min/maj7');
    expect(result.recognized).toBe(true);
  });

  it('normalizes delta notation', () => {
    const result = resolveChordQuality('Δ7');
    expect(result.normalized).toBe('maj7');
    expect(result.recognized).toBe(true);
  });

  it('identifies unsupported qualities', () => {
    const result = resolveChordQuality('mystery13');
    expect(result.normalized).toBe('major');
    expect(result.recognized).toBe(false);
  });
});
