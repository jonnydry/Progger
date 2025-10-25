import React, { useState, useMemo } from 'react';
import type { ScaleInfo } from '@/types';

interface ScaleDiagramProps {
  scaleInfo: ScaleInfo;
}

const ALL_NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const ALL_NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const noteToValue = (note: string): number => {
  if (!note || note.length === 0) return -1;
  const normalizedNote = note.charAt(0).toUpperCase() + note.slice(1).toLowerCase();
  let index = ALL_NOTES_SHARP.indexOf(normalizedNote);
  if (index !== -1) return index;
  index = ALL_NOTES_FLAT.indexOf(normalizedNote);
  return index;
};

const valueToNote = (value: number): string => ALL_NOTES_SHARP[value % 12];

const SCALE_PATTERNS: Record<string, number[]> = {
  'harmonic minor': [0, 2, 3, 5, 7, 8, 11],
  'melodic minor': [0, 2, 3, 5, 7, 9, 11],
  'pentatonic major': [0, 2, 4, 7, 9],
  'pentatonic minor': [0, 3, 5, 7, 10],
  'blues': [0, 3, 5, 6, 7, 10],
  'ionian': [0, 2, 4, 5, 7, 9, 11],
  'dorian': [0, 2, 3, 5, 7, 9, 10],
  'phrygian': [0, 1, 3, 5, 7, 8, 10],
  'lydian': [0, 2, 4, 6, 7, 9, 11],
  'mixolydian': [0, 2, 4, 5, 7, 9, 10],
  'aeolian': [0, 2, 3, 5, 7, 8, 10],
  'locrian': [0, 1, 3, 5, 6, 8, 10],
  'major': [0, 2, 4, 5, 7, 9, 11],
  'minor': [0, 2, 3, 5, 7, 8, 10],
};

const getScaleNotes = (rootNote: string, scaleName: string): number[] => {
  const rootValue = noteToValue(rootNote);
  if (rootValue === -1) return [];

  const lowerName = scaleName.toLowerCase().trim();
  
  if (lowerName.includes('pentatonic')) {
    if (lowerName.includes('major')) {
      return SCALE_PATTERNS['pentatonic major'].map(interval => (rootValue + interval) % 12);
    } else if (lowerName.includes('minor')) {
      return SCALE_PATTERNS['pentatonic minor'].map(interval => (rootValue + interval) % 12);
    }
  }
  
  if (lowerName.includes('blues')) {
    return SCALE_PATTERNS['blues'].map(interval => (rootValue + interval) % 12);
  }
  
  if (lowerName.includes('harmonic') && lowerName.includes('minor')) {
    return SCALE_PATTERNS['harmonic minor'].map(interval => (rootValue + interval) % 12);
  }
  
  if (lowerName.includes('melodic') && lowerName.includes('minor')) {
    return SCALE_PATTERNS['melodic minor'].map(interval => (rootValue + interval) % 12);
  }
  
  for (const [pattern, intervals] of Object.entries(SCALE_PATTERNS)) {
    if (lowerName.includes(pattern)) {
      return intervals.map(interval => (rootValue + interval) % 12);
    }
  }
  
  return [];
};

const STANDARD_TUNING = ['E', 'B', 'G', 'D', 'A', 'E']; // High to low
const FRET_COUNT_DESKTOP = 17;
const FRET_COUNT_MOBILE = 12;
const INLAY_FRETS = [3, 5, 7, 9, 15];
const DOUBLE_INLAY_FRET = 12;

export const SkeletonScaleDiagram: React.FC = () => (
    <div className="flex flex-col items-center animate-pulse w-full max-w-5xl mx-auto">
        <div className="h-8 w-1/3 bg-surface/80 rounded-md mb-4 self-start"></div>
        <div className="w-full h-48 bg-surface rounded-lg border border-border"></div>
    </div>
);

const FretInlay: React.FC<{ fret: number; fretCount: number }> = React.memo(({ fret, fretCount }) => {
    const left = `${((fret - 0.5) / fretCount) * 100}%`;
    const inlayClasses = "absolute w-2.5 h-2.5 rounded-full bg-text/5 dark:bg-text/10";
    if (fret === DOUBLE_INLAY_FRET) {
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
        <button type="button" className="relative w-6 h-6 md:w-7 md:h-7 flex items-center justify-center transition-transform duration-150 ease-in-out group focus:outline-none focus:z-10">
            <div className={`relative w-full h-full rounded-full flex items-center justify-center text-[9px] md:text-xs font-bold border-2 border-surface ${isRoot ? rootClasses : noteClasses}`}>
                {noteName}
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-surface text-text text-[10px] md:text-xs rounded-md shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus:opacity-100 group-focus:visible transition-all duration-200 pointer-events-none z-20">
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
            className={`px-3 py-1 text-sm font-semibold rounded transition-colors duration-200 ${viewMode === 'pattern' ? 'bg-surface shadow' : 'text-text/60 hover:text-text'}`}
        >
            Pattern
        </button>
        <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 text-sm font-semibold rounded transition-colors duration-200 ${viewMode === 'map' ? 'bg-surface shadow' : 'text-text/60 hover:text-text'}`}
        >
            Map
        </button>
      </div>
    );
});

const ScaleDiagram: React.FC<ScaleDiagramProps> = ({ scaleInfo }) => {
  const { name, rootNote, notes, fingering } = scaleInfo;
  const [viewMode, setViewMode] = useState<'pattern' | 'map'>('pattern');
  const [isMobile, setIsMobile] = useState(false);

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

  // Memoize fingering lookup for pattern view - convert to Sets for O(1) lookups
  const fingeringLookup = useMemo(() => {
    return fingering.map(frets => new Set(frets ?? []));
  }, [fingering]);

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto">
        <div className="w-full flex justify-between items-center mb-4 px-1">
            <h2 className="text-xl md:text-2xl font-semibold text-text/90">{name}</h2>
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      
      <div className="w-full bg-surface rounded-lg shadow-lg border border-border overflow-x-auto">
        <div className="min-w-[600px] md:min-w-[800px] px-4 md:px-6 py-4 md:py-5 text-[10px] md:text-xs">
            {/* Main Fretboard Area with Fade Effect */}
            <div 
                className="relative -mx-4 md:-mx-6 -my-4 md:-my-5 px-4 md:px-6 py-4 md:py-5"
                style={{
                    background: 'linear-gradient(to bottom, hsl(var(--color-primary) / 0.03), hsl(var(--color-secondary) / 0.04), hsl(var(--color-primary) / 0.05))',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)',
                    maskComposite: 'intersect',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)',
                    WebkitMaskComposite: 'source-in'
                }}
            >
                {/* Fret numbers row */}
                <div 
                    className="grid relative z-20"
                    style={{ gridTemplateColumns: `${isMobile ? '1.5rem' : '2rem'} repeat(${fretCount}, minmax(0, 1fr))` }}
                >
                    <div /> 
                    {Array.from({ length: fretCount }, (_, idx) => idx + 1).map((fret) => (
                        <div key={`fret-num-${fret}`} className="text-center text-text/50 pb-2 h-5 md:h-6 flex items-center justify-center font-semibold">
                            {[3, 5, 7, 9, 12, 15].includes(fret) ? fret : ''}
                        </div>
                    ))}
                </div>
            
                {/* Strings and Notes */}
                <div className="relative mt-[-20px] md:mt-[-24px]">
                    {/* Fret Inlays */}
                    {[...INLAY_FRETS, DOUBLE_INLAY_FRET].filter(f => f <= fretCount).map(fret => 
                        <FretInlay key={`inlay-${fret}`} fret={fret} fretCount={fretCount} />
                    )}

                    {/* Strings */}
                    {STANDARD_TUNING.map((_, i) => (
                        <div key={`string-line-${i}`} className="absolute left-0 right-0 bg-gradient-to-r from-text/10 via-text/40 to-text/10" style={{ 
                            top: `${(i + 0.5) * (100 / 6)}%`, 
                            height: `${1 + (i * 0.4)}px`,
                            transform: 'translateY(-50%)',
                        }} />
                    ))}
                    
                    {/* Note Grid */}
                    <div 
                        className="relative grid z-10"
                        style={{ gridTemplateColumns: `${isMobile ? '1.5rem' : '2rem'} repeat(${fretCount}, minmax(0, 1fr))` }}
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
                            
                            return (
                                <React.Fragment key={`string-row-${stringIndex}`}>
                                    {/* String Name with optional open note */}
                                    <div className="flex items-center justify-center text-text/70 h-8 md:h-10 pr-1 md:pr-2 font-bold relative text-[10px] md:text-xs">
                                        {hasOpenNote ? (
                                            <NoteDot noteName={stringName} fret={0} isRoot={isOpenRoot} />
                                        ) : (
                                            stringName
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
                                            noteName = valueToNote(currentNoteValue);
                                        }

                                        return (
                                            <div key={`fret-${stringIndex}-${fret}`} className="flex items-center justify-center relative h-8 md:h-10 group">
                                                {/* Fret wire */}
                                                {fret === 1 && <div className="absolute top-0 bottom-0 left-0 w-1 bg-text/50 shadow-md"></div>}
                                                {fret > 1 && <div className={`absolute top-0 bottom-0 left-0 w-px ${fret === 12 ? 'bg-text/30' : 'bg-text/15'}`}></div>}
                                                
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
  );
};

export default React.memo(ScaleDiagram);
