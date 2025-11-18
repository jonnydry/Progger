/**
 * Find Correct Pattern for Half-Diminished (min7b5) Chords
 * 
 * min7b5: root, minor 3rd, diminished 5th, minor 7th [0, 3, 6, 10]
 * Need to find which pattern produces these notes
 */

import { noteToValue, valueToNote, STANDARD_TUNING_VALUES } from '../client/utils/musicTheory';
import { getChordNotes } from '../client/utils/chordAnalysis';

function getNotesFromPattern(frets: (number | 'x')[], firstFret: number): number[] {
  const notes: number[] = [];
  frets.forEach((fret, stringIndex) => {
    if (typeof fret === 'number') {
      const absoluteFret = firstFret > 1 ? firstFret + fret - 1 : fret;
      const noteValue = (STANDARD_TUNING_VALUES[stringIndex] + absoluteFret) % 12;
      notes.push(noteValue);
    }
  });
  return Array.from(new Set(notes)).sort();
}

function testPattern(pattern: (number | 'x')[], root: string): void {
  const expectedNotes = new Set(getChordNotes(`${root}m7b5`).map(n => noteToValue(n)));
  const expectedNames = Array.from(expectedNotes).map(v => valueToNote(v)).sort();
  
  console.log(`\n${root}m7b5 - Expected: ${expectedNames.join(', ')}`);
  console.log(`Pattern [${pattern.join(', ')}]:`);
  
  for (let fret = 1; fret <= 12; fret++) {
    const notes = getNotesFromPattern(pattern, fret);
    const noteSet = new Set(notes);
    const match = Array.from(expectedNotes).every(n => noteSet.has(n)) && notes.length === 4;
    
    const noteNames = notes.map(v => valueToNote(v)).sort();
    if (match) {
      console.log(`  ✓ Fret ${fret}: ${noteNames.join(', ')} MATCHES!`);
    } else {
      // Show first few for debugging
      if (fret <= 4) {
        console.log(`  Fret ${fret}: ${noteNames.join(', ')}`);
      }
    }
  }
}

console.log('🔍 Finding Correct Pattern for Half-Diminished Chords');
console.log('='.repeat(60));

// Test common patterns
const patterns = [
  ['x', 'x', 1, 2, 1, 2],  // dim7 pattern
  ['x', 'x', 1, 2, 2, 1],  // alternative pattern
  ['x', 'x', 1, 2, 1, 1],  // another possibility
];

for (const root of ['C', 'D', 'E', 'F', 'G', 'A', 'B']) {
  for (const pattern of patterns) {
    testPattern(pattern, root);
  }
}

