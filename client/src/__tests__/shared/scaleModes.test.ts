import { describe, expect, it } from "vitest";
import {
  normalizeScaleDescriptor,
  normalizeModeCanonical,
  getMajorSystemModeProfile,
} from "@shared/music/scaleModes";

describe("shared scaleModes", () => {
  it("normalizes Natural Minor and Ionian aliases", () => {
    expect(normalizeScaleDescriptor("Natural Minor")?.libraryKey).toBe("minor");
    expect(normalizeScaleDescriptor("Ionian")?.libraryKey).toBe("major");
  });

  it("normalizes mode canonical names regardless of case", () => {
    expect(normalizeModeCanonical("dorian")).toBe("Dorian");
    expect(normalizeModeCanonical("aeolian")).toBe("Minor");
  });

  it("returns major-system mode profiles", () => {
    const profile = getMajorSystemModeProfile("Mixolydian");
    expect(profile?.degreeRoman).toBe("V");
    expect(profile?.formula).toBe("1 2 3 4 5 6 b7");
  });
});
