import React, { useMemo } from 'react';
import type { ChordVoicing } from '@/types';

interface VoicingDiagramProps {
  chordName: string;
  voicing: ChordVoicing;
  className?: string;
}

export const VoicingDiagram: React.FC<VoicingDiagramProps> = ({ chordName, voicing, className }) => {
  const { frets, firstFret = 1 } = voicing;

  const FRET_COUNT = 5;
  const STRING_COUNT = 6;
  const FRET_HEIGHT = 30;
  const STRING_WIDTH = 25;
  const DOT_RADIUS = 7;
  const PADDING = 20;
  const LEFT_MARGIN = 18;
  
  // String stroke widths - thicker strings (lower index) are visually thicker
  const STRING_STROKE_WIDTHS = [1.5, 1.4, 1.3, 1.2, 1.1, 1.0] as const;

  const width = LEFT_MARGIN + (STRING_COUNT - 1) * STRING_WIDTH + PADDING * 2;
  const height = FRET_COUNT * FRET_HEIGHT + PADDING * 2.5;

  const highestFret = useMemo(() =>
    Math.max(...frets.filter(f => typeof f === 'number').map(f => f as number)),
    [frets]
  );

  // Determine if this voicing uses relative positioning to firstFret (barre chords)
  // Barre chords (firstFret > 1) always use relative positioning where fret values
  // represent offsets from the barre position. Open chords never use relative positioning.
  const usesRelativeFormat = useMemo(() => {
    return firstFret > 1; // Barre chords always use relative positioning
  }, [firstFret]);

  const effectiveFirstFret = useMemo(() =>
    firstFret > 1 ? firstFret : (highestFret > FRET_COUNT ? highestFret - FRET_COUNT + 1 : 1),
    [firstFret, highestFret]
  );

  const containerClass = className !== undefined
    ? `flex flex-col items-center ${className}`
    : "flex flex-col items-center p-3 rounded-lg bg-surface border border-border shadow-md w-full max-w-[180px]";

  return (
    <div className={containerClass}>
      <h3 className="text-lg font-bold mb-3 text-text/90">{chordName}</h3>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="bg-transparent w-full h-auto"
        role="img"
        aria-label={`Guitar chord diagram for ${chordName}`}
      >
        {/* Fretboard number */}
        {effectiveFirstFret > 1 && (
          <text
            x={(LEFT_MARGIN + PADDING) / 2}
            y={PADDING + FRET_HEIGHT * 0.8}
            fontSize="11"
            fill="currentColor"
            className="text-text/70 font-semibold"
            textAnchor="middle"
          >
            {effectiveFirstFret}
          </text>
        )}

        {/* Frets (horizontal lines) */}
        {Array.from({ length: FRET_COUNT + 1 }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={LEFT_MARGIN + PADDING}
            y1={PADDING + i * FRET_HEIGHT}
            x2={LEFT_MARGIN + PADDING + (STRING_COUNT - 1) * STRING_WIDTH}
            y2={PADDING + i * FRET_HEIGHT}
            strokeWidth={i === 0 && effectiveFirstFret === 1 ? 3 : 1}
            className={i === 0 && effectiveFirstFret === 1 ? 'stroke-text/60' : 'stroke-text/20'}
          />
        ))}

        {/* Strings (vertical lines) */}
        {Array.from({ length: STRING_COUNT }).map((_, i) => (
          <line
            key={`string-${i}`}
            x1={LEFT_MARGIN + PADDING + i * STRING_WIDTH}
            y1={PADDING}
            x2={LEFT_MARGIN + PADDING + i * STRING_WIDTH}
            y2={PADDING + FRET_COUNT * FRET_HEIGHT}
            className="stroke-text/30"
            strokeWidth={STRING_STROKE_WIDTHS[i]}
          />
        ))}

        {/* Open/Muted string indicators */}
        {frets.map((fret, i) => {
          const cx = LEFT_MARGIN + PADDING + i * STRING_WIDTH;
          const cy = PADDING - 10;
          if (fret === 'x') {
            return (
              <text key={`indicator-x-${i}`} x={cx} y={cy + 4} fontSize="14" className="fill-text/50" textAnchor="middle">x</text>
            );
          }
          if (fret === 0) {
             return (
              <circle key={`indicator-o-${i}`} cx={cx} cy={cy} r={4} strokeWidth="1.5" className="stroke-text/70 fill-none" />
            );
          }
          return null;
        })}
        
        {/* Fingering dots */}
        {frets.map((fret, stringIndex) => {
          if (typeof fret !== 'number' || fret <= 0) return null;
          
          // Convert relative finger positions to absolute fret numbers if needed
          const absoluteFret = usesRelativeFormat ? fret + firstFret - 1 : fret;
          
          // Calculate which fret position on the diagram (1-5) this absolute fret should appear at
          const fretIndex = absoluteFret - effectiveFirstFret + 1;
          if (fretIndex < 1 || fretIndex > FRET_COUNT) return null;

          const cx = LEFT_MARGIN + PADDING + stringIndex * STRING_WIDTH;
          const cy = PADDING + (fretIndex * FRET_HEIGHT) - (FRET_HEIGHT / 2);

          return (
            <circle
                key={`dot-${stringIndex}-${fret}`}
                cx={cx}
                cy={cy}
                r={DOT_RADIUS}
                className="fill-primary stroke-background"
                strokeWidth="2"
              />
          );
        })}
      </svg>
    </div>
  );
};
