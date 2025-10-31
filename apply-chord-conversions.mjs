/**
 * Script to apply all chord format conversions
 * Converts absolute-format barre chords to relative format
 */

import { readFileSync, writeFileSync } from 'fs';

// Read the conversion data
const conversions = JSON.parse(readFileSync('chord-format-conversions.json', 'utf8'));

// Read the chord library file
const libraryPath = 'client/utils/chordLibrary.ts';
let content = readFileSync(libraryPath, 'utf8');
const lines = content.split('\n');

console.log(`\n=== APPLYING ${conversions.length} CHORD FORMAT CONVERSIONS ===\n`);

let conversionsApplied = 0;

// Apply conversions in reverse order (from bottom to top)
// This prevents line number shifts from affecting later conversions
conversions.reverse().forEach((conversion, index) => {
  const { lineNum, chord, original, converted, originalLine } = conversion;
  
  // Build the search string with exact formatting
  const oldFrets = `frets: [${original}]`;
  const newFrets = `frets: [${converted}]`;
  
  // Get the actual line from the content
  const actualLine = lines[lineNum - 1];
  
  if (actualLine && actualLine.includes(oldFrets)) {
    // Replace the frets array in this line
    const newLine = actualLine.replace(oldFrets, newFrets);
    lines[lineNum - 1] = newLine;
    conversionsApplied++;
    
    if (conversionsApplied <= 10) {
      console.log(`✓ Line ${lineNum} (${chord})`);
      console.log(`  ${oldFrets} → ${newFrets}`);
    }
  } else {
    console.warn(`⚠ Warning: Could not find pattern at line ${lineNum}`);
    console.warn(`  Expected: ${oldFrets}`);
    console.warn(`  Found: ${actualLine?.trim()}`);
  }
});

// Write the updated content back
const updatedContent = lines.join('\n');
writeFileSync(libraryPath, updatedContent, 'utf8');

console.log(`\n... (${conversionsApplied - 10} more conversions)`);
console.log(`\n=== CONVERSION COMPLETE ===`);
console.log(`✓ Successfully converted ${conversionsApplied}/${conversions.length} chord voicings`);
console.log(`✓ Updated file: ${libraryPath}`);

if (conversionsApplied !== conversions.length) {
  console.log(`\n⚠ Warning: ${conversions.length - conversionsApplied} conversions were not applied`);
  process.exit(1);
} else {
  console.log(`\n✅ All chord voicings normalized to relative format!`);
}
