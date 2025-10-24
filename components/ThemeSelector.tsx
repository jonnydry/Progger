
import React, { useState, useRef, useEffect } from 'react';
import type { ThemeOption } from '../constants';

interface ThemeSelectorProps {
  themes: ThemeOption[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ themes, selectedIndex, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const currentTheme = themes[selectedIndex];

  const handleSelect = (index: number) => {
    onSelect(index);
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

  return (
    <div className="relative" ref={selectRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full text-text/70 hover:bg-surface hover:text-text focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-all duration-300"
        aria-label={`Change theme color. Current is ${currentTheme.name}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 right-0 mt-2 w-48 top-full bg-surface rounded-lg shadow-lg border border-border overflow-hidden"
          role="listbox"
        >
          {themes.map((theme, index) => (
            <li
              key={theme.name}
              onClick={() => handleSelect(index)}
              className={`px-3 py-2 cursor-pointer text-text hover:bg-primary/80 hover:text-background transition-colors flex items-center justify-between ${selectedIndex === index ? 'bg-primary text-background font-semibold' : ''}`}
              role="option"
              aria-selected={selectedIndex === index}
            >
              <span>{theme.name}</span>
               <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: `hsl(${theme.light.primary})` }}></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
