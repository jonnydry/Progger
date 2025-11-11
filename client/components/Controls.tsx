import React, { useState } from 'react';
import { KEYS, CHORD_COUNTS, COMMON_PROGRESSIONS } from '@/constants';
import { CustomSelect } from './CustomSelect';
import { ModeSelect } from './ModeSelect';
import { CustomProgressionInput } from './CustomProgressionInput';
import { ToggleSwitch } from './ToggleSwitch';

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
  customProgression?: Array<{ root: string; quality: string }>;
  onCustomProgressionChange?: (progression: Array<{ root: string; quality: string }>) => void;
  numCustomChords?: number;
  onNumCustomChordsChange?: (count: number) => void;
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
  numCustomChords = 4,
  onNumCustomChordsChange,
  onAnalyzeCustom,
  detectedKey,
  detectedMode,
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleCustomToggle = (enabled: boolean) => {
    if (onCustomChange) {
      setIsTransitioning(true);
      setTimeout(() => {
        onCustomChange(enabled);
        setTimeout(() => setIsTransitioning(false), 300);
      }, 50);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Standard Controls */}
      <div 
        className={`space-y-4 md:space-y-6 transition-all duration-500 ease-in-out ${isCustomMode ? 'translate-x-[-100%] opacity-0 pointer-events-none absolute inset-0' : 'translate-x-0 opacity-100'}`}
      >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-2">
            <div className="flex items-center justify-center">
              <ToggleSwitch
                id="advanced-chords-toggle"
                label="Advanced Chords"
                checked={includeTensions}
                onChange={onTensionsChange}
                tooltip="Prioritize extended/altered chords in the generated progression (20-40%)"
              />
            </div>

            <div className="flex items-center justify-center">
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
            <button
              onClick={onGenerate}
              disabled={isLoading}
              className="w-full relative bg-primary text-background font-bold py-3 px-4 rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out flex items-center justify-center border-b-4 border-primary/50 active:border-b-0 active:translate-y-1 shadow-lg hover:shadow-accent/40"
            >
              <span className="relative">
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate Progression'
                )}
              </span>
            </button>
          </div>
        </div>

      {/* Custom Progression Input */}
      {onCustomProgressionChange && onNumCustomChordsChange && onAnalyzeCustom && (
        <div 
          className={`space-y-4 md:space-y-6 transition-all duration-500 ease-in-out ${!isCustomMode ? 'translate-x-[100%] opacity-0 pointer-events-none absolute inset-0' : 'translate-x-0 opacity-100'}`}
        >
            <div className="flex items-center justify-center gap-4 md:gap-6 pt-2">
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
              numChords={numCustomChords}
              onNumChordsChange={onNumCustomChordsChange}
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