import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { MODES, type ModeOption } from '@/constants';

interface ModeSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Mode selection dropdown with basic and advanced modes
 *
 * Features:
 * - Basic modes (Major/Minor) always visible
 * - Advanced modes (modal scales) behind toggle
 * - Grouped by scale family (major/minor/diminished)
 * - Portal-based dropdown for proper z-index layering
 * - Auto-scrolling and position updates
 */
export const ModeSelect: React.FC<ModeSelectProps> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Check if click is outside both the select button and the dropdown menu
      if (
        selectRef.current && !selectRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
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

  // Update dropdown position when opening or scrolling
  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    if (isOpen) {
      updatePosition();
      // Update position on scroll
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  return (
    <div className="flex flex-col" ref={selectRef}>
      <label htmlFor={label} className="mb-2 text-sm font-semibold text-text/70">
        {label}
      </label>
      <button
        ref={buttonRef}
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

      {isOpen && createPortal(
        <ul
          ref={dropdownRef}
          className="fixed z-50 bg-surface rounded-md shadow-lg border border-border max-h-80 overflow-y-auto"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
          }}
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
        </ul>,
        document.body
      )}
    </div>
  );
};
