import React from 'react';
import { ROOT_NOTES, CHORD_QUALITIES } from '@/constants';
import { WheelPicker } from './WheelPicker';
import { VoicingPreview } from './VoicingPreview';
import { formatChordDisplayName } from '@/utils/chordFormatting';
import { useChordVoicingPreview } from '@/hooks/useChordVoicingPreview';

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
  // Load chord voicing with debouncing (150ms delay)
  const { voicing, isLoading } = useChordVoicingPreview(root, quality, 150);

  return (
    <div className="bg-background/50 rounded-lg p-3 md:p-4 border border-border space-y-3">
      {/* Chord header */}
      <div className="text-sm font-semibold text-text/70">
        Chord {index + 1}: <span className="text-primary font-bold">{formatChordDisplayName(root, quality)}</span>
      </div>

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
          options={CHORD_QUALITIES}
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
