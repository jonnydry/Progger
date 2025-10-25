import OpenAI from "openai";
import type { ChordInProgression, ProgressionResult, ScaleInfo } from '../types';
import { getChordVoicings } from '../utils/chordLibrary';
import { getScaleFingering, getScaleNotes } from '../utils/scaleLibrary';

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
      "chordName": "string (e.g., 'Cmaj7', 'Am7', 'G7b9')",
      "musicalFunction": "string (e.g., 'Tonic', 'Dominant 7th', 'Subdominant')",
      "relationToKey": "string (Roman numeral like 'I', 'V7', 'vi')"
    }
  ],
  "scales": [
    {
      "name": "string (full scale name like 'G Major', 'A Dorian', 'C Minor Pentatonic')",
      "rootNote": "string (e.g., 'G', 'A', 'C')"
    }
  ]
}`;

  const prompt = `You are a music theory expert specializing in guitar.
${progressionInstruction}
${tensionInstruction}

For EACH chord in the progression, provide:
- chordName: The full chord name (e.g., 'Cmaj7', 'Am7', 'G7b9')
- musicalFunction: Its role in the progression (e.g., 'Tonic', 'Dominant 7th', 'Subdominant')
- relationToKey: Roman numeral notation (e.g., 'I', 'V7', 'vi')

Additionally, suggest 2 to 3 suitable scales that can be improvised over this entire progression.
For each scale, provide:
- name: Full scale name (e.g., 'C Major', 'A Dorian', 'G Minor Pentatonic')
- rootNote: The root note (e.g., 'C', 'A', 'G')

Return ONLY valid JSON matching this schema:
${schemaDescription}

IMPORTANT: Return ONLY valid JSON, no additional text or markdown formatting.`;

  try {
    console.log("Fetching from xAI Grok API:", cacheKey);
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

    const progression: ChordInProgression[] = resultFromApi.progression.map(chord => ({
        chordName: chord.chordName,
        musicalFunction: chord.musicalFunction,
        relationToKey: chord.relationToKey,
        voicings: getChordVoicings(chord.chordName)
    }));

    const scales: ScaleInfo[] = resultFromApi.scales.map(scale => ({
        name: scale.name,
        rootNote: scale.rootNote,
        notes: getScaleNotes(scale.rootNote, scale.name),
        fingering: getScaleFingering(scale.name, scale.rootNote)
    }));

    const finalResult = { progression, scales };
    
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
