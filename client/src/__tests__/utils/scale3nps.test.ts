/**
 * Hardening tests: 7-note scales must be true 3NPS with positions across the neck.
 */
import { describe, it, expect } from "vitest";
import { getScaleFingering, SCALE_LIBRARY } from "@/utils/scaleLibrary";

const CORE_3NPS_SCALES = [
  "major",
  "minor",
  "dorian",
  "phrygian",
  "lydian",
  "mixolydian",
  "locrian",
  "harmonic minor",
  "melodic minor",
] as const;

const TEST_ROOTS = ["C", "G", "A"] as const;

describe("3NPS full-neck scale patterns", () => {
  it("core 7-note scales have exactly 7 positions in the library", () => {
    for (const scale of CORE_3NPS_SCALES) {
      expect(SCALE_LIBRARY[scale], scale).toBeDefined();
      expect(SCALE_LIBRARY[scale].fingerings.length, scale).toBe(7);
    }
  });

  it("returns exactly 3 frets per string for each core scale position", () => {
    const failures: string[] = [];

    for (const scale of CORE_3NPS_SCALES) {
      for (const root of TEST_ROOTS) {
        for (let pos = 0; pos < 7; pos++) {
          const fingering = getScaleFingering(scale, root, pos);
          fingering.forEach((stringFrets, stringIndex) => {
            if (stringFrets.length !== 3) {
              failures.push(
                `${root} ${scale} pos ${pos + 1} string ${stringIndex}: ${stringFrets.length} notes (want 3)`
              );
            }
          });
        }
      }
    }

    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("C major 3NPS positions span distinct min-fret regions across the neck", () => {
    const minFrets = Array.from({ length: 7 }, (_, pos) => {
      const fingering = getScaleFingering("major", "C", pos);
      const frets = fingering.flat();
      return Math.min(...frets);
    });

    // Sorted positions should climb the neck (allowing open-string zeros)
    const uniqueMins = new Set(minFrets);
    expect(uniqueMins.size).toBeGreaterThanOrEqual(5);

    // Full span should cover open/low frets through mid/upper neck
    expect(Math.min(...minFrets)).toBeLessThanOrEqual(1);
    expect(Math.max(...minFrets)).toBeGreaterThanOrEqual(8);

    // Adjacent sorted positions should not share the exact same min fret set
    // (each shape starts in a different region)
    for (let i = 1; i < minFrets.length; i++) {
      expect(minFrets[i]).not.toBe(minFrets[i - 1]);
    }
  });

  it("each C major position is a unique fingering shape", () => {
    const patterns = Array.from({ length: 7 }, (_, pos) =>
      JSON.stringify(getScaleFingering("major", "C", pos))
    );
    expect(new Set(patterns).size).toBe(7);
  });
});
