import { describe, expect, it } from "vitest";
import { ValidationError, validateProgressionRequest } from "../utils/validation";

describe("validation", () => {
  it("defaults generationStyle to balanced when omitted", () => {
    const result = validateProgressionRequest({
      key: "C",
      mode: "Major",
      includeTensions: false,
      numChords: 4,
      selectedProgression: "auto",
    });

    expect(result.generationStyle).toBe("balanced");
  });

  it("rejects invalid generationStyle values", () => {
    expect(() =>
      validateProgressionRequest({
        key: "C",
        mode: "Major",
        includeTensions: false,
        generationStyle: "wild",
        numChords: 4,
        selectedProgression: "auto",
      }),
    ).toThrow(ValidationError);
  });

  it("accepts Ionian as an alias for Major mode", () => {
    const result = validateProgressionRequest({
      key: "C",
      mode: "Ionian",
      includeTensions: false,
      generationStyle: "balanced",
      numChords: 4,
      selectedProgression: "auto",
    });

    expect(result.mode).toBe("Ionian");
  });
});
