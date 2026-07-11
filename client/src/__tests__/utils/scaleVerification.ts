/**
 * Scale Pattern Verification (3NPS)
 * Manual/CLI helper for inspecting 3-note-per-string positions across the neck.
 */

import { getScaleFingering } from "../../utils/scaleLibrary";

function formatFingering(fingering: number[][]): string {
  const strings = ["Low E", "A", "D", "G", "B", "High E"];
  return strings.map((string, i) => `  ${string.padEnd(6)}: ${fingering[i].join(", ")}`).join("\n");
}

function verifyCMajor3NPSPositions() {
  console.log("=== C MAJOR 3NPS VERIFICATION (7 positions) ===\n");

  for (let pos = 0; pos < 7; pos++) {
    const fingering = getScaleFingering("major", "C", pos);
    const lowE = fingering[0];
    const minFret = Math.min(...lowE);
    const notesPerString = fingering.map((s) => s.length);

    console.log(`Position ${pos + 1} (low E starts at fret ${minFret}):`);
    console.log(formatFingering(fingering));
    console.log(
      `  Notes/string: [${notesPerString.join(", ")}]${notesPerString.every((n) => n === 3) ? " ✓ 3NPS" : " ❌ not 3NPS"}`
    );
    console.log("");
  }
}

function verifyMinorPentatonicBoxes() {
  console.log("=== MINOR PENTATONIC BOXES (not 3NPS — 5-box system) ===\n");

  for (let pos = 0; pos < 5; pos++) {
    const fingering = getScaleFingering("pentatonic minor", "A", pos);
    console.log(`Box ${pos + 1}:`);
    console.log(formatFingering(fingering));
    console.log("");
  }
}

function verifySingleScalePattern(scaleName: string, root: string, position: number = 0) {
  console.log(`=== ${root} ${scaleName.toUpperCase()} POSITION ${position + 1} ===\n`);
  const fingering = getScaleFingering(scaleName, root, position);
  console.log(formatFingering(fingering));
  console.log("");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("=== PROGGER 3NPS SCALE VERIFICATION ===\n");
  console.log("• 7-note scales use 3 notes per string × 7 positions across the neck");
  console.log("• Pentatonic/blues remain box systems (not strict 3NPS)\n");

  console.log("🎭 MODAL SCALE SPOT CHECKS 🎭\n");
  verifySingleScalePattern("dorian", "D", 0);
  verifySingleScalePattern("phrygian", "E", 0);
  verifySingleScalePattern("lydian", "F", 0);
  verifySingleScalePattern("mixolydian", "G", 0);
  verifySingleScalePattern("locrian", "B", 0);

  console.log("\n🎵 C MAJOR 3NPS 🎵\n");
  verifyCMajor3NPSPositions();

  console.log("\n🎸 PENTATONIC (box system) 🎸\n");
  verifyMinorPentatonicBoxes();

  console.log("\n📊 VERIFICATION COMPLETE 📊\n");
  console.log("Expected: each 7-note position has 3 frets/string; C major mins span the neck.");
}

export { verifyCMajor3NPSPositions, verifyMinorPentatonicBoxes, verifySingleScalePattern };
