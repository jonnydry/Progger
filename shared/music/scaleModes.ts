interface ScaleDefinition {
  canonical: string;
  libraryKey: string;
  aliases?: string[];
}

export type MajorSystemModeKey =
  | "major"
  | "dorian"
  | "phrygian"
  | "lydian"
  | "mixolydian"
  | "minor"
  | "locrian";

export interface MajorSystemModeProfile {
  canonical: string;
  libraryKey: MajorSystemModeKey;
  degreeRoman: "I" | "II" | "III" | "IV" | "V" | "VI" | "VII";
  formula: string;
  majorDelta: string;
  parentMajorShift: number;
  stepPattern: string;
}

const DESCRIPTIONS: ScaleDefinition[] = [
  { canonical: "Major", libraryKey: "major", aliases: ["Ionian", "Ionian Major"] },
  { canonical: "Minor", libraryKey: "minor", aliases: ["Aeolian", "Natural Minor"] },
  { canonical: "Dorian", libraryKey: "dorian" },
  { canonical: "Phrygian", libraryKey: "phrygian" },
  { canonical: "Lydian", libraryKey: "lydian" },
  { canonical: "Mixolydian", libraryKey: "mixolydian" },
  { canonical: "Locrian", libraryKey: "locrian" },
  { canonical: "Major Pentatonic", libraryKey: "pentatonic major", aliases: ["Pentatonic Major"] },
  { canonical: "Minor Pentatonic", libraryKey: "pentatonic minor", aliases: ["Pentatonic Minor"] },
  { canonical: "Blues", libraryKey: "blues" },
  { canonical: "Whole Tone", libraryKey: "whole tone" },
  {
    canonical: "Diminished",
    libraryKey: "diminished",
    aliases: ["Half Whole Diminished", "Diminished Half Whole"],
  },
  { canonical: "Altered", libraryKey: "altered", aliases: ["Altered Scale", "Super Locrian"] },
  { canonical: "Super Locrian", libraryKey: "super locrian", aliases: ["Altered"] },
  { canonical: "Lydian Dominant", libraryKey: "lydian dominant" },
  { canonical: "Phrygian Dominant", libraryKey: "phrygian dominant" },
  { canonical: "Hungarian Minor", libraryKey: "hungarian minor" },
  { canonical: "Gypsy", libraryKey: "gypsy" },
  { canonical: "Bebop Dominant", libraryKey: "bebop dominant" },
  { canonical: "Bebop Major", libraryKey: "bebop major" },
];

const SANITIZE_STRIP_PATTERN = /[^a-z0-9#b]/g;
const SCALE_MODE_WORDS_PATTERN = /\b(scale|mode)\b/gi;

const sanitize = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/♯/g, "#")
    .replace(/♭/g, "b")
    .replace(/[()]/g, " ")
    .replace(SCALE_MODE_WORDS_PATTERN, " ")
    .toLowerCase()
    .replace(SANITIZE_STRIP_PATTERN, "");

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
  DESCRIPTIONS.map((d) => d.canonical),
);

export const FALLBACK_SCALE_LIBRARY_KEYS = new Map<string, string>([
  ["harmonicminor", "harmonic minor"],
  ["melodicminor", "melodic minor"],
  ["naturalminor", "minor"],
]);

export const MAJOR_SYSTEM_MODE_PROFILES: Record<
  MajorSystemModeKey,
  MajorSystemModeProfile
> = {
  major: {
    canonical: "Major",
    libraryKey: "major",
    degreeRoman: "I",
    formula: "1 2 3 4 5 6 7",
    majorDelta: "none",
    parentMajorShift: 0,
    stepPattern: "2-2-1-2-2-2-1",
  },
  dorian: {
    canonical: "Dorian",
    libraryKey: "dorian",
    degreeRoman: "II",
    formula: "1 2 b3 4 5 6 b7",
    majorDelta: "b3, b7",
    parentMajorShift: -2,
    stepPattern: "2-1-2-2-2-1-2",
  },
  phrygian: {
    canonical: "Phrygian",
    libraryKey: "phrygian",
    degreeRoman: "III",
    formula: "1 b2 b3 4 5 b6 b7",
    majorDelta: "b2, b3, b6, b7",
    parentMajorShift: -4,
    stepPattern: "1-2-2-2-1-2-2",
  },
  lydian: {
    canonical: "Lydian",
    libraryKey: "lydian",
    degreeRoman: "IV",
    formula: "1 2 3 #4 5 6 7",
    majorDelta: "#4",
    parentMajorShift: -5,
    stepPattern: "2-2-2-1-2-2-1",
  },
  mixolydian: {
    canonical: "Mixolydian",
    libraryKey: "mixolydian",
    degreeRoman: "V",
    formula: "1 2 3 4 5 6 b7",
    majorDelta: "b7",
    parentMajorShift: -7,
    stepPattern: "2-2-1-2-2-1-2",
  },
  minor: {
    canonical: "Minor",
    libraryKey: "minor",
    degreeRoman: "VI",
    formula: "1 2 b3 4 5 b6 b7",
    majorDelta: "b3, b6, b7",
    parentMajorShift: 3,
    stepPattern: "2-1-2-2-1-2-2",
  },
  locrian: {
    canonical: "Locrian",
    libraryKey: "locrian",
    degreeRoman: "VII",
    formula: "1 b2 b3 4 b5 b6 b7",
    majorDelta: "b2, b3, b5, b6, b7",
    parentMajorShift: 1,
    stepPattern: "1-2-2-1-2-2-2",
  },
};

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

export function normalizeModeCanonical(mode: string): string {
  const normalized = normalizeScaleDescriptor(mode);
  return normalized?.canonical ?? mode.trim();
}

export function getMajorSystemModeProfile(
  descriptor: string,
): MajorSystemModeProfile | null {
  const normalized = normalizeScaleDescriptor(descriptor);
  if (!normalized) {
    return null;
  }
  const profile = MAJOR_SYSTEM_MODE_PROFILES[
    normalized.libraryKey as MajorSystemModeKey
  ];
  return profile ?? null;
}

export function isSupportedScaleDescriptor(descriptor: string): boolean {
  const sanitizedDescriptor = sanitize(descriptor);
  return (
    DESCRIPTOR_LOOKUP.has(sanitizedDescriptor) ||
    FALLBACK_SCALE_LIBRARY_KEYS.has(sanitizedDescriptor)
  );
}
