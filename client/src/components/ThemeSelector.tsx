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
    setIsOpen(false);
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
    <div className="relative flex items-center" ref={selectRef}>
      {/* Theme picker toggle */}
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
        <span className="hidden md:block text-xs">{currentTheme.name}</span>
      </button>

      {isOpen && (
        <>
          <div className="hidden lg:block absolute right-0 top-full mt-2 z-30 w-[min(80vw,38rem)] rounded-lg border border-border bg-surface/95 backdrop-blur-sm shadow-lg p-3 animate-fade-scale-in">
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <p className="text-xs font-semibold text-text/80">Theme Bubbles</p>
              <p className="text-[11px] text-text/60">Current: {currentTheme.name}</p>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
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
                    className={`h-7 w-7 rounded-full border transition-transform duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background ${
                      selectedIndex === index
                        ? "border-primary ring-2 ring-primary/50"
                        : "border-border hover:border-primary/70"
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

          <div className="lg:hidden absolute right-0 top-full mt-2 z-30 w-[min(96vw,24rem)] rounded-lg border border-border bg-surface/95 backdrop-blur-sm shadow-lg p-3 sm:p-4 animate-fade-scale-in">
            <div className="mb-2 sm:mb-3 flex items-baseline justify-between gap-3">
              <p className="text-xs sm:text-sm font-semibold text-text/80">Pick a palette</p>
              <p className="text-[11px] text-text/60">Current: {currentTheme.name}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
              {themes.map((theme, index) => (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => handleSelect(index)}
                  className={`flex min-h-[3rem] items-center gap-2 rounded-md border px-2 py-2 text-left transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary ${
                    selectedIndex === index
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/60 hover:bg-surface"
                  }`}
                  aria-label={`Select ${theme.name} theme`}
                  aria-pressed={selectedIndex === index}
                >
                  <span
                    className={`h-5 w-5 shrink-0 rounded-full border ${
                      selectedIndex === index ? "border-primary" : "border-border"
                    }`}
                    style={{
                      backgroundColor: `hsl(${theme.light.primary})`,
                    }}
                  />
                  <span className="min-w-0 text-xs leading-tight text-text">
                    <span className="block whitespace-normal break-words font-medium">
                      {theme.name}
                    </span>
                    <span className="block text-[10px] text-text/60">
                      {selectedIndex === index ? "Selected" : "Apply"}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
