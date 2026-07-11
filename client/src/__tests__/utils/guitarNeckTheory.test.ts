/**
 * Guitar-neck theory regression: fretted notes, open shapes, key spelling.
 */
import { describe, it, expect } from "vitest";
import {
  STANDARD_TUNING_VALUES,
  valueToNote,
  getNoteAtFret,
  displayNote,
  getKeyAccidentalType,
} from "@/utils/musicTheory";
import { getChordNotes } from "@/utils/chordAnalysis";
import { getScaleFingering, validateFingeringNotes } from "@/utils/scaleLibrary";
import { splitChordName } from "@shared/music/chordQualities";
import {
  extractVoicingNotes,
  validateVoicingNotes,
  getChordVoicingsAsync,
  preloadAllChords,
} from "@/utils/chords/index";
import type { ChordVoicing } from "@/types";

describe("guitar neck theory", () => {
  it("uses standard tuning EADGBE (low→high)", () => {
    expect([...STANDARD_TUNING_VALUES]).toEqual([4, 9, 2, 7, 11, 4]);
    expect(STANDARD_TUNING_VALUES.map((v) => valueToNote(v))).toEqual([
      "E",
      "A",
      "D",
      "G",
      "B",
      "E",
    ]);
  });

  it("maps frets to correct notes on each string", () => {
    expect(getNoteAtFret("E", 0)).toBe("E");
    expect(getNoteAtFret("E", 1)).toBe("F");
    expect(getNoteAtFret("A", 2)).toBe("B");
    expect(getNoteAtFret("D", 3)).toBe("F");
    expect(getNoteAtFret("G", 0)).toBe("G");
    expect(getNoteAtFret("B", 1)).toBe("C");
  });

  it("open C shape x32010 is C-E-G-C-E", () => {
    const voicing: ChordVoicing = { frets: ["x", 3, 2, 0, 1, 0], position: "Open" };
    const notes = [...extractVoicingNotes(voicing)].map(valueToNote).sort();
    expect(notes).toEqual(["C", "E", "G"].sort());
    expect(validateVoicingNotes(voicing, "C")).toBe(true);
  });

  it("parses flat-key guitar chords for library lookup", () => {
    expect(splitChordName("Bb").root).toBe("Bb");
    expect(splitChordName("Bbmaj7").root).toBe("Bb");
    expect(getChordNotes("Bb")).toEqual(["A#", "D", "F"]); // pitch classes via sharp spelling
  });

  it("loads Bb voicings after correct root parse", async () => {
    await preloadAllChords();
    const voicings = await getChordVoicingsAsync("Bb");
    expect(voicings.length).toBeGreaterThan(0);
    for (const v of voicings) {
      expect(validateVoicingNotes(v, "Bb")).toBe(true);
    }
  });

  it("C major 3NPS positions are valid on the fretboard", () => {
    for (let pos = 0; pos < 7; pos++) {
      const fingering = getScaleFingering("major", "C", pos);
      const validation = validateFingeringNotes(fingering, "C", "C major");
      expect(validation.isValid, `pos ${pos + 1}: ${validation.invalidNotes.join("; ")}`).toBe(
        true
      );
      fingering.forEach((stringFrets) => expect(stringFrets.length).toBe(3));
    }
  });

  it("A minor uses natural key signature for neck labels", () => {
    expect(getKeyAccidentalType("A", "Minor")).toBe("natural");
    expect(displayNote("A#", "A", "minor")).toBe("Bb");
    expect(displayNote("F", "A", "minor")).toBe("F");
  });
});
