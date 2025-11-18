/**
 * Web Source Comparison Script
 * 
 * Generates human-readable reports for manual comparison with web guitar reference sources.
 * Focuses on top 50 most common chords for manual verification.
 * 
 * Usage: tsx scripts/compare-with-web-sources.ts
 */

import { loadChordsByRoot } from '../client/utils/chords/loader';
import { extractVoicingNotes, isMutedVoicing } from '../client/utils/chords/index';
import { getChordNotes } from '../client/utils/chordAnalysis';
import { valueToNote } from '../client/utils/musicTheory';
import type { ChordVoicing } from '../client/types';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const ALL_ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Common chords for web comparison - includes all 12 roots for each category
const COMMON_CHORDS = [
  // Major chords (all 12 roots)
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
  // Minor chords (all 12 roots)
  'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm',
  // 7th chords (all 12 roots)
  'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7',
  // Maj7 chords (all 12 roots)
  'Cmaj7', 'C#maj7', 'Dmaj7', 'D#maj7', 'Emaj7', 'Fmaj7', 'F#maj7', 'Gmaj7', 'G#maj7', 'Amaj7', 'A#maj7', 'Bmaj7',
  // Min7 chords (all 12 roots)
  'Cm7', 'C#m7', 'Dm7', 'D#m7', 'Em7', 'Fm7', 'F#m7', 'Gm7', 'G#m7', 'Am7', 'A#m7', 'Bm7',
  // Sus chords (common roots)
  'Csus2', 'Csus4', 'Gsus2', 'Gsus4', 'Dsus2', 'Dsus4', 'Asus2', 'Asus4',
  // Extended chords (common roots)
  'C9', 'G9', 'D9', 'A9', 'Am9', 'Em9', 'Dm9',
];

interface ChordVoicingInfo {
  chordName: string;
  voicingIndex: number;
  position: string;
  frets: (number | 'x')[];
  firstFret?: number;
  notes: string[];
  expectedNotes: string[];
  diagram: string;
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
 * Generate ASCII diagram of chord voicing
 */
function generateChordDiagram(voicing: ChordVoicing): string {
  const strings = ['E', 'B', 'G', 'D', 'A', 'E']; // High to Low
  const maxFret = voicing.firstFret || 1;
  const displayFrets = voicing.frets.map((fret, idx) => {
    if (fret === 'x') return 'x';
    if (typeof fret === 'number') {
      const absoluteFret = voicing.firstFret && voicing.firstFret > 1
        ? voicing.firstFret + fret - 1
        : fret;
      return absoluteFret;
    }
    return 'x';
  });

  // Find the range of frets to display
  const numericFrets = displayFrets.filter((f): f is number => typeof f === 'number');
  const minFret = numericFrets.length > 0 ? Math.min(...numericFrets) : 0;
  const maxDisplayFret = numericFrets.length > 0 ? Math.max(...numericFrets) : 0;
  const startFret = Math.max(0, minFret - 1);
  const endFret = maxDisplayFret + 1;

  let diagram = '';
  
  // Header
  if (voicing.firstFret && voicing.firstFret > 1) {
    diagram += `Fret ${voicing.firstFret}\n`;
  }
  
  // String labels and frets
  for (let i = strings.length - 1; i >= 0; i--) {
    const stringName = strings[i];
    const fret = displayFrets[i];
    diagram += `${stringName} |`;
    
    if (fret === 'x') {
      diagram += ' x';
    } else if (typeof fret === 'number') {
      const spaces = fret - startFret;
      diagram += ' '.repeat(Math.max(0, spaces)) + '●';
    }
    diagram += '\n';
  }
  
  // Fret numbers
  diagram += '   |';
  for (let f = startFret; f <= endFret; f++) {
    if (f === 0) {
      diagram += '0';
    } else {
      diagram += f.toString().padStart(2, ' ');
    }
  }
  diagram += '\n';

  return diagram;
}

/**
 * Load and format chord voicings for comparison
 */
async function loadChordVoicingsForComparison(): Promise<Map<string, ChordVoicingInfo[]>> {
  const chordMap = new Map<string, ChordVoicingInfo[]>();

  console.log('🔍 Loading common chords for web comparison...');

  for (const root of ALL_ROOTS) {
    try {
      const chordData = await loadChordsByRoot(root);
      
      for (const [key, voicings] of Object.entries(chordData)) {
        const [chordRoot, quality] = key.split('_') as [string, string];
        const chordName = formatChordName(chordRoot, quality);
        
        // Only include common chords
        if (!COMMON_CHORDS.includes(chordName)) {
          continue;
        }

        const voicingInfos: ChordVoicingInfo[] = voicings
          .filter(v => !isMutedVoicing(v))
          .map((voicing, index) => {
            const voicingNoteValues = extractVoicingNotes(voicing);
            const notes = Array.from(voicingNoteValues).map(v => valueToNote(v)).sort();
            const expectedNotes = getChordNotes(chordName).sort();

            return {
              chordName,
              voicingIndex: index,
              position: voicing.position || 'Unknown',
              frets: voicing.frets,
              firstFret: voicing.firstFret,
              notes,
              expectedNotes,
              diagram: generateChordDiagram(voicing),
            };
          });

        if (voicingInfos.length > 0) {
          chordMap.set(chordName, voicingInfos);
        }
      }
    } catch (error) {
      console.error(`❌ Error loading chords for root ${root}:`, error);
    }
  }

  console.log(`✅ Loaded ${chordMap.size} common chords`);
  return chordMap;
}

/**
 * Generate HTML report
 */
function generateHTMLReport(chordMap: Map<string, ChordVoicingInfo[]>): string {
  const chords = Array.from(chordMap.entries()).sort(([a], [b]) => a.localeCompare(b));
  
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PROGGER Chord Voicings - Web Comparison Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 {
      color: #333;
      border-bottom: 3px solid #4CAF50;
      padding-bottom: 10px;
    }
    .chord-section {
      background: white;
      margin: 20px 0;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .chord-name {
      font-size: 24px;
      font-weight: bold;
      color: #2196F3;
      margin-bottom: 10px;
    }
    .voicing {
      margin: 15px 0;
      padding: 15px;
      background: #f9f9f9;
      border-left: 4px solid #4CAF50;
      border-radius: 4px;
    }
    .voicing-position {
      font-weight: bold;
      color: #666;
      margin-bottom: 5px;
    }
    .notes {
      margin: 10px 0;
      font-family: monospace;
    }
    .notes-label {
      font-weight: bold;
      color: #333;
    }
    .diagram {
      font-family: monospace;
      background: #fff;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin: 10px 0;
      white-space: pre;
    }
    .links {
      margin-top: 20px;
      padding: 15px;
      background: #e3f2fd;
      border-radius: 4px;
    }
    .links a {
      color: #1976D2;
      text-decoration: none;
      margin-right: 15px;
    }
    .links a:hover {
      text-decoration: underline;
    }
    .summary {
      background: #fff3cd;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <h1>🎸 PROGGER Chord Voicings - Web Comparison Report</h1>
  
  <div class="summary">
    <h2>Summary</h2>
    <p><strong>Total Chords:</strong> ${chordMap.size}</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    <p><strong>Purpose:</strong> Manual comparison with web guitar reference sources</p>
  </div>

  <div class="links">
    <h3>Reference Links:</h3>
    <a href="https://www.ultimate-guitar.com/" target="_blank">Ultimate Guitar</a>
    <a href="https://www.chordbook.com/" target="_blank">ChordBook</a>
    <a href="https://www.guitar-chords.org.uk/" target="_blank">Guitar Chords</a>
    <a href="https://www.all-guitar-chords.com/" target="_blank">All Guitar Chords</a>
  </div>
`;

  for (const [chordName, voicings] of chords) {
    html += `
  <div class="chord-section">
    <div class="chord-name">${chordName}</div>
    <div class="notes">
      <span class="notes-label">Expected Notes:</span> ${voicings[0]?.expectedNotes.join(', ') || 'N/A'}
    </div>`;

    for (const voicing of voicings) {
      html += `
    <div class="voicing">
      <div class="voicing-position">${voicing.position} (Voicing #${voicing.voicingIndex + 1})</div>
      <div class="notes">
        <span class="notes-label">Notes:</span> ${voicing.notes.join(', ')}
      </div>
      <div class="notes">
        <span class="notes-label">Frets:</span> [${voicing.frets.join(', ')}]${voicing.firstFret ? ` @ fret ${voicing.firstFret}` : ''}
      </div>
      <div class="diagram">${voicing.diagram}</div>
    </div>`;
    }

    html += `
  </div>`;
  }

  html += `
</body>
</html>`;

  return html;
}

/**
 * Generate text report
 */
function generateTextReport(chordMap: Map<string, ChordVoicingInfo[]>): string {
  const chords = Array.from(chordMap.entries()).sort(([a], [b]) => a.localeCompare(b));
  
  let text = 'PROGGER Chord Voicings - Web Comparison Report\n';
  text += '='.repeat(60) + '\n\n';
  text += `Generated: ${new Date().toLocaleString()}\n`;
  text += `Total Chords: ${chordMap.size}\n\n`;
  text += 'Reference Links:\n';
  text += '- Ultimate Guitar: https://www.ultimate-guitar.com/\n';
  text += '- ChordBook: https://www.chordbook.com/\n';
  text += '- Guitar Chords: https://www.guitar-chords.org.uk/\n';
  text += '- All Guitar Chords: https://www.all-guitar-chords.com/\n\n';
  text += '='.repeat(60) + '\n\n';

  for (const [chordName, voicings] of chords) {
    text += `${chordName}\n`;
    text += '-'.repeat(40) + '\n';
    text += `Expected Notes: ${voicings[0]?.expectedNotes.join(', ') || 'N/A'}\n\n`;

    for (const voicing of voicings) {
      text += `  ${voicing.position} (Voicing #${voicing.voicingIndex + 1})\n`;
      text += `  Notes: ${voicing.notes.join(', ')}\n`;
      text += `  Frets: [${voicing.frets.join(', ')}]${voicing.firstFret ? ` @ fret ${voicing.firstFret}` : ''}\n`;
      text += `  Diagram:\n${voicing.diagram}\n`;
    }

    text += '\n';
  }

  return text;
}

/**
 * Main execution
 */
async function main() {
  console.log('🌐 PROGGER Web Source Comparison Report Generator');
  console.log('='.repeat(60));

  const chordMap = await loadChordVoicingsForComparison();

  // Generate HTML report
  const htmlReport = generateHTMLReport(chordMap);
  const htmlPath = join(process.cwd(), 'scripts', 'web-comparison-report.html');
  writeFileSync(htmlPath, htmlReport);
  console.log(`✅ HTML report saved to: ${htmlPath}`);

  // Generate text report
  const textReport = generateTextReport(chordMap);
  const textPath = join(process.cwd(), 'scripts', 'web-comparison-report.txt');
  writeFileSync(textPath, textReport);
  console.log(`✅ Text report saved to: ${textPath}`);

  console.log('\n📋 Next Steps:');
  console.log('1. Open web-comparison-report.html in your browser');
  console.log('2. Compare each chord with web reference sources');
  console.log('3. Note any discrepancies or alternative voicings');
  console.log('4. Update chord library if corrections are needed');
}

// Run if executed directly
const isMainModule = import.meta.url === `file://${fileURLToPath(import.meta.url)}` || 
                     process.argv[1] && import.meta.url.endsWith(process.argv[1]);

if (isMainModule || process.argv[1]?.endsWith('compare-with-web-sources.ts')) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { loadChordVoicingsForComparison, generateHTMLReport, generateTextReport };

