import { describe, it, expect } from 'vitest';
import { SCALE_LIBRARY, normalizeScaleName } from '@/utils/scaleLibrary';
import { CANONICAL_SCALE_DESCRIPTORS, FALLBACK_SCALE_LIBRARY_KEYS } from '@shared/music/scaleModes';

describe('music library coverage diagnostics', () => {
  it('includes entries for every canonical scale descriptor', () => {
    const missing: string[] = [];

    for (const descriptor of CANONICAL_SCALE_DESCRIPTORS) {
      const normalized = normalizeScaleName(descriptor);
      const libraryKey = FALLBACK_SCALE_LIBRARY_KEYS[normalized] ?? normalized;
      if (!SCALE_LIBRARY[libraryKey]) {
        missing.push(`${descriptor} → ${libraryKey}`);
      }
    }

    if (missing.length > 0) {
      console.error('Missing scale descriptors:', missing);
    }

    expect(missing).toEqual([]);
  });
});
