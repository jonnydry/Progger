/**
 * Calculate Correct Half-Diminished (min7b5) Chord Voicings
 * 
 * min7b5 intervals: [0, 3, 6, 10] - root, minor 3rd, diminished 5th, minor 7th
 * 
 * Unlike dim7, min7b5 is NOT symmetric - each root needs specific fret positions
 */

import { noteToValue, valueToNote, STANDARD_TUNING_VALUES } from '../client/utils/musicTheory';
import { getChordNotes } from '../client/utils/chordAnalysis';

const STANDARD_TUNING_NAMES = ['E', 'A', 'D', 'G', 'B', 'E']; // Low to High

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

function findCorrectFrets(root: string): { pattern: (number | 'x')[]; frets: number[] } | null {
  const expectedNotes = new Set(getChordNotes(`${root}m7b5`).map(n => noteToValue(n)));
  const expectedNames = Array.from(expectedNotes).map(v => valueToNote(v)).sort();
  
  // Common min7b5 patterns
  const patterns = [
    ['x', 'x', 1, 2, 2, 1],  // Common movable shape
    ['x', 'x', 1, 2, 1, 1],  // Alternative
    ['x', 'x', 1, 2, 3, 1],  // Another possibility
  ];
  
  for (const pattern of patterns) {
    const matchingFrets: number[] = [];
    
    for (let fret = 1; fret <= 12; fret++) {
      const notes = getNotesFromPattern(pattern, fret);
      const noteSet = new Set(notes);
      
      // Check if all expected notes are present and we have exactly 4 notes
      const match = Array.from(expectedNotes).every(n => noteSet.has(n)) && notes.length === 4;
      
      if (match) {
        matchingFrets.push(fret);
      }
    }
    
    if (matchingFrets.length > 0) {
      return { pattern, frets: matchingFrets };
    }
  }
  
  return null;
}

console.log('🎵 Finding Correct Fret Positions for Half-Diminished Chords');
console.log('='.repeat(70));

const ALL_ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const results: Record<string, { pattern: (number | 'x')[]; frets: number[]; expected: string[] }> = {};

for (const root of ALL_ROOTS) {
  const result = findCorrectFrets(root);
  const expected = getChordNotes(`${root}m7b5`).sort();
  
  if (result) {
    results[root] = { ...result, expected };
    const patternStr = `[${result.pattern.join(', ')}]`;
    const fretsStr = result.frets.join(', ');
    console.log(`${root}m7b5: Pattern ${patternStr} at frets ${fretsStr}`);
    console.log(`  Expected: ${expected.join(', ')}`);
  } else {
    console.log(`${root}m7b5: ❌ No matching pattern found`);
    console.log(`  Expected: ${expected.join(', ')}`);
  }
}

console.log('\n📊 Summary:');
console.log(`Found patterns for ${Object.keys(results).length} of ${ALL_ROOTS.length} roots`);

