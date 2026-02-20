import React, { useRef, useEffect } from 'react';
import { KEYS, CHORD_COUNTS, COMMON_PROGRESSIONS } from '@/constants';
import { CustomSelect } from './CustomSelect';
import { ModeSelect } from './ModeSelect';
import { CustomProgressionInput } from './CustomProgressionInput';
import { ToggleSwitch } from './ToggleSwitch';
import { PixelButton } from './PixelButton';
import type { CustomChordInput } from '@/types';

interface ControlsProps {
  selectedKey: string;
  onKeyChange: (key: string) => void;
  selectedMode: string;
  onModeChange: (mode: string) => void;
  selectedProgression: string;
  onProgressionChange: (progression: string) => void;
  numChords: number;
  onNumChordsChange: (count: number) => void;
  includeTensions: boolean;
  onTensionsChange: (checked: boolean) => void;
  onGenerate: () => void;
  isLoading: boolean;
  // Custom mode props
  isCustomMode?: boolean;
  onCustomChange?: (enabled: boolean) => void;
  customProgression?: CustomChordInput[];
  onCustomProgressionChange?: (progression: CustomChordInput[]) => void;
  onAnalyzeCustom?: () => void;
  detectedKey?: string;
  detectedMode?: string;
}

export const Controls: React.FC<ControlsProps> = ({
  selectedKey,
  onKeyChange,
  selectedMode,
  onModeChange,
  selectedProgression,
  onProgressionChange,
  numChords,
  onNumChordsChange,
  includeTensions,
  onTensionsChange,
  onGenerate,
  isLoading,
  isCustomMode = false,
  onCustomChange,
  customProgression = [],
  onCustomProgressionChange,
  onAnalyzeCustom,
  detectedKey,
  detectedMode,
}) => {
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current = [];
    };
  }, []);

  const handleCustomToggle = (enabled: boolean) => {
    if (onCustomChange) {
      const timer1 = setTimeout(() => {
        onCustomChange(enabled);
      }, 50);
      timersRef.current.push(timer1);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Standard Controls */}
      <div
        className={`space-y-5 md:space-y-6 transition-all duration-500 ease-in-out ${isCustomMode ? 'translate-x-[-100%] opacity-0 pointer-events-none absolute inset-0' : 'translate-x-0 opacity-100'}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <CustomSelect
            label="Key"
            value={selectedKey}
            onChange={onKeyChange}
            options={KEYS}
          />
          <ModeSelect
            label="Mode"
            value={selectedMode}
            onChange={onModeChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <CustomSelect
            label="Progression"
            value={selectedProgression}
            onChange={onProgressionChange}
            options={COMMON_PROGRESSIONS}
          />
          <CustomSelect
            label="Chords"
            value={String(numChords)}
            onChange={(val) => onNumChordsChange(Number(val))}
            options={CHORD_COUNTS.map(String)}
            disabled={selectedProgression !== 'auto'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 pt-1 sm:pt-2">
          <div className="flex items-center justify-start md:justify-center">
            <ToggleSwitch
              id="advanced-chords-toggle"
              label="Advanced Chords"
              checked={includeTensions}
              onChange={onTensionsChange}
              tooltip="Prioritize extended/altered chords in the generated progression (20-40%)"
            />
          </div>

          <div className="flex items-center justify-start md:justify-center">
            {onCustomChange && (
              <ToggleSwitch
                id="custom-toggle"
                label="Custom"
                checked={isCustomMode}
                onChange={handleCustomToggle}
              />
            )}
          </div>
        </div>

        <div className="pt-2">
          <PixelButton
            onClick={onGenerate}
            isLoading={isLoading}
            className="w-full py-3 px-4 text-sm sm:text-base"
          >
            {isLoading ? 'Generating...' : 'Generate Progression'}
          </PixelButton>
        </div>
      </div>

      {/* Custom Progression Input */}
      {onCustomProgressionChange && onAnalyzeCustom && (
        <div
          className={`space-y-5 md:space-y-6 transition-all duration-500 ease-in-out ${!isCustomMode ? 'translate-x-[100%] opacity-0 pointer-events-none absolute inset-0' : 'translate-x-0 opacity-100'}`}
        >
          <div className="flex items-center justify-start md:justify-center gap-4 md:gap-6 pt-1 sm:pt-2">
            {onCustomChange && (
              <ToggleSwitch
                id="custom-toggle-back"
                label="Custom"
                checked={isCustomMode}
                onChange={handleCustomToggle}
              />
            )}
          </div>

          <CustomProgressionInput
            customProgression={customProgression}
            onCustomProgressionChange={onCustomProgressionChange}
            onAnalyze={onAnalyzeCustom}
            isLoading={isLoading}
            detectedKey={detectedKey}
            detectedMode={detectedMode}
          />
        </div>
      )}
    </div>
  );
};
