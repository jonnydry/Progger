/**
 * Generate Correct Fret Mappings for Diminished Chords
 * 
 * The pattern [x, x, 1, 2, 1, 2] produces different dim7 chords at different frets.
 * This script maps each root to the correct fret positions.
 */

import { noteToValue, valueToNote, STANDARD_TUNING_VALUES } from '../client/utils/musicTheory';
import { getChordNotes } from '../client/utils/chordAnalysis';

const ALL_ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Calculate notes produced by pattern at a given fret
 */
function getNotesAtFret(frets: (number | 'x')[], firstFret: number): number[] {
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

/**
 * Find which fret produces a given root for dim7
 */
function findDim7Fret(root: string): number | null {
  const rootValue = noteToValue(root);
  const expectedNotes = new Set(getChordNotes(`${root}dim7`).map(n => noteToValue(n)));
  
  const pattern = ['x', 'x', 1, 2, 1, 2];
  
  // Check frets 1-12 (diminished chords repeat every 3 frets, so 12 covers all)
  for (let fret = 1; fret <= 12; fret++) {
    const notes = getNotesAtFret(pattern, fret);
    const noteSet = new Set(notes);
    
    // Check if all expected notes are present
    const allMatch = Array.from(expectedNotes).every(note => noteSet.has(note));
    if (allMatch && notes.length === 4) {
      return fret;
    }
  }
  
  return null;
}

/**
 * Generate the mapping
 */
function generateMapping(): void {
  console.log('🎵 Diminished Chord Fret Mapping');
  console.log('='.repeat(60));
  console.log('\nPattern: [x, x, 1, 2, 1, 2] (dim7 shape)');
  console.log('\nFret | Produces Dim7 Chord | Notes');
  console.log('-'.repeat(60));
  
  const fretToChord = new Map<number, string>();
  const chordToFret = new Map<string, number>();
  
  // Map each fret to what chord it produces
  for (let fret = 1; fret <= 12; fret++) {
    const notes = getNotesAtFret(['x', 'x', 1, 2, 1, 2], fret);
    const noteNames = notes.map(v => valueToNote(v)).sort();
    
    // Find which root this corresponds to (first note is usually the root)
    const firstNote = noteNames[0];
    const chordName = `${firstNote}dim7`;
    
    fretToChord.set(fret, chordName);
    chordToFret.set(chordName, fret);
    
    console.log(`${fret.toString().padEnd(4)} | ${chordName.padEnd(18)} | ${noteNames.join(', ')}`);
  }
  
  console.log('\n\n📋 Correct Fret Positions for Each Root:');
  console.log('-'.repeat(60));
  
  for (const root of ALL_ROOTS) {
    const fret = findDim7Fret(root);
    if (fret) {
      const notes = getNotesAtFret(['x', 'x', 1, 2, 1, 2], fret);
      const noteNames = notes.map(v => valueToNote(v)).sort();
      const expected = getChordNotes(`${root}dim7`).sort();
      const match = JSON.stringify(noteNames.sort()) === JSON.stringify(expected.sort());
      
      console.log(`${root.padEnd(3)}dim7: Fret ${fret.toString().padEnd(2)} → ${noteNames.join(', ').padEnd(20)} ${match ? '✅' : '❌'}`);
    }
  }
  
  console.log('\n\n💡 For Diminished Triads (dim, not dim7):');
  console.log('Diminished triads need only 3 notes (root, minor 3rd, diminished 5th).');
  console.log('The dim7 pattern includes an extra note (diminished 7th).');
  console.log('For dim triads, we should use different patterns or remove one note.');
}

generateMapping();

