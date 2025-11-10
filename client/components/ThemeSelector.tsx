
import React, { useState, useRef, useEffect } from 'react';
import type { ThemeOption } from '@/constants';

interface ThemeSelectorProps {
  themes: ThemeOption[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ themes, selectedIndex, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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
    <div className="relative flex items-center" ref={selectRef}>
      {/* Horizontal theme dots - expand from right to left */}
      <div className="flex flex-row-reverse items-center gap-2 overflow-visible">
        {isOpen && themes.map((theme, index) => (
          <div
            key={theme.name}
            className="relative"
            style={{
              animation: `slideInFromRight 0.3s ease-out forwards`,
              animationDelay: `${index * 0.05}s`,
              opacity: 0,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Tooltip with theme name */}
            {hoveredIndex === index && (
              <div
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-surface text-text text-xs rounded shadow-lg border border-border whitespace-nowrap z-20 pointer-events-none"
                style={{
                  animation: 'fadeIn 0.15s ease-out',
                }}
              >
                {theme.name}
              </div>
            )}
            
            {/* Color dot */}
            <button
              onClick={() => handleSelect(index)}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background ${
                selectedIndex === index 
                  ? 'border-primary shadow-lg scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background' 
                  : 'border-border hover:border-primary'
              }`}
              style={{ 
                backgroundColor: `hsl(${theme.light.primary})`,
              }}
              aria-label={`Select ${theme.name} theme`}
            />
          </div>
        ))}
      </div>

      {/* Theme picker icon button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full text-text/70 hover:bg-surface hover:text-text focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-all duration-300 ml-2"
        aria-label={`Change theme color. Current is ${currentTheme.name}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>

      {/* CSS animations */}
      <style>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
