/**
 * Debug diminished chord pattern to understand what notes it produces
 */

import { noteToValue, valueToNote, STANDARD_TUNING_VALUES } from '../client/utils/musicTheory';

const STANDARD_TUNING_NAMES = ['E', 'A', 'D', 'G', 'B', 'E']; // Low to High

function analyzePattern(frets: (number | 'x')[], firstFret: number): void {
  console.log(`\nPattern: [${frets.join(', ')}] @ fret ${firstFret}`);
  console.log('String | Tuning | Fret | Absolute | Note Value | Note Name');
  console.log('-'.repeat(60));
  
  const notes: number[] = [];
  
  frets.forEach((fret, stringIndex) => {
    const stringName = STANDARD_TUNING_NAMES[5 - stringIndex]; // Reverse for display
    const tuningValue = STANDARD_TUNING_VALUES[stringIndex];
    const tuningName = valueToNote(tuningValue);
    
    if (typeof fret === 'number') {
      const absoluteFret = firstFret > 1 ? firstFret + fret - 1 : fret;
      const noteValue = (tuningValue + absoluteFret) % 12;
      const noteName = valueToNote(noteValue);
      notes.push(noteValue);
      
      console.log(`${stringName.padEnd(6)} | ${tuningName.padEnd(6)} | ${fret.toString().padEnd(4)} | ${absoluteFret.toString().padEnd(8)} | ${noteValue.toString().padEnd(10)} | ${noteName}`);
    } else {
      console.log(`${stringName.padEnd(6)} | ${tuningName.padEnd(6)} | x    | muted   | -          | -`);
    }
  });
  
  const uniqueNotes = Array.from(new Set(notes)).sort();
  console.log(`\nUnique notes: ${uniqueNotes.map(v => valueToNote(v)).join(', ')}`);
}

console.log('Analyzing diminished chord pattern [x, x, 1, 2, 1, 2] at different frets:');

// Test at different frets
for (let fret = 1; fret <= 4; fret++) {
  analyzePattern(['x', 'x', 1, 2, 1, 2], fret);
}

console.log('\n\nExpected notes:');
console.log('Cdim: C, D#, F#');
console.log('Cdim7: C, D#, F#, A');
console.log('Ddim: D, F, G#');
console.log('Ddim7: D, F, G#, B');

