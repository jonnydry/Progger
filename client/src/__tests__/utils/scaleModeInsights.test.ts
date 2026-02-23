import { describe, expect, it } from "vitest";
import { getScaleModeInsight } from "@/utils/scaleModeInsights";

describe("getScaleModeInsight", () => {
  it("returns major-system insights for Dorian with relative major mapping", () => {
    const insight = getScaleModeInsight("D Dorian", "D", "C");

    expect(insight.isMajorSystemMode).toBe(true);
    expect(insight.formula).toBe("1 2 b3 4 5 6 b7");
    expect(insight.modeDegree).toBe("II");
    expect(insight.relativeMajor).toBe("C Major");
    expect(insight.majorDelta).toBe("b3, b7");
  });

  it("handles Ionian/Major mapping", () => {
    const insight = getScaleModeInsight("C Major", "C", "C");

    expect(insight.isMajorSystemMode).toBe(true);
    expect(insight.formula).toBe("1 2 3 4 5 6 7");
    expect(insight.modeDegree).toBe("I");
    expect(insight.relativeMajor).toBe("C Major");
  });

  it("falls back to generic interval formulas for non-major-system scales", () => {
    const insight = getScaleModeInsight("C Whole Tone", "C", "C");

    expect(insight.isMajorSystemMode).toBe(false);
    expect(insight.formula).toBe("1 2 3 #4 #5 b7");
    expect(insight.stepPattern).toBe("2-2-2-2-2-2");
    expect(insight.relativeMajor).toBeUndefined();
  });
});
