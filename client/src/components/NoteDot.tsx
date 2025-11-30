import React from 'react';

interface NoteDotProps {
    noteName: string;
    fret: number;
    isRoot: boolean;
    isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export const NoteDot: React.FC<NoteDotProps> = React.memo(({
    noteName,
    fret,
    isRoot,
    isHovered,
    onMouseEnter,
    onMouseLeave
}) => {
    // Swapped colors: Root gets Primary (Vibrant), Others get Secondary (Less vibrant)
    const rootClasses = "bg-primary text-background shadow-[0_0_10px_rgba(var(--color-primary),0.5)] scale-110";
    const noteClasses = "bg-secondary text-background opacity-90";

    return (
        <button
            type="button"
            className="relative w-11 h-11 md:w-6 md:h-6 flex items-center justify-center transition-all duration-150 ease-in-out group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface focus:z-10 rounded-full"
            aria-label={`${noteName} note${fret > 0 ? ` at fret ${fret}` : ' open string'}${isRoot ? ' (root note)' : ''}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onFocus={onMouseEnter}
            onBlur={onMouseLeave}
        >
            <div className={`relative w-5 h-5 md:w-full md:h-full rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold border-2 border-surface transition-all duration-200 ${isRoot ? rootClasses : noteClasses} ${isHovered ? 'scale-110 z-20' : ''}`}>
                {noteName}
            </div>

            {/* Tooltip - Controlled by isHovered prop */}
            <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-[120px] px-2 py-1 bg-surface text-text text-[10px] md:text-xs rounded-md shadow-lg border border-border transition-all duration-200 pointer-events-none z-30 ${isHovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-1'}`}>
                {noteName} {fret > 0 && `(${fret})`}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-surface"></div>
            </div>
        </button>
    );
});

export default NoteDot;
