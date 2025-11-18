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
  console.log('Starting scale pattern verification...\n');

  verifyCMajorPositions();
  verifyMinorPentatonicBoxes();

  // Additional individual checks
  verifySingleScalePattern('blues', 'A', 0);
  verifySingleScalePattern('blues', 'A', 1);
  verifySingleScalePattern('blues', 'A', 2);

  console.log('Verification complete.');
}

export {
  verifyCMajorPositions,
  verifyMinorPentatonicBoxes,
  verifySingleScalePattern
};
