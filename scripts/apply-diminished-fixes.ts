/**
 * Apply Diminished Chord Fixes
 * 
 * Updates all diminished chord voicings with correct fret positions
 */

// Fret mapping: which frets produce which dim7 chords
const FRET_MAPPING: Record<string, number[]> = {
  // Group 1: Frets 1, 4, 7, 10
  'C': [1, 4, 7, 10],
  'D#': [1, 4, 7, 10],
  'Eb': [1, 4, 7, 10],
  'F#': [1, 4, 7, 10],
  'Gb': [1, 4, 7, 10],
  'A': [1, 4, 7, 10],
  
  // Group 2: Frets 2, 5, 8, 11
  'C#': [2, 5, 8, 11],
  'Db': [2, 5, 8, 11],
  'E': [2, 5, 8, 11],
  'G': [2, 5, 8, 11],
  'A#': [2, 5, 8, 11],
  'Bb': [2, 5, 8, 11],
  
  // Group 3: Frets 3, 6, 9, 12
  'D': [3, 6, 9, 12],
  'F': [3, 6, 9, 12],
  'G#': [3, 6, 9, 12],
  'Ab': [3, 6, 9, 12],
  'B': [3, 6, 9, 12],
};

/**
 * Get correct frets for a root note
 */
function getCorrectFrets(root: string): number[] {
  // Normalize root (handle enharmonics)
  const normalized = root.replace('#', '#').replace('b', 'b');
  
  // Try direct match first
  if (FRET_MAPPING[root]) {
    return FRET_MAPPING[root];
  }
  
  // Try enharmonic equivalents
  const enharmonics: Record<string, string> = {
    'C#': 'Db',
    'D#': 'Eb',
    'F#': 'Gb',
    'G#': 'Ab',
    'A#': 'Bb',
  };
  
  const equivalent = enharmonics[root] || root;
  return FRET_MAPPING[equivalent] || [1, 4, 7, 10]; // Default fallback
}

/**
 * Generate fixed voicings for dim7
 */
function generateDim7Voicings(root: string): string {
  const frets = getCorrectFrets(root);
  const voicings = frets.map(fret => 
    `    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: ${fret}, position: 'Dim7 ${fret}th' }`
  ).join(',\n');
  
  return `  '${root}_dim7': [\n${voicings}\n  ],`;
}

/**
 * Generate fixed voicings for dim (triad)
 */
function generateDimVoicings(root: string): string {
  const frets = getCorrectFrets(root);
  // Use 3-note pattern (remove high E string)
  const voicings = frets.map(fret => 
    `    { frets: ['x', 'x', 1, 2, 1, 'x'], firstFret: ${fret}, position: 'Dim ${fret}th' }`
  ).join(',\n');
  
  return `  '${root}_dim': [\n${voicings}\n  ],`;
}

// Generate fixes for all roots
const ALL_ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

console.log('// Generated diminished chord fixes\n');
console.log('// Dim7 voicings:');
ALL_ROOTS.forEach(root => {
  console.log(generateDim7Voicings(root));
});

console.log('\n\n// Dim triad voicings:');
ALL_ROOTS.forEach(root => {
  console.log(generateDimVoicings(root));
});

