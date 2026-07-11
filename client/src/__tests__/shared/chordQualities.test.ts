import { describe, it, expect } from "vitest";
import { resolveChordQuality, splitChordName } from "@shared/music/chordQualities";

describe("shared/music/chordQualities", () => {
  it("normalizes complex dominant alterations", () => {
    const result = resolveChordQuality("7#9b13");
    expect(result.normalized).toBe("7#9b13");
    expect(result.recognized).toBe(true);
  });

  it("normalizes minor major seventh hybrids", () => {
    const result = resolveChordQuality("min/maj7");
    expect(result.normalized).toBe("min/maj7");
    expect(result.recognized).toBe(true);
  });

  it("normalizes delta notation", () => {
    const result = resolveChordQuality("Δ7");
    expect(result.normalized).toBe("maj7");
    expect(result.recognized).toBe(true);
  });

  it("normalizes flat roots without uppercasing the accidental", () => {
    expect(splitChordName("Bbmaj9")).toEqual({
      root: "Bb",
      quality: "maj9",
      bass: undefined,
    });
    expect(splitChordName("Eb7")).toEqual({
      root: "Eb",
      quality: "7",
      bass: undefined,
    });
    expect(splitChordName("F#m7b5/A")).toEqual({
      root: "F#",
      quality: "min7b5",
      bass: "A",
    });
  });

  it("identifies unsupported qualities", () => {
    const result = resolveChordQuality("mystery13");
    expect(result.normalized).toBe("major");
    expect(result.recognized).toBe(false);
  });
});
