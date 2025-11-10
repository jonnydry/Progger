import React, { useEffect } from 'react';
import { CHORD_COUNTS, ROOT_NOTES, CHORD_QUALITIES } from '@/constants';
import { WheelPicker } from './WheelPicker';
import { formatChordDisplayName } from '@/utils/chordFormatting';

interface CustomProgressionInputProps {
  numChords: number;
  onNumChordsChange: (count: number) => void;
  customProgression: Array<{ root: string; quality: string }>;
  onCustomProgressionChange: (progression: Array<{ root: string; quality: string }>) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

/**
 * Custom chord progression input interface
 *
 * Features:
 * - Dynamic number of chords selector
 * - Wheel picker for root note and chord quality
 * - Real-time chord display name preview
 * - Auto-resize progression array when chord count changes
 * - Loading state for analyze button
 */
export const CustomProgressionInput: React.FC<CustomProgressionInputProps> = ({
  numChords,
  onNumChordsChange,
  customProgression,
  onCustomProgressionChange,
  onAnalyze,
  isLoading
}) => {
  useEffect(() => {
    // Initialize or resize progression array when numChords changes
    // Only run if the current length doesn't match the desired length
    if (customProgression.length === numChords) {
      return;
    }

    const newProgression = [...customProgression];
    while (newProgression.length < numChords) {
      newProgression.push({ root: 'C', quality: 'major' });
    }
    while (newProgression.length > numChords) {
      newProgression.pop();
    }

    onCustomProgressionChange(newProgression);
  }, [numChords, customProgression, onCustomProgressionChange]);

  const handleChordChange = (index: number, field: 'root' | 'quality', value: string) => {
    // Validate input before updating state
    if (field === 'quality' && !CHORD_QUALITIES.includes(value)) {
      console.error(`Invalid chord quality: ${value}`);
      return;
    }
    if (field === 'root' && !ROOT_NOTES.includes(value)) {
      console.error(`Invalid root note: ${value}`);
      return;
    }

    const newProgression = [...customProgression];
    newProgression[index] = { ...newProgression[index], [field]: value };
    onCustomProgressionChange(newProgression);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-3">
        <label className="block text-center text-sm font-semibold text-text/70">
          Number of Chords
        </label>
        <div className="flex items-center justify-center gap-1.5 md:gap-3 flex-nowrap overflow-x-auto pb-2 md:pb-0">
          {CHORD_COUNTS.map((count) => (
            <button
              key={count}
              onClick={() => onNumChordsChange(count)}
              className={`
                relative px-2 py-1.5 md:px-5 md:py-2.5 rounded-lg font-bold text-base md:text-lg
                transition-all duration-300 ease-out
                border-2 shadow-md flex-shrink-0
                ${count === numChords
                  ? 'bg-primary text-background border-primary scale-110 shadow-primary/50 shadow-lg'
                  : 'bg-background/30 text-text/80 border-border hover:border-primary/50 hover:scale-105 hover:shadow-lg hover:text-text'
                }
              `}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {customProgression.map((chord, index) => (
          <div key={index} className="bg-background/50 rounded-lg p-3 md:p-4 border border-border">
            <div className="text-sm font-semibold text-text/70 mb-3">
              Chord {index + 1}: <span className="text-primary font-bold">{formatChordDisplayName(chord.root, chord.quality)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <WheelPicker
                label="Root"
                options={ROOT_NOTES}
                value={chord.root}
                onChange={(val) => handleChordChange(index, 'root', val)}
              />
              <WheelPicker
                label="Quality"
                options={CHORD_QUALITIES}
                value={chord.quality}
                onChange={(val) => handleChordChange(index, 'quality', val)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <button
          onClick={onAnalyze}
          disabled={isLoading}
          aria-label={isLoading ? "Analyzing chord progression, please wait" : "Analyze chord progression"}
          aria-busy={isLoading}
          aria-live="polite"
          className="w-full relative bg-primary text-background font-bold py-3 px-4 rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out flex items-center justify-center border-b-4 border-primary/50 active:border-b-0 active:translate-y-1 shadow-lg hover:shadow-accent/40"
        >
          <span className="relative">
            {isLoading ? (
              <span className="flex items-center" role="status">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-background"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span aria-live="assertive">Analyzing...</span>
              </span>
            ) : (
              'Analyze Progression'
            )}
          </span>
        </button>
      </div>
    </div>
  );
};
