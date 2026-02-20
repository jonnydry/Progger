import React, { useMemo } from 'react';
import type { ChordVoicing } from '@/types';

interface VoicingPreviewProps {
  voicing: ChordVoicing | null;
  isLoading?: boolean;
}

/**
 * Compact fretboard preview component for live chord visualization
 * Optimized for smaller display within chord input cards
 */
export const VoicingPreview: React.FC<VoicingPreviewProps> = ({ voicing, isLoading = false }) => {
  const FRET_COUNT = 4;
  const STRING_COUNT = 6;
  const FRET_HEIGHT = 20;
  const STRING_WIDTH = 18;
  const DOT_RADIUS = 5;
  const PADDING = 12;
  const LEFT_MARGIN = 14;

  const width = LEFT_MARGIN + (STRING_COUNT - 1) * STRING_WIDTH + PADDING * 2;
  const height = FRET_COUNT * FRET_HEIGHT + PADDING * 2.5;

  const { frets, firstFret, effectiveFirstFret, usesRelativeFormat } = useMemo(() => {
    if (!voicing) {
      return {
        frets: [],
        firstFret: 1,
        effectiveFirstFret: 1,
        usesRelativeFormat: false,
      };
    }

    const f = voicing.frets;
    const ff = voicing.firstFret || 1;
    const hf = Math.max(...f.filter(fret => typeof fret === 'number').map(fret => fret as number), 0);
    const urf = ff > 1;
    const eff = ff > 1 ? ff : (hf > FRET_COUNT ? hf - FRET_COUNT + 1 : 1);

    return {
      frets: f,
      firstFret: ff,
      effectiveFirstFret: eff,
      usesRelativeFormat: urf,
    };
  }, [voicing]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-2 rounded-md bg-background/20 border border-border/30" style={{ height: height + 10 }}>
        <div className="animate-pulse text-text/40 text-xs">Loading...</div>
      </div>
    );
  }

  if (!voicing) {
    return (
      <div className="flex items-center justify-center p-2 rounded-md bg-background/20 border border-border/30" style={{ height: height + 10 }}>
        <div className="text-text/40 text-xs">No preview</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-2 rounded-md bg-background/30 border border-border/40">
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
            x={(LEFT_MARGIN + PADDING) / 2}
            y={PADDING + FRET_HEIGHT * 0.7}
            fontSize="9"
            fill="currentColor"
            className="text-text/60 font-semibold"
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
            strokeWidth={i === 0 && effectiveFirstFret === 1 ? 2.5 : 1}
            className={i === 0 && effectiveFirstFret === 1 ? 'stroke-text/50' : 'stroke-text/15'}
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
            className="stroke-text/25"
            strokeWidth={1.3 - (i * 0.08)}
          />
        ))}

        {/* Open/Muted string indicators */}
        {frets.map((fret, i) => {
          const cx = LEFT_MARGIN + PADDING + i * STRING_WIDTH;
          const cy = PADDING - 8;
          if (fret === 'x') {
            return (
              <text key={`indicator-x-${i}`} x={cx} y={cy + 3} fontSize="11" className="fill-text/40" textAnchor="middle">x</text>
            );
          }
          if (fret === 0) {
            return (
              <circle key={`indicator-o-${i}`} cx={cx} cy={cy} r={3} strokeWidth="1.2" className="stroke-text/60 fill-none" />
            );
          }
          return null;
        })}

        {/* Fingering dots */}
        {frets.map((fret, stringIndex) => {
          if (typeof fret !== 'number' || fret <= 0) return null;

          // Convert relative finger positions to absolute fret numbers if needed
          const absoluteFret = usesRelativeFormat ? fret + firstFret - 1 : fret;

          // Calculate which fret position on the diagram (1-4) this absolute fret should appear at
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
              strokeWidth="1.5"
            />
          );
        })}
      </svg>

      {/* Position info */}
      {voicing.position && (
        <div className="text-[10px] text-text/50 mt-1">
          {voicing.position}
        </div>
      )}
    </div>
  );
};
