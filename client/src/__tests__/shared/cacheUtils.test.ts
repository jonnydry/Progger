import { describe, expect, it } from "vitest";
import { getProgressionCacheKey } from "@shared/cacheUtils";

describe("shared cacheUtils", () => {
  it("normalizes mode aliases to the same cache key token", () => {
    const majorKey = getProgressionCacheKey(
      "C",
      "Major",
      false,
      4,
      "auto",
      "balanced",
    );
    const ionianKey = getProgressionCacheKey(
      "C",
      "Ionian",
      false,
      4,
      "auto",
      "balanced",
    );

    expect(majorKey).toBe(ionianKey);
  });
});
