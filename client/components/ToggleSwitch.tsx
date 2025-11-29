import React from 'react';

interface ToggleSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  tooltip?: string;
}

/**
 * Reusable toggle switch component with optional tooltip
 *
 * Features:
 * - Accessible with sr-only checkbox and proper ARIA labels
 * - Smooth animations and focus states
 * - Optional tooltip on hover/focus
 * - Consistent styling across the app
 */
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  label,
  checked,
  onChange,
  tooltip,
}) => {
  return (
    <label htmlFor={id} className="flex items-center cursor-pointer select-none group relative">
      <span className="mr-2 md:mr-4 text-text/80 group-hover:text-text transition-colors font-semibold">
        {label}
      </span>
      <div className={`relative ${tooltip ? 'group/tooltip' : ''}`}>
        <input
          id={id}
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-describedby={tooltip ? `${id}-tooltip` : undefined}
        />
        <div className="w-12 h-6 bg-text/20 border-2 border-text/40 shadow-inner peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 peer-focus:ring-offset-surface transition-all"></div>
        <div className="absolute left-1 top-1 w-4 h-4 bg-background border-2 border-text/80 shadow-md transition-transform steps(4) peer-checked:translate-x-6 peer-checked:bg-primary peer-checked:shadow-primary/50 peer-checked:shadow-lg"></div>

        {/* Optional Tooltip */}
        {tooltip && (
          <div
            id={`${id}-tooltip`}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-surface text-text text-xs rounded-lg shadow-lg border border-border opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible group-focus-within/tooltip:opacity-100 group-focus-within/tooltip:visible transition-all duration-200 pointer-events-none z-50 max-w-xs text-center"
          >
            {tooltip}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-surface"></div>
          </div>
        )}
      </div>
    </label>
  );
};
