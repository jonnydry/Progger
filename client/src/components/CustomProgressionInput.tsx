import React from 'react';
import { MAX_CUSTOM_CHORDS } from '@/constants';
import { getSmartDefaultChord } from '@/utils/smartChordSuggestions';
import { ChordInputCard } from './ChordInputCard';
import { playProgression } from '@/utils/audioEngine';
import { PixelButton } from './PixelButton';
import type { CustomChordInput } from '@/types';
import { createChordId } from '@/utils/customProgression';

interface CustomProgressionInputProps {
  customProgression: CustomChordInput[];
  onCustomProgressionChange: (progression: CustomChordInput[]) => void;
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
  customProgression,
  onCustomProgressionChange,
  onAnalyze,
  isLoading,
  detectedKey,
  detectedMode,
}) => {
  const [playingIndex, setPlayingIndex] = React.useState<number | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const playbackCleanupRef = React.useRef<(() => void) | null>(null);
  const canAddChord = customProgression.length < MAX_CUSTOM_CHORDS;

  React.useEffect(() => {
    return () => {
      if (playbackCleanupRef.current) {
        playbackCleanupRef.current();
        playbackCleanupRef.current = null;
      }
    };
  }, []);

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
    if (!canAddChord) return;

    const newProgression = [...customProgression];
    // Add a smart default based on the current progression
    const smartDefault = getSmartDefaultChord(newProgression);
    newProgression.push({ id: createChordId(), ...smartDefault });
    onCustomProgressionChange(newProgression);
  };

  const handleRemoveChord = (index: number) => {
    if (customProgression.length <= 1) return; // Prevent removing the last chord
    const newProgression = customProgression.filter((_, i) => i !== index);
    onCustomProgressionChange(newProgression);
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

  const handlePlayProgression = () => {
    if (isPlaying) return;

    if (playbackCleanupRef.current) {
      playbackCleanupRef.current();
      playbackCleanupRef.current = null;
    }

    setIsPlaying(true);
    setPlayingIndex(null);

    playbackCleanupRef.current = playProgression(
      customProgression,
      (index) => setPlayingIndex(index),
      () => {
        playbackCleanupRef.current = null;
        setIsPlaying(false);
        setPlayingIndex(null);
      }
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Top Controls: Key Display & Play All */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {detectedKey && detectedMode ? (
          <div className="text-center py-2 px-4 rounded-md bg-background/40 border-2 border-border flex-1 w-full md:w-auto">
            <div className="text-xs text-text/60 mb-1">Detected Key</div>
            <div className="text-sm font-semibold">
              <span className="text-primary">{detectedKey}</span>
              <span className="text-text/70 mx-1">•</span>
              <span className="text-text/80">{detectedMode}</span>
            </div>
          </div>
        ) : <div className="flex-1"></div>}

        <PixelButton
          onClick={handlePlayProgression}
          disabled={isPlaying}
          variant="secondary"
          className="flex items-center gap-2 px-5 py-2.5"
        >
          {isPlaying ? (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              <span>Playing...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>Play Progression</span>
            </>
          )}
        </PixelButton>
      </div>

      <div className="space-y-4">
        {customProgression.map((chord, index) => (
          <ChordInputCard
            key={chord.id}
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
            isPlaying={playingIndex === index}
          />
        ))}
      </div>

      {/* Add Chord Button */}
      <div className="flex justify-center pt-2 pb-2">
        <PixelButton
          onClick={handleAddChord}
          disabled={!canAddChord}
          variant="ghost"
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-primary/30 hover:border-primary/60"
        >
          <div className="bg-primary/10 rounded-full p-1 group-hover:bg-primary/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <span className="font-semibold">Add Chord</span>
        </PixelButton>
      </div>
      {!canAddChord && (
        <p className="text-center text-xs text-text/60 -mt-1">
          Maximum of {MAX_CUSTOM_CHORDS} chords reached.
        </p>
      )}

      <div className="pt-2">
        <PixelButton
          onClick={onAnalyze}
          isLoading={isLoading}
          disabled={isLoading}
          aria-label={isLoading ? "Analyzing chord progression, please wait" : "Analyze chord progression"}
          className="w-full py-3 px-4 text-base"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Progression'}
        </PixelButton>
      </div>
    </div>
  );
};
