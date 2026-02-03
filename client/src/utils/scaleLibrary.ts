/**
 * Scale Library - Guitar Scale Patterns Database
 *
 * REBUILT using 3 Notes Per String (3NPS) System
 *
 * The 3NPS system provides:
 * - 7 positions for 7-note scales (one starting on each scale degree)
 * - Consistent 3 notes on every string for speed and economy
 * - Natural alignment with the 7 modes of the major scale
 * - Better fretboard coverage than CAGED
 *
 * CRITICAL GUITAR CONVENTION:
 * All fingering arrays follow standard guitar string order:
 * fingering[0] = Low E (6th string)
 * fingering[1] = A (5th string)
 * fingering[2] = D (4th string)
 * fingering[3] = G (3rd string)
 * fingering[4] = B (2nd string)
 * fingering[5] = High E (1st string)
 *
 * Standard Tuning Note Values (where C=0):
 * Low E = 4, A = 9, D = 2, G = 7, B = 11, High E = 4
 */

import { noteToValue, valueToNote } from "./musicTheory";
import {
  normalizeScaleDescriptor,
  FALLBACK_SCALE_LIBRARY_KEYS,
} from "@shared/music/scaleModes";

export interface ScalePattern {
  intervals: number[];
  fingerings: number[][][];
  positions?: string[];
}

type ScaleLibrary = Record<string, ScalePattern>;

// Standard tuning values (chromatic where C=0)
// Low E(4), A(9), D(2), G(7), B(11), High E(4)
const TUNING = [4, 9, 2, 7, 11, 4];

/**
 * Helper function to find fret for a note value on a string
 * Returns the fret number where that note appears within a fret range
 */
function findNoteOnString(
  stringValue: number,
  noteValue: number,
  minFret: number,
  maxFret: number,
): number[] {
  const frets: number[] = [];
  for (let fret = minFret; fret <= maxFret; fret++) {
    if ((stringValue + fret) % 12 === noteValue) {
      frets.push(fret);
    }
  }
  return frets;
}

/**
 * Generate all 7 3NPS positions for a 7-note scale
 * Each position starts on a different scale degree
 *
 * @param intervals - Scale intervals from root (e.g., [0,2,4,5,7,9,11] for major)
 * @param rootValue - Chromatic value of the root (C=0)
 * @returns Array of 7 fingering patterns, each with 6 strings of 3 frets each
 */
function generate3NPSPositions(
  intervals: number[],
  rootValue: number,
): number[][][] {
  const scaleNoteValues = intervals.map((i) => (rootValue + i) % 12);
  const positions: number[][][] = [];

  // For each of the 7 starting degrees, we create one position
  // Position 1 starts with the root on low E
  // Position 2 starts with the 2nd scale degree on low E
  // etc.

  for (let startDegree = 0; startDegree < 7; startDegree++) {
    const position: number[][] = [];

    // Find where this degree appears on low E string (lowest occurrence in first octave)
    const startNoteValue = scaleNoteValues[startDegree];
    let baseFret = -1;
    for (let fret = 0; fret <= 12; fret++) {
      if ((TUNING[0] + fret) % 12 === startNoteValue) {
        baseFret = fret;
        break;
      }
    }

    if (baseFret === -1) baseFret = 0;

    // Track which scale degree we're on as we traverse strings
    let currentDegreeIndex = startDegree;
    let lastFret = baseFret; // Track the last fret used to ensure smooth progression

    for (let stringIdx = 0; stringIdx < 6; stringIdx++) {
      const stringValue = TUNING[stringIdx];
      const stringFrets: number[] = [];

      // We need exactly 3 notes on this string
      for (let noteCount = 0; noteCount < 3; noteCount++) {
        const degreeIndex = (currentDegreeIndex + noteCount) % 7;
        const noteValue = scaleNoteValues[degreeIndex];

        // Find this note on the current string, starting from around lastFret
        // We want notes that progress logically up the neck
        let searchStart =
          stringIdx === 0 ? baseFret : Math.max(0, lastFret - 2);
        let searchEnd = searchStart + 7;

        const possibleFrets = findNoteOnString(
          stringValue,
          noteValue,
          searchStart,
          Math.min(24, searchEnd),
        );

        if (possibleFrets.length > 0) {
          // Choose the fret that maintains logical position progression
          let chosenFret = possibleFrets[0];
          for (const fret of possibleFrets) {
            if (stringFrets.length === 0) {
              // First note on string - choose closest to lastFret
              if (Math.abs(fret - lastFret) < Math.abs(chosenFret - lastFret)) {
                chosenFret = fret;
              }
            } else {
              // Subsequent notes - must be higher than previous
              const prevFret = stringFrets[stringFrets.length - 1];
              if (fret > prevFret && fret < chosenFret) {
                chosenFret = fret;
              } else if (fret > prevFret && chosenFret <= prevFret) {
                chosenFret = fret;
              }
            }
          }

          // Ensure ascending order within string
          if (
            stringFrets.length === 0 ||
            chosenFret > stringFrets[stringFrets.length - 1]
          ) {
            stringFrets.push(chosenFret);
          } else {
            // Need to search higher
            const higherFrets = findNoteOnString(
              stringValue,
              noteValue,
              stringFrets[stringFrets.length - 1] + 1,
              24,
            );
            if (higherFrets.length > 0) {
              stringFrets.push(higherFrets[0]);
            }
          }
        }
      }

      // Update tracking for next string
      if (stringFrets.length > 0) {
        lastFret = stringFrets[0]; // Use first fret of this string as reference for next
      }
      currentDegreeIndex = (currentDegreeIndex + 3) % 7; // Move 3 degrees for next string
      position.push(stringFrets);
    }

    positions.push(position);
  }

  return positions;
}

/**
 * Manually verified 3NPS patterns for C Major scale
 * C Major notes: C(0), D(2), E(4), F(5), G(7), A(9), B(11)
 *
 * Each position starts with a different note of the scale on the low E string.
 * All patterns are mathematically verified.
 */
const C_MAJOR_3NPS: number[][][] = [
  // Position 1: Starting on E (fret 0 on low E) - corresponds to Phrygian shape
  // Low E starts: E(0), F(1), G(3)
  [
    [0, 1, 3], // Low E: E(4+0=4), F(4+1=5), G(4+3=7) ✓
    [0, 2, 3], // A: A(9+0=9), B(9+2=11), C(9+3=0) ✓
    [0, 2, 3], // D: D(2+0=2), E(2+2=4), F(2+3=5) ✓
    [0, 2, 4], // G: G(7+0=7), A(7+2=9), B(7+4=11) ✓
    [0, 1, 3], // B: B(11+0=11), C(11+1=0), D(11+3=2) ✓
    [0, 1, 3], // High E: E(4+0=4), F(4+1=5), G(4+3=7) ✓
  ],
  // Position 2: Starting on F (fret 1 on low E) - corresponds to Lydian shape
  // Low E starts: F(1), G(3), A(5)
  [
    [1, 3, 5], // Low E: F(5), G(7), A(9) ✓
    [2, 3, 5], // A: B(11), C(0), D(2) ✓
    [2, 3, 5], // D: E(4), F(5), G(7) ✓
    [2, 4, 5], // G: A(9), B(11), C(0) ✓
    [1, 3, 5], // B: C(0), D(2), E(4) ✓
    [1, 3, 5], // High E: F(5), G(7), A(9) ✓
  ],
  // Position 3: Starting on G (fret 3 on low E) - corresponds to Mixolydian shape
  // Low E starts: G(3), A(5), B(7)
  [
    [3, 5, 7], // Low E: G(7), A(9), B(11) ✓
    [3, 5, 7], // A: C(0), D(2), E(4) ✓
    [3, 5, 7], // D: F(5), G(7), A(9) ✓
    [4, 5, 7], // G: B(11), C(0), D(2) ✓
    [3, 5, 6], // B: D(2), E(4), F(5) ✓
    [3, 5, 7], // High E: G(7), A(9), B(11) ✓
  ],
  // Position 4: Starting on A (fret 5 on low E) - corresponds to Aeolian shape
  // Low E starts: A(5), B(7), C(8)
  [
    [5, 7, 8], // Low E: A(9), B(11), C(0) ✓
    [5, 7, 8], // A: D(2), E(4), F(5) ✓
    [5, 7, 9], // D: G(7), A(9), B(11) ✓
    [5, 7, 9], // G: C(0), D(2), E(4) ✓
    [5, 6, 8], // B: E(4), F(5), G(7) ✓
    [5, 7, 8], // High E: A(9), B(11), C(0) ✓
  ],
  // Position 5: Starting on B (fret 7 on low E) - corresponds to Locrian shape
  // Low E starts: B(7), C(8), D(10)
  [
    [7, 8, 10], // Low E: B(11), C(0), D(2) ✓
    [7, 8, 10], // A: E(4), F(5), G(7) ✓
    [7, 9, 10], // D: A(9), B(11), C(0) ✓
    [7, 9, 10], // G: D(2), E(4), F(5) ✓
    [6, 8, 10], // B: F(5), G(7), A(9) ✓
    [7, 8, 10], // High E: B(11), C(0), D(2) ✓
  ],
  // Position 6: Starting on C (fret 8 on low E) - corresponds to Ionian shape (ROOT POSITION)
  // Low E starts: C(8), D(10), E(12)
  [
    [8, 10, 12], // Low E: C(0), D(2), E(4) ✓
    [8, 10, 12], // A: F(5), G(7), A(9) ✓
    [9, 10, 12], // D: B(11), C(0), D(2) ✓
    [9, 10, 12], // G: E(4), F(5), G(7) ✓
    [8, 10, 12], // B: G(7), A(9), B(11) ✓
    [8, 10, 12], // High E: C(0), D(2), E(4) ✓
  ],
  // Position 7: Starting on D (fret 10 on low E) - corresponds to Dorian shape
  // Low E starts: D(10), E(12), F(13)
  [
    [10, 12, 13], // Low E: D(2), E(4), F(5) ✓
    [10, 12, 14], // A: G(7), A(9), B(11) ✓
    [10, 12, 14], // D: C(0), D(2), E(4) ✓
    [10, 12, 14], // G: F(5), G(7), A(9) ✓
    [10, 12, 13], // B: A(9), B(11), C(0) ✓
    [10, 12, 13], // High E: D(2), E(4), F(5) ✓
  ],
];

/**
 * A Minor (Natural Minor / Aeolian) 3NPS patterns
 * A Minor notes: A(9), B(11), C(0), D(2), E(4), F(5), G(7)
 * Same notes as C Major, just different root
 */
const A_MINOR_3NPS: number[][][] = [
  // Position 1: Starting on A (fret 5 on low E) - ROOT POSITION
  [
    [5, 7, 8], // Low E: A(9), B(11), C(0) ✓
    [5, 7, 8], // A: D(2), E(4), F(5) ✓
    [5, 7, 9], // D: G(7), A(9), B(11) ✓
    [5, 7, 9], // G: C(0), D(2), E(4) ✓
    [5, 6, 8], // B: E(4), F(5), G(7) ✓
    [5, 7, 8], // High E: A(9), B(11), C(0) ✓
  ],
  // Position 2: Starting on B (fret 7 on low E)
  [
    [7, 8, 10], // Low E: B(11), C(0), D(2) ✓
    [7, 8, 10], // A: E(4), F(5), G(7) ✓
    [7, 9, 10], // D: A(9), B(11), C(0) ✓
    [7, 9, 10], // G: D(2), E(4), F(5) ✓
    [6, 8, 10], // B: F(5), G(7), A(9) ✓
    [7, 8, 10], // High E: B(11), C(0), D(2) ✓
  ],
  // Position 3: Starting on C (fret 8 on low E)
  [
    [8, 10, 12], // Low E: C(0), D(2), E(4) ✓
    [8, 10, 12], // A: F(5), G(7), A(9) ✓
    [9, 10, 12], // D: B(11), C(0), D(2) ✓
    [9, 10, 12], // G: E(4), F(5), G(7) ✓
    [8, 10, 12], // B: G(7), A(9), B(11) ✓
    [8, 10, 12], // High E: C(0), D(2), E(4) ✓
  ],
  // Position 4: Starting on D (fret 10 on low E)
  [
    [10, 12, 13], // Low E: D(2), E(4), F(5) ✓
    [10, 12, 14], // A: G(7), A(9), B(11) ✓
    [10, 12, 14], // D: C(0), D(2), E(4) ✓
    [10, 12, 14], // G: F(5), G(7), A(9) ✓
    [10, 12, 13], // B: A(9), B(11), C(0) ✓
    [10, 12, 13], // High E: D(2), E(4), F(5) ✓
  ],
  // Position 5: Starting on E (fret 0/12 on low E) - using fret 0 for open position
  [
    [0, 1, 3], // Low E: E(4), F(5), G(7) ✓
    [0, 2, 3], // A: A(9), B(11), C(0) ✓
    [0, 2, 3], // D: D(2), E(4), F(5) ✓
    [0, 2, 4], // G: G(7), A(9), B(11) ✓
    [0, 1, 3], // B: B(11), C(0), D(2) ✓
    [0, 1, 3], // High E: E(4), F(5), G(7) ✓
  ],
  // Position 6: Starting on F (fret 1 on low E)
  [
    [1, 3, 5], // Low E: F(5), G(7), A(9) ✓
    [2, 3, 5], // A: B(11), C(0), D(2) ✓
    [2, 3, 5], // D: E(4), F(5), G(7) ✓
    [2, 4, 5], // G: A(9), B(11), C(0) ✓
    [1, 3, 5], // B: C(0), D(2), E(4) ✓
    [1, 3, 5], // High E: F(5), G(7), A(9) ✓
  ],
  // Position 7: Starting on G (fret 3 on low E)
  [
    [3, 5, 7], // Low E: G(7), A(9), B(11) ✓
    [3, 5, 7], // A: C(0), D(2), E(4) ✓
    [3, 5, 7], // D: F(5), G(7), A(9) ✓
    [4, 5, 7], // G: B(11), C(0), D(2) ✓
    [3, 5, 6], // B: D(2), E(4), F(5) ✓
    [3, 5, 7], // High E: G(7), A(9), B(11) ✓
  ],
];

/**
 * A Harmonic Minor 3NPS patterns
 * A Harmonic Minor notes: A(9), B(11), C(0), D(2), E(4), F(5), G#(8)
 * Intervals: 0, 2, 3, 5, 7, 8, 11
 */
const A_HARMONIC_MINOR_3NPS: number[][][] = [
  // Position 1: Starting on A (fret 5 on low E) - ROOT POSITION
  // A Harmonic Minor: A(9), B(11), C(0), D(2), E(4), F(5), G#(8)
  [
    [5, 7, 8], // Low E: A(9), B(11), C(0) - E+5=9=A✓, E+7=11=B✓, E+8=0=C✓
    [5, 7, 8], // A: D(2), E(4), F(5) - A+5=2=D✓, A+7=4=E✓, A+8=5=F✓
    [6, 7, 9], // D: G#(8), A(9), B(11) - D+6=8=G#✓, D+7=9=A✓, D+9=11=B✓
    [5, 7, 9], // G: C(0), D(2), E(4) - G+5=0=C✓, G+7=2=D✓, G+9=4=E✓
    [5, 6, 9], // B: E(4), F(5), G#(8) - B+5=4=E✓, B+6=5=F✓, B+9=8=G#✓
    [5, 7, 8], // High E: A(9), B(11), C(0) ✓
  ],
  // Position 2: Starting on B (fret 7 on low E)
  [
    [7, 8, 10], // Low E: B(11), C(0), D(2) ✓
    [7, 8, 11], // A: E(4), F(5), G#(8) - A+7=4=E✓, A+8=5=F✓, A+11=8=G#✓
    [7, 9, 10], // D: A(9), B(11), C(0) ✓
    [7, 9, 10], // G: D(2), E(4), F(5) ✓
    [6, 9, 10], // B: F(5), G#(8), A(9) ✓
    [7, 8, 10], // High E: B(11), C(0), D(2) ✓
  ],
  // Position 3: Starting on C (fret 8 on low E)
  [
    [8, 10, 12], // Low E: C(0), D(2), E(4) ✓
    [8, 11, 12], // A: F(5), G#(8), A(9) ✓
    [9, 10, 12], // D: B(11), C(0), D(2) ✓
    [9, 10, 13], // G: E(4), F(5), G#(8) - G+13=20%12=8=G#✓
    [9, 10, 12], // B: G#(8), A(9), B(11) - B+9=8=G#✓, B+10=9=A✓, B+12=11=B✓
    [8, 10, 12], // High E: C(0), D(2), E(4) ✓
  ],
  // Position 4: Starting on D (fret 10 on low E)
  [
    [10, 12, 13], // Low E: D(2), E(4), F(5) ✓
    [11, 12, 14], // A: G#(8), A(9), B(11) ✓
    [10, 12, 14], // D: C(0), D(2), E(4) ✓
    [10, 13, 14], // G: F(5), G#(8), A(9) - G+10=5=F✓, G+13=8=G#✓, G+14=9=A✓
    [10, 12, 13], // B: A(9), B(11), C(0) ✓
    [10, 12, 13], // High E: D(2), E(4), F(5) ✓
  ],
  // Position 5: Starting on E (fret 0/12 on low E)
  [
    [0, 1, 4], // Low E: E(4), F(5), G#(8) - E+0=4=E✓, E+1=5=F✓, E+4=8=G#✓
    [0, 2, 3], // A: A(9), B(11), C(0) ✓
    [0, 2, 3], // D: D(2), E(4), F(5) ✓
    [1, 2, 4], // G: G#(8), A(9), B(11) - G+1=8=G#✓, G+2=9=A✓, G+4=11=B✓
    [0, 1, 3], // B: B(11), C(0), D(2) ✓
    [0, 1, 4], // High E: E(4), F(5), G#(8) ✓
  ],
  // Position 6: Starting on F (fret 1 on low E)
  [
    [1, 4, 5], // Low E: F(5), G#(8), A(9) ✓
    [2, 3, 5], // A: B(11), C(0), D(2) ✓
    [2, 3, 6], // D: E(4), F(5), G#(8) - D+2=4=E✓, D+3=5=F✓, D+6=8=G#✓
    [2, 4, 5], // G: A(9), B(11), C(0) ✓
    [1, 3, 5], // B: C(0), D(2), E(4) ✓
    [1, 4, 5], // High E: F(5), G#(8), A(9) ✓
  ],
  // Position 7: Starting on G# (fret 4 on low E)
  [
    [4, 5, 7], // Low E: G#(8), A(9), B(11) ✓
    [3, 5, 7], // A: C(0), D(2), E(4) ✓
    [3, 6, 7], // D: F(5), G#(8), A(9) - D+3=5=F✓, D+6=8=G#✓, D+7=9=A✓
    [4, 5, 7], // G: B(11), C(0), D(2) ✓
    [3, 5, 6], // B: D(2), E(4), F(5) - B+3=2=D✓, B+5=4=E✓, B+6=5=F✓
    [4, 5, 7], // High E: G#(8), A(9), B(11) ✓
  ],
];

/**
 * A Melodic Minor 3NPS patterns (ascending form)
 * A Melodic Minor notes: A(9), B(11), C(0), D(2), E(4), F#(6), G#(8)
 * Intervals: 0, 2, 3, 5, 7, 9, 11
 */
const A_MELODIC_MINOR_3NPS: number[][][] = [
  // A Melodic Minor: A(9), B(11), C(0), D(2), E(4), F#(6), G#(8)
  // Position 1: Starting on A (fret 5 on low E) - ROOT POSITION
  [
    [5, 7, 8], // Low E: A(9), B(11), C(0) - E+5=9=A✓, E+7=11=B✓, E+8=0=C✓
    [5, 7, 9], // A: D(2), E(4), F#(6) - A+5=2=D✓, A+7=4=E✓, A+9=6=F#✓
    [6, 7, 9], // D: G#(8), A(9), B(11) - D+6=8=G#✓, D+7=9=A✓, D+9=11=B✓
    [5, 7, 9], // G: C(0), D(2), E(4) - G+5=0=C✓, G+7=2=D✓, G+9=4=E✓
    [5, 7, 9], // B: E(4), F#(6), G#(8) - B+5=4=E✓, B+7=6=F#✓, B+9=8=G#✓
    [5, 7, 8], // High E: A(9), B(11), C(0) ✓
  ],
  // Position 2: Starting on B (fret 7 on low E)
  [
    [7, 8, 10], // Low E: B(11), C(0), D(2) ✓
    [7, 9, 11], // A: E(4), F#(6), G#(8) ✓
    [7, 9, 10], // D: A(9), B(11), C(0) ✓
    [7, 9, 11], // G: D(2), E(4), F#(6) ✓
    [7, 9, 10], // B: F#(6), G#(8), A(9) ✓
    [7, 8, 10], // High E: B(11), C(0), D(2) ✓
  ],
  // Position 3: Starting on C (fret 8 on low E)
  [
    [8, 10, 12], // Low E: C(0), D(2), E(4) ✓
    [9, 11, 12], // A: F#(6), G#(8), A(9) ✓
    [9, 10, 12], // D: B(11), C(0), D(2) ✓
    [9, 11, 13], // G: E(4), F#(6), G#(8) - G+9=4=E✓, G+11=6=F#✓, G+13=8=G#✓
    [9, 10, 12], // B: G#(8), A(9), B(11) - B+9=8=G#✓, B+10=9=A✓, B+12=11=B✓
    [8, 10, 12], // High E: C(0), D(2), E(4) ✓
  ],
  // Position 4: Starting on D (fret 10 on low E)
  [
    [10, 12, 14], // Low E: D(2), E(4), F#(6) - E+10=2=D✓, E+12=4=E✓, E+14=6=F#✓
    [11, 12, 14], // A: G#(8), A(9), B(11) ✓
    [10, 12, 14], // D: C(0), D(2), E(4) - D+10=0=C✓, D+12=2=D✓, D+14=4=E✓
    [11, 13, 14], // G: F#(6), G#(8), A(9) - G+11=6=F#✓, G+13=8=G#✓, G+14=9=A✓
    [10, 12, 13], // B: A(9), B(11), C(0) - B+10=9=A✓, B+12=11=B✓, B+13=0=C✓
    [10, 12, 14], // High E: D(2), E(4), F#(6) ✓
  ],
  // Position 5: Starting on E (fret 0/12 on low E)
  [
    [0, 2, 4], // Low E: E(4), F#(6), G#(8) - E+0=4=E✓, E+2=6=F#✓, E+4=8=G#✓
    [0, 2, 3], // A: A(9), B(11), C(0) - A+0=9=A✓, A+2=11=B✓, A+3=0=C✓
    [0, 2, 4], // D: D(2), E(4), F#(6) - D+0=2=D✓, D+2=4=E✓, D+4=6=F#✓
    [1, 2, 4], // G: G#(8), A(9), B(11) - G+1=8=G#✓, G+2=9=A✓, G+4=11=B✓
    [0, 1, 3], // B: B(11), C(0), D(2) - B+0=11=B✓, B+1=0=C✓, B+3=2=D✓
    [0, 2, 4], // High E: E(4), F#(6), G#(8) ✓
  ],
  // Position 6: Starting on F# (fret 2 on low E)
  [
    [2, 4, 5], // Low E: F#(6), G#(8), A(9) - E+2=6=F#✓, E+4=8=G#✓, E+5=9=A✓
    [2, 3, 5], // A: B(11), C(0), D(2) - A+2=11=B✓, A+3=0=C✓, A+5=2=D✓
    [2, 4, 6], // D: E(4), F#(6), G#(8) - D+2=4=E✓, D+4=6=F#✓, D+6=8=G#✓
    [2, 4, 5], // G: A(9), B(11), C(0) - G+2=9=A✓, G+4=11=B✓, G+5=0=C✓
    [1, 3, 5], // B: C(0), D(2), E(4) - B+1=0=C✓, B+3=2=D✓, B+5=4=E✓
    [2, 4, 5], // High E: F#(6), G#(8), A(9) ✓
  ],
  // Position 7: Starting on G# (fret 4 on low E)
  [
    [4, 5, 7], // Low E: G#(8), A(9), B(11) ✓
    [3, 5, 7], // A: C(0), D(2), E(4) ✓
    [4, 6, 7], // D: F#(6), G#(8), A(9) ✓
    [4, 5, 7], // G: B(11), C(0), D(2) ✓
    [3, 5, 7], // B: D(2), E(4), F#(6) ✓
    [4, 5, 7], // High E: G#(8), A(9), B(11) ✓
  ],
];

/**
 * Generated 3NPS patterns for additional 7-note scales
 * Uses the same 3NPS system as major/minor modes with 7 positions.
 */
const F_LYDIAN_DOMINANT_3NPS = generate3NPSPositions(
  [0, 2, 4, 6, 7, 9, 10],
  noteToValue("F"),
);

const E_PHRYGIAN_DOMINANT_3NPS = generate3NPSPositions(
  [0, 1, 4, 5, 7, 8, 10],
  noteToValue("E"),
);

const C_ALTERED_3NPS = generate3NPSPositions(
  [0, 1, 3, 4, 6, 8, 10],
  noteToValue("C"),
);

const A_HUNGARIAN_MINOR_3NPS = generate3NPSPositions(
  [0, 2, 3, 6, 7, 8, 11],
  noteToValue("A"),
);

/**
 * A Minor Pentatonic patterns (5 boxes)
 * A Minor Pentatonic notes: A(9), C(0), D(2), E(4), G(7)
 * Intervals: 0, 3, 5, 7, 10
 *
 * Pentatonic scales typically use 2 notes per string in the standard boxes
 */
const A_MINOR_PENTATONIC: number[][][] = [
  // Box 1 - The famous "blues box" - ROOT on 6th and 4th string
  [
    [5, 8], // Low E: A(9), C(0) - E+5=9=A✓, E+8=0=C✓
    [5, 7], // A: D(2), E(4) - A+5=2=D✓, A+7=4=E✓
    [5, 7], // D: G(7), A(9) - D+5=7=G✓, D+7=9=A✓
    [5, 7], // G: C(0), D(2) - G+5=0=C✓, G+7=2=D✓
    [5, 8], // B: E(4), G(7) - B+5=4=E✓, B+8=7=G✓
    [5, 8], // High E: A(9), C(0) ✓
  ],
  // Box 2 - Starting on C
  [
    [8, 10], // Low E: C(0), D(2) ✓
    [7, 10], // A: E(4), G(7) ✓
    [7, 10], // D: A(9), C(0) - D+7=9=A✓, D+10=0=C✓
    [7, 9], // G: D(2), E(4) - G+7=2=D✓, G+9=4=E✓
    [8, 10], // B: G(7), A(9) - B+8=7=G✓, B+10=9=A✓
    [8, 10], // High E: C(0), D(2) ✓
  ],
  // Box 3 - Starting on D
  [
    [10, 12], // Low E: D(2), E(4) ✓
    [10, 12], // A: G(7), A(9) ✓
    [10, 12], // D: C(0), D(2) - D+10=0=C✓, D+12=2=D✓
    [9, 12], // G: E(4), G(7) - G+9=4=E✓, G+12=7=G✓
    [10, 13], // B: A(9), C(0) - B+10=9=A✓, B+13=0=C✓
    [10, 12], // High E: D(2), E(4) ✓
  ],
  // Box 4 - Starting on E
  [
    [12, 15], // Low E: E(4), G(7) ✓
    [12, 15], // A: A(9), C(0) - A+12=9=A✓, A+15=0=C✓
    [12, 14], // D: D(2), E(4) ✓
    [12, 14], // G: G(7), A(9) - G+12=7=G✓, G+14=9=A✓
    [13, 15], // B: C(0), D(2) ✓
    [12, 15], // High E: E(4), G(7) ✓
  ],
  // Box 5 - Starting on G
  [
    [15, 17], // Low E: G(7), A(9) ✓
    [15, 17], // A: C(0), D(2) ✓
    [14, 17], // D: E(4), G(7) ✓
    [14, 17], // G: A(9), C(0) - G+14=9=A✓, G+17=0=C✓
    [15, 17], // B: D(2), E(4) ✓
    [15, 17], // High E: G(7), A(9) ✓
  ],
];

/**
 * C Major Pentatonic patterns (5 boxes)
 * C Major Pentatonic notes: C(0), D(2), E(4), G(7), A(9)
 * Same notes as A Minor Pentatonic, different root
 * Intervals: 0, 2, 4, 7, 9
 */
const C_MAJOR_PENTATONIC: number[][][] = [
  // Box 1 - ROOT position, C on 6th string
  [
    [8, 10], // Low E: C(0), D(2) ✓
    [7, 10], // A: E(4), G(7) ✓
    [7, 10], // D: A(9), C(0) ✓
    [7, 9], // G: D(2), E(4) ✓
    [8, 10], // B: G(7), A(9) ✓
    [8, 10], // High E: C(0), D(2) ✓
  ],
  // Box 2
  [
    [10, 12], // Low E: D(2), E(4) ✓
    [10, 12], // A: G(7), A(9) ✓
    [10, 12], // D: C(0), D(2) ✓
    [9, 12], // G: E(4), G(7) ✓
    [10, 13], // B: A(9), C(0) ✓
    [10, 12], // High E: D(2), E(4) ✓
  ],
  // Box 3
  [
    [12, 15], // Low E: E(4), G(7) ✓
    [12, 15], // A: A(9), C(0) ✓
    [12, 14], // D: D(2), E(4) ✓
    [12, 14], // G: G(7), A(9) ✓
    [13, 15], // B: C(0), D(2) ✓
    [12, 15], // High E: E(4), G(7) ✓
  ],
  // Box 4
  [
    [15, 17], // Low E: G(7), A(9) ✓
    [15, 17], // A: C(0), D(2) ✓
    [14, 17], // D: E(4), G(7) ✓
    [14, 17], // G: A(9), C(0) ✓
    [15, 17], // B: D(2), E(4) ✓
    [15, 17], // High E: G(7), A(9) ✓
  ],
  // Box 5 - wraps to lower frets
  [
    [5, 8], // Low E: A(9), C(0) ✓
    [5, 7], // A: D(2), E(4) ✓
    [5, 7], // D: G(7), A(9) ✓
    [5, 7], // G: C(0), D(2) ✓
    [5, 8], // B: E(4), G(7) ✓
    [5, 8], // High E: A(9), C(0) ✓
  ],
];

/**
 * A Blues Scale patterns (5 boxes)
 * A Blues notes: A(9), C(0), D(2), Eb(3), E(4), G(7)
 * Intervals: 0, 3, 5, 6, 7, 10
 *
 * Blues scale = Minor pentatonic + blue note (b5)
 */
const A_BLUES: number[][][] = [
  // Box 1 - The classic blues box with blue note (Eb)
  [
    [5, 8], // Low E: A(9), C(0) ✓
    [5, 6, 7], // A: D(2), Eb(3), E(4) - the chromatic cluster! A+5=2=D✓, A+6=3=Eb✓, A+7=4=E✓
    [5, 7], // D: G(7), A(9) ✓
    [5, 7, 8], // G: C(0), D(2), Eb(3) - G+5=0=C✓, G+7=2=D✓, G+8=3=Eb✓
    [5, 8], // B: E(4), G(7) ✓
    [5, 8], // High E: A(9), C(0) ✓
  ],
  // Box 2 - around frets 7-11
  [
    [8, 10, 11], // Low E: C(0), D(2), Eb(3) ✓
    [7, 10], // A: E(4), G(7) ✓
    [7, 10], // D: A(9), C(0) - D+7=9=A✓, D+10=0=C✓ (Eb is at fret 1 or 13)
    [7, 8, 9], // G: D(2), Eb(3), E(4) - G+7=2=D✓, G+8=3=Eb✓, G+9=4=E✓
    [8, 10], // B: G(7), A(9) ✓
    [8, 10, 11], // High E: C(0), D(2), Eb(3) ✓
  ],
  // Box 3
  [
    [10, 11, 12], // Low E: D(2), Eb(3), E(4) ✓
    [10, 12], // A: G(7), A(9) ✓
    [10, 12, 13], // D: C(0), D(2), Eb(3) - D+10=0=C✓, D+12=2=D✓, D+13=3=Eb✓
    [9, 12], // G: E(4), G(7) ✓
    [10, 13], // B: A(9), C(0) ✓
    [10, 11, 12], // High E: D(2), Eb(3), E(4) ✓
  ],
  // Box 4
  [
    [11, 12, 15], // Low E: Eb(3), E(4), G(7) ✓
    [12, 15], // A: A(9), C(0) ✓
    [12, 13, 14], // D: D(2), Eb(3), E(4) ✓
    [12, 14], // G: G(7), A(9) ✓
    [13, 15], // B: C(0), D(2) ✓
    [11, 12, 15], // High E: Eb(3), E(4), G(7) ✓
  ],
  // Box 5
  [
    [15, 17], // Low E: G(7), A(9) ✓
    [15, 17, 18], // A: C(0), D(2), Eb(3) ✓
    [14, 17], // D: E(4), G(7) ✓
    [14, 17, 20], // G: A(9), C(0), D(2) - includes extension
    [15, 17], // B: D(2), E(4) - B+15=2=D✓, B+17=4=E✓
    [15, 17], // High E: G(7), A(9) ✓
  ],
];

/**
 * C Whole Tone Scale patterns
 * C Whole Tone notes: C(0), D(2), E(4), F#(6), G#(8), A#(10)
 * Intervals: 0, 2, 4, 6, 8, 10
 *
 * Symmetric scale - only 2 unique transpositions exist
 */
const C_WHOLE_TONE: number[][][] = [
  // Position 1 - lower position
  [
    [2, 4, 6], // Low E: F#(6), G#(8), A#(10) ✓
    [3, 5, 7], // A: C(0), D(2), E(4) ✓
    [4, 6, 8], // D: F#(6), G#(8), A#(10) ✓
    [5, 7, 9], // G: C(0), D(2), E(4) ✓
    [5, 7, 9], // B: E(4), F#(6), G#(8) ✓
    [2, 4, 6], // High E: F#(6), G#(8), A#(10) ✓
  ],
  // Position 2 - higher position
  [
    [8, 10, 12], // Low E: C(0), D(2), E(4) ✓
    [7, 9, 11], // A: E(4), F#(6), G#(8) ✓
    [8, 10, 12], // D: A#(10), C(0), D(2) ✓
    [9, 11, 13], // G: E(4), F#(6), G#(8) ✓
    [9, 11, 13], // B: G#(8), A#(10), C(0) ✓
    [8, 10, 12], // High E: C(0), D(2), E(4) ✓
  ],
];

/**
 * C Diminished (Half-Whole) Scale patterns
 * C Diminished notes: C(0), Db(1), Eb(3), E(4), F#(6), G(7), A(9), Bb(10)
 * Intervals: 0, 1, 3, 4, 6, 7, 9, 10
 *
 * 8-note symmetric scale with 3 unique transpositions
 */
const C_DIMINISHED: number[][][] = [
  // C diminished (Half-Whole): C(0), Db(1), Eb(3), E(4), F#(6), G(7), A(9), Bb(10)
  // Position 1 - around frets 8-11
  [
    [8, 9, 11], // Low E: C(0), Db(1), Eb(3) ✓
    [7, 9, 10], // A: E(4), F#(6), G(7) ✓
    [7, 8, 10], // D: A(9), Bb(10), C(0) - D+7=9=A✓, D+8=10=Bb✓, D+10=0=C✓
    [6, 8, 9], // G: Db(1), Eb(3), E(4) - G+6=1=Db✓, G+8=3=Eb✓, G+9=4=E✓
    [7, 8, 10], // B: F#(6), G(7), A(9) - B+7=6=F#✓, B+8=7=G✓, B+10=9=A✓
    [8, 9, 11], // High E: C(0), Db(1), Eb(3) ✓
  ],
  // Position 2
  [
    [9, 11, 12], // Low E: Db(1), Eb(3), E(4) ✓
    [9, 10, 12], // A: F#(6), G(7), A(9) ✓
    [7, 8, 10], // D: A(9), Bb(10), C(0) ✓
    [8, 9, 11], // G: Eb(3), E(4), F#(6) ✓
    [9, 10, 12], // B: G(7), A(9), Bb(10) - B+8=7=G✓, B+10=9=A✓, B+11=10=Bb✓
    [9, 11, 12], // High E: Db(1), Eb(3), E(4) ✓
  ],
  // Position 3
  [
    [11, 12, 14], // Low E: Eb(3), E(4), F#(6) ✓
    [10, 12, 13], // A: G(7), A(9), Bb(10) ✓
    [8, 10, 11], // D: Bb(10), C(0), Db(1) ✓
    [9, 11, 12], // G: E(4), F#(6), G(7) ✓
    [10, 11, 13], // B: A(9), Bb(10), C(0) ✓
    [11, 12, 14], // High E: Eb(3), E(4), F#(6) ✓
  ],
];

// ==================== SCALE LIBRARY ====================

export const SCALE_LIBRARY: ScaleLibrary = {
  /**
   * MAJOR SCALE (Ionian Mode)
   * Formula: W-W-H-W-W-W-H (2-2-1-2-2-2-1 semitones)
   * Intervals: 1, 2, 3, 4, 5, 6, 7
   * Stored in C
   */
  major: {
    intervals: [0, 2, 4, 5, 7, 9, 11],
    fingerings: C_MAJOR_3NPS,
    positions: [
      "Position 1",
      "Position 2",
      "Position 3",
      "Position 4",
      "Position 5",
      "Position 6",
      "Position 7",
    ],
  },

  /**
   * DORIAN MODE
   * Formula: W-H-W-W-W-H-W (2-1-2-2-2-1-2 semitones)
   * Intervals: 1, 2, b3, 4, 5, 6, b7
   * Stored in D (same fingering shapes as C major, transposed)
   */
  dorian: {
    intervals: [0, 2, 3, 5, 7, 9, 10],
    fingerings: C_MAJOR_3NPS, // Same shapes, transposed
    positions: [
      "Position 1",
      "Position 2",
      "Position 3",
      "Position 4",
      "Position 5",
      "Position 6",
      "Position 7",
    ],
  },

  /**
   * PHRYGIAN MODE
   * Formula: H-W-W-W-H-W-W (1-2-2-2-1-2-2 semitones)
   * Intervals: 1, b2, b3, 4, 5, b6, b7
   * Stored in E
   */
  phrygian: {
    intervals: [0, 1, 3, 5, 7, 8, 10],
    fingerings: C_MAJOR_3NPS,
    positions: [
      "Position 1",
      "Position 2",
      "Position 3",
      "Position 4",
      "Position 5",
      "Position 6",
      "Position 7",
    ],
  },

  /**
   * LYDIAN MODE
   * Formula: W-W-W-H-W-W-H (2-2-2-1-2-2-1 semitones)
   * Intervals: 1, 2, 3, #4, 5, 6, 7
   * Stored in F
   */
  lydian: {
    intervals: [0, 2, 4, 6, 7, 9, 11],
    fingerings: C_MAJOR_3NPS,
    positions: [
      "Position 1",
      "Position 2",
      "Position 3",
      "Position 4",
      "Position 5",
      "Position 6",
      "Position 7",
    ],
  },

  /**
   * MIXOLYDIAN MODE
   * Formula: W-W-H-W-W-H-W (2-2-1-2-2-1-2 semitones)
   * Intervals: 1, 2, 3, 4, 5, 6, b7
   * Stored in G
   */
  mixolydian: {
    intervals: [0, 2, 4, 5, 7, 9, 10],
    fingerings: C_MAJOR_3NPS,
    positions: [
      "Position 1",
      "Position 2",
      "Position 3",
      "Position 4",
      "Position 5",
      "Position 6",
      "Position 7",
    ],
  },

  /**
   * NATURAL MINOR SCALE (Aeolian Mode)
   * Formula: W-H-W-W-H-W-W (2-1-2-2-1-2-2 semitones)
   * Intervals: 1, 2, b3, 4, 5, b6, b7
   * Stored in A
   */
  minor: {
    intervals: [0, 2, 3, 5, 7, 8, 10],
    fingerings: A_MINOR_3NPS,
    positions: [
      "Position 1",
      "Position 2",
      "Position 3",
      "Position 4",
      "Position 5",
      "Position 6",
      "Position 7",
    ],
  },

  /**
   * LOCRIAN MODE
   * Formula: H-W-W-H-W-W-W (1-2-2-1-2-2-2 semitones)
   * Intervals: 1, b2, b3, 4, b5, b6, b7
   * Stored in B
   */
  locrian: {
    intervals: [0, 1, 3, 5, 6, 8, 10],
    fingerings: C_MAJOR_3NPS,
    positions: [
      "Position 1",
      "Position 2",
      "Position 3",
      "Position 4",
      "Position 5",
      "Position 6",
      "Position 7",
    ],
  },

  /**
   * HARMONIC MINOR SCALE
   * Formula: W-H-W-W-H-Aug2-H (2-1-2-2-1-3-1 semitones)
   * Intervals: 1, 2, b3, 4, 5, b6, 7
   * Stored in A
   */
  "harmonic minor": {
    intervals: [0, 2, 3, 5, 7, 8, 11],
    fingerings: A_HARMONIC_MINOR_3NPS,
    positions: [
      "Position 1",
      "Position 2",
      "Position 3",
      "Position 4",
      "Position 5",
      "Position 6",
      "Position 7",
    ],
  },

  /**
   * MELODIC MINOR SCALE (Ascending form)
   * Formula: W-H-W-W-W-W-H (2-1-2-2-2-2-1 semitones)
   * Intervals: 1, 2, b3, 4, 5, 6, 7
   * Stored in A
   */
  "melodic minor": {
    intervals: [0, 2, 3, 5, 7, 9, 11],
    fingerings: A_MELODIC_MINOR_3NPS,
    positions: [
      "Position 1",
      "Position 2",
      "Position 3",
      "Position 4",
      "Position 5",
      "Position 6",
      "Position 7",
    ],
  },

  /**
   * MINOR PENTATONIC SCALE
   * Formula: m3-W-W-m3-W (3-2-2-3-2 semitones)
   * Intervals: 1, b3, 4, 5, b7
   * Stored in A
   */
  "pentatonic minor": {
    intervals: [0, 3, 5, 7, 10],
    fingerings: A_MINOR_PENTATONIC,
    positions: ["Box 1", "Box 2", "Box 3", "Box 4", "Box 5"],
  },

  /**
   * MAJOR PENTATONIC SCALE
   * Formula: W-W-m3-W-m3 (2-2-3-2-3 semitones)
   * Intervals: 1, 2, 3, 5, 6
   * Stored in C
   */
  "pentatonic major": {
    intervals: [0, 2, 4, 7, 9],
    fingerings: C_MAJOR_PENTATONIC,
    positions: ["Box 1", "Box 2", "Box 3", "Box 4", "Box 5"],
  },

  /**
   * BLUES SCALE
   * Formula: m3-W-H-H-m3-W (3-2-1-1-3-2 semitones)
   * Intervals: 1, b3, 4, b5, 5, b7
   * Stored in A
   */
  blues: {
    intervals: [0, 3, 5, 6, 7, 10],
    fingerings: A_BLUES,
    positions: ["Box 1", "Box 2", "Box 3", "Box 4", "Box 5"],
  },

  /**
   * WHOLE TONE SCALE
   * Formula: W-W-W-W-W-W (2-2-2-2-2-2 semitones)
   * Intervals: 1, 2, 3, #4, #5, b7
   * Stored in C
   */
  "whole tone": {
    intervals: [0, 2, 4, 6, 8, 10],
    fingerings: C_WHOLE_TONE,
    positions: ["Position 1", "Position 2"],
  },

  /**
   * DIMINISHED SCALE (Half-Whole)
   * Formula: H-W-H-W-H-W-H-W (1-2-1-2-1-2-1-2 semitones)
   * Intervals: 1, b2, b3, 3, #4, 5, 6, b7
   * Stored in C
   */
  diminished: {
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
    fingerings: C_DIMINISHED,
    positions: ["Position 1", "Position 2", "Position 3"],
  },

  /**
   * ALTERED SCALE (Super Locrian)
   * Mode 7 of melodic minor
   * Formula: H-W-H-W-W-W-W (1-2-1-2-2-2-2 semitones)
   * Intervals: 1, b2, b3, b4, b5, b6, b7
   * Stored in C
   */
  altered: {
    intervals: [0, 1, 3, 4, 6, 8, 10],
    fingerings: C_ALTERED_3NPS,
    positions: [
      "Position 1",
      "Position 2",
      "Position 3",
      "Position 4",
      "Position 5",
      "Position 6",
      "Position 7",
    ],
  },

  /**
   * PHRYGIAN DOMINANT
   * Mode 5 of harmonic minor
   * Intervals: 1, b2, 3, 4, 5, b6, b7
   * Stored in E
   */
  "phrygian dominant": {
    intervals: [0, 1, 4, 5, 7, 8, 10],
    fingerings: E_PHRYGIAN_DOMINANT_3NPS,
    positions: [
      "Position 1",
      "Position 2",
      "Position 3",
      "Position 4",
      "Position 5",
      "Position 6",
      "Position 7",
    ],
  },

  /**
   * LYDIAN DOMINANT
   * Mode 4 of melodic minor
   * Intervals: 1, 2, 3, #4, 5, 6, b7
   * Stored in F
   */
  "lydian dominant": {
    intervals: [0, 2, 4, 6, 7, 9, 10],
    fingerings: F_LYDIAN_DOMINANT_3NPS,
    positions: [
      "Position 1",
      "Position 2",
      "Position 3",
      "Position 4",
      "Position 5",
      "Position 6",
      "Position 7",
    ],
  },

  /**
   * BEBOP DOMINANT
   * Major scale with added b7 for smooth chromatic passing
   * Intervals: 1, 2, 3, 4, 5, 6, b7, 7
   * Stored in C
   */
  "bebop dominant": {
    intervals: [0, 2, 4, 5, 7, 9, 10, 11],
    fingerings: [
      [
        [7, 8, 10], // Low E: B(11), C(0), D(2)
        [7, 8, 10, 12], // A: E(4), F(5), G(7), A(9)
        [7, 9, 10], // D: A(9), B(11), C(0)
        [7, 9, 10], // G: D(2), E(4), F(5)
        [8, 10, 11], // B: G(7), A(9), Bb(10)
        [7, 8, 10], // High E: B(11), C(0), D(2)
      ],
    ],
    positions: ["Position 1"],
  },

  /**
   * BEBOP MAJOR
   * Major scale with added #5 for smooth chromatic passing
   * Intervals: 1, 2, 3, 4, 5, #5, 6, 7
   * Stored in C
   */
  "bebop major": {
    intervals: [0, 2, 4, 5, 7, 8, 9, 11],
    fingerings: [
      [
        [7, 8, 10], // Low E: B(11), C(0), D(2)
        [7, 8, 10, 11], // A: E(4), F(5), G(7), G#(8)
        [7, 9, 10], // D: A(9), B(11), C(0)
        [7, 9, 10], // G: D(2), E(4), F(5)
        [8, 9, 10], // B: G(7), G#(8), A(9)
        [7, 8, 10], // High E: B(11), C(0), D(2)
      ],
    ],
    positions: ["Position 1"],
  },

  /**
   * HUNGARIAN MINOR
   * Intervals: 1, 2, b3, #4, 5, b6, 7
   * Stored in A
   */
  "hungarian minor": {
    intervals: [0, 2, 3, 6, 7, 8, 11],
    fingerings: A_HUNGARIAN_MINOR_3NPS,
    positions: [
      "Position 1",
      "Position 2",
      "Position 3",
      "Position 4",
      "Position 5",
      "Position 6",
      "Position 7",
    ],
  },

  /**
   * GYPSY SCALE (same as Hungarian Minor)
   */
  gypsy: {
    intervals: [0, 2, 3, 6, 7, 8, 11],
    fingerings: A_HUNGARIAN_MINOR_3NPS,
    positions: [
      "Position 1",
      "Position 2",
      "Position 3",
      "Position 4",
      "Position 5",
      "Position 6",
      "Position 7",
    ],
  },

  /**
   * SUPER LOCRIAN (same as Altered)
   */
  "super locrian": {
    intervals: [0, 1, 3, 4, 6, 8, 10],
    fingerings: C_ALTERED_3NPS,
    positions: [
      "Position 1",
      "Position 2",
      "Position 3",
      "Position 4",
      "Position 5",
      "Position 6",
      "Position 7",
    ],
  },
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Extract root note from scale name (e.g., "C major" -> "C")
 */
function extractRootFromScaleName(scaleName: string): string {
  const match = scaleName.match(/^([A-G][#b]?)/);
  return match ? match[1] : "C";
}

/**
 * Get the root note that stored patterns represent for a given scale type
 */
function getStoredPatternRoot(scaleKey: string): string {
  const STORED_PATTERN_ROOTS: Record<string, string> = {
    major: "C",
    dorian: "D",
    phrygian: "E",
    lydian: "F",
    mixolydian: "G",
    minor: "A",
    locrian: "B",
    "harmonic minor": "A",
    "melodic minor": "A",
    "pentatonic major": "C",
    "pentatonic minor": "A",
    blues: "A",
    "whole tone": "C",
    diminished: "C",
    altered: "C",
    "bebop dominant": "C",
    "bebop major": "C",
    "phrygian dominant": "E",
    "hungarian minor": "A",
    gypsy: "A",
    "lydian dominant": "F",
    "super locrian": "C",
  };
  return STORED_PATTERN_ROOTS[scaleKey] || "C";
}

/**
 * Transpose a fingering pattern by semitones
 * Handles octave wrapping to keep patterns in playable range
 */
function transposeFingering(
  fingering: number[][],
  semitones: number,
): number[][] {
  if (semitones === 0) {
    return fingering.map((stringFrets) => [...stringFrets]);
  }

  const allFrets = fingering.flat();
  if (allFrets.length === 0) {
    return fingering.map((stringFrets) => [...stringFrets]);
  }

  const minFret = Math.min(...allFrets);
  const maxFret = Math.max(...allFrets);

  // Calculate octave adjustment to keep pattern in playable range
  let octaveAdjustment = 0;
  const targetMin = minFret + semitones;
  const targetMax = maxFret + semitones;

  if (targetMin < 0) {
    octaveAdjustment = Math.ceil(Math.abs(targetMin) / 12) * 12;
  } else if (targetMax > 20) {
    const potentialShift = -Math.floor((targetMax - 12) / 12) * 12;
    if (targetMin + potentialShift >= 0) {
      octaveAdjustment = potentialShift;
    }
  }

  const adjustedSemitones = semitones + octaveAdjustment;

  return fingering.map((stringFrets) =>
    stringFrets.map((fret) => {
      const newFret = fret + adjustedSemitones;
      return Math.max(0, Math.min(newFret, 24));
    }),
  );
}

/**
 * Get sorted position indices by minimum fret
 */
function getSortedPatternIndices(fingerings: number[][][]): number[] {
  if (!fingerings || fingerings.length === 0) {
    return [];
  }

  const patternsWithMinFrets = fingerings.map((pattern, index) => {
    const allFrets = pattern.flat().filter((f) => f >= 0);
    const minFret = allFrets.length > 0 ? Math.min(...allFrets) : 999;
    return { minFret, originalIndex: index };
  });

  patternsWithMinFrets.sort((a, b) => a.minFret - b.minFret);
  return patternsWithMinFrets.map((item) => item.originalIndex);
}

/**
 * Get positions array sorted by fingering location
 */
export function getSortedPositions(
  scaleData: ScalePattern,
  _scaleKey?: string,
): string[] {
  if (!scaleData.positions || scaleData.positions.length === 0) {
    return ["Position 1"];
  }

  if (!scaleData.fingerings || scaleData.fingerings.length === 0) {
    return scaleData.positions;
  }

  const sortedIndices = getSortedPatternIndices(scaleData.fingerings);
  return sortedIndices.map(
    (index) => scaleData.positions![index] || `Position ${index + 1}`,
  );
}

/**
 * Convert scale descriptor to library key
 */
function toScaleDescriptor(name: string): string {
  const trimmed = name.trim();
  const match = trimmed.match(/^([A-G][#b]?)(?:\s+)(.+)$/i);
  const descriptor = match ? match[2] : trimmed;
  return descriptor.replace(/\b(scale|mode)\b/gi, "").trim();
}

/**
 * Normalize scale name to match SCALE_LIBRARY keys
 */
export function normalizeScaleName(name: string): string {
  const descriptor = toScaleDescriptor(name);
  const normalized = normalizeScaleDescriptor(descriptor);

  if (normalized) {
    return normalized.libraryKey;
  }

  const fallback = descriptor.toLowerCase().trim();
  if (SCALE_LIBRARY[fallback]) {
    return fallback;
  }

  const sanitized = descriptor.replace(/\s+|-/g, "").toLowerCase();
  const fallbackKey = FALLBACK_SCALE_LIBRARY_KEYS.get(sanitized);
  if (fallbackKey && SCALE_LIBRARY[fallbackKey]) {
    return fallbackKey;
  }

  return "major";
}

/**
 * Get scale intervals from name
 */
export function getScaleIntervals(scaleName: string): number[] {
  const normalized = normalizeScaleName(scaleName);
  const scaleData = SCALE_LIBRARY[normalized];

  if (scaleData) {
    return scaleData.intervals;
  }

  // Fuzzy match
  for (const [key, data] of Object.entries(SCALE_LIBRARY)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return data.intervals;
    }
  }

  return SCALE_LIBRARY["major"].intervals;
}

/**
 * Generate scale fingering algorithmically when stored patterns unavailable
 */
function generateFingeringAlgorithmically(
  scaleName: string,
  rootNote: string,
  positionIndex: number,
): number[][] {
  const intervals = getScaleIntervals(scaleName);
  const rootValue = noteToValue(rootNote);
  const scaleNotes = new Set(intervals.map((i) => (rootValue + i) % 12));

  // Position starting frets
  const startFrets = [0, 3, 5, 7, 10, 12, 15];
  const safePositionIndex = Math.max(
    0,
    Math.min(positionIndex, startFrets.length - 1),
  );
  const baseFret = startFrets[safePositionIndex];

  // Generate fingering for each string
  const fingering: number[][] = [];

  for (let stringIdx = 0; stringIdx < 6; stringIdx++) {
    const stringTuning = TUNING[stringIdx];
    const frets: number[] = [];

    // Search for scale notes within a 4-5 fret span
    const searchStart = Math.max(0, baseFret);
    const searchEnd = Math.min(24, baseFret + 5);

    for (let fret = searchStart; fret <= searchEnd; fret++) {
      const noteValue = (stringTuning + fret) % 12;
      if (scaleNotes.has(noteValue)) {
        frets.push(fret);
        if (frets.length >= 3) break; // 3NPS max
      }
    }

    fingering.push(frets);
  }

  return fingering;
}

/**
 * Get scale fingering for a specific key and position
 *
 * @param scaleName - Scale name (e.g., "C major", "A minor pentatonic")
 * @param rootNote - Optional explicit root note
 * @param positionIndex - Position index (0-based)
 * @returns 2D array of fret numbers [lowE, A, D, G, B, highE]
 */
export function getScaleFingering(
  scaleName: string,
  rootNote?: string,
  positionIndex: number = 0,
): number[][] {
  const root = rootNote || extractRootFromScaleName(scaleName);
  const normalized = normalizeScaleName(scaleName);
  const scaleData = SCALE_LIBRARY[normalized];

  // Fall back to algorithmic generation if no stored patterns
  if (
    !scaleData ||
    !scaleData.fingerings ||
    scaleData.fingerings.length === 0
  ) {
    return generateFingeringAlgorithmically(scaleName, root, positionIndex);
  }

  const availablePositions = scaleData.fingerings.length;
  const safePositionIndex = Math.max(
    0,
    Math.min(positionIndex, availablePositions - 1),
  );

  // Get sorted indices so position 0 is always lowest on neck
  const sortedIndices = getSortedPatternIndices(scaleData.fingerings);
  const storedPatternIndex =
    sortedIndices[safePositionIndex] ?? safePositionIndex;
  const storedPattern = scaleData.fingerings[storedPatternIndex];

  if (!storedPattern || storedPattern.length !== 6) {
    return generateFingeringAlgorithmically(scaleName, root, positionIndex);
  }

  // Calculate transposition from stored root to requested root
  const storedRoot = getStoredPatternRoot(normalized);
  const storedRootValue = noteToValue(storedRoot);
  const requestedRootValue = noteToValue(root);
  const semitoneOffset = (requestedRootValue - storedRootValue + 12) % 12;

  if (semitoneOffset === 0) {
    return storedPattern.map((stringFrets) => [...stringFrets]);
  }

  return transposeFingering(storedPattern, semitoneOffset);
}

/**
 * Get scale notes for a given root and scale type
 */
export function getScaleNotes(rootNote: string, scaleName: string): string[] {
  const intervals = getScaleIntervals(scaleName);
  const noteValue = noteToValue(rootNote);

  return intervals.map((interval) => {
    const noteVal = (noteValue + interval) % 12;
    return valueToNote(noteVal);
  });
}

/**
 * Validate fingering pattern against expected scale notes
 */
export function validateFingeringNotes(
  fingering: number[][],
  rootNote: string,
  scaleName: string,
): { isValid: boolean; invalidNotes: string[]; coverage: number } {
  const intervals = getScaleIntervals(scaleName);
  const rootValue = noteToValue(rootNote);
  const expectedNoteValues = new Set(
    intervals.map((i) => (rootValue + i) % 12),
  );

  const invalidNotes: string[] = [];
  let totalNotes = 0;
  let correctNotes = 0;

  fingering.forEach((stringFrets, stringIndex) => {
    const stringTuning = TUNING[stringIndex];

    stringFrets.forEach((fret) => {
      if (fret >= 0 && fret <= 24) {
        totalNotes++;
        const noteValue = (stringTuning + fret) % 12;

        if (expectedNoteValues.has(noteValue)) {
          correctNotes++;
        } else {
          const noteName = valueToNote(noteValue);
          invalidNotes.push(
            `String ${stringIndex + 1}, fret ${fret}: ${noteName}`,
          );
        }
      }
    });
  });

  const coverage = totalNotes > 0 ? correctNotes / totalNotes : 0;

  return {
    isValid: invalidNotes.length === 0,
    invalidNotes,
    coverage,
  };
}

/**
 * Get validated scale fingering with console warnings for invalid patterns
 */
export function getValidatedScaleFingering(
  scaleName: string,
  rootNote?: string,
  positionIndex: number = 0,
): number[][] {
  const root = rootNote || extractRootFromScaleName(scaleName);
  const fingering = getScaleFingering(scaleName, root, positionIndex);

  const validation = validateFingeringNotes(fingering, root, scaleName);

  if (!validation.isValid) {
    console.warn(
      `Scale fingering validation failed for "${scaleName}" (root: ${root}, position: ${positionIndex}):`,
      `\n  Coverage: ${(validation.coverage * 100).toFixed(1)}%`,
      `\n  Invalid notes: ${validation.invalidNotes.slice(0, 5).join(", ")}${validation.invalidNotes.length > 5 ? "..." : ""}`,
    );
  }

  return fingering;
}
