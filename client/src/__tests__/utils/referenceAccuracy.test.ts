/**
 * Reference-grade accuracy: standard keys × modes must be 100% correct on the neck.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { KEYS } from "@/constants";
import {
  SCALE_LIBRARY,
  getScaleFingering,
  validateFingeringNotes,
  getScaleIntervals,
} from "@/utils/scaleLibrary";
import {
  getKeyAccidentalType,
  displayNote,
  noteToValue,
  STANDARD_TUNING_VALUES,
  valueToNote,
} from "@/utils/musicTheory";
import {
  getChordVoicingsAsync,
  preloadAllChords,
  validateVoicingNotes,
  extractVoicingNotes,
} from "@/utils/chords/index";
import { getChordNotes } from "@/utils/chordAnalysis";

/** App mode picker: Ionian through Locrian (natural minor = Aeolian). */
const STANDARD_MODES = [
  "major",
  "dorian",
  "phrygian",
  "lydian",
  "mixolydian",
  "minor",
  "locrian",
] as const;

const TEXTBOOK_INTERVALS: Record<(typeof STANDARD_MODES)[number], number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  minor: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
};

/** Parent-major signature type for mode tonics (guitar spelling). */
const MODE_SIGNATURE_CASES: Array<[string, string, "sharp" | "flat" | "natural"]> = [
  ["C", "major", "natural"],
  ["A", "minor", "natural"],
  ["D", "dorian", "natural"],
  ["E", "phrygian", "natural"],
  ["F", "lydian", "natural"],
  ["G", "mixolydian", "natural"],
  ["B", "locrian", "natural"],
  ["G", "major", "sharp"],
  ["E", "minor", "sharp"],
  ["A", "dorian", "sharp"],
  ["F", "major", "flat"],
  ["D", "minor", "flat"],
  ["G", "dorian", "flat"],
  ["Bb", "major", "flat"],
  ["F#", "major", "sharp"],
];

describe("reference accuracy — standard keys & modes", () => {
  it("textbook intervals match for all seven modes", () => {
    for (const mode of STANDARD_MODES) {
      expect(getScaleIntervals(mode), mode).toEqual(TEXTBOOK_INTERVALS[mode]);
      expect(SCALE_LIBRARY[mode].intervals, mode).toEqual(TEXTBOOK_INTERVALS[mode]);
    }
  });

  it("every fretted note is in-scale for all 12 keys × 7 modes × 7 positions (100%)", () => {
    const failures: string[] = [];

    for (const mode of STANDARD_MODES) {
      for (const root of KEYS) {
        for (let pos = 0; pos < 7; pos++) {
          const fingering = getScaleFingering(mode, root, pos);
          fingering.forEach((stringFrets, stringIndex) => {
            if (stringFrets.length !== 3) {
              failures.push(
                `${root} ${mode} pos ${pos + 1} string ${stringIndex}: ${stringFrets.length} notes`
              );
            }
          });

          const validation = validateFingeringNotes(fingering, root, mode);
          if (!validation.isValid || validation.coverage < 1) {
            failures.push(
              `${root} ${mode} pos ${pos + 1}: ${validation.invalidNotes.join("; ") || "coverage < 1"}`
            );
          }

          // Independent check: pitch class from tuning + fret ∈ scale
          const rootPc = noteToValue(root);
          const scalePcs = new Set(TEXTBOOK_INTERVALS[mode].map((i) => (rootPc + i) % 12));
          fingering.forEach((frets, stringIndex) => {
            const open = STANDARD_TUNING_VALUES[stringIndex];
            frets.forEach((fret) => {
              const pc = (open + fret) % 12;
              if (!scalePcs.has(pc)) {
                failures.push(
                  `${root} ${mode} pos ${pos + 1}: string ${stringIndex} fret ${fret} = ${valueToNote(pc)} not in scale`
                );
              }
            });
          });
        }
      }
    }

    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("neck note labels use correct key signatures for standard modes", () => {
    for (const [tonic, mode, expected] of MODE_SIGNATURE_CASES) {
      expect(getKeyAccidentalType(tonic, mode), `${tonic} ${mode}`).toBe(expected);
    }
    expect(displayNote("A#", "A", "minor")).toBe("Bb");
    expect(displayNote("F#", "G", "major")).toBe("F#");
    expect(displayNote("Bb", "F", "major")).toBe("Bb");
    expect(displayNote("C#", "A", "dorian")).toBe("C#"); // A dorian → G (sharps)
    // Scale-library names must resolve to diatonic spelling modes
    expect(getKeyAccidentalType("G", "pentatonic minor")).toBe("flat"); // → Bb major sig
    expect(displayNote("A#", "G", "pentatonic minor")).toBe("Bb");
    expect(getKeyAccidentalType("A", "blues")).toBe("natural");
    expect(getKeyAccidentalType("C", "harmonic minor")).toBe("flat"); // → Eb
  });
});

describe("reference accuracy — standard chord voicings on the neck", () => {
  const qualities = ["", "m", "7", "maj7", "m7"] as const;

  beforeAll(async () => {
    await preloadAllChords();
  });

  it("displayed voicings are 100% chord tones for all 12 keys × common qualities", async () => {
    const failures: string[] = [];

    for (const root of KEYS) {
      for (const quality of qualities) {
        const chordName = `${root}${quality}`;
        const voicings = await getChordVoicingsAsync(chordName);
        if (voicings.length === 0) {
          failures.push(`${chordName}: no voicings after 100% filter`);
          continue;
        }

        const expected = new Set(getChordNotes(chordName).map((n) => noteToValue(n)));
        for (const voicing of voicings) {
          if (!validateVoicingNotes(voicing, chordName)) {
            failures.push(`${chordName} ${voicing.position ?? "?"}: failed validateVoicingNotes`);
            continue;
          }
          for (const pc of extractVoicingNotes(voicing)) {
            if (!expected.has(pc)) {
              failures.push(
                `${chordName} ${voicing.position ?? "?"}: fretted ${valueToNote(pc)} not in chord`
              );
            }
          }
        }
      }
    }

    expect(failures, failures.join("\n")).toEqual([]);
  });
});
