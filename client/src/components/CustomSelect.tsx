import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Z_INDEX } from "@/constants/zIndex";

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: (string | { name: string; value: string })[];
  disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
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
        selectRef.current &&
        !selectRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

      // Throttle scroll updates to once per frame (16ms) for better performance
      let rafId: number | null = null;
      const throttledUpdatePosition = () => {
        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            updatePosition();
            rafId = null;
          });
        }
      };

      // Update position on scroll and resize
      window.addEventListener("scroll", throttledUpdatePosition, true);
      window.addEventListener("resize", throttledUpdatePosition);

      return () => {
        window.removeEventListener("scroll", throttledUpdatePosition, true);
        window.removeEventListener("resize", throttledUpdatePosition);
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
      };
    }
  }, [isOpen]);

  const selectedOption = useMemo(
    () =>
      options.find(
        (opt) => (typeof opt === "string" ? opt : opt.value) === value,
      ),
    [options, value],
  );

  const displayValue = useMemo(
    () =>
      selectedOption
        ? typeof selectedOption === "string"
          ? selectedOption
          : selectedOption.name
        : value,
    [selectedOption, value],
  );

  return (
    <div className="flex flex-col" ref={selectRef}>
      <label
        htmlFor={label}
        className={`mb-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wide ${disabled ? "text-text/40" : "text-text/70"}`}
      >
        {label}
      </label>
      <button
        ref={buttonRef}
        id={label}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`relative min-h-[44px] text-left bg-background border-2 border-border rounded-md px-3 py-2.5 text-sm sm:text-base text-text focus:outline-none focus:ring-2 focus:ring-primary transition w-full flex justify-between items-center shadow-inner ${disabled ? "bg-text/5 text-text/50 cursor-not-allowed" : "hover:border-primary/50"}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        {displayValue}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-text/50 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen &&
        !disabled &&
        createPortal(
          <ul
            ref={dropdownRef}
            className="fixed bg-surface rounded-md shadow-lg border border-border max-h-72 overflow-y-auto text-sm sm:text-base"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              zIndex: Z_INDEX.dropdown,
            }}
            role="listbox"
          >
            {options.map((option) => {
              const optionValue =
                typeof option === "string" ? option : option.value;
              const optionName =
                typeof option === "string" ? option : option.name;
              const isSelected = value === optionValue;

              return (
                <li
                  key={optionValue}
                  onClick={() => handleSelect(optionValue)}
                  className={`px-3 py-2.5 cursor-pointer text-text hover:bg-primary/80 hover:text-background transition-colors ${isSelected ? "bg-primary text-background font-semibold" : ""}`}
                  role="option"
                  aria-selected={isSelected}
                >
                  {optionName}
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
};
