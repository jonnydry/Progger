import React from 'react';
import type { ChordVoicing } from '@/types';

interface VoicingDiagramProps {
  chordName: string;
  voicing: ChordVoicing;
}

export const VoicingDiagram: React.FC<VoicingDiagramProps> = ({ chordName, voicing }) => {
  const { frets, firstFret = 1 } = voicing;

  const FRET_COUNT = 5;
  const STRING_COUNT = 6;
  const FRET_HEIGHT = 30;
  const STRING_WIDTH = 25;
  const DOT_RADIUS = 7;
  const PADDING = 20;
  const LEFT_MARGIN = 18;

  const width = LEFT_MARGIN + (STRING_COUNT - 1) * STRING_WIDTH + PADDING * 2;
  const height = FRET_COUNT * FRET_HEIGHT + PADDING * 2.5;

  const highestFret = Math.max(...frets.filter(f => typeof f === 'number').map(f => f as number));
  const effectiveFirstFret = firstFret > 1 ? firstFret : (highestFret > FRET_COUNT ? highestFret - FRET_COUNT + 1 : 1);

  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-surface border border-border shadow-md w-full max-w-[180px]">
      <h3 className="text-lg font-bold mb-3 text-text/90">{chordName}</h3>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="bg-transparent"
      >
        {/* Fretboard number */}
        {effectiveFirstFret > 1 && (
          <text
            x={4}
            y={PADDING + FRET_HEIGHT * 0.8}
            fontSize="11"
            fill="currentColor"
            className="text-text/70 font-semibold"
            textAnchor="start"
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
            strokeWidth={1.5 - (i * 0.1)}
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
          
          const fretIndex = fret - (effectiveFirstFret > 1 ? effectiveFirstFret -1 : 0);
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