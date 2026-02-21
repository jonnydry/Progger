// Prompt optimization utilities for XAI API cost reduction

export interface ProgressionRequest {
  key: string;
  mode: string;
  includeTensions: boolean;
  generationStyle: "conservative" | "balanced" | "adventurous";
  numChords: number;
  selectedProgression: string;
}

export interface PromptComponents {
  basePrompt: string;
  advancedChordInstructions: string;
  progressionInstructions: string;
  schemaDescription: string;
  fullPrompt: string;
}

interface AutoProgressionConfig {
  isAuto: boolean;
  variant?: string;
}

function parseAutoProgression(selectedProgression: string): AutoProgressionConfig {
  const normalized = selectedProgression.trim();
  if (normalized.toLowerCase() === "auto") {
    return { isAuto: true };
  }

  const match = normalized.match(/^auto:(.+)$/i);
  if (match) {
    return { isAuto: true, variant: match[1].trim().toLowerCase() };
  }

  return { isAuto: false };
}

function getAutoCreativityDirective(variant?: string): string {
  switch (variant) {
    case "modal-cadence":
      return "Prioritize modal cadences and avoid generic pop loops.";
    case "stepwise-voice-leading":
      return "Prioritize smooth bass motion by step and semitone for voice-leading interest.";
    case "dominant-motion":
      return "Include stronger dominant movement with at least one secondary dominant when musically valid.";
    case "pedal-point":
      return "Use a brief pedal-point moment to create tension before release.";
    case "backdoor-mix":
      return "Include at least one backdoor or subdominant-driven dominant resolution when stylistically appropriate.";
    case "quartal-color":
      return "Bias toward modern color tones and quartal-like harmonic colors while preserving tonal clarity.";
    default:
      return "Avoid overused templates like I-V-vi-IV unless explicitly requested.";
  }
}

function getGenerationStyleDirective(generationStyle: "conservative" | "balanced" | "adventurous"): string {
  if (generationStyle === "conservative") {
    return "Favor stable diatonic motion, clear cadences, and minimal chromatic substitutions.";
  }
  if (generationStyle === "adventurous") {
    return "Favor surprising but musical movement, richer substitutions, and bolder color tones while preserving coherent voice leading.";
  }
  return "Balance familiarity and novelty with one or two tasteful harmonic surprises.";
}

/**
 * Optimizes prompt length by only including advanced chord instructions when needed
 */
export function buildOptimizedPrompt(request: ProgressionRequest): PromptComponents {
  const { key, mode, includeTensions, generationStyle, numChords, selectedProgression } = request;
  const autoConfig = parseAutoProgression(selectedProgression);
  const progressionLabel = autoConfig.isAuto ? "AI Generated (auto)" : selectedProgression;

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

🎵 MANDATORY CHORD COUNT: ${numChords} chords 🎵
═══════════════════════════════════════
You MUST return EXACTLY ${numChords} chord objects in the progression array.
This is NON-NEGOTIABLE and will be strictly validated.

TASK:
Generate a creative ${numChords}-chord progression in the key of ${key} ${mode}.

REQUEST CONTEXT (MUST HONOR EXACTLY):
- key: ${key}
- mode: ${mode}
- numChords: ${numChords}
- selectedProgression: ${progressionLabel}
- includeTensions: ${includeTensions ? "true" : "false"}
- generationStyle: ${generationStyle}

⚠️ CRITICAL CHORD COUNT REQUIREMENTS:
- REQUIRED: Exactly ${numChords} chord objects
- NOT ${numChords - 1}, NOT ${numChords + 1}, EXACTLY ${numChords}
- Count your chords before responding: 1, 2, 3... up to ${numChords}
- If you generate ${numChords - 1} or fewer chords, your response will be REJECTED
- If you generate ${numChords + 1} or more chords, your response will be REJECTED

MODE CHARACTERISTICS:
${modeInfo.modeCharacteristics}

CRITICAL REQUIREMENTS:
1. Use EXACT chord notation that matches guitar voicing standards
2. Chord names must include quality: maj7, min7, 7, 9, 7b9, 7#9, 7alt, etc.
3. Respect the key signature: ${key.includes('b') ? 'use flats (Bb, Eb, Ab)' : key.includes('#') ? 'use sharps (F#, C#, G#)' : 'use standard note spelling'}
4. Ensure smooth voice leading between chords
5. Provide accurate Roman numeral analysis for each chord
6. Use harmonies that highlight the characteristic notes of ${mode} mode`;

  // Advanced chord instructions - only included when advanced chords are requested
  let advancedChordInstructions = '';
  if (includeTensions) {
    // Calculate appropriate number of advanced chords based on progression length
    const minAdvancedChords = Math.max(1, Math.floor(numChords * 0.2)); // At least 20%
    const maxAdvancedChords = Math.ceil(numChords * 0.4); // At most 40%

    advancedChordInstructions = `
Include ${minAdvancedChords} to ${maxAdvancedChords} chords with advanced harmonic qualities.

ADVANCED CHORD GUIDELINES:
- Secondary dominants (e.g., V7/V, V7/ii): Dominant chords that resolve to diatonic chords
- Tritone substitutions: bII7 chords resolving down a half-step (use sparingly, only with clear resolution)
- Altered dominants: Use extensions like 7b9, 7#9, 7b5, 7#5, 7alt on dominant function chords
- Extended chords: 9ths, 11ths, 13ths for smooth voice leading
- Half-diminished (m7b5): Common in minor keys and as secondary ii chords
- Suspended dominants: 7sus4 chords for delayed resolution

HARMONIC PRIORITIZATION:
- PREFER advanced chords on dominant and pre-dominant functions (V7, ii, IV, secondary dominants)
- Keep tonic chords stable - use maj7, 6, or maj9 for color, avoid heavy alterations on I/i
- Ensure clear voice leading and functional resolution (e.g., V7alt → Imaj7/6/9, not V7alt → i)
- Advanced chords must make harmonic sense within the progression - prioritize musicality over complexity

MUSIC THEORY RULES:
- Advanced chords should have clear voice leading and resolution
- Altered dominants (7b9, 7#9, 7alt) work best on V7 chords or secondary dominants
- Extended chords (9, 11, 13) work well on any function but prioritize dominants and pre-dominants
- In ${modeInfo.isMajorMode ? 'major' : 'minor'} modes, respect the key signature
- Use appropriate accidentals: ${key.includes('b') ? 'prefer flats' : key.includes('#') ? 'prefer sharps' : 'use standard spelling'}`;
  } else {
    advancedChordInstructions = `
TENSIONS MODE: OFF
- Prioritize diatonic 7th chord vocabulary and clean functional movement
- Avoid overusing altered dominants and dense upper-structure tension chains
- Keep harmonic color tasteful and moderate unless the progression pattern explicitly implies stronger chromaticism`;
  }

  // Progression-specific instructions
  let progressionInstructions = '';

  if (autoConfig.isAuto) {
    progressionInstructions = `The progression should sound musical and guitar-friendly, but not formulaic.

AUTO-GENERATION VARIETY RULES:
- Do NOT default to the same stock loop every time
- Use at least one non-triadic color chord when stylistically valid
- Keep functional coherence while varying cadence shape
- ${getAutoCreativityDirective(autoConfig.variant)}
- STYLE TARGET: ${getGenerationStyleDirective(generationStyle)}`;
  } else {
    const romanNumeralInstruction = `
ROMAN NUMERAL INTERPRETATION:
- Uppercase (I, IV, V): Major chords
- Lowercase (ii, iii, vi): Minor chords
- Diminished: ii° or vii°
- Add 7th chords for jazz/contemporary sound: Imaj7, ii7, V7, etc.

EXAMPLES:
${modeInfo.romanNumeralExamples}

The number of chords should exactly match the progression pattern.

STYLE TARGET:
- ${getGenerationStyleDirective(generationStyle)}`;

    progressionInstructions = `Generate the specific chord progression "${selectedProgression}" using Nashville Number System conventions in the key of ${key} ${mode}. ${romanNumeralInstruction}`;
  }

  // Final combined prompt
  const fullPrompt = `${basePrompt}${advancedChordInstructions}${progressionInstructions}

For EACH chord in the progression, provide:
- chordName: EXACT chord name with quality (e.g., 'Cmaj7', 'Am7', 'G7b9', 'D7alt', 'Bm7b5')
- musicalFunction: Detailed role (e.g., 'Tonic Major 7th', 'Secondary Dominant to ii', 'Altered Dominant')
- relationToKey: Roman numeral (e.g., 'Imaj7', 'V7', 'iim7', 'V7/ii')

Additionally, suggest ALL compatible scales for improvisation over this progression:
- Include every musically plausible compatible scale (do not limit to 2-3)
- Primary scale MUST be '${key} ${mode}' to match the modal character and MUST appear first
- For modal progressions (Lydian, Dorian, Phrygian, Mixolydian, Locrian):
  * Include the mode (${mode}) at different root positions that appear in the progression
  * Example: For a Lydian progression with chords on C, D, and E, suggest "C Lydian", "D Lydian", and "E Lydian" when musically valid
  * For modes, prioritize ${mode} scales at different roots over generic major/minor scales
- Include additional compatible options such as pentatonic variants or related modes when they fit
- Do not return duplicate scales (same root + descriptor)
- Order scales from strongest fit to more color/optional choices
- name: EXACT format - root note + mode name ONLY (e.g., '${key} ${mode}', '${key} Major Pentatonic', '${key} Dorian', '${key} Lydian')
  * DO NOT add words like "Natural", "Harmonic", "Melodic", or "Scale"
  * CORRECT: "E Minor", "G Major Pentatonic", "A Dorian", "C Lydian"
  * WRONG: "E Natural Minor", "G Harmonic Minor", "A Dorian Scale"
- rootNote: The root note matching key signature preference

Return ONLY valid JSON matching this schema:
${schemaDescription}

════════════════════════════════════════════════════════
⚠️ ⚠️ ⚠️  FINAL MANDATORY VERIFICATION  ⚠️ ⚠️ ⚠️
════════════════════════════════════════════════════════
Before you return your response:
1. COUNT the chord objects in your progression array
2. Verify the count equals EXACTLY ${numChords}
3. If count ≠ ${numChords}, ADD or REMOVE chords until count = ${numChords}
4. Verify the primary scale includes "${key} ${mode}" exactly by mode identity
5. Verify response follows includeTensions=${includeTensions ? "true" : "false"} behavior
6. Verify response aligns with generationStyle=${generationStyle}

REQUIRED: progression.length === ${numChords}
Your response will be REJECTED if this requirement is not met.
════════════════════════════════════════════════════════

IMPORTANT: Return ONLY valid JSON, no additional text or markdown formatting.`;

  return {
    basePrompt,
    advancedChordInstructions,
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
    components.advancedChordInstructions,
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
