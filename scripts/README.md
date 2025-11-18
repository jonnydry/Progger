# PROGGER Validation Scripts

This directory contains validation and comparison scripts for PROGGER chord voicings.

## Scripts

### 1. `validate-chord-voicings.ts`

Mathematically validates all chord voicings in PROGGER against music theory.

**Usage:**
```bash
npm run validate-chords
# or
tsx scripts/validate-chord-voicings.ts
```

**What it does:**
- Loads all chord voicings from all 12 roots
- Extracts notes from each voicing using mathematical formula
- Compares extracted notes with expected chord notes
- Categorizes voicings as:
  - ✅ **Valid**: All notes match expected chord
  - ⚠️ **Partial**: Missing some notes (intentionally incomplete)
  - 🎵 **Rootless**: Omits root note (intentionally)
  - ❌ **Invalid**: Produces incorrect or extra notes
  - 🔇 **Muted**: All strings muted

**Output:**
- Console summary with statistics
- `scripts/validation-report.json` - Detailed JSON report

**Exit Codes:**
- `0` - All voicings valid
- `1` - Errors found (invalid voicings detected)

### 2. `compare-with-web-sources.ts`

Generates human-readable reports for manual comparison with web guitar reference sources.

**Usage:**
```bash
npm run compare-web
# or
tsx scripts/compare-with-web-sources.ts
```

**What it does:**
- Focuses on common chords (all 12 roots for major, minor, 7th, maj7, min7, plus sus and extended chords)
- Generates HTML and text reports with:
  - Chord diagrams (ASCII)
  - Fret positions
  - Note names
  - Expected vs actual notes
  - Links to web reference sources

**Output:**
- `scripts/web-comparison-report.html` - HTML report for browser viewing
- `scripts/web-comparison-report.txt` - Text report for easy copy-paste

**Next Steps:**
1. Open `web-comparison-report.html` in your browser
2. Compare each chord with web reference sources:
   - [Ultimate Guitar](https://www.ultimate-guitar.com/)
   - [ChordBook](https://www.chordbook.com/)
   - [Guitar Chords](https://www.guitar-chords.org.uk/)
   - [All Guitar Chords](https://www.all-guitar-chords.com/)
3. Note any discrepancies or alternative voicings
4. Update chord library if corrections are needed

## Validation Process

### Phase 1: Mathematical Validation
Run `validate-chord-voicings.ts` to programmatically validate all voicings:
- Uses music theory to verify voicing notes match expected chord notes
- Identifies mathematically incorrect voicings
- Flags voicings for manual review

### Phase 2: Web Comparison
Run `compare-with-web-sources.ts` to generate comparison reports:
- Includes all 12 roots for major, minor, 7th, maj7, and min7 chords
- Plus common sus and extended chords for manual verification
- Provides readable format for cross-referencing
- Helps identify alternative voicings vs errors

### Phase 3: Fix Issues
Based on validation results:
1. Fix voicings with incorrect notes (mathematical errors)
2. Document intentional differences (alternative voicings)
3. Verify rootless/partial voicings are correctly labeled
4. Update chord library data files in `client/utils/chords/data/`

## Example Workflow

```bash
# 1. Run mathematical validation
npm run validate-chords

# 2. Review validation report
cat scripts/validation-report.json | jq '.errors'

# 3. Generate web comparison report
npm run compare-web

# 4. Open HTML report in browser
open scripts/web-comparison-report.html

# 5. Compare with web sources and fix any issues
# 6. Re-run validation to verify fixes
npm run validate-chords
```

## Notes

- Validation uses mathematical formulas, so it's 100% accurate for note extraction
- Some voicings may be intentionally partial or rootless - these are flagged as warnings, not errors
- Web comparison is for manual verification of common chords only
- All scripts are read-only - they don't modify production code

