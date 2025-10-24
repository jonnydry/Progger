import { GoogleGenAI, Type } from "@google/genai";
import type { ChordInProgression, ChordVoicing, ProgressionResult, ScaleInfo } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const chordVoicingSchema = {
    type: Type.OBJECT,
    properties: {
        frets: {
            type: Type.ARRAY,
            description: "Array of 6 items for guitar strings from low E to high e. Use 'x' for muted strings and numbers as strings for frets (e.g., \"0\", \"3\").",
            items: { type: Type.STRING }
        },
        firstFret: {
            type: Type.INTEGER,
            description: "Optional. The fret number where the diagram starts. Defaults to 1 if the chord is not in open position.",
        }
    },
    required: ['frets'],
};

const chordInProgressionSchema = {
    type: Type.OBJECT,
    properties: {
        chordName: {
            type: Type.STRING,
            description: 'The name of the chord, e.g., "Cmaj7", "Am7".',
        },
        musicalFunction: {
            type: Type.STRING,
            description: 'A brief description of the chord\'s musical function (e.g., "Tonic", "Dominant 7th", "Subdominant").'
        },
        relationToKey: {
            type: Type.STRING,
            description: 'The chord\'s roman numeral relationship to the key (e.g., "I", "V7", "vi").'
        },
        voicings: {
            type: Type.ARRAY,
            description: "An array of 3-4 different, playable guitar voicings for this chord at different positions on the neck.",
            items: chordVoicingSchema
        }
    },
    required: ['chordName', 'musicalFunction', 'relationToKey', 'voicings']
};


const scaleSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'The full name of the scale, e.g., "G Major (Ionian)".' },
        rootNote: { type: Type.STRING, description: 'The root note of the scale, e.g., "G".' },
        notes: {
            type: Type.ARRAY,
            description: 'An array of all the notes in the scale, starting from the root note.',
            items: { type: Type.STRING }
        },
        fingering: {
            type: Type.ARRAY,
            description: "A 3-notes-per-string fingering pattern. An array of 6 inner arrays, one for each string from low E to high e. Each inner array contains exactly 3 fret numbers.",
            items: {
                type: Type.ARRAY,
                items: { type: Type.INTEGER }
            }
        }
    },
    required: ['name', 'rootNote', 'notes', 'fingering']
};

const schema = {
    type: Type.OBJECT,
    properties: {
        progression: {
            type: Type.ARRAY,
            items: chordInProgressionSchema
        },
        scales: {
            type: Type.ARRAY,
            description: "A list of suitable scales for the progression.",
            items: scaleSchema
        }
    },
    required: ['progression', 'scales']
};

// Types reflecting the raw API response before data transformation
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
  // --- Caching Implementation ---
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
  // --- End Caching Implementation ---
  
  const tensionInstruction = includeTensions
    ? `Incorporate one or two more complex 'leading' or 'transition' chords with interesting tensions to add harmonic interest. Examples include secondary dominants, tritone substitutions, or altered chords.`
    : `Keep the progression relatively standard and diatonic to the key.`;

  const progressionInstruction = selectedProgression === 'auto'
    ? `Generate a common but interesting ${numChords}-chord progression in the key of ${key} ${mode}. The progression must make harmonic sense and be musically pleasing.`
    : `Generate the specific chord progression "${selectedProgression}" using Nashville Number System conventions in the key of ${key} ${mode}. For example, in C Major, 'I' is C, 'ii' is Dm, 'vi' is Am. In A Minor, 'i' is Am, 'VI' is F, 'III' is C. The number of chords should exactly match the requested progression.`;

  const prompt = `
    You are a music theory expert specializing in guitar.
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

    Return the entire result as a single JSON object that adheres to the provided schema.
  `;

  try {
    console.log("Fetching from API:", cacheKey);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    const resultFromApi = JSON.parse(jsonText) as ProgressionResultFromAPI;
    
    // Validate the raw response structure
    if (!resultFromApi.progression || !resultFromApi.scales || !Array.isArray(resultFromApi.progression) || !Array.isArray(resultFromApi.scales)) {
        throw new Error("Invalid data structure received from API.");
    }
    if (resultFromApi.progression.some(p => !p.voicings || p.voicings.length === 0 || !p.musicalFunction || !p.relationToKey)) {
        throw new Error("API returned incomplete chord data (missing voicings, function, or relation to key).");
    }
     if (resultFromApi.scales.some(s => !s.fingering || s.fingering.length !== 6 || s.fingering.some(f => !Array.isArray(f) || f.length !== 3))) {
        throw new Error("Invalid scale fingering data received from API.");
    }

    // Transform the progression part of the API response
    const progression: ChordInProgression[] = resultFromApi.progression.map(chord => ({
        ...chord,
        voicings: chord.voicings.map(voicing => ({
            ...voicing,
            frets: voicing.frets.map(fret => (fret.toLowerCase() === 'x' ? 'x' : parseInt(fret, 10)))
        }))
    }));

    // Validate the transformed data
    if (progression.some(c => c.voicings.some(v => v.frets.some(f => typeof f === 'number' && isNaN(f))))) {
        throw new Error("Invalid fret number received from API. Expected numbers or 'x'.");
    }

    const finalResult = { progression, scales: resultFromApi.scales };
    
    // --- Caching Implementation ---
    try {
        sessionStorage.setItem(cacheKey, JSON.stringify(finalResult));
    } catch (error) {
        console.warn("Could not write to session storage", error);
    }
    // --- End Caching Implementation ---

    return finalResult;
  } catch (error) {
    console.error("Error generating chord progression:", error);
    if (error instanceof SyntaxError) { // JSON.parse failed
        throw new Error("Failed to parse the response from the AI. The format was invalid.");
    }
    throw new Error("Failed to generate chord progression. The AI might be busy, or the request was invalid.");
  }
}