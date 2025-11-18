/**
 * Scale Pattern Verification
 * Cross-references our generated patterns against standard guitar scale references
 */

import { getScaleFingering } from '../../utils/scaleLibrary';

// Standard CAGED positions for C Major (frets where E string root appears)
const C_MAJOR_CAGED_ORIGINS = [8, 3, 0, 5, 10]; // C, A, G, E, D shapes

// Standard minor pentatonic box positions (frets where boxes start)
const MINOR_PENTATONIC_BOXES = [12, 10, 8, 5, 3]; // Position 1-5 fret origins

function formatFingering(fingering: number[][]): string {
  const strings = ['Low E', 'A', 'D', 'G', 'B', 'High E'];
  return strings.map((string, i) =>
    `  ${string.padEnd(6)}: ${fingering[i].join(', ')}`).join('\n');
}

function verifyCMajorPositions() {
  console.log('=== C MAJOR SCALE VERIFICATION ===\n');

  for (let pos = 0; pos < 5; pos++) {
    const fingering = getScaleFingering('major', 'C', pos);
    const expectedOrigin = C_MAJOR_CAGED_ORIGINS[pos];

    console.log(`Position ${pos + 1} (${expectedOrigin}th fret on low E):`);
    console.log(formatFingering(fingering));

    // Verify low E has notes and starts at expected fret
    const lowEString = fingering[0];
    const minFret = Math.min(...lowEString.filter(f => f > 0));
    const matchesExpectedOrigin = minFret === expectedOrigin;

    console.log(`  ✓ Low E root fret: ${minFret}${matchesExpectedOrigin ? ' ✓' : ' ❌ (expected ' + expectedOrigin + ')'}`);
    console.log('');
  }
}

function verifyMinorPentatonicBoxes() {
  console.log('=== MINOR PENTATONIC BOXES VERIFICATION ===\n');

  for (let pos = 0; pos < 5; pos++) {
    const fingering = getScaleFingering('pentatonic minor', 'A', pos);
    const expectedOrigin = MINOR_PENTATONIC_BOXES[pos];

    console.log(`Box ${pos + 1} (${expectedOrigin}th fret origin):`);
    console.log(formatFingering(fingering));

    // Verify the pentatonic pattern starts at expected locations
    console.log(`  Expected origin: ${expectedOrigin}th fret`);
    console.log('');
  }
}

function verifySingleScalePattern(scaleName: string, root: string, position: number = 0) {
  console.log(`=== ${root} ${scaleName.toUpperCase()} POSITION ${position + 1} ===\n`);
  const fingering = getScaleFingering(scaleName, root, position);
  console.log(formatFingering(fingering));
  console.log('');
}

// Run verifications if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('=== PROGGER SCALE VERIFICATION AGAINST GUITAR EDUCATION STANDARDS ===\n');

  console.log('**GUITAR SCALE ACADEMY STANDARDS:**\n');
  console.log('• C Major follows CAGED: E(8),A(3),G(0),E(5),D(10) frets on low E string');
  console.log('• Minor Pentatonic boxes: A=12th,10th,8th,5th,3rd fret origins');
  console.log('• Modal scales positioned relative to diatonic roots\n');

  console.log('**Verification Results:**\n');

  // Modal Scales First (as requested)
  console.log('🎭 MODAL SCALE VERIFICATION 🎭\n');
  console.log('--- D DORIAN (Modal Scale #2) ---');
  verifySingleScalePattern('dorian', 'D', 0); // Should start with root at ~10th fret
  verifySingleScalePattern('dorian', 'D', 1); // Second position

  console.log('--- E PHRYGIAN (Modal Scale #3) ---');
  verifySingleScalePattern('phrygian', 'E', 0); // Should start with root at ~12th fret

  console.log('--- F LYDIAN (Modal Scale #4) ---');
  verifySingleScalePattern('lydian', 'F', 0); // Should start with root at ~1st fret

  console.log('--- G MIXOLYDIAN (Modal Scale #5) ---');
  verifySingleScalePattern('mixolydian', 'G', 0); // Should start with root at ~3rd fret

  console.log('--- B LOCRIAN (Modal Scale #7) ---');
  verifySingleScalePattern('locrian', 'B', 0); // Should start with root at ~7th fret

  console.log('\n🎵 DIATONIC SCALE VERIFICATION 🎵\n');
  verifyCMajorPositions(); // C Major/Ionian

  console.log('\n🎸 PENTATONIC SCALE VERIFICATION 🎸\n');
  verifyMinorPentatonicBoxes(); // A Minor Pentatonic boxes

  console.log('\n🎺 BLUES SCALE VERIFICATION 🎺\n');
  console.log('A Blues (hexatonic scale with flat-5th):');
  verifySingleScalePattern('blues', 'A', 0);
  verifySingleScalePattern('blues', 'A', 1);
  verifySingleScalePattern('blues', 'A', 2);

  console.log('\n📊 VERIFICATION COMPLETE 📊\n');
  console.log('**Expected Results:**');
  console.log('• Modal scales should start at characteristic fret positions (10th for D, 12th for E, etc.)');
  console.log('• C Major positions should cover full neck in CAGED order (8,3,0,5,10)');
  console.log('• Pentatonic boxes should align with 5-box system (12,10,8,5,3 frets)');
  console.log('• All positions should show different fret ranges (no identical patterns)');
  console.log('\nIf any positions are identical or at wrong frets, the POSITION_OFFSETS need adjustment.');
}

export {
  verifyCMajorPositions,
  verifyMinorPentatonicBoxes,
  verifySingleScalePattern
};
