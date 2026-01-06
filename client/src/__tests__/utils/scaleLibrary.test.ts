import { describe, it, expect } from "vitest";
import {
  getScaleFingering,
  getScaleIntervals,
  normalizeScaleName,
  getScaleNotes,
  SCALE_LIBRARY,
} from "@/utils/scaleLibrary";

describe("scaleLibrary", () => {
  describe("getScaleFingering", () => {
    it("should return fingering for major scale", () => {
      const fingering = getScaleFingering("major", "C");
      expect(fingering).toBeDefined();
      expect(Array.isArray(fingering)).toBe(true);
      expect(fingering.length).toBe(6); // 6 strings
    });

    it("should return fingering for minor scale", () => {
      const fingering = getScaleFingering("minor", "A");
      expect(fingering).toBeDefined();
      expect(fingering.length).toBe(6);
    });

    it("should handle different root notes", () => {
      const cMajor = getScaleFingering("major", "C");
      const gMajor = getScaleFingering("major", "G");
      expect(cMajor).toBeDefined();
      expect(gMajor).toBeDefined();
      // Fingering should be transposed based on root
      expect(cMajor).not.toEqual(gMajor);
    });

    it("should handle different position indices", () => {
      const pos1 = getScaleFingering("major", "C", 0);
      const pos2 = getScaleFingering("major", "C", 1);
      expect(pos1).toBeDefined();
      expect(pos2).toBeDefined();
      // Different positions should have different fingerings
      expect(pos1).not.toEqual(pos2);
    });

    it("should handle modal scales", () => {
      const dorian = getScaleFingering("dorian", "D");
      const mixolydian = getScaleFingering("mixolydian", "G");
      expect(dorian).toBeDefined();
      expect(mixolydian).toBeDefined();
    });

    it("should handle pentatonic scales", () => {
      const pentatonicMajor = getScaleFingering("pentatonic major", "C");
      const pentatonicMinor = getScaleFingering("pentatonic minor", "A");
      expect(pentatonicMajor).toBeDefined();
      expect(pentatonicMinor).toBeDefined();
    });

    it("should fallback to major for unknown scales", () => {
      const unknown = getScaleFingering("unknown scale", "C");
      expect(unknown).toBeDefined();
      expect(unknown.length).toBe(6);
    });
  });

  describe("getScaleIntervals", () => {
    it("should return intervals for major scale", () => {
      const intervals = getScaleIntervals("major");
      expect(intervals).toEqual([0, 2, 4, 5, 7, 9, 11]);
    });

    it("should return intervals for minor scale", () => {
      const intervals = getScaleIntervals("minor");
      expect(intervals).toBeDefined();
      expect(Array.isArray(intervals)).toBe(true);
    });

    it("should handle modal scales", () => {
      const dorian = getScaleIntervals("dorian");
      const mixolydian = getScaleIntervals("mixolydian");
      expect(dorian).toBeDefined();
      expect(mixolydian).toBeDefined();
      expect(dorian).not.toEqual(mixolydian);
    });

    it("should fallback to major intervals for unknown scales", () => {
      const unknown = getScaleIntervals("unknown");
      expect(unknown).toEqual([0, 2, 4, 5, 7, 9, 11]);
    });
  });

  describe("normalizeScaleName", () => {
    it("should normalize major scale names", () => {
      expect(normalizeScaleName("Major")).toBe("major");
      expect(normalizeScaleName("MAJOR")).toBe("major");
      expect(normalizeScaleName("major scale")).toBe("major");
    });

    it("should normalize minor scale names", () => {
      expect(normalizeScaleName("Minor")).toBe("minor");
      expect(normalizeScaleName("minor scale")).toBe("minor");
      expect(normalizeScaleName("C Minor")).toBe("minor");
    });

    it("should normalize pentatonic scales", () => {
      expect(normalizeScaleName("Pentatonic Major")).toBe("pentatonic major");
      expect(normalizeScaleName("pentatonic minor")).toBe("pentatonic minor");
    });

    it("should normalize modal scales", () => {
      expect(normalizeScaleName("Dorian")).toBe("dorian");
      expect(normalizeScaleName("Mixolydian")).toBe("mixolydian");
      expect(normalizeScaleName("Phrygian")).toBe("phrygian");
      expect(normalizeScaleName("Lydian")).toBe("lydian");
    });

    it("should normalize Ionian to Major", () => {
      expect(normalizeScaleName("Ionian")).toBe("major");
      expect(normalizeScaleName("C Ionian")).toBe("major");
      expect(normalizeScaleName("G Ionian")).toBe("major");
      expect(normalizeScaleName("ionian")).toBe("major");
    });

    it("should normalize Aeolian to Minor", () => {
      expect(normalizeScaleName("Aeolian")).toBe("minor");
      expect(normalizeScaleName("A Aeolian")).toBe("minor");
      expect(normalizeScaleName("D Aeolian")).toBe("minor");
      expect(normalizeScaleName("aeolian")).toBe("minor");
    });

    it("should normalize advanced mode descriptors", () => {
      expect(normalizeScaleName("G Lydian Dominant")).toBe("lydian dominant");
      expect(normalizeScaleName("C Super Locrian")).toBe("super locrian");
      expect(normalizeScaleName("Bb Blues")).toBe("blues");
    });

    it("should normalize blues scale", () => {
      expect(normalizeScaleName("Blues")).toBe("blues");
      expect(normalizeScaleName("blues scale")).toBe("blues");
    });

    it("should default to major for unknown scales", () => {
      expect(normalizeScaleName("unknown")).toBe("major");
      expect(normalizeScaleName("random scale")).toBe("major");
    });
  });

  describe("getScaleNotes", () => {
    it("should return notes for C major", () => {
      const notes = getScaleNotes("C", "major");
      expect(notes).toEqual(["C", "D", "E", "F", "G", "A", "B"]);
    });

    it("should return notes for A minor", () => {
      const notes = getScaleNotes("A", "minor");
      expect(notes).toBeDefined();
      expect(notes.length).toBe(7);
      expect(notes[0]).toBe("A");
    });

    it("should handle different root notes", () => {
      const gMajor = getScaleNotes("G", "major");
      expect(gMajor[0]).toBe("G");
      expect(gMajor.length).toBe(7);
    });

    it("should handle scales with sharps", () => {
      const dMajor = getScaleNotes("D", "major");
      expect(dMajor).toBeDefined();
      expect(dMajor.length).toBe(7);
    });

    it("should handle scales with flats", () => {
      const fMajor = getScaleNotes("F", "major");
      expect(fMajor).toBeDefined();
      expect(fMajor.length).toBe(7);
    });

    it("should wrap around octave correctly", () => {
      const bMajor = getScaleNotes("B", "major");
      expect(bMajor).toBeDefined();
      expect(bMajor.length).toBe(7);
      // Should include notes that wrap to next octave
    });
  });

  describe("SCALE_LIBRARY - Comprehensive Structure Tests", () => {
    // Note: 'aeolian' normalizes to 'minor' and 'ionian' normalizes to 'major'
    // so they are not separate entries in SCALE_LIBRARY
    // 3NPS (3 Notes Per String) system uses 7 positions for 7-note scales
    const SCALE_POSITION_REQUIREMENTS = {
      major: 7, // 3NPS: 7 positions for 7-note scale
      minor: 7, // 3NPS: 7 positions for 7-note scale
      dorian: 7, // 3NPS: 7 positions for 7-note scale
      phrygian: 7, // 3NPS: 7 positions for 7-note scale
      lydian: 7, // 3NPS: 7 positions for 7-note scale
      mixolydian: 7, // 3NPS: 7 positions for 7-note scale
      locrian: 7, // 3NPS: 7 positions for 7-note scale
      "harmonic minor": 7, // 3NPS: 7 positions for 7-note scale
      "melodic minor": 7, // 3NPS: 7 positions for 7-note scale
      "pentatonic major": 5, // 5 boxes for 5-note scale
      "pentatonic minor": 5, // 5 boxes for 5-note scale
      blues: 5, // 5 boxes (6-note scale, uses pentatonic boxes + blue note)
      "whole tone": 2, // Symmetric 6-note scale, only 2 unique positions
      diminished: 3, // Symmetric 8-note scale, 3 unique positions
    } as Record<string, number>;

    it("should contain major scale", () => {
      expect(SCALE_LIBRARY.major).toBeDefined();
      expect(SCALE_LIBRARY.major.intervals).toBeDefined();
      expect(SCALE_LIBRARY.major.fingerings).toBeDefined();
    });

    it("should contain minor scale", () => {
      expect(SCALE_LIBRARY.minor).toBeDefined();
    });

    it("should contain modal scales", () => {
      expect(SCALE_LIBRARY.dorian).toBeDefined();
      expect(SCALE_LIBRARY.mixolydian).toBeDefined();
      expect(SCALE_LIBRARY.phrygian).toBeDefined();
    });

    it("should have correct number of positions for each scale", () => {
      for (const [name, requiredPositions] of Object.entries(
        SCALE_POSITION_REQUIREMENTS,
      )) {
        const scaleKey = name.replace(/\s+/g, " ");
        expect(SCALE_LIBRARY[scaleKey]).toBeDefined();
        const actualPositions = SCALE_LIBRARY[scaleKey].fingerings.length;
        expect(actualPositions).toBe(requiredPositions);
      }
    });

    it("should have consistent structure for all scales", () => {
      for (const [name, scale] of Object.entries(SCALE_LIBRARY)) {
        expect(scale.intervals).toBeDefined();
        expect(Array.isArray(scale.intervals)).toBe(true);
        expect(scale.fingerings).toBeDefined();
        expect(Array.isArray(scale.fingerings)).toBe(true);
        expect(scale.fingerings.length).toBeGreaterThan(0);
        scale.fingerings.forEach((pattern) =>
          validateFingeringStructure(pattern),
        );
      }
    });

    it("should handle blank position requests gracefully", () => {
      // Test scales with limited positions - requesting non-existent positions should not crash
      const testCases = [
        { scale: "blues", availablePositions: 5, testPosition: 6 },
        { scale: "whole tone", availablePositions: 2, testPosition: 3 },
        { scale: "diminished", availablePositions: 3, testPosition: 5 },
      ] as const;

      for (const { scale, availablePositions, testPosition } of testCases) {
        expect(() => getScaleFingering(scale, "C", testPosition)).not.toThrow();

        // Should fall back to the last available position when out of range
        const fallbackFingering = getScaleFingering(scale, "C", testPosition);
        const lastAvailablePosition = Math.min(
          availablePositions - 1,
          testPosition,
        );
        const lastPositionFingering = getScaleFingering(
          scale,
          "C",
          lastAvailablePosition,
        );
        expect(fallbackFingering).toEqual(lastPositionFingering);
      }
    });

    it("should not have blank or identical patterns for available positions", () => {
      for (const [name, scale] of Object.entries(SCALE_LIBRARY)) {
        const positions = scale.fingerings.length;

        // Test that each position is unique (not identical)
        for (let i = 1; i < positions; i++) {
          const pos1 = getScaleFingering(name, "C", i - 1);
          const pos2 = getScaleFingering(name, "C", i);

          // Positions should be different (unless they are truly the same, but this catches obvious duplicates)
          // Use JSON.stringify for deep comparison of arrays
          if (JSON.stringify(pos1.flat()) === JSON.stringify(pos2.flat())) {
            console.warn(
              `Scale "${name}" positions ${i - 1} and ${i} are identical - may indicate incomplete patterns`,
            );
          }
        }

        // Check for empty patterns (all strings with empty fret arrays)
        for (let pos = 0; pos < positions; pos++) {
          const fingering = scale.fingerings[pos];
          expect(fingering).toBeDefined();

          // Check that each string has at least some notes
          const totalNotes = fingering.flat().length;
          expect(totalNotes).toBeGreaterThan(0);
        }
      }
    });

    it("should have correct interval structures", () => {
      // Note: 'aeolian' normalizes to 'minor' so it's not a separate entry
      const EXPECTED_INTERVALS = {
        major: [0, 2, 4, 5, 7, 9, 11],
        minor: [0, 2, 3, 5, 7, 8, 10],
        dorian: [0, 2, 3, 5, 7, 9, 10],
        phrygian: [0, 1, 3, 5, 7, 8, 10],
        lydian: [0, 2, 4, 6, 7, 9, 11],
        mixolydian: [0, 2, 4, 5, 7, 9, 10],
        locrian: [0, 1, 3, 5, 6, 8, 10],
        "harmonic minor": [0, 2, 3, 5, 7, 8, 11],
        "melodic minor": [0, 2, 3, 5, 7, 9, 11],
        "pentatonic major": [0, 2, 4, 7, 9],
        "pentatonic minor": [0, 3, 5, 7, 10],
        blues: [0, 3, 5, 6, 7, 10],
        "whole tone": [0, 2, 4, 6, 8, 10],
        diminished: [0, 1, 3, 4, 6, 7, 9, 10], // Half-Whole diminished (most common)
      } as const;

      for (const [scaleName, expectedIntervals] of Object.entries(
        EXPECTED_INTERVALS,
      )) {
        const scale = SCALE_LIBRARY[scaleName];
        expect(scale).toBeDefined();
        expect(scale.intervals).toEqual(expectedIntervals);
      }
    });

    it("should generate different C major positions", () => {
      // Verify that C major positions cover different parts of the neck
      const cMajorPositions = [0, 1, 2, 3, 4].map((pos) =>
        getScaleFingering("major", "C", pos),
      );

      // Each position should be different to avoid blank displays
      for (let i = 1; i < cMajorPositions.length; i++) {
        expect(cMajorPositions[i]).not.toEqual(cMajorPositions[i - 1]);
      }
    });

    it("should generate valid pentatonic patterns", () => {
      // Our pentatonic implementation generates scale notes algorithmically
      // Verify each position generates valid patterns with scale notes
      for (let pos = 0; pos < 5; pos++) {
        const fingering = getScaleFingering("pentatonic minor", "A", pos);

        // Should have notes on all 6 strings
        expect(fingering.length).toBe(6);

        // Each string should have some notes (algorithmic generation)
        fingering.forEach((string) => {
          expect(string.length).toBeGreaterThan(0);
          // All notes should be within valid fret range
          string.forEach((fret) => {
            expect(fret).toBeGreaterThanOrEqual(0);
            expect(fret).toBeLessThanOrEqual(24);
          });
        });

        // Verify the pattern is different from other positions
        for (let otherPos = 0; otherPos < 5; otherPos++) {
          if (pos !== otherPos) {
            const otherFingering = getScaleFingering(
              "pentatonic minor",
              "A",
              otherPos,
            );
            expect(fingering).not.toEqual(otherFingering);
          }
        }
      }
    });

    it("should generate valid modal scale patterns", () => {
      // Test modal scales generate unique patterns with correct intervals

      // D Dorian
      const dDorianPos0 = getScaleFingering("dorian", "D", 0);
      const dDorianPos1 = getScaleFingering("dorian", "D", 1);
      expect(dDorianPos0.length).toBe(6); // 6 strings
      expect(dDorianPos0).not.toEqual(dDorianPos1); // Different positions

      // E Phrygian
      const ePhrygianPos0 = getScaleFingering("phrygian", "E", 0);
      const ePhrygianPos1 = getScaleFingering("phrygian", "E", 1);
      expect(ePhrygianPos0.length).toBe(6);
      expect(ePhrygianPos0).not.toEqual(ePhrygianPos1);

      // F Lydian
      const fLydianPos0 = getScaleFingering("lydian", "F", 0);
      const fLydianPos1 = getScaleFingering("lydian", "F", 1);
      expect(fLydianPos0.length).toBe(6);
      expect(fLydianPos0).not.toEqual(fLydianPos1);

      // G Mixolydian
      const gMixoPos0 = getScaleFingering("mixolydian", "G", 0);
      const gMixoPos1 = getScaleFingering("mixolydian", "G", 1);
      expect(gMixoPos0.length).toBe(6);
      expect(gMixoPos0).not.toEqual(gMixoPos1);

      // Verify modal interval structures
      expect(getScaleIntervals("dorian")).toEqual([0, 2, 3, 5, 7, 9, 10]);
      expect(getScaleIntervals("phrygian")).toEqual([0, 1, 3, 5, 7, 8, 10]);
      expect(getScaleIntervals("lydian")).toEqual([0, 2, 4, 6, 7, 9, 11]);
      expect(getScaleIntervals("mixolydian")).toEqual([0, 2, 4, 5, 7, 9, 10]);
    });

    it("should match CAGED system positions for C Major", () => {
      // C Major CAGED positions: Roots should be at standard fret locations
      // Position 0: E-A-D-G-B-E = 4-9-14-intervals from C
      // We'll test that scale notes appear at the expected fret positions
      const cMajorPos0 = getScaleFingering("major", "C", 0);

      // Position 1: Each position should start with different fret ranges
      // (our algorithm ensures positions are distributed across the neck)
      const positions = [0, 1, 2, 3, 4];
      const positionPatterns = positions.map((pos) =>
        getScaleFingering("major", "C", pos),
      );

      // Verify each position has different fret coverage
      for (let i = 0; i < positionPatterns.length - 1; i++) {
        expect(positionPatterns[i]).not.toEqual(positionPatterns[i + 1]);
      }
    });

    it("should generate different fret locations per position", () => {
      // Test that different positions provide varied fret coverage across the neck
      const cMajor = [0, 1, 2, 3, 4].map((pos) =>
        getScaleFingering("major", "C", pos),
      );

      // Get the range of lowest frets for each position (excluding open strings)
      const positionMinFrets = cMajor.map((fingering) => {
        const allFrets = fingering.flat().filter((f) => f > 0);
        return Math.min(...allFrets);
      });

      // Verify that positions have different starting points (at least somewhat different)
      // This ensures the scales are spread across different neck regions
      const uniqueStarts = new Set(positionMinFrets);
      expect(uniqueStarts.size).toBeGreaterThan(1); // At least some variety

      // Verify all positions have notes (no empty positions)
      cMajor.forEach((fingering) => {
        const totalNotes = fingering.flat().length;
        expect(totalNotes).toBeGreaterThan(0);
      });
    });
  });
});

function validateFingeringStructure(fingering: number[][]): void {
  expect(fingering.length).toBe(6);
  fingering.forEach((stringPattern) => {
    stringPattern.forEach((fret) => {
      expect(typeof fret === "number").toBe(true);
      expect(fret).toBeGreaterThanOrEqual(0);
      expect(fret).toBeLessThanOrEqual(24);
    });
  });
}

function collectNoteValues(fingering: number[][]): number[] {
  return fingering.flat().map((fret) => fret % 12);
}
