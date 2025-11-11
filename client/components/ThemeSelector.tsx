
import React, { useState, useRef, useEffect } from 'react';
import type { ThemeOption } from '@/constants';

interface ThemeSelectorProps {
  themes: ThemeOption[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ themes, selectedIndex, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const currentTheme = themes[selectedIndex];

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Total animation time: 0.12s base + (11 themes * 0.02s) = ~0.34s, using 300ms to be safe
  };

  const handleSelect = (index: number) => {
    onSelect(index);
    handleClose();
  };

  const handleToggle = () => {
    if (isOpen && !isClosing) {
      handleClose();
    } else if (!isOpen) {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        if (isOpen && !isClosing) {
          handleClose();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isClosing]);

  return (
    <div className="relative flex items-center" ref={selectRef}>
      {/* Theme dots grid - responsive wrapping for mobile */}
      <div className="flex flex-row-reverse flex-wrap items-center gap-1.5 sm:gap-2 overflow-visible max-w-[280px] sm:max-w-none">
        {(isOpen || isClosing) && themes.map((theme, index) => {
          // Opening: cascade right to left (index 0, 1, 2...)
          // Closing: cascade left to right (reverse order for mirror effect)
          const delay = isClosing ? (themes.length - 1 - index) * 0.02 : index * 0.02;
          
          return (
          <div
            key={theme.name}
            className="relative"
            style={{
              animation: `${isClosing ? 'slideOutToLeft' : 'slideInFromRight'} 0.12s ease-out forwards`,
              animationDelay: `${delay}s`,
              opacity: isClosing ? 1 : 0,
            }}
            onMouseEnter={() => !isClosing && setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Tooltip with theme name - positioned above on mobile, below on desktop */}
            {hoveredIndex === index && !isClosing && (
              <div
                className="absolute bottom-full mb-2 sm:bottom-auto sm:top-full sm:mb-0 sm:mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-surface text-text text-xs rounded shadow-lg border border-border whitespace-nowrap z-20 pointer-events-none"
                style={{
                  animation: 'fadeIn 0.08s ease-out',
                }}
              >
                {theme.name}
              </div>
            )}
            
            {/* Color dot - responsive sizing */}
            <button
              onClick={() => handleSelect(index)}
              disabled={isClosing}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background ${
                selectedIndex === index 
                  ? 'border-primary shadow-lg scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background' 
                  : 'border-border hover:border-primary'
              } ${isClosing ? 'cursor-default' : ''}`}
              style={{ 
                backgroundColor: `hsl(${theme.light.primary})`,
              }}
              aria-label={`Select ${theme.name} theme`}
            />
          </div>
          );
        })}
      </div>

      {/* Theme picker icon button */}
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2 p-2 rounded-full text-text/70 hover:bg-surface hover:text-text focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-all duration-300 ml-1.5 sm:ml-2"
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
        
        @keyframes slideOutToLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-20px);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-4px);
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
