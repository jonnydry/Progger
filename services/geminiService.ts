import OpenAI from "openai";
import type { ChordInProgression, ProgressionResult, ScaleInfo } from '../types';

const getOpenAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  return new OpenAI({ 
    baseURL: "https://api.x.ai/v1", 
    apiKey: process.env.API_KEY,
    dangerouslyAllowBrowser: true
  });
};

interface RawChordVoicing {
    frets: string[];
    firstFret?: number;
}

interface RawChordInProgression {
    chordName: string;
    musicalFunction: string;
    relationToKey: string;
    voicings: RawChordVoicing[];
}

interface ProgressionResultFromAPI {
    progression: RawChordInProgression[];
    scales: ScaleInfo[];
}

export async function generateChordProgression(key: string, mode: string, includeTensions: boolean, numChords: number, selectedProgression: string): Promise<ProgressionResult> {
  const cacheKey = `progression-${key}-${mode}-${includeTensions}-${numChords}-${selectedProgression}`;
  try {
    const cachedResult = sessionStorage.getItem(cacheKey);
    if (cachedResult) {
      console.log("Serving from cache:", cacheKey);
      return JSON.parse(cachedResult) as ProgressionResult;
    }
  } catch (error) {
    console.warn("Could not read from session storage", error);
  }
  
  const tensionInstruction = includeTensions
    ? `Incorporate one or two more complex 'leading' or 'transition' chords with interesting tensions to add harmonic interest. Examples include secondary dominants, tritone substitutions, or altered chords.`
    : `Keep the progression relatively standard and diatonic to the key.`;

  const progressionInstruction = selectedProgression === 'auto'
    ? `Generate a common but interesting ${numChords}-chord progression in the key of ${key} ${mode}. The progression must make harmonic sense and be musically pleasing.`
    : `Generate the specific chord progression "${selectedProgression}" using Nashville Number System conventions in the key of ${key} ${mode}. For example, in C Major, 'I' is C, 'ii' is Dm, 'vi' is Am. In A Minor, 'i' is Am, 'VI' is F, 'III' is C. The number of chords should exactly match the requested progression.`;

  const schemaDescription = `
{
  "progression": [
    {
      "chordName": "string (e.g., 'Cmaj7', 'Am7')",
      "musicalFunction": "string (e.g., 'Tonic', 'Dominant 7th', 'Subdominant')",
      "relationToKey": "string (Roman numeral like 'I', 'V7', 'vi')",
      "voicings": [
        {
          "frets": ["string array of 6 items for guitar strings, use 'x' for muted, numbers as strings for frets"],
          "firstFret": "optional integer for diagram starting fret"
        }
      ]
    }
  ],
  "scales": [
    {
      "name": "string (full scale name like 'G Major (Ionian)')",
      "rootNote": "string (e.g., 'G')",
      "notes": ["array of all notes in the scale"],
      "fingering": [[3 integers], [3 integers], [3 integers], [3 integers], [3 integers], [3 integers]]
    }
  ]
}`;

  const prompt = `You are a music theory expert specializing in guitar.
${progressionInstruction}
${tensionInstruction}

For EACH chord in the progression, provide its name, its musical function (e.g., 'Tonic', 'Dominant 7th'), its relation to the key as a Roman numeral (e.g., 'I', 'V7', 'vi'), and an array of 3-4 different, playable guitar voicings at various positions on the neck.

For each voicing, provide a 'frets' array and an optional 'firstFret'.
The 'frets' array must have 6 items, representing guitar strings from low E (6th string) to high e (1st string).
Use 'x' for muted strings and numbers represented as strings for frets (e.g., "0", "1", "12").
If a voicing doesn't start at the open position, 'firstFret' should indicate the starting fret of the chord diagram.

Additionally, suggest a list of 2 to 3 suitable modal scales that can be improvised over this entire progression.
For each scale, provide its full name, root note, all notes in the scale, and a "3-notes-per-string" fingering pattern.
When listing scale notes, use standard music notation and avoid confusing enharmonic equivalents (e.g., use C instead of B#, E instead of Fb) unless required by the key signature.
The 'fingering' property must be an array of 6 inner arrays (one per string), each containing exactly three integer fret numbers.

Return the entire result as a single JSON object that adheres to this schema:
${schemaDescription}

IMPORTANT: Return ONLY valid JSON, no additional text or markdown formatting.`;

  try {
    console.log("Fetching from xAI Grok API:", cacheKey);
    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: "grok-beta",
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
      max_tokens: 4000,
    });

    const jsonText = response.choices[0].message.content?.trim();
    if (!jsonText) {
      throw new Error("Empty response from API");
    }

    const resultFromApi = JSON.parse(jsonText) as ProgressionResultFromAPI;
    
    if (!resultFromApi.progression || !resultFromApi.scales || !Array.isArray(resultFromApi.progression) || !Array.isArray(resultFromApi.scales)) {
        throw new Error("Invalid data structure received from API.");
    }
    if (resultFromApi.progression.some(p => !p.voicings || p.voicings.length === 0 || !p.musicalFunction || !p.relationToKey)) {
        throw new Error("API returned incomplete chord data (missing voicings, function, or relation to key).");
    }
    if (resultFromApi.scales.some(s => !s.fingering || s.fingering.length !== 6 || s.fingering.some(f => !Array.isArray(f) || f.length !== 3))) {
        throw new Error("Invalid scale fingering data received from API.");
    }

    const progression: ChordInProgression[] = resultFromApi.progression.map(chord => ({
        ...chord,
        voicings: chord.voicings.map(voicing => ({
            ...voicing,
            frets: voicing.frets.map(fret => (fret.toLowerCase() === 'x' ? 'x' : parseInt(fret, 10)))
        }))
    }));

    if (progression.some(c => c.voicings.some(v => v.frets.some(f => typeof f === 'number' && isNaN(f))))) {
        throw new Error("Invalid fret number received from API. Expected numbers or 'x'.");
    }

    const finalResult = { progression, scales: resultFromApi.scales };
    
    try {
        sessionStorage.setItem(cacheKey, JSON.stringify(finalResult));
    } catch (error) {
        console.warn("Could not write to session storage", error);
    }

    return finalResult;
  } catch (error) {
    console.error("Error generating chord progression:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse the response from the AI. The format was invalid.");
    }
    throw new Error("Failed to generate chord progression. The AI might be busy, or the request was invalid.");
  }
}
