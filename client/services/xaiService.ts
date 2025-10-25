import type { ChordInProgression, ProgressionResult, ScaleInfo } from '../types';
import { getChordVoicings } from '../utils/chordLibrary';
import { getScaleFingering, getScaleNotes } from '../utils/scaleLibrary';

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
  
  try {
    console.log("Fetching from backend API:", cacheKey);

    const response = await fetch('/api/generate-progression', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key,
        mode,
        includeTensions,
        numChords,
        selectedProgression,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const resultFromApi = await response.json() as ProgressionResultFromAPI;
    
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
