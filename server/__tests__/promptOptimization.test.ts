import { describe, expect, it } from "vitest";
import { buildOptimizedPrompt } from "../promptOptimization";

describe("promptOptimization", () => {
  it("includes request context for key, mode, and chord count", () => {
    const prompt = buildOptimizedPrompt({
      key: "D",
      mode: "Mixolydian",
      includeTensions: false,
      generationStyle: "conservative",
      numChords: 5,
      selectedProgression: "auto",
    }).fullPrompt;

    expect(prompt).toContain("REQUEST CONTEXT (MUST HONOR EXACTLY)");
    expect(prompt).toContain("key: D");
    expect(prompt).toContain("mode: Mixolydian");
    expect(prompt).toContain("numChords: 5");
    expect(prompt).toContain("includeTensions: false");
    expect(prompt).toContain("generationStyle: conservative");
  });

  it("explicitly contextualizes advanced-chord mode", () => {
    const promptWithTensions = buildOptimizedPrompt({
      key: "G",
      mode: "Major",
      includeTensions: true,
      generationStyle: "balanced",
      numChords: 4,
      selectedProgression: "auto",
    }).fullPrompt;

    const promptWithoutTensions = buildOptimizedPrompt({
      key: "G",
      mode: "Major",
      includeTensions: false,
      generationStyle: "adventurous",
      numChords: 4,
      selectedProgression: "auto",
    }).fullPrompt;

    expect(promptWithTensions).toContain("ADVANCED CHORD GUIDELINES");
    expect(promptWithoutTensions).toContain("TENSIONS MODE: OFF");
  });
});
