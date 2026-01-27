export const CANONICAL_CHORD_QUALITIES = new Set<string>([
  'major',
  'minor',
  'dim',
  'aug',
  'sus2',
  'sus4',
  '5',
  '7',
  'maj7',
  'min7',
  'dim7',
  'min7b5',
  'min/maj7',
  '9',
  'maj9',
  'min9',
  '9#11',
  '11',
  'maj11',
  'min11',
  '13',
  'maj13',
  'min13',
  '6',
  'min6',
  '6/9',
  'add9',
  'add11',
  'madd9',
  '7b9',
  '7#9',
  '7b5',
  '7#5',
  '7alt',
  '7b13',
  '7#11',
  '7b9b13',
  '7#9b13',
  '7sus4',
  '9sus4',
  'maj7#11',
  'maj7b13',
  'maj7#9',
  'quartal'
]);

const QUALITY_SYNONYMS: Record<string, string> = {
  '': 'major',
  'maj': 'major',
  'major': 'major',
  'm': 'minor',
  'min': 'minor',
  'minor': 'minor',
  '-': 'minor',
  'm7b5': 'min7b5',
  'm9': 'min9',
  'min9': 'min9',
  '-9': 'min9',
  'm11': 'min11',
  'min11': 'min11',
  '-11': 'min11',
  'm13': 'min13',
  'min13': 'min13',
  '-13': 'min13',
  'mmaj7': 'min/maj7',
  'mmaj9': 'min9',
  'maj7': 'maj7',
  'maj9': 'maj9',
  'maj11': 'maj11',
  'maj13': 'maj13',
  'δ7': 'maj7',
  'δ9': 'maj9',
  'δ11': 'maj11',
  'δ13': 'maj13',
  'δ': 'maj7',
  'ø': 'min7b5',
  'ø7': 'min7b5',
  'ø9': 'min9',
  'ø11': 'min11',
  'dom7': '7',
  'dominant7': '7',
  'major7': 'maj7',
  'm7': 'min7',
  'min7': 'min7',
  'minor7': 'min7',
  '-7': 'min7',
  'dim7': 'dim7',
  'o7': 'dim7',
  '°7': 'dim7',
  'half-dim': 'min7b5',
  'min7b5': 'min7b5',
  'sus': 'sus4',
  'sus9': '9sus4',
  'sus4': 'sus4',
  'sus2': 'sus2',
  'power': '5',
  '5th': '5',
  'quartal': 'quartal'
};

const ALTERATION_PATTERNS: Array<{ match: RegExp; normalized: string }> = [
  { match: /^(maj|Δ)7.*#11$/, normalized: 'maj7#11' },
  { match: /^(maj|Δ)7.*b13$/, normalized: 'maj7b13' },
  { match: /^(maj|Δ)7.*#9$/, normalized: 'maj7#9' },
  { match: /^(maj|Δ)7$/, normalized: 'maj7' },
  { match: /^m(in)?\/maj7$/, normalized: 'min/maj7' },
  { match: /^minmaj7$/, normalized: 'min/maj7' },
  { match: /^m7\+$/, normalized: 'min/maj7' },
  { match: /^min7\/maj7$/, normalized: 'min/maj7' },
  { match: /^7.*b9.*b13$/, normalized: '7b9b13' },
  { match: /^7.*#9.*b13$/, normalized: '7#9b13' },
  { match: /^7.*b9$/, normalized: '7b9' },
  { match: /^7.*#9$/, normalized: '7#9' },
  { match: /^7.*#11$/, normalized: '7#11' },
  { match: /^7.*b13$/, normalized: '7b13' },
  { match: /^7.*b5$/, normalized: '7b5' },
  { match: /^7.*(#5|\+5|\+)$/, normalized: '7#5' },
  { match: /^7.*alt$/, normalized: '7alt' },
  { match: /^7.*sus4$/, normalized: '7sus4' },
  { match: /^9.*#11$/, normalized: '9#11' },
  { match: /^9.*sus4$/, normalized: '9sus4' },
  { match: /^maj9$/, normalized: 'maj9' },
  { match: /^min9$/, normalized: 'min9' },
  { match: /^maj11$/, normalized: 'maj11' },
  { match: /^min11$/, normalized: 'min11' },
  { match: /^maj13$/, normalized: 'maj13' },
  { match: /^min13$/, normalized: 'min13' },
  { match: /^add9$/, normalized: 'add9' },
  { match: /^add11$/, normalized: 'add11' },
  { match: /^m(add)?9$/, normalized: 'madd9' },
  { match: /^6\/?9$/, normalized: '6/9' }
];

const SIMPLE_PATTERNS: Array<{ match: RegExp; normalized: string }> = [
  { match: /^maj?$/, normalized: 'major' },
  { match: /^m(in)?$/, normalized: 'minor' },
  { match: /^dim$/, normalized: 'dim' },
  { match: /^aug$/, normalized: 'aug' },
  { match: /^sus2$/, normalized: 'sus2' },
  { match: /^sus4$/, normalized: 'sus4' },
  { match: /^5$/, normalized: '5' },
  { match: /^6$/, normalized: '6' },
  { match: /^m(in)?6$/, normalized: 'min6' },
  { match: /^maj7$/, normalized: 'maj7' },
  { match: /^min7$/, normalized: 'min7' },
  { match: /^7$/, normalized: '7' },
  { match: /^9$/, normalized: '9' },
  { match: /^11$/, normalized: '11' },
  { match: /^13$/, normalized: '13' },
  { match: /^dim7$/, normalized: 'dim7' },
  { match: /^quartal$/, normalized: 'quartal' }
];

/**
 * Normalize chord quality strings to canonical forms shared across client and server.
 * Falls back to 'major' when the quality cannot be determined.
 */
export function resolveChordQuality(quality: string): {
  normalized: string;
  recognized: boolean;
} {
  const sanitized = quality.replace(/\s+/g, '').toLowerCase();

  if (!sanitized) {
    return { normalized: 'major', recognized: true };
  }

  const synonym = QUALITY_SYNONYMS[sanitized];
  if (synonym) {
    return { normalized: synonym, recognized: true };
  }

  for (const pattern of ALTERATION_PATTERNS) {
    if (pattern.match.test(sanitized)) {
      return { normalized: pattern.normalized, recognized: true };
    }
  }

  for (const pattern of SIMPLE_PATTERNS) {
    if (pattern.match.test(sanitized)) {
      return { normalized: pattern.normalized, recognized: true };
    }
  }

  if (CANONICAL_CHORD_QUALITIES.has(sanitized)) {
    return { normalized: sanitized, recognized: true };
  }

  return { normalized: 'major', recognized: false };
}

export function normalizeChordQuality(quality: string): string {
  return resolveChordQuality(quality).normalized;
}

export function isSupportedChordQuality(quality: string): boolean {
  return resolveChordQuality(quality).recognized;
}

export function splitChordName(chordName: string): {
  root: string;
  quality: string;
  bass?: string;
} {
  const match = chordName.match(/^([A-G][#b]?)(.*?)(?:\/([A-G][#b]?))?$/i);
  if (!match) {
    return { root: 'C', quality: 'major' };
  }

  const [, rawRoot, rawQuality = '', rawBass] = match;
  const normalizedQuality = normalizeChordQuality(rawQuality);

  return {
    root: rawRoot.toUpperCase().replace('B#', 'C').replace('E#', 'F'),
    quality: normalizedQuality,
    bass: rawBass ? rawBass.toUpperCase() : undefined,
  };
}
