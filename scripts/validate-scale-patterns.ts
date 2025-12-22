
import { getScaleFingering, validateFingeringNotes, SCALE_LIBRARY, normalizeScaleName } from '../client/src/utils/scaleLibrary';
import { noteToValue, valueToNote } from '../client/src/utils/musicTheory';

// Mock dependencies if needed, or rely on tsx to handle imports
// Since we are running with tsx, we can import directly from src if paths are correct.
// We might need to handle aliases if they are used in imports.
// The error above showed cannot find module, so I'm creating it now.

// Suppress console.warn during validation
const originalWarn = console.warn;
console.warn = () => {}; // Suppress warnings

async function validateAll() {
  console.log('Validating scale patterns...\n');
  
  const scaleTypes = Object.keys(SCALE_LIBRARY);
  const testRoots = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
  
  let totalErrors = 0;
  let totalChecks = 0;
  let totalWarnings = 0;
  
  for (const scaleType of scaleTypes) {
    const scaleData = SCALE_LIBRARY[scaleType];
    const maxPositions = scaleData.positions?.length || 5;
    
    for (const root of testRoots) {
      const scaleName = `${root} ${scaleType}`;
      
      // Check all positions for this scale
      for (let pos = 0; pos < maxPositions; pos++) {
        totalChecks++;
        try {
          const fingering = getScaleFingering(scaleName, root, pos);
          const validation = validateFingeringNotes(fingering, root, scaleName);
          
          // Verify we have notes
          const noteCount = fingering.flat().length;
          if (noteCount === 0) {
            console.error(`❌ Empty fingering for ${scaleName} Pos ${pos+1}`);
            totalErrors++;
            continue;
          }
          
          // Check validation
          if (!validation.isValid) {
            console.error(`❌ Validation failed for ${scaleName} Pos ${pos+1}`);
            console.error(`   Coverage: ${(validation.coverage * 100).toFixed(1)}%`);
            console.error(`   Invalid notes: ${validation.invalidNotes.slice(0, 5).join(', ')}${validation.invalidNotes.length > 5 ? '...' : ''}`);
            totalErrors++;
          } else if (validation.coverage < 1.0) {
            // Warn if coverage is less than 100% (some notes might be missing)
            totalWarnings++;
            if (totalWarnings <= 5) { // Only show first 5 warnings
              console.warn(`⚠️  Low coverage for ${scaleName} Pos ${pos+1}: ${(validation.coverage * 100).toFixed(1)}%`);
            }
          }
          
          // Verify pattern spans reasonable range (CAGED boxes should be 4-6 frets wide)
          const allFrets = fingering.flat();
          if (allFrets.length > 0) {
            const minFret = Math.min(...allFrets);
            const maxFret = Math.max(...allFrets);
            const span = maxFret - minFret;
            
            if (span > 7) {
              console.warn(`⚠️  Wide span for ${scaleName} Pos ${pos+1}: ${span} frets (${minFret}-${maxFret})`);
            }
          }
          
        } catch (err) {
          console.error(`❌ Error checking ${scaleName} Pos ${pos+1}:`, err);
          totalErrors++;
        }
      }
    }
  }
  
  // Restore console.warn
  console.warn = originalWarn;
  
  console.log('\n---------------------------------------------------');
  console.log(`Validation complete:`);
  console.log(`  Total checks: ${totalChecks}`);
  console.log(`  Errors: ${totalErrors}`);
  console.log(`  Warnings: ${totalWarnings}`);
  
  if (totalErrors > 0) {
    console.log('\n❌ Validation FAILED - errors found!');
    process.exit(1);
  } else {
    console.log('\n✅ All patterns validated successfully!');
    process.exit(0);
  }
}

validateAll().catch(console.error);

