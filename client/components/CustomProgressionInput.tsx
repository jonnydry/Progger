import React, { useEffect } from 'react';
import { CHORD_COUNTS } from '@/constants';
import { getSmartDefaultChord } from '@/utils/smartChordSuggestions';
import { ChordInputCard } from './ChordInputCard';

interface CustomProgressionInputProps {
  numChords: number;
  onNumChordsChange: (count: number) => void;
  customProgression: Array<{ root: string; quality: string }>;
  onCustomProgressionChange: (progression: Array<{ root: string; quality: string }>) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  detectedKey?: string;
  detectedMode?: string;
}

/**
 * Custom chord progression input interface
 *
 * Features:
 * - Dynamic number of chords selector
 * - Wheel picker for root note and chord quality
 * - Live fretboard preview that updates in real-time as users scroll
 *   • Shows instant visual feedback of chord voicings
 *   • Displays lowest/most common fingering position
 *   • Debounced loading (150ms) for smooth performance
 * - Smart default chord selection based on musical context:
 *   • Key detection from existing chords
 *   • Common progression pattern recognition
 *   • Last chord quality memory
 * - Auto-resize progression array when chord count changes
 * - Loading state for analyze button
 */
export const CustomProgressionInput: React.FC<CustomProgressionInputProps> = ({
  numChords,
  onNumChordsChange,
  customProgression,
  onCustomProgressionChange,
  onAnalyze,
  isLoading,
  detectedKey,
  detectedMode,
}) => {
  // We no longer use numChords/onNumChordsChange directly for UI, 
  // but we keep the props to avoid breaking the interface if it's used elsewhere.
  // The progression length is now the source of truth.

  const handleRootChange = (index: number, value: string) => {
    const newProgression = [...customProgression];
    newProgression[index] = { ...newProgression[index], root: value };
    onCustomProgressionChange(newProgression);
  };

  const handleQualityChange = (index: number, value: string) => {
    const newProgression = [...customProgression];
    newProgression[index] = { ...newProgression[index], quality: value };
    onCustomProgressionChange(newProgression);
  };

  const handleAddChord = () => {
    const newProgression = [...customProgression];
    // Add a smart default based on the current progression
    const smartDefault = getSmartDefaultChord(newProgression);
    newProgression.push(smartDefault);
    onCustomProgressionChange(newProgression);
    // Also update parent's count if needed (though we rely on array length now)
    onNumChordsChange(newProgression.length);
  };

  const handleRemoveChord = (index: number) => {
    if (customProgression.length <= 1) return; // Prevent removing the last chord
    const newProgression = customProgression.filter((_, i) => i !== index);
    onCustomProgressionChange(newProgression);
    onNumChordsChange(newProgression.length);
  };

  const handleMoveChord = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === customProgression.length - 1) return;

    const newProgression = [...customProgression];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap
    [newProgression[index], newProgression[targetIndex]] = [newProgression[targetIndex], newProgression[index]];

    onCustomProgressionChange(newProgression);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Detected Key Display */}
      {detectedKey && detectedMode && (
        <div className="text-center py-2 px-4 rounded-md bg-background/40 border border-border/30">
          <div className="text-xs text-text/60 mb-1">Detected Key</div>
          <div className="text-sm font-semibold">
            <span className="text-primary">{detectedKey}</span>
            <span className="text-text/70 mx-1">•</span>
            <span className="text-text/80">{detectedMode}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {customProgression.map((chord, index) => (
          <ChordInputCard
            key={`${index}-${chord.root}-${chord.quality}`} // Use index in key to ensure stable rendering during reorders, but adding data helps uniqueness
            index={index}
            root={chord.root}
            quality={chord.quality}
            onRootChange={(val) => handleRootChange(index, val)}
            onQualityChange={(val) => handleQualityChange(index, val)}
            onRemove={() => handleRemoveChord(index)}
            onMoveUp={() => handleMoveChord(index, 'up')}
            onMoveDown={() => handleMoveChord(index, 'down')}
            isFirst={index === 0}
            isLast={index === customProgression.length - 1}
          />
        ))}
      </div>

      {/* Add Chord Button */}
      <div className="flex justify-center pt-2 pb-2">
        <button
          onClick={handleAddChord}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/60 transition-all duration-300 group"
        >
          <div className="bg-primary/10 rounded-full p-1 group-hover:bg-primary/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <span className="font-semibold">Add Chord</span>
        </button>
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
