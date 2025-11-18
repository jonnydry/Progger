/**
 * Analyze Validation Errors
 * 
 * Analyzes the validation report to identify patterns and prioritize fixes.
 * 
 * Usage: tsx scripts/analyze-validation-errors.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import type { ValidationReport } from './validate-chord-voicings';

interface ErrorPattern {
  pattern: string;
  count: number;
  examples: Array<{ chordName: string; position: string; issue: string }>;
}

/**
 * Analyze error patterns
 */
function analyzeErrors(report: ValidationReport): void {
  console.log('🔍 Analyzing Validation Errors');
  console.log('='.repeat(60));

  const errors = report.errors;
  console.log(`\nTotal Errors: ${errors.length}`);

  // Group by error type
  const byStatus = {
    incorrect: errors.filter(e => e.status === 'incorrect'),
    missing_notes: errors.filter(e => e.status === 'missing_notes'),
    extra_notes: errors.filter(e => e.status === 'extra_notes'),
  };

  console.log(`\nError Breakdown:`);
  console.log(`  Incorrect: ${byStatus.incorrect.length}`);
  console.log(`  Missing Notes: ${byStatus.missing_notes.length}`);
  console.log(`  Extra Notes: ${byStatus.extra_notes.length}`);

  // Analyze chord quality patterns
  console.log(`\n📊 Error Patterns by Chord Quality:`);
  const qualityPatterns = new Map<string, number>();
  
  errors.forEach(error => {
    const match = error.chordName.match(/^[A-G][#b]?(.*)/);
    const quality = match ? match[1] || 'major' : 'unknown';
    qualityPatterns.set(quality, (qualityPatterns.get(quality) || 0) + 1);
  });

  const sortedQualities = Array.from(qualityPatterns.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  sortedQualities.forEach(([quality, count]) => {
    console.log(`  ${quality || 'major'}: ${count} errors`);
  });

  // Analyze diminished chord errors specifically
  const dimErrors = errors.filter(e => 
    e.chordName.includes('dim') || e.chordName.includes('Dim')
  );
  console.log(`\n🎵 Diminished Chord Errors: ${dimErrors.length}`);
  if (dimErrors.length > 0) {
    console.log(`  Sample errors:`);
    dimErrors.slice(0, 5).forEach(e => {
      console.log(`    ${e.chordName} - ${e.position}:`);
      console.log(`      Expected: ${e.expectedNotes.join(', ')}`);
      console.log(`      Got: ${e.voicingNotes.join(', ')}`);
    });
  }

  // Analyze barre chord transposition issues
  const barreErrors = errors.filter(e => 
    e.position.toLowerCase().includes('barre') && e.firstFret && e.firstFret > 1
  );
  console.log(`\n🎸 Barre Chord Errors: ${barreErrors.length}`);
  
  // Analyze common fret patterns
  console.log(`\n🔢 Common Fret Patterns in Errors:`);
  const fretPatterns = new Map<string, number>();
  
  errors.forEach(error => {
    const pattern = error.frets.join(',');
    fretPatterns.set(pattern, (fretPatterns.get(pattern) || 0) + 1);
  });

  const sortedPatterns = Array.from(fretPatterns.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  sortedPatterns.forEach(([pattern, count]) => {
    console.log(`  [${pattern}]: ${count} occurrences`);
  });

  // Analyze root patterns
  console.log(`\n🎹 Errors by Root Note:`);
  const rootPatterns = new Map<string, number>();
  
  errors.forEach(error => {
    const match = error.chordName.match(/^([A-G][#b]?)/);
    const root = match ? match[1] : 'unknown';
    rootPatterns.set(root, (rootPatterns.get(root) || 0) + 1);
  });

  const sortedRoots = Array.from(rootPatterns.entries())
    .sort((a, b) => b[1] - a[1]);

  sortedRoots.forEach(([root, count]) => {
    console.log(`  ${root}: ${count} errors`);
  });

  // Identify systematic issues
  console.log(`\n⚠️  Systematic Issues Detected:`);
  
  // Check for same voicing pattern used incorrectly across multiple roots
  const voicingPatternMap = new Map<string, Array<{ chord: string; root: string }>>();
  
  errors.forEach(error => {
    const pattern = `${error.frets.join(',')}@${error.firstFret || 0}`;
    const match = error.chordName.match(/^([A-G][#b]?)/);
    const root = match ? match[1] : 'unknown';
    
    if (!voicingPatternMap.has(pattern)) {
      voicingPatternMap.set(pattern, []);
    }
    voicingPatternMap.get(pattern)!.push({ chord: error.chordName, root });
  });

  const problematicPatterns = Array.from(voicingPatternMap.entries())
    .filter(([_, chords]) => chords.length >= 3)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);

  if (problematicPatterns.length > 0) {
    console.log(`  Patterns used incorrectly across multiple chords:`);
    problematicPatterns.forEach(([pattern, chords]) => {
      console.log(`    Pattern: [${pattern.split('@')[0]}] @ ${pattern.split('@')[1]}`);
      console.log(`      Used in ${chords.length} chords: ${chords.slice(0, 5).map(c => c.chord).join(', ')}`);
    });
  }

  // Recommendations
  console.log(`\n💡 Recommendations:`);
  console.log(`  1. Fix diminished chord voicings (${dimErrors.length} errors)`);
  console.log(`  2. Review barre chord transpositions (${barreErrors.length} errors)`);
  console.log(`  3. Check voicings with common fret patterns`);
  console.log(`  4. Verify root note calculations for enharmonic equivalents`);
  
  if (dimErrors.length > 50) {
    console.log(`\n  ⚠️  HIGH PRIORITY: Diminished chords have systematic errors`);
    console.log(`     Consider: Diminished chords use symmetric patterns that may`);
    console.log(`     need special handling in transposition logic.`);
  }
}

/**
 * Main execution
 */
async function main() {
  const reportPath = join(process.cwd(), 'scripts', 'validation-report.json');
  
  try {
    const reportData = readFileSync(reportPath, 'utf-8');
    const report: ValidationReport = JSON.parse(reportData);
    
    analyzeErrors(report);
  } catch (error) {
    console.error('Error reading validation report:', error);
    console.error('Please run "npm run validate-chords" first to generate the report.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

