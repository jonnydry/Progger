import OpenAI from "openai";

const getOpenAI = () => {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error("XAI_API_KEY environment variable is not set.");
  }
  return new OpenAI({
    baseURL: "https://api.x.ai/v1",
    apiKey: apiKey,
  });
};

interface SimpleChord {
  chordName: string;
  musicalFunction: string;
  relationToKey: string;
}

interface SimpleScale {
  name: string;
  rootNote: string;
}

interface ProgressionResultFromAPI {
  progression: SimpleChord[];
  scales: SimpleScale[];
}

export async function generateChordProgression(
  key: string,
  mode: string,
  includeTensions: boolean,
  numChords: number,
  selectedProgression: string
): Promise<ProgressionResultFromAPI> {
  // Calculate appropriate number of tension chords based on progression length
  const minTensionChords = Math.max(1, Math.floor(numChords * 0.2)); // At least 20%
  const maxTensionChords = Math.ceil(numChords * 0.4); // At most 40%

  const tensionInstruction = includeTensions
    ? `Include ${minTensionChords} to ${maxTensionChords} chords with harmonic tension to add color and movement.

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
- In ${mode === 'Major' ? 'major' : 'minor'} keys, respect the key signature
- Use appropriate accidentals: ${key.includes('b') ? 'prefer flats' : key.includes('#') ? 'prefer sharps' : 'use standard spelling'}

VOICING PREFERENCE:
Use chord extensions that have guitar voicings: maj7, min7, 7, 9, maj9, min9, 7b9, 7#9, 7alt, 7sus4, min7b5, dim7`
    : `Keep the progression diatonic to ${key} ${mode}. Use primarily triads and basic seventh chords (maj7, min7, 7) that fit naturally within the key signature.`;

  const progressionInstruction = selectedProgression === 'auto'
    ? `Generate a musically coherent ${numChords}-chord progression in the key of ${key} ${mode}.
       The progression should follow common harmonic movement patterns and sound pleasing on guitar.`
    : `Generate the specific chord progression "${selectedProgression}" using Nashville Number System conventions in the key of ${key} ${mode}.

ROMAN NUMERAL INTERPRETATION:
- Uppercase (I, IV, V): Major chords
- Lowercase (ii, iii, vi): Minor chords
- Diminished: ii° or vii°
- Add 7th chords for jazz/contemporary sound: Imaj7, ii7, V7, etc.

EXAMPLES:
${mode === 'Major'
  ? `In ${key} Major: I = ${key}maj7, ii = min7, iii = min7, IV = maj7, V = 7, vi = min7, vii° = min7b5`
  : `In ${key} Minor: i = ${key}min7, ii° = min7b5, III = maj7, iv = min7, v = min7, VI = maj7, VII = 7`}

The number of chords should exactly match the progression pattern.`;

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
      "name": "string (full scale name like 'G Major', 'A Dorian', 'C Minor Pentatonic', 'G Altered')",
      "rootNote": "string (e.g., 'G', 'A', 'C' - match the key signature accidental preference)"
    }
  ]
}`;

  const prompt = `You are a music theory expert specializing in jazz and contemporary guitar harmony.

TASK:
${progressionInstruction}
${tensionInstruction}

CRITICAL REQUIREMENTS:
1. Use EXACT chord notation that matches guitar voicing standards
2. Chord names must include quality: maj7, min7, 7, 9, 7b9, 7#9, 7alt, etc.
3. Respect the key signature: ${key.includes('b') ? 'use flats (Bb, Eb, Ab)' : key.includes('#') ? 'use sharps (F#, C#, G#)' : 'use standard note spelling'}
4. Ensure smooth voice leading between chords
5. Provide accurate Roman numeral analysis for each chord

For EACH chord in the progression, provide:
- chordName: EXACT chord name with quality (e.g., 'Cmaj7', 'Am7', 'G7b9', 'D7alt', 'Bm7b5')
- musicalFunction: Detailed role (e.g., 'Tonic Major 7th', 'Secondary Dominant to ii', 'Altered Dominant')
- relationToKey: Roman numeral (e.g., 'Imaj7', 'V7', 'iim7', 'V7/ii', 'bII7')

Additionally, suggest 2 to 3 suitable scales for improvisation over this progression:
- name: Full scale name (e.g., '${key} Major', '${key} Dorian', '${key} Altered Scale')
- rootNote: The root note matching key signature preference

Return ONLY valid JSON matching this schema:
${schemaDescription}

IMPORTANT: Return ONLY valid JSON, no additional text or markdown formatting.`;

  try {
    console.log("Fetching from xAI Grok API");
    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: "grok-4-fast-reasoning",
      messages: [
        {
          role: "system",
          content: "You are a music theory expert. Always respond with valid JSON matching the exact schema provided."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000,
    });

    const jsonText = response.choices[0].message.content?.trim();
    if (!jsonText) {
      throw new Error("Empty response from API");
    }

    const resultFromApi = JSON.parse(jsonText) as ProgressionResultFromAPI;

    if (!resultFromApi.progression || !resultFromApi.scales || !Array.isArray(resultFromApi.progression) || !Array.isArray(resultFromApi.scales)) {
      throw new Error("Invalid data structure received from API.");
    }
    if (resultFromApi.progression.some(p => !p.chordName || !p.musicalFunction || !p.relationToKey)) {
      throw new Error("API returned incomplete chord data (missing name, function, or relation to key).");
    }
    if (resultFromApi.scales.some(s => !s.name || !s.rootNote)) {
      throw new Error("API returned incomplete scale data (missing name or root note).");
    }

    return resultFromApi;
  } catch (error) {
    console.error("Error generating chord progression:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse the response from the AI. The format was invalid.");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to generate chord progression. The AI might be busy, or the request was invalid.");
  }
}
