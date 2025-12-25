import {
  getScaleFingering,
  getScaleNotes,
  validateFingeringNotes,
} from "../client/src/utils/scaleLibrary";
import {
  noteToValue,
  valueToNote,
  STANDARD_TUNING_NAMES,
} from "../client/src/utils/musicTheory";

// Helper to show what notes are at each fret
function getNoteAtFret(stringTuning: string, fret: number): string {
  const tuningValue = noteToValue(stringTuning);
  const noteValue = (tuningValue + fret) % 12;
  return valueToNote(noteValue);
}

// Helper to display a fingering pattern
function displayFingering(
  scaleName: string,
  rootNote: string,
  positionIndex: number,
  fingering: number[][],
) {
  console.log(`\n${scaleName} - Position ${positionIndex + 1}:`);
  console.log("─".repeat(60));

  const tuning = [...STANDARD_TUNING_NAMES].reverse(); // Low to high: E, A, D, G, B, E

  // Header
  console.log("String | Frets | Notes");
  console.log("─".repeat(60));

  fingering.forEach((frets, stringIndex) => {
    const stringName = tuning[stringIndex];
    const fretStr = frets.length > 0 ? frets.join(", ") : "(none)";
    const notes = frets.map((f) => getNoteAtFret(stringName, f)).join(", ");
    console.log(`  ${stringName.padEnd(4)} | ${fretStr.padEnd(15)} | ${notes}`);
  });

  // Validation
  const validation = validateFingeringNotes(fingering, rootNote, scaleName);
  const expectedNotes = getScaleNotes(rootNote, scaleName);

  console.log("─".repeat(60));
  console.log(`Expected scale notes: ${expectedNotes.join(", ")}`);
  console.log(
    `Validation: ${validation.isValid ? "✅ PASS" : "❌ FAIL"} (${(validation.coverage * 100).toFixed(1)}% coverage)`,
  );

  if (!validation.isValid && validation.invalidNotes.length > 0) {
    console.log(
      `Invalid notes found: ${validation.invalidNotes.slice(0, 5).join(", ")}`,
    );
  }
}

console.log("=".repeat(60));
console.log("SCALE PATTERN GENERATION TEST");
console.log("=".repeat(60));

// Test 1: C Major - Position 1 (should start around open/low frets)
console.log("\n📊 TEST 1: C Major Scale");
const cMajorPos1 = getScaleFingering("C Major", "C", 0);
displayFingering("C Major", "C", 0, cMajorPos1);

// Test 2: C Major - Position 2 (should be higher up the neck)
const cMajorPos2 = getScaleFingering("C Major", "C", 1);
displayFingering("C Major", "C", 1, cMajorPos2);

// Test 3: A Minor - Position 1 (relative minor of C)
console.log("\n📊 TEST 2: A Minor Scale");
const aMinorPos1 = getScaleFingering("A Minor", "A", 0);
displayFingering("A Minor", "A", 0, aMinorPos1);

// Test 4: G Major - Position 1 (different key)
console.log("\n📊 TEST 3: G Major Scale");
const gMajorPos1 = getScaleFingering("G Major", "G", 0);
displayFingering("G Major", "G", 0, gMajorPos1);

// Test 5: F# Major - Position 1 (sharp key)
console.log("\n📊 TEST 4: F# Major Scale");
const fSharpMajorPos1 = getScaleFingering("F# Major", "F#", 0);
displayFingering("F# Major", "F#", 0, fSharpMajorPos1);

// Test 6: C Major Pentatonic
console.log("\n📊 TEST 5: C Major Pentatonic");
const cPentPos1 = getScaleFingering("C Major Pentatonic", "C", 0);
displayFingering("C Major Pentatonic", "C", 0, cPentPos1);

console.log("\n" + "=".repeat(60));
console.log("✅ All tests completed!");
console.log("=".repeat(60));
