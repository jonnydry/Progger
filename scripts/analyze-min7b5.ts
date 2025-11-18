/**
 * Analyze Half-Diminished (min7b5) Chord Patterns
 * 
 * min7b5 intervals: [0, 3, 6, 10] - root, minor 3rd, diminished 5th, minor 7th
 * dim7 intervals: [0, 3, 6, 9] - root, minor 3rd, diminished 5th, diminished 7th
 * 
 * The difference is the 7th: min7b5 has minor 7th (10), dim7 has diminished 7th (9)
 */

import { noteToValue, valueToNote, STANDARD_TUNING_VALUES } from '../client/utils/musicTheory';
import { getChordNotes } from '../client/utils/chordAnalysis';

const STANDARD_TUNING_NAMES = ['E', 'A', 'D', 'G', 'B', 'E']; // Low to High

function analyzePattern(frets: (number | 'x')[], firstFret: number): void {
  const notes: number[] = [];
  
  frets.forEach((fret, stringIndex) => {
    if (typeof fret === 'number') {
      const absoluteFret = firstFret > 1 ? firstFret + fret - 1 : fret;
      const noteValue = (STANDARD_TUNING_VALUES[stringIndex] + absoluteFret) % 12;
      notes.push(noteValue);
    }
  });
  
  const uniqueNotes = Array.from(new Set(notes)).sort();
  const noteNames = uniqueNotes.map(v => valueToNote(v));
  
  console.log(`Fret ${firstFret}: ${noteNames.join(', ')}`);
  return uniqueNotes;
}

function findMin7b5Pattern(root: string): void {
  const rootValue = noteToValue(root);
  const expectedNotes = new Set(getChordNotes(`${root}m7b5`).map(n => noteToValue(n)));
  const expectedNames = Array.from(expectedNotes).map(v => valueToNote(v)).sort();
  
  console.log(`\n${root}m7b5 - Expected: ${expectedNames.join(', ')}`);
  
  // Test the dim7 pattern
  console.log('Pattern [x, x, 1, 2, 1, 2]:');
  for (let fret = 1; fret <= 4; fret++) {
    const notes = analyzePattern(['x', 'x', 1, 2, 1, 2], fret);
    const noteSet = new Set(notes);
    const match = Array.from(expectedNotes).every(n => noteSet.has(n));
    if (match) {
      console.log(`  ✓ Fret ${fret} matches!`);
    }
  }
  
  // Test alternative pattern [x, x, 1, 2, 2, 1] (common min7b5 shape)
  console.log('\nPattern [x, x, 1, 2, 2, 1]:');
  for (let fret = 1; fret <= 4; fret++) {
    const notes = analyzePattern(['x', 'x', 1, 2, 2, 1], fret);
    const noteSet = new Set(notes);
    const match = Array.from(expectedNotes).every(n => noteSet.has(n));
    if (match) {
      console.log(`  ✓ Fret ${fret} matches!`);
    }
  }
}

console.log('🎵 Analyzing Half-Diminished (min7b5) Chord Patterns');
console.log('='.repeat(60));

// Test a few roots
for (const root of ['C', 'D', 'E', 'F', 'G', 'A', 'B']) {
  findMin7b5Pattern(root);
}

