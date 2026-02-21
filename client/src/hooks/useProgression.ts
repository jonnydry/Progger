import { useMutation } from '@tanstack/react-query';
import { generateChordProgression, analyzeCustomProgression } from '../services/xaiService';
import type { ProgressionResult } from '../types';

interface GenerateProgressionParams {
    key: string;
    mode: string;
    includeTensions: boolean;
    generationStyle: string;
    numChords: number;
    selectedProgression: string;
}

export const useGenerateProgression = () => {
    return useMutation<ProgressionResult, Error, GenerateProgressionParams>({
        mutationFn: ({ key, mode, includeTensions, generationStyle, numChords, selectedProgression }) =>
            generateChordProgression(key, mode, includeTensions, generationStyle, numChords, selectedProgression),
    });
};

export const useAnalyzeCustomProgression = () => {
    return useMutation<ProgressionResult, Error, string[]>({
        mutationFn: (chords) => analyzeCustomProgression(chords),
    });
};
