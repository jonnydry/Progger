/**
 * Calculate Correct Diminished Chord Voicings
 * 
 * Diminished chords are symmetric - the same pattern represents different chords
 * depending on the root note. This script calculates correct fret positions.
 * 
 * Usage: tsx scripts/calculate-diminished-voicings.ts
 */

import { noteToValue, valueToNote, STANDARD_TUNING_VALUES } from '../client/utils/musicTheory';
import { getChordNotes } from '../client/utils/chordAnalysis';
import type { ChordVoicing } from '../client/types';

const ALL_ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Calculate what notes a fret pattern produces at a given firstFret
 */
function calculateNotesFromPattern(
  frets: (number | 'x')[],
  firstFret: number
): number[] {
  const notes: number[] = [];
  
  frets.forEach((fret, stringIndex) => {
    if (typeof fret === 'number') {
      const absoluteFret = firstFret > 1 ? firstFret + fret - 1 : fret;
      const noteValue = (STANDARD_TUNING_VALUES[stringIndex] + absoluteFret) % 12;
      notes.push(noteValue);
    }
  });
  
  return notes;
}

/**
 * Find the correct firstFret for a diminished chord pattern
 * The pattern ['x', 'x', 1, 2, 1, 2] produces a dim7 chord, but we need
 * to find which fret produces the correct root
 */
function findCorrectFretForDimChord(
  root: string,
  quality: 'dim' | 'dim7',
  pattern: (number | 'x')[]
): { firstFret: number; notes: string[] } | null {
  const rootValue = noteToValue(root);
  const expectedNotes = new Set(getChordNotes(quality === 'dim' ? root : `${root}dim7`).map(n => noteToValue(n)));
  
  // Try different fret positions (1-12)
  for (let firstFret = 1; firstFret <= 12; firstFret++) {
    const notes = calculateNotesFromPattern(pattern, firstFret);
    const noteSet = new Set(notes);
    
    // Check if all expected notes are present (or at least the root for partial voicings)
    if (quality === 'dim') {
      // For dim triad, check if root is present
      if (notes.includes(rootValue)) {
        return {
          firstFret,
          notes: notes.map(v => valueToNote(v))
        };
      }
    } else {
      // For dim7, check if all 4 notes match
      const allMatch = Array.from(expectedNotes).every(note => noteSet.has(note));
      if (allMatch && notes.length === 4) {
        return {
          firstFret,
          notes: notes.map(v => valueToNote(v))
        };
      }
    }
  }
  
  return null;
}

/**
 * Generate correct voicings for all diminished chords
 */
function generateDiminishedVoicings(): void {
  console.log('🎵 Calculating Correct Diminished Chord Voicings');
  console.log('='.repeat(60));
  
  const dimPattern = ['x', 'x', 1, 2, 1, 2]; // Standard dim7 pattern
  const results: Array<{
    root: string;
    quality: 'dim' | 'dim7';
    currentVoicings: Array<{ firstFret: number; notes: string[] }>;
    correctVoicings: Array<{ firstFret: number; notes: string[] }>;
  }> = [];
  
  for (const root of ALL_ROOTS) {
    // Check dim
    const dimExpected = getChordNotes(root);
    const dimResult = findCorrectFretForDimChord(root, 'dim', dimPattern);
    
    // Check dim7
    const dim7Expected = getChordNotes(`${root}dim7`);
    const dim7Result = findCorrectFretForDimChord(root, 'dim7', dimPattern);
    
    if (dimResult || dim7Result) {
      results.push({
        root,
        quality: 'dim',
        currentVoicings: [], // Will be populated from data files
        correctVoicings: dimResult ? [dimResult] : []
      });
      
      results.push({
        root,
        quality: 'dim7',
        currentVoicings: [],
        correctVoicings: dim7Result ? [dim7Result] : []
      });
    }
  }
  
  // Generate report
  console.log('\n📊 Results Summary:');
  console.log(`Total chords analyzed: ${results.length}`);
  
  console.log('\n🔧 Recommended Fixes:');
  results.forEach(({ root, quality, correctVoicings }) => {
    if (correctVoicings.length > 0) {
      const chordName = quality === 'dim' ? root : `${root}dim7`;
      const expected = getChordNotes(chordName);
      console.log(`\n${chordName}:`);
      console.log(`  Expected: ${expected.join(', ')}`);
      correctVoicings.forEach(({ firstFret, notes }) => {
        console.log(`  Fret ${firstFret}: ${notes.join(', ')}`);
      });
    }
  });
  
  // Note: The pattern ['x', 'x', 1, 2, 1, 2] is actually correct for dim7 chords
  // The issue is that it produces different roots at different frets
  // For Cdim7, we need fret positions that produce C, D#, F#, A
  // The pattern at different frets produces:
  // - Fret 2: F, B, D, G# (Fdim7)
  // - Fret 3: F#, C, D#, A (F#dim7) 
  // - Fret 4: G, C#, E, A# (Gdim7)
  // etc.
  
  // We need to find which fret produces Cdim7
  console.log('\n💡 Key Insight:');
  console.log('The pattern [x, x, 1, 2, 1, 2] is a movable dim7 shape.');
  console.log('Each fret position produces a different dim7 chord.');
  console.log('We need to identify which fret produces the correct root.');
}

// Run if executed directly
if (import.meta.url.endsWith('calculate-diminished-voicings.ts') || 
    process.argv[1]?.endsWith('calculate-diminished-voicings.ts')) {
  generateDiminishedVoicings();
}

export { generateDiminishedVoicings, findCorrectFretForDimChord };

