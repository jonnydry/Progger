/**
 * Map Half-Diminished (min7b5) Chords to Correct Fret Positions
 * 
 * Pattern: ['x', 1, 2, 1, 2, 'x'] with firstFret
 * This pattern produces all 12 min7b5 chords at different frets
 */

const FRET_MAPPING: Record<string, number> = {
  'A#': 1,  // A#m7b5 at fret 1
  'Bb': 1,  // Bb = A#
  'B': 2,   // Bm7b5 at fret 2
  'C': 3,   // Cm7b5 at fret 3
  'C#': 4,  // C#m7b5 at fret 4
  'Db': 4,  // Db = C#
  'D': 5,   // Dm7b5 at fret 5
  'D#': 6,  // D#m7b5 at fret 6
  'Eb': 6,  // Eb = D#
  'E': 7,   // Em7b5 at fret 7
  'F': 8,   // Fm7b5 at fret 8
  'F#': 9,  // F#m7b5 at fret 9
  'Gb': 9,  // Gb = F#
  'G': 10,  // Gm7b5 at fret 10
  'G#': 11, // G#m7b5 at fret 11
  'Ab': 11, // Ab = G#
  'A': 12,  // Am7b5 at fret 12
};

function generateMin7b5Voicings(root: string): string {
  const fret = FRET_MAPPING[root] || 1;
  
  // Keep open voicing if it exists, add barre voicings
  const voicings = [
    `    { frets: ['x', 1, 2, 1, 2, 'x'], firstFret: ${fret}, position: 'Barre ${fret}th' }`,
  ];
  
  // Add additional positions (every 12 frets)
  if (fret + 12 <= 12) {
    voicings.push(`    { frets: ['x', 1, 2, 1, 2, 'x'], firstFret: ${fret + 12}, position: 'Barre ${fret + 12}th' }`);
  }
  
  return `  '${root}_min7b5': [\n${voicings.join(',\n')}\n  ],`;
}

console.log('// Generated min7b5 chord fixes using barre pattern [x, 1, 2, 1, 2, x]\n');
console.log('// Fret mapping:\n');
Object.entries(FRET_MAPPING).forEach(([root, fret]) => {
  console.log(`// ${root}m7b5 -> fret ${fret}`);
});

console.log('\n// Voicings:\n');
const ALL_ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
ALL_ROOTS.forEach(root => {
  console.log(generateMin7b5Voicings(root));
});

