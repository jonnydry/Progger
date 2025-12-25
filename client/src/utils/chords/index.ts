/**
 * Async Chord Library API
 *
 * Provides async access to chord voicings with automatic lazy loading.
 * This is the recommended API for new code to benefit from code splitting.
 *
 * Migration from old API:
 * - getChordVoicings(name) → await getChordVoicingsAsync(name)
 * - Add preloadCommonKeys() call after app initialization
 */

import type { ChordVoicing } from "../../types";
import type { ChordKey } from "./types";
import { loadChordsByRoot } from "./loader";
import { normalizeChordQuality } from "@shared/music/chordQualities";
import {
  STANDARD_TUNING_VALUES,
  noteToValue,
  valueToNote,
} from "../musicTheory";
import { getChordNotes } from "../chordAnalysis";

// Re-export loader utilities
export { preloadCommonKeys, getCacheStats, clearChordCache } from "./loader";

/**
 * Enharmonic root normalization
 * Maps less common enharmonics to their primary spelling
 */
const ENHARMONIC_ROOTS: Record<string, string> = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
  // Uncommon enharmonics
  Cb: "B",
  Fb: "E",
  "B#": "C",
  "E#": "F",
};

/**
 * Normalize root note to canonical form
 */
export function normalizeRoot(root: string): string {
  const upper = root.toUpperCase();
  return ENHARMONIC_ROOTS[upper] || upper;
}

/**
 * Extract root and quality from chord name
 *
 * NOTE: Slash chords (e.g., "Cmaj7/E") are parsed by extracting the root chord ("Cmaj7")
 * and ignoring the bass note ("/E"). The system returns standard voicings for the root chord
 * without adjusting for the specified bass note. This is acceptable for most use cases as
 * guitarists typically choose voicings based on the full chord rather than forcing a specific
 * bass note. Future enhancement: filter or rank voicings by bass note proximity.
 */
function extractRootAndQuality(chordName: string): {
  root: string;
  quality: string;
  bassNote?: string;
} {
  const match = chordName.match(/^([A-G][#b]?)(.*)/i);
  if (!match) return { root: "C", quality: "major" };

  const [, rawRoot, rawSuffix] = match;

  // Check for slash chord (e.g., "maj7/E")
  const slashIndex = rawSuffix.indexOf("/");
  const qualitySegment =
    slashIndex >= 0 ? rawSuffix.substring(0, slashIndex) : rawSuffix;
  const bassNote =
    slashIndex >= 0 ? rawSuffix.substring(slashIndex + 1) : undefined;

  // Log warning if bass note is present (currently not used in voicing selection)
  if (bassNote) {
    console.info(
      `Slash chord detected: "${chordName}". Showing voicings for ${rawRoot}${qualitySegment} (bass note /${bassNote} not enforced)`,
    );
  }

  return {
    root: normalizeRoot(rawRoot),
    quality: normalizeChordQuality(qualitySegment),
    bassNote,
  };
}

/**
 * Get chord voicings asynchronously
 *
 * @param chordName - Chord name (e.g., "Cmaj7", "F#m", "Bb7")
 * @returns Promise resolving to array of chord voicings
 *
 * @example
 * const voicings = await getChordVoicingsAsync('Cmaj7');
 * console.log(voicings); // [{ frets: [...], position: 'Open' }, ...]
 */
export async function getChordVoicingsAsync(
  chordName: string,
): Promise<ChordVoicing[]> {
  const { root, quality } = extractRootAndQuality(chordName);

  // Load chord data for this root
  const chordData = await loadChordsByRoot(root);

  // Look up the specific chord
  const key: ChordKey = `${root}_${quality}`;
  const voicings = chordData[key];

  if (voicings && voicings.length > 0) {
    // Filter out invalid voicings (those where less than 50% of notes match the chord)
    // Calculate expected notes once for efficiency
    const expectedNotes = new Set(
      getChordNotes(chordName).map((note) => noteToValue(note)),
    );
    const validVoicings = voicings.filter((voicing) =>
      validateVoicingNotesWithExpected(voicing, chordName, expectedNotes),
    );

    if (validVoicings.length > 0) {
      return validVoicings;
    }
    // If all voicings failed validation, fall through to transposition fallback
  }

  // Fallback 1: Try mathematical transposition from other roots
  const transposedVoicings = await findVoicingsByTransposition(root, quality);
  if (transposedVoicings && transposedVoicings.length > 0) {
    if (import.meta.env.DEV) {
      console.log(`✓ Found voicings for "${chordName}" via transposition`);
    }
    return transposedVoicings;
  }

  // Fallback 2: Try to find similar chord in the same key
  const similarChord = findSimilarChord(chordData, quality);
  if (similarChord) {
    console.warn(
      `Chord "${chordName}" not found, using similar chord:`,
      similarChord,
    );
    return chordData[similarChord];
  }

  // Fallback 3: Return basic major triad
  const majorKey: ChordKey = `${root}_major`;
  if (chordData[majorKey]) {
    console.warn(
      `Chord "${chordName}" not found, falling back to ${root} major`,
    );
    return chordData[majorKey];
  }

  // If even major doesn't exist, return empty (shouldn't happen)
  console.error(`No chords found for root "${root}"`);
  return [];
}

/**
 * Extract the note values (0-11) produced by a chord voicing
 * Uses mathematical formula: noteValue = (STANDARD_TUNING_VALUES[stringIndex] + absoluteFret) % 12
 * @public - Exported for validation scripts
 */
export function extractVoicingNotes(voicing: ChordVoicing): Set<number> {
  const noteValues = new Set<number>();
  const usesRelativeFormat =
    voicing.firstFret !== undefined && voicing.firstFret > 1;

  voicing.frets.forEach((fret, stringIndex) => {
    if (typeof fret === "number") {
      const absoluteFret = usesRelativeFormat
        ? voicing.firstFret! + fret - 1
        : fret;
      const noteValue =
        (STANDARD_TUNING_VALUES[stringIndex] + absoluteFret) % 12;
      noteValues.add(noteValue);
    }
  });

  return noteValues;
}

/**
 * Optimized validation function that accepts pre-calculated expected notes
 * Used internally for batch validation to avoid redundant calculations
 * @param voicing - The voicing to validate
 * @param chordName - The chord name (for error messages)
 * @param expectedNotes - Pre-calculated set of expected note values
 * @returns True if voicing matches chord, false otherwise
 * @internal
 */
function validateVoicingNotesWithExpected(
  voicing: ChordVoicing,
  chordName: string,
  expectedNotes: Set<number>,
): boolean {
  const voicingNotes = extractVoicingNotes(voicing);

  if (voicingNotes.size === 0) {
    return false;
  }

  // Count how many voicing notes match expected chord notes
  let matchCount = 0;
  for (const noteValue of voicingNotes) {
    if (expectedNotes.has(noteValue)) {
      matchCount++;
    }
  }

  // Require at least 50% of voicing notes to be valid chord tones
  // This filters out incorrect voicings while allowing partial/rootless voicings
  const matchRatio = matchCount / voicingNotes.size;
  const isValid = matchRatio >= 0.5;

  // Development mode warning for invalid voicings
  if (!isValid && import.meta.env.DEV) {
    const voicingNoteNames = Array.from(voicingNotes).map((v) =>
      valueToNote(v),
    );
    const expectedNoteNames = Array.from(expectedNotes).map((v) =>
      valueToNote(v),
    );
    console.warn(
      `⚠️ Voicing validation failed for "${chordName}":\n` +
        `   Expected notes: ${expectedNoteNames.join(", ")}\n` +
        `   Voicing notes: ${voicingNoteNames.join(", ")}\n` +
        `   Match ratio: ${(matchRatio * 100).toFixed(0)}% (need 50%)\n` +
        `   Position: ${voicing.position || "Unknown"}`,
    );
  }

  return isValid;
}

/**
 * Validate that a voicing produces notes that match the expected chord
 * Requires at least 50% of voicing notes to be valid chord tones
 * @param voicing - The voicing to validate
 * @param chordName - The chord name (e.g., "Cmaj7")
 * @returns True if voicing matches chord, false otherwise
 * @public - Exported for validation scripts
 */
export function validateVoicingNotes(
  voicing: ChordVoicing,
  chordName: string,
): boolean {
  const expectedNotes = new Set(
    getChordNotes(chordName).map((note) => noteToValue(note)),
  );
  return validateVoicingNotesWithExpected(voicing, chordName, expectedNotes);
}

/**
 * Transpose a barre chord voicing by adjusting firstFret mathematically
 * Only transposes barre chords (firstFret > 1), leaves open chords unchanged
 * @param voicing - The voicing to transpose
 * @param semitoneOffset - Number of semitones to transpose (can be negative)
 * @returns Transposed voicing
 */
function transposeBarreVoicing(
  voicing: ChordVoicing,
  semitoneOffset: number,
): ChordVoicing {
  if (!voicing.firstFret || voicing.firstFret <= 1) {
    return voicing; // Open chords don't transpose
  }

  const newFirstFret = voicing.firstFret + semitoneOffset;
  // Cap at fret 17 to ensure playability (most guitars have 20-24 frets)
  const clampedFirstFret = Math.max(1, Math.min(newFirstFret, 17));

  return {
    ...voicing,
    firstFret: clampedFirstFret,
    position: voicing.position ? `${voicing.position} (transposed)` : undefined,
  };
}

/**
 * Find a similar chord quality in the same key
 */
function findSimilarChord(
  chordData: Record<string, ChordVoicing[]>,
  targetQuality: string,
): string | null {
  const availableChords = Object.keys(chordData);

  // Try quality families
  const qualityFamilies: Record<string, string[]> = {
    major: ["major", "maj7", "6", "add9", "9", "13"],
    minor: ["minor", "min7", "min9", "min11", "min6"],
    dominant: ["7", "9", "13", "7#9", "7b9", "7#5"],
    diminished: ["dim", "dim7", "min7b5"],
    augmented: ["aug", "aug7", "7#5"],
  };

  // Find which family the target quality belongs to
  for (const [family, qualities] of Object.entries(qualityFamilies)) {
    if (qualities.includes(targetQuality)) {
      // Look for other chords in the same family
      for (const quality of qualities) {
        const match = availableChords.find((key) =>
          key.endsWith(`_${quality}`),
        );
        if (match) return match;
      }
    }
  }

  // No similar chord found
  return null;
}

/**
 * Try to find voicings by transposing from another root
 * Uses mathematical transposition to generate voicings for missing chords
 * @param targetRoot - The root note we need voicings for
 * @param targetQuality - The chord quality we need
 * @returns Transposed voicings or null if not found
 */
async function findVoicingsByTransposition(
  targetRoot: string,
  targetQuality: string,
): Promise<ChordVoicing[] | null> {
  // Try transposing from other roots (prioritize common roots)
  const sourceRoots = [
    "C",
    "G",
    "D",
    "A",
    "E",
    "F",
    "B",
    "C#",
    "D#",
    "F#",
    "G#",
    "A#",
  ];

  for (const sourceRoot of sourceRoots) {
    try {
      const sourceChordData = await loadChordsByRoot(sourceRoot);
      const sourceKey: ChordKey = `${sourceRoot}_${targetQuality}`;
      const sourceVoicings = sourceChordData[sourceKey];

      if (sourceVoicings && sourceVoicings.length > 0) {
        // Calculate semitone offset
        const sourceValue = noteToValue(sourceRoot);
        const targetValue = noteToValue(targetRoot);
        const semitoneOffset = (targetValue - sourceValue + 12) % 12;

        if (semitoneOffset === 0) {
          continue; // Same root, skip
        }

        // Construct target chord name for validation
        const targetChordName =
          targetQuality === "major"
            ? targetRoot
            : `${targetRoot}${targetQuality}`;

        // Transpose voicings and validate with pre-calculated expected notes
        const expectedNotes = new Set(
          getChordNotes(targetChordName).map((note) => noteToValue(note)),
        );
        const transposedVoicings = sourceVoicings
          .map((voicing) => transposeBarreVoicing(voicing, semitoneOffset))
          .filter((voicing) =>
            validateVoicingNotesWithExpected(
              voicing,
              targetChordName,
              expectedNotes,
            ),
          );

        if (transposedVoicings.length > 0) {
          if (import.meta.env.DEV) {
            console.log(
              `✓ Transposed ${sourceRoot}${targetQuality === "major" ? "" : targetQuality} → ${targetChordName} (${semitoneOffset} semitones)`,
            );
          }
          return transposedVoicings;
        }
      }
    } catch (error) {
      // Continue to next root if loading fails
      continue;
    }
  }

  return null;
}

/**
 * Check if a voicing uses all muted strings (indicates missing/unknown chord)
 */
export function isMutedVoicing(voicing: ChordVoicing): boolean {
  return voicing.frets.every((fret) => fret === "x");
}

/**
 * Batch load multiple chords efficiently
 * Groups chords by root to minimize dynamic imports
 */
export async function loadMultipleChords(
  chordNames: string[],
): Promise<Map<string, ChordVoicing[]>> {
  const result = new Map<string, ChordVoicing[]>();

  // Group chords by root to batch load
  const chordsByRoot = new Map<string, string[]>();

  for (const name of chordNames) {
    const { root } = extractRootAndQuality(name);
    const existing = chordsByRoot.get(root) || [];
    existing.push(name);
    chordsByRoot.set(root, existing);
  }

  // Load all roots in parallel
  const loadPromises = Array.from(chordsByRoot.entries()).map(
    async ([root, names]) => {
      const chordData = await loadChordsByRoot(root);

      for (const name of names) {
        const { root: chordRoot, quality } = extractRootAndQuality(name);
        const key: ChordKey = `${chordRoot}_${quality}`;
        const voicings = chordData[key] || [];
        result.set(name, voicings);
      }
    },
  );

  await Promise.all(loadPromises);
  return result;
}

/**
 * Preload all chord data into memory
 * Call this on app init to enable synchronous access via getChordVoicingsSync
 */
export async function preloadAllChords(): Promise<void> {
  const allKeys = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  await Promise.all(allKeys.map((key) => loadChordsByRoot(key)));
  console.log("✅ All chord data preloaded");
}
