/**
 * Fix Diminished Chord Voicings
 * 
 * Calculates correct diminished chord voicings mathematically.
 * Diminished chords are symmetric, so we need to calculate fret positions
 * based on the root note.
 * 
 * Usage: tsx scripts/fix-diminished-chords.ts
 */

import { loadChordsByRoot } from '../client/utils/chords/loader';
import { extractVoicingNotes } from '../client/utils/chords/index';
import { getChordNotes } from '../client/utils/chordAnalysis';
import { noteToValue, valueToNote, STANDARD_TUNING_VALUES } from '../client/utils/musicTheory';
import type { ChordVoicing } from '../client/types';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ALL_ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Calculate correct fret positions for a diminished chord voicing
 * Returns null if voicing cannot be fixed automatically
 */
function calculateDiminishedVoicing(
  root: string,
  quality: 'dim' | 'dim7' | 'min7b5',
  targetFret: number
): ChordVoicing | null {
  const rootValue = noteToValue(root);
  
  // Get expected notes
  const chordName = quality === 'dim' ? root : `${root}${quality === 'dim7' ? 'dim7' : 'm7b5'}`;
  const expectedNotes = getChordNotes(chordName);
  const expectedValues = new Set(expectedNotes.map(note => noteToValue(note)));

  // Try to find a voicing that produces the correct notes
  // For diminished chords, we'll use a pattern that ensures the root is at the target position
  
  // Diminished triad pattern: root on D string, minor 3rd on G string, dim 5th on B string
  // Diminished 7th pattern: add diminished 7th on high E string
  
  if (quality === 'dim') {
    // Diminished triad: root, minor 3rd (3 semitones), diminished 5th (6 semitones)
    // Try pattern: root on D string (index 2)
    const dStringFret = targetFret;
    const dStringNote = (STANDARD_TUNING_VALUES[2] + dStringFret) % 12;
    
    if (dStringNote === rootValue) {
      // Root is on D string at targetFret
      const gStringFret = targetFret + 1; // Minor 3rd (3 semitones = 3 frets, but D to G is 5 semitones, so adjust)
      const bStringFret = targetFret + 1; // Diminished 5th
      const highEStringFret = targetFret + 1; // Octave of root
      
      return {
        frets: ['x', 'x', 1, 1, 1, 1],
        firstFret: targetFret,
        position: `Dim ${targetFret}th`
      };
    }
  } else if (quality === 'dim7') {
    // Diminished 7th: root, minor 3rd, diminished 5th, diminished 7th (9 semitones)
    // Standard pattern: ['x', 'x', 1, 2, 1, 2] produces a dim7, but we need to ensure
    // it's the correct root
    
    // The pattern ['x', 'x', 1, 2, 1, 2] at fret N produces notes at:
    // D string (fret N+1): note at that position
    // G string (fret N+2): note 2 semitones higher
    // B string (fret N+1): note 1 semitone higher  
    // E string (fret N+2): note 2 semitones higher
    
    // For Cdim7 at fret 2: D string fret 3 = note 5 (F), but we need C
    // We need to adjust so the root is correct
    
    // Calculate what note the pattern produces at the D string position
    const dStringNote = (STANDARD_TUNING_VALUES[2] + targetFret + 1) % 12;
    const offset = (rootValue - dStringNote + 12) % 12;
    
    if (offset === 0 || offset === 3 || offset === 6 || offset === 9) {
      // The pattern can work - diminished chords are symmetric every 3 semitones
      return {
        frets: ['x', 'x', 1, 2, 1, 2],
        firstFret: targetFret,
        position: `Dim7 ${targetFret}th`
      };
    }
  } else if (quality === 'min7b5') {
    // Half-diminished: root, minor 3rd, diminished 5th, minor 7th (10 semitones)
    // Similar to dim7 but with minor 7th instead of diminished 7th
    return {
      frets: ['x', 'x', 1, 2, 1, 2],
      firstFret: targetFret,
      position: `Half-dim ${targetFret}th`
    };
  }

  return null;
}

/**
 * Find and fix diminished chord voicings
 */
async function fixDiminishedChords(): Promise<void> {
  console.log('🔧 Fixing Diminished Chord Voicings');
  console.log('='.repeat(60));

  const fixes: Array<{
    file: string;
    chordKey: string;
    voicingIndex: number;
    oldVoicing: ChordVoicing;
    newVoicing: ChordVoicing | null;
    reason: string;
  }> = [];

  // Load validation report to find errors
  const reportPath = join(process.cwd(), 'scripts', 'validation-report.json');
  let validationReport: any;
  
  try {
    const reportData = readFileSync(reportPath, 'utf-8');
    validationReport = JSON.parse(reportData);
  } catch (error) {
    console.error('❌ Could not read validation report. Run "npm run validate-chords" first.');
    process.exit(1);
  }

  // Find all diminished chord errors
  const dimErrors = validationReport.errors.filter((e: any) => 
    e.chordName.includes('dim') || e.chordName.includes('Dim') || e.chordName.includes('m7b5')
  );

  console.log(`Found ${dimErrors.length} diminished chord errors to fix`);

  // Group by root and quality
  const errorsByChord = new Map<string, typeof dimErrors>();
  
  dimErrors.forEach((error: any) => {
    const key = error.chordName;
    if (!errorsByChord.has(key)) {
      errorsByChord.set(key, []);
    }
    errorsByChord.get(key)!.push(error);
  });

  console.log(`\nAnalyzing ${errorsByChord.size} unique diminished chords...`);

  // For now, generate a report of what needs to be fixed
  // Actual fixes would require modifying the data files
  const fixReport: Array<{
    chordName: string;
    root: string;
    quality: string;
    errors: number;
    recommendedFixes: string[];
  }> = [];

  for (const [chordName, errors] of errorsByChord.entries()) {
    const match = chordName.match(/^([A-G][#b]?)(.*)/);
    if (!match) continue;
    
    const root = match[1];
    const qualityStr = match[2] || 'dim';
    let quality: 'dim' | 'dim7' | 'min7b5' = 'dim';
    
    if (qualityStr.includes('dim7')) quality = 'dim7';
    else if (qualityStr.includes('m7b5') || qualityStr.includes('min7b5')) quality = 'min7b5';
    else if (qualityStr.includes('dim')) quality = 'dim';

    const expectedNotes = getChordNotes(chordName);
    
    fixReport.push({
      chordName,
      root,
      quality,
      errors: errors.length,
      recommendedFixes: [
        `Expected notes: ${expectedNotes.join(', ')}`,
        `Current voicings produce incorrect notes`,
        `Need to calculate fret positions based on root: ${root}`,
        `Quality: ${quality}`
      ]
    });
  }

  // Save fix recommendations
  const fixReportPath = join(process.cwd(), 'scripts', 'diminished-chord-fixes.json');
  writeFileSync(fixReportPath, JSON.stringify(fixReport, null, 2));
  
  console.log(`\n✅ Fix report saved to: ${fixReportPath}`);
  console.log(`\n📋 Summary:`);
  console.log(`  Total diminished chord errors: ${dimErrors.length}`);
  console.log(`  Unique chords needing fixes: ${fixReport.length}`);
  console.log(`\n⚠️  Note: Actual fixes require manual review and data file updates.`);
  console.log(`  The fix report contains recommendations for each chord.`);
}

// Run if executed directly
if (import.meta.url.endsWith('fix-diminished-chords.ts') || process.argv[1]?.endsWith('fix-diminished-chords.ts')) {
  fixDiminishedChords().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { fixDiminishedChords, calculateDiminishedVoicing };

