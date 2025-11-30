import React, { useRef } from 'react';

interface ColorPickerProps {
  color: string;
  setColor: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, setColor }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="w-6 h-6 rounded-full border-2 border-slate-400/50 dark:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-primary-50 dark:focus:ring-offset-slate-950"
        style={{ backgroundColor: color }}
        aria-label="Change theme color"
      ></button>
      <input
        ref={inputRef}
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
};