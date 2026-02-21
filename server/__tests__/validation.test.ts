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
});
