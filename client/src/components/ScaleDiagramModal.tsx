import React, { useState, useMemo } from 'react';
import type { ScaleInfo } from '../types';
import { noteToValue as noteToValueBase, valueToNote, displayNote, STANDARD_TUNING_NAMES } from '../utils/musicTheory';
import { getScaleIntervals, getScaleFingering, SCALE_LIBRARY, normalizeScaleName } from '../utils/scaleLibrary';
import NoteDot from './NoteDot';
import { PixelCard } from './PixelCard';

interface ScaleDiagramModalProps {
  scaleInfo: ScaleInfo;
  musicalKey: string;
  isOpen: boolean;
  onClose: () => void;
}

// Wrapper to return -1 for invalid notes (used as sentinel value in this component)
const noteToValue = (note: string): number => {
  const value = noteToValueBase(note, -1);
  return value;
};

/**
 * Calculate scale note values from root and scale name
 */
const getScaleNotes = (rootNote: string, scaleName: string): number[] => {
  const rootValue = noteToValue(rootNote);
  if (rootValue === -1) {
    return [];
  }

  const intervals = getScaleIntervals(scaleName);
  if (intervals.length === 0) {
    return [];
  }

  return intervals.map(interval => (rootValue + interval) % 12);
};

const STANDARD_TUNING = STANDARD_TUNING_NAMES;
const FRET_COUNT = 24; // Always show full 24 frets in modal
const INLAY_FRETS = [3, 5, 7, 9, 15, 17, 19, 21] as const;
const DOUBLE_INLAY_FRETS = [12, 24] as const;

// String line heights (in pixels) - thicker strings are visually thicker
const STRING_HEIGHTS = [1, 1.4, 1.8, 2.2, 2.6, 3.0] as const;

const FretInlay: React.FC<{ fret: number }> = React.memo(({ fret }) => {
  const left = `${((fret - 0.5) / FRET_COUNT) * 100}%`;
  const inlayClasses = "absolute w-2 h-2 rounded-full bg-text/5 dark:bg-text/10";
  if (DOUBLE_INLAY_FRETS.includes(fret)) {
    return <>
      <div className={inlayClasses} style={{ left, top: '33.33%', transform: 'translate(-50%, -50%)' }} />
      <div className={inlayClasses} style={{ left, top: '66.67%', transform: 'translate(-50%, -50%)' }} />
    </>
  }
  return <div className={inlayClasses} style={{ left, top: '50%', transform: 'translate(-50%, -50%)' }} />
});



const ViewToggle: React.FC<{
  viewMode: 'pattern' | 'map';
  setViewMode: (mode: 'pattern' | 'map') => void;
}> = React.memo(({ viewMode, setViewMode }) => {
  return (
    <div className="flex items-center space-x-2 bg-text/10 p-1 rounded-md">
      <button
        onClick={() => setViewMode('pattern')}
        className={`px-3 py-1 text-sm font-semibold rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${viewMode === 'pattern' ? 'bg-surface shadow' : 'text-text/60 hover:text-text'
          }`}
        aria-label="Pattern view"
        aria-pressed={viewMode === 'pattern'}
      >
        Pattern
      </button>
      <button
        onClick={() => setViewMode('map')}
        className={`px-3 py-1 text-sm font-semibold rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${viewMode === 'map' ? 'bg-surface shadow' : 'text-text/60 hover:text-text'
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
          className={`px-2 py-1 text-sm font-semibold rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${currentPosition === index
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

const ScaleDiagramModal: React.FC<ScaleDiagramModalProps> = ({ scaleInfo, musicalKey, isOpen, onClose }) => {
  const { name, rootNote, notes } = scaleInfo;
  const [viewMode, setViewMode] = useState<'pattern' | 'map'>('pattern');
  const [currentPosition, setCurrentPosition] = useState(0);
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);

  const rootNoteValue = useMemo(() => noteToValue(rootNote), [rootNote]);
  const scaleNoteValues = useMemo(() => {
    const calculatedNotes = getScaleNotes(rootNote, name);
    if (calculatedNotes.length > 0) {
      return new Set(calculatedNotes);
    }
    return new Set(notes.map(noteToValue).filter(v => v !== -1));
  }, [rootNote, name, notes]);

  // Generate position-aware fingering
  const currentFingering = useMemo(() => {
    return getScaleFingering(name, rootNote, currentPosition);
  }, [name, rootNote, currentPosition]);

  // Memoize fingering lookup for pattern view
  const fingeringLookup = useMemo(() => {
    return currentFingering.map(frets => new Set(frets ?? []));
  }, [currentFingering]);

  // Get available positions
  const availablePositions = useMemo(() => {
    // Use centralized normalization to avoid mismatching composite scales
    // (e.g., "Harmonic Minor" should not match "Minor")
    const scaleKey = normalizeScaleName(name);
    const scaleData = SCALE_LIBRARY[scaleKey];
    return scaleData?.positions || ['Position 1'];
  }, [name]);

  // Display scale name
  const displayedScaleName = useMemo(() => {
    const displayRootNote = displayNote(rootNote, musicalKey);
    return name.replace(rootNote, displayRootNote);
  }, [name, rootNote, musicalKey]);

  const visibleInlays = useMemo(() => [...INLAY_FRETS, ...DOUBLE_INLAY_FRETS], []);

  // Memoize grid template columns to avoid string interpolation on every render
  const gridTemplateColumns = useMemo(() =>
    `1.75rem repeat(${FRET_COUNT}, minmax(0, 1fr))`,
    []
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <PixelCard
        noAnimate
        className="w-[95vw] max-w-7xl max-h-[90vh] !p-0 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-background/50">
          <h2 className="text-xl md:text-2xl font-semibold text-text/90">{displayedScaleName}</h2>
          <div className="flex items-center space-x-3">
            <PositionSelector
              positions={availablePositions}
              currentPosition={currentPosition}
              setCurrentPosition={setCurrentPosition}
            />
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-background text-text/70 hover:text-text transition-colors duration-200"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable fretboard */}
        <div className="overflow-auto p-6">
          <div className="min-w-[800px] w-full">
            {/* Main Fretboard Area */}
            <div
              className="relative px-4 py-4"
              style={{
                background: 'linear-gradient(to bottom, hsl(var(--color-primary) / 0.03), hsl(var(--color-secondary) / 0.04), hsl(var(--color-primary) / 0.05))',
              }}
            >
              {/* Fret numbers row */}
              <div
                className="grid relative z-20"
                style={{ gridTemplateColumns }}
              >
                <div />
                {Array.from({ length: FRET_COUNT }, (_, idx) => idx + 1).map((fret) => (
                  <div key={`fret-num-${fret}`} className="text-center text-text/50 pb-1 h-5 flex items-center justify-center font-semibold text-[10px]">
                    {[3, 5, 7, 9, 12, 15, 17, 19, 21, 24].includes(fret) ? fret : ''}
                  </div>
                ))}
              </div>

              {/* Strings and Notes */}
              <div className="relative mt-[-20px]">
                {/* Fret Inlays */}
                {visibleInlays.map(fret =>
                  <FretInlay key={`inlay-${fret}`} fret={fret} />
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
                        <div className="flex items-center justify-center text-text/70 h-8 pr-1 font-bold relative text-xs">
                          {hasOpenNote ? (
                            <NoteDot
                              noteName={displayedStringName}
                              fret={0}
                              isRoot={isOpenRoot}
                              isHovered={hoveredNoteId === `note-0-${stringIndex}`}
                              onMouseEnter={() => setHoveredNoteId(`note-0-${stringIndex}`)}
                              onMouseLeave={() => setHoveredNoteId(null)}
                            />
                          ) : (
                            displayedStringName
                          )}
                        </div>

                        {/* Fret cells */}
                        {Array.from({ length: FRET_COUNT }, (_, idx) => idx + 1).map((fret) => {
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
                            <div key={`fret-${stringIndex}-${fret}`} className="flex items-center justify-center relative h-8 group">
                              {/* Fret wire */}
                              {fret === 1 && <div className="absolute top-0 bottom-0 left-0 w-1 bg-text/50 shadow-md"></div>}
                              {fret > 1 && <div className={`absolute top-0 bottom-0 left-0 w-px ${fret === 12 || fret === 24 ? 'bg-text/30' : 'bg-text/15'}`}></div>}

                              {isNotePresent && (
                                <NoteDot
                                  noteName={noteName}
                                  fret={fret}
                                  isRoot={isRoot}
                                  isHovered={hoveredNoteId === `note-${fret}-${stringIndex}`}
                                  onMouseEnter={() => setHoveredNoteId(`note-${fret}-${stringIndex}`)}
                                  onMouseLeave={() => setHoveredNoteId(null)}
                                />
                              )}
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
      </PixelCard>
    </div>
  );
};

export default React.memo(ScaleDiagramModal);

