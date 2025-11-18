/**
 * Chord Voicing Validation Script
 * 
 * Validates all chord voicings in PROGGER against music theory.
 * Uses mathematical validation to ensure voicings produce correct notes.
 * 
 * Usage: tsx scripts/validate-chord-voicings.ts
 */

import { loadChordsByRoot } from '../client/utils/chords/loader';
import { extractVoicingNotes, isMutedVoicing } from '../client/utils/chords/index';
import { getChordNotes } from '../client/utils/chordAnalysis';
import { noteToValue, valueToNote } from '../client/utils/musicTheory';
import type { ChordVoicing } from '../client/types';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const ALL_ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

interface ValidationResult {
  chordName: string;
  voicingIndex: number;
  position: string;
  status: 'valid' | 'missing_notes' | 'extra_notes' | 'incorrect' | 'partial' | 'rootless' | 'muted';
  voicingNotes: string[];
  expectedNotes: string[];
  missingNotes: string[];
  extraNotes: string[];
  frets: (number | 'x')[];
  firstFret?: number;
}

interface ValidationReport {
  summary: {
    totalChords: number;
    totalVoicings: number;
    validVoicings: number;
    invalidVoicings: number;
    partialVoicings: number;
    rootlessVoicings: number;
    mutedVoicings: number;
    errors: number;
  };
  results: ValidationResult[];
  errors: ValidationResult[];
  warnings: ValidationResult[];
}

/**
 * Format chord name from root and quality
 */
function formatChordName(root: string, quality: string): string {
  if (quality === 'major') {
    return root;
  }
  if (quality === 'minor') {
    return `${root}m`;
  }
  if (quality.startsWith('min')) {
    return `${root}${quality.replace('min', 'm')}`;
  }
  if (quality.startsWith('maj')) {
    return `${root}${quality}`;
  }
  return `${root}${quality}`;
}

/**
 * Check if voicing is intentionally rootless based on position label
 */
function isRootlessVoicing(position: string | undefined): boolean {
  if (!position) return false;
  const lower = position.toLowerCase();
  return lower.includes('rootless') || lower.includes('no root');
}

/**
 * Check if voicing is intentionally partial based on position label
 */
function isPartialVoicing(position: string | undefined): boolean {
  if (!position) return false;
  const lower = position.toLowerCase();
  return lower.includes('partial') || lower.includes('incomplete');
}

/**
 * Validate a single voicing
 */
function validateVoicing(
  voicing: ChordVoicing,
  chordName: string,
  voicingIndex: number
): ValidationResult {
  // Check if muted
  if (isMutedVoicing(voicing)) {
    return {
      chordName,
      voicingIndex,
      position: voicing.position || 'Unknown',
      status: 'muted',
      voicingNotes: [],
      expectedNotes: [],
      missingNotes: [],
      extraNotes: [],
      frets: voicing.frets,
      firstFret: voicing.firstFret,
    };
  }

  // Extract notes from voicing
  const voicingNoteValues = extractVoicingNotes(voicing);
  const voicingNotes = Array.from(voicingNoteValues).map(v => valueToNote(v)).sort();

  // Get expected chord notes
  const expectedNoteNames = getChordNotes(chordName);
  const expectedNoteValues = new Set(expectedNoteNames.map(note => noteToValue(note)));
  const expectedNotes = expectedNoteNames.sort();
  const rootNote = expectedNoteNames[0]; // First note is always the root

  // Find missing and extra notes
  const missingNotes = expectedNotes.filter(note => !voicingNoteValues.has(noteToValue(note)));
  const extraNotes = voicingNotes.filter(note => !expectedNoteValues.has(noteToValue(note)));

  // GUITAR-FOCUSED STATUS DETERMINATION
  // Only flag voicings with WRONG notes as errors
  // Partial and rootless are VALID for guitar
  let status: ValidationResult['status'] = 'valid';

  if (voicingNoteValues.size === 0) {
    status = 'muted';
  } else if (extraNotes.length > 0) {
    // Has notes that don't belong to the chord - REAL ERROR
    // This is what matters for guitar - playing wrong notes
    status = 'incorrect';
  } else if (missingNotes.length === 0) {
    // All chord tones present - perfect!
    status = 'valid';
  } else if (isRootlessVoicing(voicing.position) || missingNotes.includes(rootNote)) {
    // Missing root - valid and common on guitar
    status = 'rootless';
  } else if (isPartialVoicing(voicing.position) || missingNotes.length > 0) {
    // Missing some chord tones - valid for guitar (6 string limitation)
    status = 'partial';
  } else {
    status = 'valid';
  }

  return {
    chordName,
    voicingIndex,
    position: voicing.position || 'Unknown',
    status,
    voicingNotes,
    expectedNotes,
    missingNotes,
    extraNotes,
    frets: voicing.frets,
    firstFret: voicing.firstFret,
  };
}

/**
 * Main validation function
 */
async function validateAllChords(): Promise<ValidationReport> {
  const results: ValidationResult[] = [];
  const allChordNames = new Set<string>();

  console.log('🔍 Loading chord data from all roots...');

  // Load all chord data
  for (const root of ALL_ROOTS) {
    try {
      const chordData = await loadChordsByRoot(root);
      
      // Process all chords for this root
      for (const [key, voicings] of Object.entries(chordData)) {
        const [chordRoot, quality] = key.split('_') as [string, string];
        const chordName = formatChordName(chordRoot, quality);
        allChordNames.add(chordName);

        // Validate each voicing
        voicings.forEach((voicing, index) => {
          const result = validateVoicing(voicing, chordName, index);
          results.push(result);
        });
      }
    } catch (error) {
      console.error(`❌ Error loading chords for root ${root}:`, error);
    }
  }

  console.log(`✅ Loaded ${allChordNames.size} chords with ${results.length} voicings`);

  // Categorize results - ONLY 'incorrect' are real errors
  const validVoicings = results.filter(r => r.status === 'valid');
  const invalidVoicings = results.filter(r => r.status === 'incorrect');
  const partialVoicings = results.filter(r => r.status === 'partial');
  const rootlessVoicings = results.filter(r => r.status === 'rootless');
  const mutedVoicings = results.filter(r => r.status === 'muted');

  const summary = {
    totalChords: allChordNames.size,
    totalVoicings: results.length,
    validVoicings: validVoicings.length,
    invalidVoicings: invalidVoicings.length,
    partialVoicings: partialVoicings.length,
    rootlessVoicings: rootlessVoicings.length,
    mutedVoicings: mutedVoicings.length,
    errors: invalidVoicings.length,
  };

  const report: ValidationReport = {
    summary,
    results,
    errors: invalidVoicings,
    warnings: [...partialVoicings, ...rootlessVoicings],
  };

  return report;
}

/**
 * Generate human-readable summary
 */
function printSummary(report: ValidationReport): void {
  console.log('\n📊 Validation Summary');
  console.log('='.repeat(50));
  console.log(`Total Chords: ${report.summary.totalChords}`);
  console.log(`Total Voicings: ${report.summary.totalVoicings}`);
  console.log(`✅ Valid: ${report.summary.validVoicings}`);
  console.log(`⚠️  Partial: ${report.summary.partialVoicings}`);
  console.log(`🎵 Rootless: ${report.summary.rootlessVoicings}`);
  console.log(`❌ Invalid: ${report.summary.invalidVoicings}`);
  console.log(`🔇 Muted: ${report.summary.mutedVoicings}`);

  if (report.errors.length > 0) {
    console.log('\n❌ Errors Found:');
    report.errors.forEach(error => {
      console.log(`\n  ${error.chordName} - ${error.position} (voicing #${error.voicingIndex})`);
      console.log(`    Expected: ${error.expectedNotes.join(', ')}`);
      console.log(`    Got: ${error.voicingNotes.join(', ')}`);
      if (error.missingNotes.length > 0) {
        console.log(`    Missing: ${error.missingNotes.join(', ')}`);
      }
      if (error.extraNotes.length > 0) {
        console.log(`    Extra: ${error.extraNotes.join(', ')}`);
      }
      console.log(`    Frets: [${error.frets.join(', ')}]${error.firstFret ? ` @ ${error.firstFret}` : ''}`);
    });
  }

  if (report.warnings.length > 0) {
    console.log(`\n⚠️  Warnings: ${report.warnings.length} voicings (partial/rootless)`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🎸 PROGGER Chord Voicing Validation');
  console.log('='.repeat(50));

  const report = await validateAllChords();
  printSummary(report);

  // Save report to JSON
  const reportPath = join(process.cwd(), 'scripts', 'validation-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n💾 Report saved to: ${reportPath}`);

  // Exit with error code if there are voicings with WRONG notes
  if (report.errors.length > 0) {
    console.log(`\n❌ Found ${report.errors.length} voicings with WRONG notes`);
    console.log(`   (Playing notes that don't belong to the chord)`);
    const guitarValid = report.summary.validVoicings + report.summary.partialVoicings + report.summary.rootlessVoicings;
    console.log(`✅ ${guitarValid} voicings are guitar-practical (${report.summary.validVoicings} complete, ${report.summary.partialVoicings} partial, ${report.summary.rootlessVoicings} rootless)`);
    process.exit(1);
  } else {
    console.log('\n✅ All voicings are guitar-practical! (No wrong notes)');
    console.log(`   ${report.summary.validVoicings} complete, ${report.summary.partialVoicings} partial, ${report.summary.rootlessVoicings} rootless`);
    process.exit(0);
  }
}

// Run if executed directly
const isMainModule = import.meta.url === `file://${fileURLToPath(import.meta.url)}` || 
                     process.argv[1] && import.meta.url.endsWith(process.argv[1]);

if (isMainModule || process.argv[1]?.endsWith('validate-chord-voicings.ts')) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { validateAllChords, validateVoicing };

