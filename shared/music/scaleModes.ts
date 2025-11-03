interface ScaleDefinition {
  canonical: string;
  libraryKey: string;
  aliases?: string[];
}

const DESCRIPTIONS: ScaleDefinition[] = [
  { canonical: 'Major', libraryKey: 'major', aliases: ['Ionian'] },
  { canonical: 'Minor', libraryKey: 'minor', aliases: ['Aeolian'] },
  { canonical: 'Dorian', libraryKey: 'dorian' },
  { canonical: 'Phrygian', libraryKey: 'phrygian' },
  { canonical: 'Lydian', libraryKey: 'lydian' },
  { canonical: 'Mixolydian', libraryKey: 'mixolydian' },
  { canonical: 'Locrian', libraryKey: 'locrian' },
  { canonical: 'Major Pentatonic', libraryKey: 'pentatonic major', aliases: ['Pentatonic Major'] },
  { canonical: 'Minor Pentatonic', libraryKey: 'pentatonic minor', aliases: ['Pentatonic Minor'] },
  { canonical: 'Blues', libraryKey: 'blues' },
  { canonical: 'Whole Tone', libraryKey: 'whole tone' },
  { canonical: 'Diminished', libraryKey: 'diminished' },
  { canonical: 'Altered', libraryKey: 'altered', aliases: ['Super Locrian'] },
  { canonical: 'Super Locrian', libraryKey: 'super locrian' },
  { canonical: 'Lydian Dominant', libraryKey: 'lydian dominant' },
  { canonical: 'Phrygian Dominant', libraryKey: 'phrygian dominant' },
  { canonical: 'Hungarian Minor', libraryKey: 'hungarian minor' },
  { canonical: 'Gypsy', libraryKey: 'gypsy' },
  { canonical: 'Bebop Dominant', libraryKey: 'bebop dominant' },
  { canonical: 'Bebop Major', libraryKey: 'bebop major' }
];

const sanitize = (value: string) => value.replace(/\s+|-/g, '').toLowerCase();

const DESCRIPTOR_LOOKUP = new Map<string, ScaleDefinition>();

for (const definition of DESCRIPTIONS) {
  DESCRIPTOR_LOOKUP.set(sanitize(definition.canonical), definition);
  if (definition.aliases) {
    for (const alias of definition.aliases) {
      DESCRIPTOR_LOOKUP.set(sanitize(alias), definition);
    }
  }
}

export const CANONICAL_SCALE_DESCRIPTORS = new Set<string>(
  DESCRIPTIONS.map((d) => d.canonical)
);

export const FALLBACK_SCALE_LIBRARY_KEYS = new Map<string, string>([
  ['harmonicminor', 'harmonic minor'],
  ['melodicminor', 'melodic minor']
]);

export function normalizeScaleDescriptor(descriptor: string): {
  canonical: string;
  libraryKey: string;
} | null {
  const entry = DESCRIPTOR_LOOKUP.get(sanitize(descriptor));
  if (!entry) {
    return null;
  }
  return { canonical: entry.canonical, libraryKey: entry.libraryKey };
}

export function isSupportedScaleDescriptor(descriptor: string): boolean {
  const sanitizedDescriptor = sanitize(descriptor);
  return (
    DESCRIPTOR_LOOKUP.has(sanitizedDescriptor) ||
    FALLBACK_SCALE_LIBRARY_KEYS.has(sanitizedDescriptor)
  );
}
