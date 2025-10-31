/**
 * Script to analyze and convert chord voicing formats
 * from absolute to relative positioning
 */

import { readFileSync, writeFileSync } from 'fs';

// Read the chord library file
const libraryPath = 'client/utils/chordLibrary.ts';
const content = readFileSync(libraryPath, 'utf8');

// Parse chord voicings - this is a simplified parser
// We'll track line numbers and identify format inconsistencies
const lines = content.split('\n');

const issues = [];
let inChordVoicings = false;
let currentChord = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const lineNum = i + 1;
  
  // Track when we enter/exit the CHORD_VOICINGS object
  if (line.includes('const CHORD_VOICINGS')) {
    inChordVoicings = true;
    continue;
  }
  if (inChordVoicings && line.includes('const GENERIC_BARRE_SHAPES')) {
    inChordVoicings = false;
    break;
  }
  
  if (!inChordVoicings) continue;
  
  // Look for chord entries with frets and firstFret
  const chordMatch = line.match(/^  '([^']+)':/);
  if (chordMatch) {
    currentChord = chordMatch[1];
  }
  
  // Look for voicings with firstFret > 1
  const fretsMatch = line.match(/frets: \[(.*?)\]/);
  const firstFretMatch = line.match(/firstFret: (\d+)/);
  
  if (fretsMatch && firstFretMatch) {
    const fretsArray = fretsMatch[1];
    const firstFret = parseInt(firstFretMatch[1]);
    
    if (firstFret > 1) {
      // Parse the frets array
      const frets = fretsArray.split(',').map(f => {
        f = f.trim();
        if (f === "'x'" || f === '"x"' || f === 'x') return 'x';
        return parseInt(f) || 0;
      });
      
      // Check if this looks like absolute format
      // Absolute format: fret values are close to or equal to firstFret value
      const numericFrets = frets.filter(f => typeof f === 'number' && f > 0);
      if (numericFrets.length > 0) {
        const minFret = Math.min(...numericFrets);
        const maxFret = Math.max(...numericFrets);
        
        // Heuristic: if minimum fret equals or is very close to firstFret, it's absolute
        // Relative format would have minFret = 1
        if (minFret === firstFret || (minFret >= firstFret - 1 && minFret > 1)) {
          // This is absolute format - needs conversion
          const convertedFrets = frets.map(f => {
            if (f === 'x' || f === 0) return f;
            return f - firstFret + 1;
          });
          
          issues.push({
            lineNum,
            chord: currentChord,
            firstFret,
            original: fretsArray,
            converted: convertedFrets.map(f => f === 'x' ? "'x'" : f).join(', '),
            originalLine: line
          });
        }
      }
    }
  }
}

console.log(`\n=== CHORD FORMAT AUDIT ===\n`);
console.log(`Found ${issues.length} chord voicings using ABSOLUTE format that need conversion\n`);

// Group by chord type for easier review
const byChord = {};
issues.forEach(issue => {
  if (!byChord[issue.chord]) byChord[issue.chord] = [];
  byChord[issue.chord].push(issue);
});

for (const [chord, chordIssues] of Object.entries(byChord)) {
  console.log(`\n${chord}:`);
  chordIssues.forEach(issue => {
    console.log(`  Line ${issue.lineNum} (firstFret: ${issue.firstFret})`);
    console.log(`    BEFORE: [${issue.original}]`);
    console.log(`    AFTER:  [${issue.converted}]`);
  });
}

console.log(`\n=== CONVERSION SUMMARY ===`);
console.log(`Total voicings to convert: ${issues.length}`);
console.log(`\nTo apply these changes, we'll use the edit tool to convert each one.`);

// Output JSON for processing
writeFileSync('chord-format-conversions.json', JSON.stringify(issues, null, 2));
console.log(`\nConversion data saved to: chord-format-conversions.json`);
