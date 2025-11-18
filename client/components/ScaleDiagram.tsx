import React, { useState, useMemo, lazy, Suspense } from 'react';
import type { ScaleInfo } from '../types';
import { noteToValue as noteToValueBase, valueToNote, displayNote, STANDARD_TUNING_NAMES } from '../utils/musicTheory';
import { getScaleIntervals, getScaleFingering, SCALE_LIBRARY, normalizeScaleName } from '../utils/scaleLibrary';

const LazyScaleDiagramModal = lazy(() => import('./ScaleDiagramModal'));

interface ScaleDiagramProps {
  scaleInfo: ScaleInfo;
  musicalKey: string;
}

// Wrapper to return -1 for invalid notes (used as sentinel value in this component)
const noteToValue = (note: string): number => {
  const value = noteToValueBase(note, -1);
  return value;
};

/**
 * Calculate scale note values from root and scale name
 * Uses the centralized scale library for consistency
 */
const getScaleNotes = (rootNote: string, scaleName: string): number[] => {
  const rootValue = noteToValue(rootNote);
  if (rootValue === -1) {
    console.warn(`Invalid root note: ${rootNote}`);
    return [];
  }

  // Get intervals from the scale library (single source of truth)
  const intervals = getScaleIntervals(scaleName);

  if (intervals.length === 0) {
    console.warn(`No intervals found for scale: ${scaleName}`);
    return [];
  }

  // Apply intervals from root note
  return intervals.map(interval => (rootValue + interval) % 12);
};

const STANDARD_TUNING = STANDARD_TUNING_NAMES; // High to low
const FRET_COUNT_DESKTOP = 24;
const FRET_COUNT_MOBILE = 15;
const INLAY_FRETS = [3, 5, 7, 9, 15, 17, 19, 21] as const;
const DOUBLE_INLAY_FRETS = [12, 24] as const;

// String line heights (in pixels) - thicker strings are visually thicker
const STRING_HEIGHTS = [1, 1.4, 1.8, 2.2, 2.6, 3.0] as const;

export const SkeletonScaleDiagram: React.FC = () => (
    <div className="flex flex-col items-center animate-pulse w-full max-w-4xl mx-auto">
        <div className="h-6 w-1/3 bg-surface/80 rounded-md mb-3 self-start"></div>
        <div className="w-full h-32 bg-surface rounded-lg border border-border"></div>
    </div>
);

const FretInlay: React.FC<{ fret: number; fretCount: number }> = React.memo(({ fret, fretCount }) => {
    const left = `${((fret - 0.5) / fretCount) * 100}%`;
    const inlayClasses = "absolute w-2 h-2 rounded-full bg-text/5 dark:bg-text/10";
    if (DOUBLE_INLAY_FRETS.includes(fret)) {
        return <>
            <div className={inlayClasses} style={{ left, top: '33.33%', transform: 'translate(-50%, -50%)' }} />
            <div className={inlayClasses} style={{ left, top: '66.67%', transform: 'translate(-50%, -50%)' }} />
        </>
    }
    return <div className={inlayClasses} style={{ left, top: '50%', transform: 'translate(-50%, -50%)' }} />
});

const NoteDot: React.FC<{ noteName: string, fret: number, isRoot: boolean }> = React.memo(({ noteName, fret, isRoot }) => {
    const rootClasses = "bg-secondary text-background";
    const noteClasses = "bg-primary text-background";

    return (
        <button 
            type="button" 
            className="relative w-11 h-11 md:w-6 md:h-6 flex items-center justify-center transition-transform duration-150 ease-in-out group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface focus:z-10 rounded-full"
            aria-label={`${noteName} note${fret > 0 ? ` at fret ${fret}` : ' open string'}${isRoot ? ' (root note)' : ''}`}
        >
            <div className={`relative w-5 h-5 md:w-full md:h-full rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold border-2 border-surface ${isRoot ? rootClasses : noteClasses}`}>
                {noteName}
            </div>
            {/* Tooltip - positioned dynamically to avoid overflow */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-[120px] px-2 py-1 bg-surface text-text text-[10px] md:text-xs rounded-md shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus:opacity-100 group-focus:visible transition-all duration-200 pointer-events-none z-20">
                {noteName} {fret > 0 && `(${fret})`}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-surface"></div>
            </div>
        </button>
    );
});

const ViewToggle: React.FC<{
  viewMode: 'pattern' | 'map';
  setViewMode: (mode: 'pattern' | 'map') => void;
}> = React.memo(({ viewMode, setViewMode }) => {
    return (
      <div className="flex items-center space-x-2 bg-text/10 p-1 rounded-md">
        <button
            onClick={() => setViewMode('pattern')}
            className={`px-3 py-1 text-sm font-semibold rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
              viewMode === 'pattern' ? 'bg-surface shadow' : 'text-text/60 hover:text-text'
            }`}
            aria-label="Pattern view"
            aria-pressed={viewMode === 'pattern'}
        >
            Pattern
        </button>
        <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 text-sm font-semibold rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
              viewMode === 'map' ? 'bg-surface shadow' : 'text-text/60 hover:text-text'
            }`}
            aria-label="Map view"
            aria-pressed={viewMode === 'map'}
        >
            Map
        </button>
      </div>
    );
});

const PositionSelector: React.FC<{
  positions: string[];
  currentPosition: number;
  setCurrentPosition: (position: number) => void;
}> = React.memo(({ positions, currentPosition, setCurrentPosition }) => {
  if (positions.length <= 1) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setCurrentPosition(Math.max(0, currentPosition - 1));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setCurrentPosition(Math.min(positions.length - 1, currentPosition + 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setCurrentPosition(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setCurrentPosition(positions.length - 1);
    }
  };

  return (
    <div className="flex items-center space-x-1 bg-text/10 p-1 rounded-md">
      <span className="text-sm text-text/70 px-2">Pos:</span>
      {positions.map((position, index) => (
        <button
          key={index}
          onClick={() => setCurrentPosition(index)}
          onKeyDown={handleKeyDown}
          className={`px-2 py-1 text-sm font-semibold rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
            currentPosition === index
              ? 'bg-secondary text-background shadow'
              : 'text-text/60 hover:text-text hover:bg-surface/50'
          }`}
          aria-label={`Position ${index + 1}`}
          aria-pressed={currentPosition === index}
          role="tab"
          tabIndex={currentPosition === index ? 0 : -1}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
});

const ScaleDiagram: React.FC<ScaleDiagramProps> = ({ scaleInfo, musicalKey }) => {
  const { name, rootNote, notes } = scaleInfo;
  const [viewMode, setViewMode] = useState<'pattern' | 'map'>('pattern');
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Detect mobile screen size
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fretCount = isMobile ? FRET_COUNT_MOBILE : FRET_COUNT_DESKTOP;

  const rootNoteValue = useMemo(() => noteToValue(rootNote), [rootNote]);
  const scaleNoteValues = useMemo(() => {
    const calculatedNotes = getScaleNotes(rootNote, name);
    if (calculatedNotes.length > 0) {
      return new Set(calculatedNotes);
    }
    return new Set(notes.map(noteToValue).filter(v => v !== -1));
  }, [rootNote, name, notes]);

  // Memoize visible inlay frets to avoid array operations on every render
  const visibleInlays = useMemo(() =>
    [...INLAY_FRETS, ...DOUBLE_INLAY_FRETS].filter(f => f <= fretCount),
    [fretCount]
  );

  // Memoize grid template columns to avoid string interpolation on every render
  const gridTemplateColumns = useMemo(() => 
    `${isMobile ? '1.5rem' : '1.75rem'} repeat(${fretCount}, minmax(0, 1fr))`,
    [isMobile, fretCount]
  );

  // Get available positions for the current scale
  const availablePositions = useMemo(() => {
    // Use proper scale name normalization to match SCALE_LIBRARY keys
    const scaleKey = normalizeScaleName(name);
    const scaleData = SCALE_LIBRARY[scaleKey];
    return scaleData?.positions || ['Position 1'];
  }, [name]);

  // Calculate the best starting position for mobile devices
  // Prioritizes positions that fit within the 15-fret mobile display
  const bestMobilePosition = useMemo(() => {
    if (!isMobile) return 0;

    // Get all positions' fingerings and find their minimum fret
    const positionMinFrets = availablePositions.map((_, index) => {
      const fingering = getScaleFingering(name, rootNote, index);
      // Find the minimum fret across all strings
      const allFrets = fingering.flat();
      return allFrets.length > 0 ? Math.min(...allFrets) : 0;
    });

    // Find positions that fit within mobile range (0-15)
    const fitsInMobile = positionMinFrets.map((minFret, index) => {
      const fingering = getScaleFingering(name, rootNote, index);
      const maxFret = Math.max(...fingering.flat());
      return maxFret <= FRET_COUNT_MOBILE;
    });

    // Prefer the first position that fits completely in mobile view
    const firstFittingPosition = fitsInMobile.indexOf(true);
    if (firstFittingPosition !== -1) {
      return firstFittingPosition;
    }

    // If no position fits completely, choose the one with the lowest minimum fret
    const lowestMinFretIndex = positionMinFrets.indexOf(Math.min(...positionMinFrets));
    return lowestMinFretIndex;
  }, [isMobile, name, rootNote, availablePositions]);

  const [currentPosition, setCurrentPosition] = useState(() => bestMobilePosition ?? 0);

  // Update position when mobile state changes or when best position changes
  React.useEffect(() => {
    setCurrentPosition(bestMobilePosition ?? 0);
  }, [bestMobilePosition]);

  // Generate position-aware fingering
  const currentFingering = useMemo(() => {
    return getScaleFingering(name, rootNote, currentPosition);
  }, [name, rootNote, currentPosition]);

  // Memoize fingering lookup for pattern view - convert to Sets for O(1) lookups
  const fingeringLookup = useMemo(() => {
    return currentFingering.map(frets => new Set(frets ?? []));
  }, [currentFingering]);

  // Display scale name with context-aware root note
  const displayedScaleName = useMemo(() => {
    const displayRootNote = displayNote(rootNote, musicalKey);
    return name.replace(rootNote, displayRootNote);
  }, [name, rootNote, musicalKey]);

  return (
    <>
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
        <div className="w-full flex justify-between items-center mb-3 px-1">
            <h2 className="text-lg md:text-xl font-semibold text-text/90">{displayedScaleName}</h2>
            <div className="flex items-center space-x-2">
              <PositionSelector
                positions={availablePositions}
                currentPosition={currentPosition}
                setCurrentPosition={setCurrentPosition}
              />
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              {isMobile && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-2 rounded-md bg-text/10 hover:bg-text/20 text-text/70 hover:text-text transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  aria-label="Expand to full view"
                  title="View full fretboard"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              )}
            </div>
        </div>

      <div
        className={`w-full bg-surface rounded-lg shadow-lg border border-border overflow-x-auto overflow-y-hidden transition-all duration-300 group relative ${
          isMobile ? 'cursor-pointer hover:shadow-xl hover:border-primary/50' : ''
        }`}
        onClick={isMobile ? () => setIsModalOpen(true) : undefined}
        role={isMobile ? "button" : undefined}
        tabIndex={isMobile ? 0 : undefined}
        onKeyDown={isMobile ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsModalOpen(true);
          }
        } : undefined}
        aria-label={isMobile ? "Click to expand scale diagram" : undefined}
      >
        {/* Expand hint overlay - only shown on mobile */}
        {isMobile && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-primary/50">
              <p className="text-sm font-medium text-text/90 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Click to view full fretboard
              </p>
            </div>
          </div>
        )}

        <div className={`${isMobile ? 'min-w-[600px]' : 'w-full'} px-3 md:px-4 py-3 md:py-4 text-[10px] md:text-xs transition-all duration-300`}>
            {/* Main Fretboard Area with Fade Effect */}
            <div
                className="relative md:-mx-4 md:-my-4 md:px-4 md:py-4"
                style={{
                    background: 'linear-gradient(to bottom, hsl(var(--color-primary) / 0.03), hsl(var(--color-secondary) / 0.04), hsl(var(--color-primary) / 0.05))',
                    ...(isMobile ? {} : {
                        // Use WebKit prefixes for better browser support
                        // Standard mask-composite has limited support, so we rely on WebKit version
                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)',
                        WebkitMaskComposite: 'source-in',
                        // Fallback for browsers that support standard syntax
                        maskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)',
                    })
                }}
            >
                {/* Fret numbers row */}
                <div
                    className="grid relative z-20"
                    style={{ gridTemplateColumns }}
                >
                    <div />
                    {Array.from({ length: fretCount }, (_, idx) => idx + 1).map((fret) => (
                        <div key={`fret-num-${fret}`} className="text-center text-text/50 pb-1 h-4 md:h-5 flex items-center justify-center font-semibold text-[9px] md:text-[10px]">
                            {[3, 5, 7, 9, 12, 15, 17, 19, 21, 24].includes(fret) ? fret : ''}
                        </div>
                    ))}
                </div>
            
                {/* Strings and Notes */}
                <div className="relative mt-[-16px] md:mt-[-20px]">
                    {/* Fret Inlays */}
                    {visibleInlays.map(fret =>
                        <FretInlay key={`inlay-${fret}`} fret={fret} fretCount={fretCount} />
                    )}

                    {/* Strings */}
                    {STANDARD_TUNING.map((_, i) => (
                        <div key={`string-line-${i}`} className="absolute left-0 right-0 bg-gradient-to-r from-text/10 via-text/40 to-text/10" style={{ 
                            top: `${(i + 0.5) * (100 / 6)}%`, 
                            height: `${STRING_HEIGHTS[i]}px`,
                            transform: 'translateY(-50%)',
                        }} />
                    ))}
                    
                    {/* Note Grid */}
                    <div
                        className="relative grid z-10 transition-opacity duration-200"
                        style={{ gridTemplateColumns }}
                    >
                        {/* String rows */}
                        {STANDARD_TUNING.map((stringName, stringIndex) => {
                            // Check if open string (fret 0) has a note
                            const openStringNoteValue = noteToValue(stringName);
                            let hasOpenNote = false;
                            if (viewMode === 'pattern') {
                                hasOpenNote = fingeringLookup[5 - stringIndex]?.has(0) ?? false;
                            } else {
                                hasOpenNote = scaleNoteValues.has(openStringNoteValue);
                            }
                            const isOpenRoot = openStringNoteValue === rootNoteValue;
                            const displayedStringName = displayNote(stringName, musicalKey);
                            
                            return (
                                <React.Fragment key={`string-row-${stringIndex}`}>
                                    {/* String Name with optional open note */}
                                    <div className="flex items-center justify-center text-text/70 h-7 md:h-8 pr-1 font-bold relative text-[10px] md:text-xs">
                                        {hasOpenNote ? (
                                            <NoteDot noteName={displayedStringName} fret={0} isRoot={isOpenRoot} />
                                        ) : (
                                            displayedStringName
                                        )}
                                    </div>

                                    {/* Fret cells */}
                                    {Array.from({ length: fretCount }, (_, idx) => idx + 1).map((fret) => {
                                        const currentNoteValue = (noteToValue(stringName) + fret) % 12;
                                        
                                        let isNotePresent = false;
                                        if (viewMode === 'pattern') {
                                            isNotePresent = fingeringLookup[5 - stringIndex]?.has(fret) ?? false;
                                        } else {
                                            isNotePresent = scaleNoteValues.has(currentNoteValue);
                                        }

                                        let isRoot = false;
                                        let noteName = '';
                                        if (isNotePresent) {
                                            isRoot = currentNoteValue === rootNoteValue;
                                            const rawNoteName = valueToNote(currentNoteValue);
                                            noteName = displayNote(rawNoteName, musicalKey);
                                        }

                                        return (
                                            <div key={`fret-${stringIndex}-${fret}`} className="flex items-center justify-center relative h-7 md:h-8 group">
                                                {/* Fret wire */}
                                                {fret === 1 && <div className="absolute top-0 bottom-0 left-0 w-1 bg-text/50 shadow-md"></div>}
                                                {fret > 1 && <div className={`absolute top-0 bottom-0 left-0 w-px ${fret === 12 || fret === 24 ? 'bg-text/30' : 'bg-text/15'}`}></div>}
                                                
                                                {isNotePresent && <NoteDot noteName={noteName} fret={fret} isRoot={isRoot} />}
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>

    {/* Modal */}
    <Suspense fallback={null}>
      {isModalOpen && (
        <LazyScaleDiagramModal
          scaleInfo={scaleInfo}
          musicalKey={musicalKey}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Suspense>
  </>
  );
};

export default React.memo(ScaleDiagram);
export { ScaleDiagram };
