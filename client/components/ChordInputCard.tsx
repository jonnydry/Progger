import React, { useState, useEffect } from 'react';
import { ROOT_NOTES } from '@/constants';
import { WheelPicker } from './WheelPicker';
import { VoicingPreview } from './VoicingPreview';
import { ChordQualityCategoryTabs } from './ChordQualityCategoryTabs';
import { formatChordDisplayName } from '@/utils/chordFormatting';
import { useChordVoicingPreview } from '@/hooks/useChordVoicingPreview';
import type { ChordQualityCategory } from '@/constants/chordQualityCategories';
import { getCategoryForQuality, getQualitiesForCategory } from '@/constants/chordQualityCategories';

interface ChordInputCardProps {
  index: number;
  root: string;
  quality: string;
  onRootChange: (value: string) => void;
  onQualityChange: (value: string) => void;
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
 */
export const ChordInputCard: React.FC<ChordInputCardProps> = ({
  index,
  root,
  quality,
  onRootChange,
  onQualityChange,
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

  return (
    <div className="bg-background/50 rounded-lg p-3 md:p-4 border border-border space-y-3">
      {/* Chord header */}
      <div className="text-sm font-semibold text-text/70">
        Chord {index + 1}: <span className="text-primary font-bold">{formatChordDisplayName(root, quality)}</span>
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
    </div>
  );
};
