import React, { useState, useRef, useEffect, useMemo } from 'react';
import { KEYS, MODES, CHORD_COUNTS, COMMON_PROGRESSIONS, ROOT_NOTES, CHORD_QUALITIES, type ModeOption } from '@/constants';
import { CustomSelect } from './CustomSelect';
import { WheelPicker } from './WheelPicker';

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
  // BYO mode props
  isBYOMode?: boolean;
  onBYOChange?: (enabled: boolean) => void;
  customProgression?: Array<{ root: string; quality: string }>;
  onCustomProgressionChange?: (progression: Array<{ root: string; quality: string }>) => void;
  numCustomChords?: number;
  onNumCustomChordsChange?: (count: number) => void;
  onAnalyzeCustom?: () => void;
}

const ModeSelect: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedMode = useMemo(() =>
    MODES.find(m => m.value === value),
    [value]
  );

  const displayValue = useMemo(() =>
    selectedMode ? selectedMode.name : value,
    [selectedMode, value]
  );

  // Separate basic and advanced modes
  const basicModes = useMemo(() => 
    MODES.filter(m => m.value === 'Major' || m.value === 'Minor'),
    []
  );

  const advancedModes = useMemo(() => {
    const groups: Record<string, ModeOption[]> = {
      major: [],
      minor: [],
      diminished: [],
    };
    MODES.forEach(mode => {
      if (mode.value !== 'Major' && mode.value !== 'Minor') {
        groups[mode.group].push(mode);
      }
    });
    return groups;
  }, []);

  const groupLabels: Record<string, string> = {
    major: 'Major Modes',
    minor: 'Minor Modes',
    diminished: 'Diminished',
  };

  // Check if current selection is an advanced mode
  const isAdvancedMode = useMemo(() => 
    value !== 'Major' && value !== 'Minor',
    [value]
  );

  // Auto-expand advanced when an advanced mode is selected
  useEffect(() => {
    if (isAdvancedMode && isOpen) {
      setShowAdvanced(true);
    }
  }, [isAdvancedMode, isOpen]);

  return (
    <div className="flex flex-col relative" ref={selectRef}>
      <label htmlFor={label} className="mb-2 text-sm font-semibold text-text/70">
        {label}
      </label>
      <button
        id={label}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-left bg-background border-2 border-border rounded-md px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary transition w-full flex justify-between items-center shadow-inner hover:border-primary/50"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {displayValue}
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-text/50 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul
          className="absolute z-20 mt-1 w-full top-full bg-surface rounded-md shadow-lg border border-border max-h-80 overflow-y-auto"
          role="listbox"
        >
          {/* Basic Modes - Always shown */}
          {basicModes.map((mode) => {
            const isSelected = value === mode.value;
            return (
              <li
                key={mode.value}
                onClick={() => handleSelect(mode.value)}
                className={`px-3 py-2.5 cursor-pointer text-text hover:bg-primary/80 hover:text-background transition-colors ${isSelected ? 'bg-primary text-background font-semibold' : ''}`}
                role="option"
                aria-selected={isSelected}
                title={mode.description}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{mode.name}</span>
                  <span className={`text-xs mt-0.5 ${isSelected ? 'text-background/80' : 'text-text/60'}`}>
                    {mode.description}
                  </span>
                </div>
              </li>
            );
          })}

          {/* Advanced Toggle */}
          <li className="border-t border-border/50">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAdvanced(!showAdvanced);
              }}
              className="w-full px-3 py-2.5 text-left text-sm font-semibold text-text/70 hover:text-text hover:bg-primary/80 hover:text-background transition-colors duration-200 flex items-center justify-between"
            >
              <span>Advanced Modes</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 text-text/50 transition-transform duration-200 ${showAdvanced ? 'transform rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </li>

          {/* Advanced Modes - Shown when toggled or if current selection is advanced */}
          {(showAdvanced || isAdvancedMode) && (['major', 'minor', 'diminished'] as const).map((groupKey) => {
            const groupModes = advancedModes[groupKey];
            if (groupModes.length === 0) return null;

            return (
              <React.Fragment key={groupKey}>
                <li className="px-3 py-2 text-xs font-bold text-text/50 uppercase tracking-wider bg-background/50 sticky top-0 z-10 border-b border-border/50">
                  {groupLabels[groupKey]}
                </li>
                {groupModes.map((mode) => {
                  const isSelected = value === mode.value;
                  return (
                    <li
                      key={mode.value}
                      onClick={() => handleSelect(mode.value)}
                      className={`px-3 py-2.5 cursor-pointer text-text hover:bg-primary/80 hover:text-background transition-colors ${isSelected ? 'bg-primary text-background font-semibold' : ''}`}
                      role="option"
                      aria-selected={isSelected}
                      title={mode.description}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{mode.name}</span>
                        <span className={`text-xs mt-0.5 ${isSelected ? 'text-background/80' : 'text-text/60'}`}>
                          {mode.description}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </React.Fragment>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const CustomProgressionInput: React.FC<{
  numChords: number;
  onNumChordsChange: (count: number) => void;
  customProgression: Array<{ root: string; quality: string }>;
  onCustomProgressionChange: (progression: Array<{ root: string; quality: string }>) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}> = ({ numChords, onNumChordsChange, customProgression, onCustomProgressionChange, onAnalyze, isLoading }) => {
  useEffect(() => {
    // Initialize or resize progression array when numChords changes
    const newProgression = [...customProgression];
    while (newProgression.length < numChords) {
      newProgression.push({ root: 'C', quality: 'major' });
    }
    while (newProgression.length > numChords) {
      newProgression.pop();
    }
    if (newProgression.length !== customProgression.length) {
      onCustomProgressionChange(newProgression);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numChords]);

  const handleChordChange = (index: number, field: 'root' | 'quality', value: string) => {
    const newProgression = [...customProgression];
    newProgression[index] = { ...newProgression[index], [field]: value };
    onCustomProgressionChange(newProgression);
  };

  const getChordDisplayName = (chord: { root: string; quality: string }) => {
    if (chord.quality === 'major') {
      return chord.root;
    }
    if (chord.quality === 'minor') {
      return `${chord.root}m`;
    }
    if (chord.quality === 'min7') {
      return `${chord.root}m7`;
    }
    if (chord.quality === 'maj7') {
      return `${chord.root}maj7`;
    }
    if (chord.quality === 'dim') {
      return `${chord.root}dim`;
    }
    if (chord.quality === 'aug') {
      return `${chord.root}aug`;
    }
    if (chord.quality === 'sus2') {
      return `${chord.root}sus2`;
    }
    if (chord.quality === 'sus4') {
      return `${chord.root}sus4`;
    }
    return `${chord.root}${chord.quality}`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="block text-center text-sm font-semibold text-text/70">
          Number of Chords
        </label>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {CHORD_COUNTS.map((count) => (
            <button
              key={count}
              onClick={() => onNumChordsChange(count)}
              className={`
                relative px-5 py-2.5 rounded-lg font-bold text-lg
                transition-all duration-300 ease-out
                border-2 shadow-md
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
          <div key={index} className="bg-background/50 rounded-lg p-4 border border-border">
            <div className="text-sm font-semibold text-text/70 mb-3">
              Chord {index + 1}: <span className="text-primary font-bold">{getChordDisplayName(chord)}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
          className="w-full relative bg-primary text-background font-bold py-3 px-4 rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out flex items-center justify-center border-b-4 border-primary/50 active:border-b-0 active:translate-y-1 shadow-lg hover:shadow-accent/40"
        >
          <span className="relative">
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
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
  isBYOMode = false,
  onBYOChange,
  customProgression = [],
  onCustomProgressionChange,
  numCustomChords = 4,
  onNumCustomChordsChange,
  onAnalyzeCustom,
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleBYOToggle = (enabled: boolean) => {
    if (onBYOChange) {
      setIsTransitioning(true);
      setTimeout(() => {
        onBYOChange(enabled);
        setTimeout(() => setIsTransitioning(false), 300);
      }, 50);
    }
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* Standard Controls */}
      <div 
        className={`space-y-6 transition-all duration-500 ease-in-out ${isBYOMode ? 'translate-x-[-100%] opacity-0 pointer-events-none absolute inset-0' : 'translate-x-0 opacity-100'}`}
      >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="flex items-center justify-center">
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
            
            <div className="flex items-center justify-center">
              {onBYOChange && (
                <label htmlFor="byo-toggle" className="flex items-center cursor-pointer select-none group">
                  <span className="mr-4 text-text/80 group-hover:text-text transition-colors font-semibold">BYO</span>
                  <div className="relative">
                     <input
                      id="byo-toggle"
                      type="checkbox"
                      className="sr-only peer"
                      checked={isBYOMode}
                      onChange={(e) => handleBYOToggle(e.target.checked)}
                    />
                    <div className="w-12 h-6 bg-text/20 rounded-full shadow-inner peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 peer-focus:ring-offset-surface transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-background rounded-full shadow-md transition-transform peer-checked:translate-x-6 peer-checked:bg-primary peer-checked:shadow-primary/50 peer-checked:shadow-lg"></div>
                  </div>
                </label>
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
          className={`space-y-6 transition-all duration-500 ease-in-out ${!isBYOMode ? 'translate-x-[100%] opacity-0 pointer-events-none absolute inset-0' : 'translate-x-0 opacity-100'}`}
        >
            <div className="flex items-center justify-center gap-6 pt-2">
              {onBYOChange && (
                <label htmlFor="byo-toggle-back" className="flex items-center cursor-pointer select-none group">
                  <span className="mr-4 text-text/80 group-hover:text-text transition-colors font-semibold">BYO</span>
                  <div className="relative">
                     <input
                      id="byo-toggle-back"
                      type="checkbox"
                      className="sr-only peer"
                      checked={isBYOMode}
                      onChange={(e) => handleBYOToggle(e.target.checked)}
                    />
                    <div className="w-12 h-6 bg-text/20 rounded-full shadow-inner peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 peer-focus:ring-offset-surface transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-background rounded-full shadow-md transition-transform peer-checked:translate-x-6 peer-checked:bg-primary peer-checked:shadow-primary/50 peer-checked:shadow-lg"></div>
                  </div>
                </label>
              )}
            </div>
            
            <CustomProgressionInput
              numChords={numCustomChords}
              onNumChordsChange={onNumCustomChordsChange}
              customProgression={customProgression}
              onCustomProgressionChange={onCustomProgressionChange}
              onAnalyze={onAnalyzeCustom}
              isLoading={isLoading}
            />
        </div>
      )}
    </div>
  );
};