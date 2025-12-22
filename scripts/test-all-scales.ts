import { getScaleFingering, validateFingeringNotes, SCALE_LIBRARY, normalizeScaleName } from '../client/src/utils/scaleLibrary';
import { getScaleNotes } from '../client/src/utils/scaleLibrary';

// Suppress console warnings during test
const originalWarn = console.warn;
console.warn = () => {};

const ALL_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Db', 'Eb', 'Gb', 'Ab', 'Bb'];

interface TestResult {
  scaleType: string;
  root: string;
  position: number;
  passed: boolean;
  error?: string;
  coverage?: number;
}

const results: TestResult[] = [];
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log('='.repeat(80));
console.log('COMPREHENSIVE SCALE PATTERN TEST');
console.log('Testing all scales with all keys and positions');
console.log('='.repeat(80));

// Test each scale type
for (const [scaleType, scaleData] of Object.entries(SCALE_LIBRARY)) {
  const maxPositions = scaleData.positions?.length || 5;
  
  console.log(`\n📊 Testing: ${scaleType.toUpperCase()}`);
  console.log(`   Positions: ${maxPositions}`);
  console.log(`   Intervals: [${scaleData.intervals.join(', ')}]`);
  
  // Test with multiple keys
  const testKeys = ALL_KEYS.slice(0, 12); // Test all 12 chromatic keys
  
  for (const root of testKeys) {
    const scaleName = `${root} ${scaleType}`;
    
    // Test all positions for this scale
    for (let pos = 0; pos < maxPositions; pos++) {
      totalTests++;
      
      try {
        const fingering = getScaleFingering(scaleName, root, pos);
        const validation = validateFingeringNotes(fingering, root, scaleName);
        
        // Check for empty fingering
        const noteCount = fingering.flat().length;
        if (noteCount === 0) {
          results.push({
            scaleType,
            root,
            position: pos,
            passed: false,
            error: 'Empty fingering generated'
          });
          failedTests++;
          continue;
        }
        
        // Check validation
        if (!validation.isValid) {
          results.push({
            scaleType,
            root,
            position: pos,
            passed: false,
            error: `Invalid notes: ${validation.invalidNotes.slice(0, 3).join(', ')}`,
            coverage: validation.coverage
          });
          failedTests++;
        } else {
          results.push({
            scaleType,
            root,
            position: pos,
            passed: true,
            coverage: validation.coverage
          });
          passedTests++;
        }
        
      } catch (error) {
        results.push({
          scaleType,
          root,
          position: pos,
          passed: false,
          error: error instanceof Error ? error.message : String(error)
        });
        failedTests++;
      }
    }
  }
}

// Restore console.warn
console.warn = originalWarn;

// Print summary
console.log('\n' + '='.repeat(80));
console.log('TEST SUMMARY');
console.log('='.repeat(80));
console.log(`Total tests: ${totalTests}`);
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`Success rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);

// Show failures if any
if (failedTests > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('FAILED TESTS:');
  console.log('='.repeat(80));
  
  const failures = results.filter(r => !r.passed);
  
  // Group by scale type
  const failuresByScale = new Map<string, TestResult[]>();
  failures.forEach(f => {
    const existing = failuresByScale.get(f.scaleType) || [];
    existing.push(f);
    failuresByScale.set(f.scaleType, existing);
  });
  
  for (const [scaleType, scaleFailures] of failuresByScale.entries()) {
    console.log(`\n❌ ${scaleType.toUpperCase()}: ${scaleFailures.length} failures`);
    // Show first 5 failures per scale type
    scaleFailures.slice(0, 5).forEach(f => {
      console.log(`   ${f.root} - Position ${f.position + 1}: ${f.error || 'Unknown error'}`);
      if (f.coverage !== undefined) {
        console.log(`      Coverage: ${(f.coverage * 100).toFixed(1)}%`);
      }
    });
    if (scaleFailures.length > 5) {
      console.log(`   ... and ${scaleFailures.length - 5} more`);
    }
  }
}

// Show sample successful tests
if (passedTests > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('SAMPLE SUCCESSFUL TESTS:');
  console.log('='.repeat(80));
  
  const successes = results.filter(r => r.passed);
  const sampleSuccesses = successes.slice(0, 10);
  
  sampleSuccesses.forEach(s => {
    const scaleName = `${s.root} ${s.scaleType}`;
    console.log(`✅ ${scaleName.padEnd(30)} Position ${s.position + 1} - Coverage: ${((s.coverage || 1) * 100).toFixed(1)}%`);
  });
  
  if (successes.length > 10) {
    console.log(`\n... and ${successes.length - 10} more successful tests`);
  }
}

// Test specific examples that users might encounter
console.log('\n' + '='.repeat(80));
console.log('REAL-WORLD EXAMPLES:');
console.log('='.repeat(80));

const realWorldExamples = [
  { name: 'C Major', root: 'C', type: 'major' },
  { name: 'A Minor', root: 'A', type: 'minor' },
  { name: 'G Major', root: 'G', type: 'major' },
  { name: 'D Dorian', root: 'D', type: 'dorian' },
  { name: 'E Phrygian', root: 'E', type: 'phrygian' },
  { name: 'F Lydian', root: 'F', type: 'lydian' },
  { name: 'G Mixolydian', root: 'G', type: 'mixolydian' },
  { name: 'A Minor Pentatonic', root: 'A', type: 'pentatonic minor' },
  { name: 'C Major Pentatonic', root: 'C', type: 'pentatonic major' },
  { name: 'A Blues', root: 'A', type: 'blues' },
  { name: 'C Harmonic Minor', root: 'C', type: 'harmonic minor' },
  { name: 'D Melodic Minor', root: 'D', type: 'melodic minor' },
];

for (const example of realWorldExamples) {
  try {
    const scaleName = `${example.root} ${example.type}`;
    const fingering = getScaleFingering(scaleName, example.root, 0);
    const validation = validateFingeringNotes(fingering, example.root, scaleName);
    const expectedNotes = getScaleNotes(example.root, scaleName);
    
    console.log(`\n${example.name}:`);
    console.log(`  Expected notes: ${expectedNotes.join(', ')}`);
    console.log(`  Validation: ${validation.isValid ? '✅ PASS' : '❌ FAIL'} (${(validation.coverage * 100).toFixed(1)}% coverage)`);
    console.log(`  Fret count: ${fingering.flat().length} notes across 6 strings`);
    
    if (!validation.isValid && validation.invalidNotes.length > 0) {
      console.log(`  ⚠️  Invalid notes: ${validation.invalidNotes.slice(0, 3).join(', ')}`);
    }
  } catch (error) {
    console.log(`\n${example.name}:`);
    console.log(`  ❌ ERROR: ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log('\n' + '='.repeat(80));

if (failedTests === 0) {
  console.log('✅ ALL TESTS PASSED! All scales work correctly.');
  process.exit(0);
} else {
  console.log(`❌ ${failedTests} TESTS FAILED. Please review the errors above.`);
  process.exit(1);
}

