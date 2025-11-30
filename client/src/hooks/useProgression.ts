import { useMutation } from '@tanstack/react-query';
import { generateChordProgression, analyzeCustomProgression } from '../services/xaiService';
import type { ProgressionResult } from '../types';

interface GenerateProgressionParams {
    key: string;
    mode: string;
    includeTensions: boolean;
    numChords: number;
    selectedProgression: string;
}

export const useGenerateProgression = () => {
    return useMutation<ProgressionResult, Error, GenerateProgressionParams>({
        mutationFn: ({ key, mode, includeTensions, numChords, selectedProgression }) =>
            generateChordProgression(key, mode, includeTensions, numChords, selectedProgression),
    });
};

export const useAnalyzeCustomProgression = () => {
    return useMutation<ProgressionResult, Error, string[]>({
        mutationFn: (chords) => analyzeCustomProgression(chords),
    });
};
