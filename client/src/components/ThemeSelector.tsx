import React, { useState, useRef, useEffect } from "react";
import type { ThemeOption } from "@/constants";

interface ThemeSelectorProps {
  themes: ThemeOption[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  selectedIndex,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const currentTheme = themes[selectedIndex];

  const handleSelect = (index: number) => {
    onSelect(index);
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative flex items-center gap-1 sm:gap-2 overflow-visible" ref={selectRef}>
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2 p-1.5 sm:p-2 rounded-full text-text/70 hover:bg-surface hover:text-text focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-all duration-300"
        aria-label={`Change theme color. Current is ${currentTheme.name}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      </button>

      <span className="hidden md:block text-xs text-text/80 max-w-[11rem] truncate" title={currentTheme.name}>
        {currentTheme.name}
      </span>

      <div
        className={`flex items-center overflow-x-hidden overflow-y-visible transition-[max-width,opacity,margin] duration-200 ease-out ${
          isOpen
            ? "opacity-100 max-w-[7.5rem] sm:max-w-[9rem] md:max-w-[12rem] lg:max-w-[15rem] ml-1"
            : "opacity-0 max-w-0 ml-0"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto overflow-y-visible py-1 pr-1">
          {themes.map((theme, index) => (
            <div
              key={theme.name}
              className="relative shrink-0"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {hoveredIndex === index && (
                <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1 text-xs font-medium text-text shadow-lg z-20 pointer-events-none">
                  {theme.name}
                </div>
              )}

              <button
                type="button"
                onClick={() => handleSelect(index)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
                className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background ${
                  selectedIndex === index
                    ? "border-2 border-primary"
                    : "border border-border hover:border-primary/70"
                }`}
                style={{
                  backgroundColor: `hsl(${theme.light.primary})`,
                }}
                aria-label={`Select ${theme.name} theme`}
                aria-pressed={selectedIndex === index}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
