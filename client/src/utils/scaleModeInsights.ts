import { getScaleIntervals, normalizeScaleName } from "./scaleLibrary";
import { displayNote, noteToValue, valueToNote } from "./musicTheory";
import { getMajorSystemModeProfile } from "@shared/music/scaleModes";

export interface ScaleModeInsight {
  modeName: string;
  formula: string;
  stepPattern: string;
  majorDelta?: string;
  relativeMajor?: string;
  modeDegree?: "I" | "II" | "III" | "IV" | "V" | "VI" | "VII";
  isMajorSystemMode: boolean;
}

const extractDescriptor = (scaleName: string): string => {
  const match = scaleName.trim().match(/^([A-G](?:[#b♯♭])?)(?:\s+)(.+)$/i);
  return match ? match[2] : scaleName;
};

const titleCaseWords = (value: string): string =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const intervalsToStepPattern = (intervals: number[]): string => {
  const unique = [...new Set(intervals.map((v) => ((v % 12) + 12) % 12))].sort(
    (a, b) => a - b,
  );
  if (unique.length === 0) return "";
  if (!unique.includes(0)) {
    unique.unshift(0);
  }

  const steps = unique.map((current, idx) => {
    const next = idx === unique.length - 1 ? unique[0] + 12 : unique[idx + 1];
    return String(next - current);
  });
  return steps.join("-");
};

const intervalToFormulaToken = (interval: number, intervalsSet: Set<number>): string => {
  const normalized = ((interval % 12) + 12) % 12;
  const hasMajorThird = intervalsSet.has(4);
  const hasMinorThird = intervalsSet.has(3);
  switch (normalized) {
    case 0:
      return "1";
    case 1:
      return "b2";
    case 2:
      return "2";
    case 3:
      return "b3";
    case 4:
      return "3";
    case 5:
      return "4";
    case 6:
      return intervalsSet.has(7) || (hasMajorThird && !hasMinorThird)
        ? "#4"
        : "b5";
    case 7:
      return "5";
    case 8:
      return hasMajorThird && !hasMinorThird ? "#5" : "b6";
    case 9:
      return "6";
    case 10:
      return "b7";
    case 11:
      return "7";
    default:
      return String(normalized);
  }
};

const intervalsToFormula = (intervals: number[]): string => {
  const unique = [...new Set(intervals.map((v) => ((v % 12) + 12) % 12))].sort(
    (a, b) => a - b,
  );
  if (unique.length === 0) return "";
  if (!unique.includes(0)) {
    unique.unshift(0);
  }

  const intervalsSet = new Set(unique);
  return unique
    .map((interval) => intervalToFormulaToken(interval, intervalsSet))
    .join(" ");
};

export function getScaleModeInsight(
  scaleName: string,
  rootNote: string,
  accidentalContext: string,
): ScaleModeInsight {
  const normalizedKey = normalizeScaleName(scaleName);
  const descriptor = extractDescriptor(scaleName);
  const scaleIntervals = getScaleIntervals(scaleName);
  const stepPattern = intervalsToStepPattern(scaleIntervals);
  const knownMode = getMajorSystemModeProfile(normalizedKey);

  if (knownMode) {
    const rootValue = noteToValue(rootNote);
    const parentMajorValue = (rootValue + knownMode.parentMajorShift + 12) % 12;
    const parentMajorRoot = displayNote(
      valueToNote(parentMajorValue),
      accidentalContext,
    );
    const relativeMajor = `${parentMajorRoot} Major`;

    return {
      modeName: knownMode.canonical,
      formula: knownMode.formula,
      stepPattern,
      majorDelta: knownMode.majorDelta,
      relativeMajor,
      modeDegree: knownMode.degreeRoman,
      isMajorSystemMode: true,
    };
  }

  const genericFormula = intervalsToFormula(scaleIntervals);
  return {
    modeName: titleCaseWords(descriptor),
    formula: genericFormula,
    stepPattern,
    isMajorSystemMode: false,
  };
}
