import React from "react";

interface NoteDotProps {
  noteName: string;
  fret: number;
  isRoot: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  /** Dimmed dots for non-selected positions in All overlay mode */
  dimmed?: boolean;
}

export const NoteDot: React.FC<NoteDotProps> = React.memo(
  ({ noteName, fret, isRoot, isHovered, onMouseEnter, onMouseLeave, dimmed = false }) => {
    const rootClasses =
      "bg-primary text-background shadow-[0_0_10px_hsl(var(--color-primary)_/_0.5)] scale-110";
    const noteClasses = "bg-secondary text-background opacity-90";
    const dimmedClasses = "bg-text/25 text-text/70 border-text/20 opacity-50 scale-90";

    return (
      <button
        type="button"
        className="relative w-11 h-11 md:w-6 md:h-6 flex items-center justify-center transition-all duration-150 ease-in-out group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface focus:z-10 rounded-full"
        aria-label={`${noteName} note${fret > 0 ? ` at fret ${fret}` : " open string"}${isRoot ? " (root note)" : ""}${dimmed ? " (other position)" : ""}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onMouseEnter}
        onBlur={onMouseLeave}
      >
        <div
          className={`relative w-5 h-5 md:w-full md:h-full rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold border-2 border-surface transition-all duration-200 ${
            dimmed ? dimmedClasses : isRoot ? rootClasses : noteClasses
          } ${isHovered && !dimmed ? "scale-110 z-20" : ""}`}
        >
          {noteName}
        </div>

        <div
          className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-[120px] px-2 py-1 bg-surface text-text text-[10px] md:text-xs rounded-md shadow-lg border border-border transition-all duration-200 pointer-events-none z-30 ${isHovered ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-1"}`}
        >
          {noteName} {fret > 0 && `(${fret})`}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-surface"></div>
        </div>
      </button>
    );
  }
);
NoteDot.displayName = "NoteDot";

export default NoteDot;
