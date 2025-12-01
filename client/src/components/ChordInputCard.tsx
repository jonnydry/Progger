import React, { useState, useEffect } from 'react';
import { ROOT_NOTES } from '@/constants';
import { PixelCard } from './PixelCard';
import { WheelPicker } from './WheelPicker';
import { VoicingPreview } from './VoicingPreview';
import { ChordQualityCategoryTabs } from './ChordQualityCategoryTabs';
import { formatChordDisplayName } from '@/utils/chordFormatting';
import { useChordVoicingPreview } from '@/hooks/useChordVoicingPreview';
import type { ChordQualityCategory } from '@/constants/chordQualityCategories';
import { getCategoryForQuality, getQualitiesForCategory } from '@/constants/chordQualityCategories';
import { playChord } from '@/utils/audioEngine';

interface ChordInputCardProps {
  index: number;
  root: string;
  quality: string;
  onRootChange: (value: string) => void;
  onQualityChange: (value: string) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  isPlaying?: boolean;
}

/**
 * Individual chord input card with live fretboard preview
 *
 * Features:
 * - Categorized chord quality selection (progressive disclosure)
 * - Wheel pickers for root and quality selection
 * - Real-time fretboard diagram preview
 * - Debounced voicing loading for performance
 * - Shows lowest/most common voicing position
 * - Playback, reordering, and removal controls
 */
export const ChordInputCard: React.FC<ChordInputCardProps> = ({
  index,
  root,
  quality,
  onRootChange,
  onQualityChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  isPlaying = false,
}) => {
  // Track the selected chord quality category
  const [selectedCategory, setSelectedCategory] = useState<ChordQualityCategory>('Basic');

  // Load chord voicing with debouncing (150ms delay)
  const { voicing, isLoading } = useChordVoicingPreview(root, quality, 150);

  // Auto-switch category when quality changes (e.g., from smart defaults or user selection)
  useEffect(() => {
    const category = getCategoryForQuality(quality);
    if (category && category !== selectedCategory) {
      setSelectedCategory(category);
    }
  }, [quality]);

  // Get filtered chord qualities for the selected category
  const filteredQualities = getQualitiesForCategory(selectedCategory);

  const handlePlay = () => {
    playChord(root, quality);
  };

  return (
    <PixelCard
      noAnimate
      className={`
        p-3 md:p-4 space-y-3 transition-all duration-300
        ${isPlaying
          ? 'border-accent shadow-[0_0_15px_rgba(var(--accent),0.3)] scale-[1.02] z-10'
          : 'hover:border-primary/30'
        }
      `}
    >
      {/* Chord header & Controls */}
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm font-semibold text-text/70 flex items-center gap-2">
          <span className={`
            px-2 py-0.5 rounded text-xs border transition-colors duration-300
            ${isPlaying
              ? 'bg-accent text-background border-accent font-bold'
              : 'bg-background/80 border-border/50'
            }
          `}>
            #{index + 1}
          </span>
          <span className={`
            font-bold text-base transition-colors duration-300
            ${isPlaying ? 'text-accent' : 'text-primary'}
          `}>
            {formatChordDisplayName(root, quality)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePlay}
            className={`
              p-1.5 rounded-md transition-colors
              ${isPlaying
                ? 'text-accent hover:bg-accent/10'
                : 'text-primary hover:bg-primary/10'
              }
            `}
            title="Play Chord"
            aria-label="Play chord"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>

          <div className="h-4 w-px bg-border/50 mx-1"></div>

          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="p-1.5 text-text/50 hover:text-text hover:bg-background/80 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move Up"
            aria-label="Move chord up"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>

          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="p-1.5 text-text/50 hover:text-text hover:bg-background/80 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move Down"
            aria-label="Move chord down"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <div className="h-4 w-px bg-border/50 mx-1"></div>

          <button
            onClick={onRemove}
            className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
            title="Remove Chord"
            aria-label="Remove chord"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Category tabs for chord quality selection */}
      <ChordQualityCategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Wheel pickers */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <WheelPicker
          label="Root"
          options={ROOT_NOTES}
          value={root}
          onChange={onRootChange}
        />
        <WheelPicker
          label="Quality"
          options={filteredQualities}
          value={quality}
          onChange={onQualityChange}
        />
      </div>

      {/* Live fretboard preview */}
      <div className="pt-2">
        <div className="text-xs font-semibold text-text/60 mb-2">Live Preview:</div>
        <div className="flex justify-center">
          <VoicingPreview voicing={voicing} isLoading={isLoading} />
        </div>
      </div>
    </PixelCard>
  );
};
