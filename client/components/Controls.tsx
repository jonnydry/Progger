import React from 'react';
import { KEYS, MODES, CHORD_COUNTS, COMMON_PROGRESSIONS } from '@/constants';
import { CustomSelect } from './CustomSelect';

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
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomSelect
          label="Key"
          value={selectedKey}
          onChange={onKeyChange}
          options={KEYS}
        />
        <CustomSelect
          label="Mode"
          value={selectedMode}
          onChange={onModeChange}
          options={MODES}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <div className="flex items-center justify-center pt-2">
        <label htmlFor="tensions-toggle" className="flex items-center cursor-pointer select-none group">
          <span className="mr-4 text-text/80 group-hover:text-text transition-colors font-semibold">Tension Chords</span>
          <div className="relative">
             <input
              id="tensions-toggle"
              type="checkbox"
              className="sr-only peer"
              checked={includeTensions}
              onChange={(e) => onTensionsChange(e.target.checked)}
            />
            <div className="w-12 h-6 bg-text/20 rounded-full shadow-inner peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 peer-focus:ring-offset-surface transition-all"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-background rounded-full shadow-md transition-transform peer-checked:translate-x-6 peer-checked:bg-primary peer-checked:shadow-primary/50 peer-checked:shadow-lg"></div>
          </div>
        </label>
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
  );
};