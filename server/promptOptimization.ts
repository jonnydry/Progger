// Prompt optimization utilities for XAI API cost reduction

export interface ProgressionRequest {
  key: string;
  mode: string;
  includeTensions: boolean;
  numChords: number;
  selectedProgression: string;
}

export interface PromptComponents {
  basePrompt: string;
  tensionInstructions: string;
  progressionInstructions: string;
  schemaDescription: string;
  fullPrompt: string;
}

/**
 * Optimizes prompt length by only including tension instructions when needed
 */
export function buildOptimizedPrompt(request: ProgressionRequest): PromptComponents {
  const { key, mode, includeTensions, numChords, selectedProgression } = request;

  // Common schema description used in all prompts
  const schemaDescription = `
{
  "progression": [
    {
      "chordName": "string (IMPORTANT: Use exact chord notation - e.g., 'Cmaj7', 'Am7', 'G7b9', 'D7alt', 'Fmaj9')",
      "musicalFunction": "string (e.g., 'Tonic Major 7th', 'Dominant 7th with flat 9', 'Subdominant Major 7th')",
      "relationToKey": "string (Roman numeral like 'Imaj7', 'V7', 'iim7', 'V7/ii')"
    }
  ],
  "scales": [
    {
      "name": "string (EXACT FORMAT: root + mode name - e.g., 'G Major', 'A Dorian', 'C Minor Pentatonic', 'G Altered'. NO qualifiers like Natural/Harmonic/Melodic)",
      "rootNote": "string (e.g., 'G', 'A', 'C' - match the key signature accidental preference)"
    }
  ]
}`;

  // Get mode-specific characteristics
  const getModeCharacteristics = (modeName: string): { 
    isMajorMode: boolean; 
    romanNumeralExamples: string;
    modeCharacteristics: string;
  } => {
    const modeLower = modeName.toLowerCase();
    
    if (modeLower === 'major' || modeLower === 'ionian') {
      return {
        isMajorMode: true,
        romanNumeralExamples: `In ${key} Major: I = ${key}maj7, ii = min7, iii = min7, IV = maj7, V = 7, vi = min7, vii° = min7b5`,
        modeCharacteristics: 'Use major scale harmony. I, IV, V are major chords. Emphasize tonic stability and clear resolutions.'
      };
    } else if (modeLower === 'minor' || modeLower === 'aeolian') {
      return {
        isMajorMode: false,
        romanNumeralExamples: `In ${key} Minor: i = ${key}min7, ii° = min7b5, III = maj7, iv = min7, v = min7, VI = maj7, VII = 7`,
        modeCharacteristics: 'Use natural minor scale harmony. i, iv, v are minor chords. May use harmonic minor (V7) for stronger resolution.'
      };
    } else if (modeLower === 'dorian') {
      return {
        isMajorMode: false,
        romanNumeralExamples: `In ${key} Dorian: i = ${key}min7, ii = min7, III = maj7, IV = maj7, v = min7, vi° = min7b5, VII = maj7`,
        modeCharacteristics: 'Use Dorian mode harmony with raised 6th. Emphasize i-IV and i-VII progressions. Common in jazz and fusion.'
      };
    } else if (modeLower === 'phrygian') {
      return {
        isMajorMode: false,
        romanNumeralExamples: `In ${key} Phrygian: i = ${key}min7, II = maj7, III = maj7, iv = min7, v° = dim7, VI = maj7, vii = min7`,
        modeCharacteristics: 'Use Phrygian mode harmony with lowered 2nd. Emphasize i-II progressions. Dark, Spanish flavor. Avoid dominant V7 resolution.'
      };
    } else if (modeLower === 'lydian') {
      return {
        isMajorMode: true,
        romanNumeralExamples: `In ${key} Lydian: I = ${key}maj7, II = maj7, iii = min7, iv° = min7b5, V = maj7, vi = min7, vii = min7`,
        modeCharacteristics: 'Use Lydian mode harmony with raised 4th. Emphasize I-II and I-V progressions. Dreamy, floating quality. Avoid IV chord which contains the natural 4th.'
      };
    } else if (modeLower === 'mixolydian') {
      return {
        isMajorMode: true,
        romanNumeralExamples: `In ${key} Mixolydian: I = ${key}7, ii = min7, iii = min7b5, IV = maj7, v = min7, vi = min7, VII = maj7`,
        modeCharacteristics: 'Use Mixolydian mode harmony with lowered 7th. Emphasize I-bVII and I-IV progressions. Bluesy, rock sound. Dominant I chord.'
      };
    } else if (modeLower === 'locrian') {
      return {
        isMajorMode: false,
        romanNumeralExamples: `In ${key} Locrian: i° = min7b5, II = maj7, iii = min7, IV = min7, v = min7, VI = maj7, VII = maj7`,
        modeCharacteristics: 'Use Locrian mode harmony (rarely used). Unstable due to diminished tonic. Minimal resolution. Use sparingly for dramatic effect.'
      };
    } else {
      // Default to major
      return {
        isMajorMode: true,
        romanNumeralExamples: `In ${key} Major: I = ${key}maj7, ii = min7, iii = min7, IV = maj7, V = 7, vi = min7, vii° = min7b5`,
        modeCharacteristics: 'Use major scale harmony.'
      };
    }
  };

  const modeInfo = getModeCharacteristics(mode);

  // Base prompt - always included
  const basePrompt = `You are a music theory expert specializing in jazz and contemporary guitar harmony.

TASK:
Generate a creative ${numChords}-chord progression in the key of ${key} ${mode}.

MODE CHARACTERISTICS:
${modeInfo.modeCharacteristics}

CRITICAL REQUIREMENTS:
1. Use EXACT chord notation that matches guitar voicing standards
2. Chord names must include quality: maj7, min7, 7, 9, 7b9, 7#9, 7alt, etc.
3. Respect the key signature: ${key.includes('b') ? 'use flats (Bb, Eb, Ab)' : key.includes('#') ? 'use sharps (F#, C#, G#)' : 'use standard note spelling'}
4. Ensure smooth voice leading between chords
5. Provide accurate Roman numeral analysis for each chord
6. Use harmonies that highlight the characteristic notes of ${mode} mode`;

  // Progressive tension instructions - only included when tensions are requested
  let tensionInstructions = '';
  if (includeTensions) {
    // Calculate appropriate number of tension chords based on progression length
    const minTensionChords = Math.max(1, Math.floor(numChords * 0.2)); // At least 20%
    const maxTensionChords = Math.ceil(numChords * 0.4); // At most 40%

    tensionInstructions = `
Include ${minTensionChords} to ${maxTensionChords} chords with harmonic tension.

TENSION CHORD GUIDELINES:
- Secondary dominants (e.g., V7/V, V7/ii): Dominant chords that resolve to diatonic chords
- Tritone substitutions: bII7 chords resolving down a half-step
- Altered dominants: Use extensions like 7b9, 7#9, 7b5, 7#5, 7alt on dominant function chords
- Extended chords: 9ths, 11ths, 13ths for smooth voice leading
- Half-diminished (m7b5): Common in minor keys and as secondary ii chords
- Suspended dominants: 7sus4 chords for delayed resolution

MUSIC THEORY RULES:
- Tension chords should have clear voice leading and resolution
- Altered dominants (7b9, 7#9, 7alt) work best on V7 chords or secondary dominants
- Don't use tensions on tonic chords unless it's a maj7 or maj9
- In ${modeInfo.isMajorMode ? 'major' : 'minor'} modes, respect the key signature
- Use appropriate accidentals: ${key.includes('b') ? 'prefer flats' : key.includes('#') ? 'prefer sharps' : 'use standard spelling'}`;
  }

  // Progression-specific instructions
  let progressionInstructions = '';

  if (selectedProgression === 'auto') {
    progressionInstructions = `The progression should follow common harmonic movement patterns and sound pleasing on guitar.`;
  } else {
    const romanNumeralInstruction = selectedProgression === 'auto'
      ? ''
      : `
ROMAN NUMERAL INTERPRETATION:
- Uppercase (I, IV, V): Major chords
- Lowercase (ii, iii, vi): Minor chords
- Diminished: ii° or vii°
- Add 7th chords for jazz/contemporary sound: Imaj7, ii7, V7, etc.

EXAMPLES:
${modeInfo.romanNumeralExamples}

The number of chords should exactly match the progression pattern.`;

    progressionInstructions = `Generate the specific chord progression "${selectedProgression}" using Nashville Number System conventions in the key of ${key} ${mode}. ${romanNumeralInstruction}`;
  }

  // Final combined prompt
  const fullPrompt = `${basePrompt}${tensionInstructions}${progressionInstructions}

For EACH chord in the progression, provide:
- chordName: EXACT chord name with quality (e.g., 'Cmaj7', 'Am7', 'G7b9', 'D7alt', 'Bm7b5')
- musicalFunction: Detailed role (e.g., 'Tonic Major 7th', 'Secondary Dominant to ii', 'Altered Dominant')
- relationToKey: Roman numeral (e.g., 'Imaj7', 'V7', 'iim7', 'V7/ii')

Additionally, suggest 2 to 3 suitable scales for improvisation over this progression:
- Primary scale should be '${key} ${mode}' to match the modal character
- Additional scales can include pentatonic variants, altered scales, or related modes
- name: EXACT format - root note + mode name ONLY (e.g., '${key} ${mode}', '${key} Major Pentatonic', '${key} Dorian', '${key} Altered')
  * DO NOT add words like "Natural", "Harmonic", "Melodic", or "Scale"
  * CORRECT: "E Minor", "G Major Pentatonic", "A Dorian"
  * WRONG: "E Natural Minor", "G Harmonic Minor", "A Dorian Scale"
- rootNote: The root note matching key signature preference

Return ONLY valid JSON matching this schema:
${schemaDescription}

IMPORTANT: Return ONLY valid JSON, no additional text or markdown formatting.`;

  return {
    basePrompt,
    tensionInstructions,
    progressionInstructions,
    schemaDescription,
    fullPrompt
  };
}

/**
 * Creates a prompt fingerprint for caching optimization
 */
export function createPromptFingerprint(components: PromptComponents): string {
  // Create a hash-like fingerprint from the prompt components
  const content = [
    components.basePrompt,
    components.tensionInstructions,
    components.progressionInstructions
  ].join('|');

  // Simple hash for cache key (we could use a real hash function later)
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
}

/**
 * Estimates token usage for a request (rough approximation)
 */
export function estimateTokenUsage(components: PromptComponents): number {
  const totalText = components.fullPrompt + components.schemaDescription;
  // Rough estimate: ~4 characters per token for English text
  return Math.ceil(totalText.length / 4);
}
