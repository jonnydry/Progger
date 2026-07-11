/**
 * Hardening tests: chord voicings and scale fingerings must stay musically accurate.
 */
import { describe, it, expect } from "vitest";
import {
  getChordVoicingsAsync,
  normalizeRoot,
  validateVoicingNotes,
  preloadAllChords,
} from "@/utils/chords/index";
import {
  SCALE_LIBRARY,
  getScaleFingering,
  validateFingeringNotes,
} from "@/utils/scaleLibrary";
import { noteToValue } from "@/utils/musicTheory";
import { detectKey } from "@/utils/smartChordSuggestions";

describe("music data validation", () => {
  describe("normalizeRoot / noteToValue", () => {
    it("maps flat roots to sharp canonical forms", () => {
      expect(normalizeRoot("Db")).toBe("C#");
      expect(normalizeRoot("db")).toBe("C#");
      expect(normalizeRoot("DB")).toBe("C#");
    });

    it("handles unicode accidentals", () => {
      expect(normalizeRoot("D♭")).toBe("C#");
      expect(normalizeRoot("F♯")).toBe("F#");
      expect(noteToValue("D♭")).toBe(1);
      expect(noteToValue("F♯")).toBe(6);
    });
  });

  describe("chord voicing accuracy (100% chord tones)", () => {
    const sampleChords = [
      "C",
      "Am",
      "G",
      "Em",
      "F",
      "Dm",
      "Cmaj7",
      "Am7",
      "G7",
      "Cm",
      "Gm",
    ];

    it("returns only voicings where every fretted note is a chord tone", async () => {
      await preloadAllChords();

      for (const chord of sampleChords) {
        const voicings = await getChordVoicingsAsync(chord);
        expect(voicings.length, `${chord} should have voicings`).toBeGreaterThan(0);
        for (const voicing of voicings) {
          expect(
            validateVoicingNotes(voicing, chord),
            `${chord} ${voicing.position ?? "unknown"} failed 100% chord-tone validation`
          ).toBe(true);
        }
      }
    });
  });

  describe("scale fingering accuracy", () => {
    const coreScales = [
      "major",
      "minor",
      "dorian",
      "phrygian",
      "lydian",
      "mixolydian",
      "locrian",
      "harmonic minor",
      "melodic minor",
      "blues",
    ];
    const testRoots = ["C", "G", "D", "A", "E", "F"];

    it("stored patterns produce only in-scale notes for core scales", () => {
      const failures: string[] = [];

      for (const scaleType of coreScales) {
        if (!SCALE_LIBRARY[scaleType]) continue;
        const maxPositions = SCALE_LIBRARY[scaleType].positions?.length || 5;

        for (const root of testRoots) {
          for (let pos = 0; pos < maxPositions; pos++) {
            const scaleName = `${root} ${scaleType}`;
            const fingering = getScaleFingering(scaleName, root, pos);
            const validation = validateFingeringNotes(fingering, root, scaleName);
            if (!validation.isValid) {
              failures.push(
                `${scaleName} pos ${pos + 1}: ${validation.invalidNotes.join("; ")}`
              );
            }
          }
        }
      }

      expect(failures, failures.join("\n")).toEqual([]);
    });
  });

  describe("key detection", () => {
    it("detects G major from G-Em-C", () => {
      const result = detectKey([
        { root: "G", quality: "major" },
        { root: "E", quality: "minor" },
        { root: "C", quality: "major" },
      ]);
      expect(result).toEqual({ key: "G", mode: "major" });
    });

    it("detects A minor from Am-F-C-G", () => {
      const result = detectKey([
        { root: "A", quality: "minor" },
        { root: "F", quality: "major" },
        { root: "C", quality: "major" },
        { root: "G", quality: "major" },
      ]);
      expect(result).toEqual({ key: "A", mode: "minor" });
    });

    it("detects G major from G7-Em-C (tonic dominant)", () => {
      const result = detectKey([
        { root: "G", quality: "7" },
        { root: "E", quality: "minor" },
        { root: "C", quality: "major" },
      ]);
      expect(result).toEqual({ key: "G", mode: "major" });
    });
  });
});
