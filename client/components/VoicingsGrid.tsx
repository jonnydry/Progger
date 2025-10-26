import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { VoicingDiagram } from './VoicingDiagram';
import type { ChordInProgression } from '@/types';
import { ChordDetailView } from './ChordDetailView';

interface VoicingsGridProps {
  progression: ChordInProgression[];
  isLoading: boolean;
  skeletonCount?: number;
}

const SkeletonDiagram: React.FC = () => (
    <div className="flex flex-col items-center animate-pulse">
        <div className="h-7 w-24 bg-surface/80 rounded-md mb-3"></div>
        <div className="w-[180px] h-[202px] bg-surface rounded-lg border border-border"></div>
        <div className="h-8 w-20 bg-surface/80 rounded-full mt-4"></div>
    </div>
);

const ArrowButton: React.FC<{ direction: 'left' | 'right'; onClick: () => void }> = React.memo(({ direction, onClick }) => (
  <button
    onClick={onClick}
    className="p-1.5 rounded-full bg-surface hover:bg-background text-text/80 hover:text-text transition-all duration-200 shadow-sm hover:scale-110 border border-border active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      {direction === 'left' ? (
        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
      ) : (
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      )}
    </svg>
  </button>
));


export const VoicingsGrid: React.FC<VoicingsGridProps> = ({ progression, isLoading, skeletonCount = 4 }) => {
  const [voicingIndices, setVoicingIndices] = useState<number[]>([]);
  const [expandedChordIndex, setExpandedChordIndex] = useState<number | null>(null);

  useEffect(() => {
    // Reset indices when a new progression is loaded
    setVoicingIndices(new Array(progression.length).fill(0));
    setExpandedChordIndex(null);
  }, [progression]);

  const handleVoicingChange = useCallback((chordIndex: number, direction: 'next' | 'prev') => {
    const numVoicings = progression[chordIndex].voicings.length;
    setVoicingIndices(prev => {
      const newIndices = [...prev];
      const current = newIndices[chordIndex];
      if (direction === 'next') {
        newIndices[chordIndex] = (current + 1) % numVoicings;
      } else {
        newIndices[chordIndex] = (current - 1 + numVoicings) % numVoicings;
      }
      return newIndices;
    });
  }, [progression]);

  const handleChordClick = useCallback((index: number) => {
    setExpandedChordIndex(prev => (prev === index ? null : index));
  }, []);

  if (isLoading) {
      return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 justify-items-center mt-8">
            {Array.from({ length: skeletonCount }).map((_, i) => <SkeletonDiagram key={i} />)}
          </div>
      );
  }

  if (progression.length === 0) {
    return (
      <div className="text-center py-20 px-6 bg-surface rounded-lg border border-border max-w-3xl mx-auto shadow-lg flex flex-col items-center">
        <div className="relative mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text/30 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" />
            </svg>
        </div>
        <p className="text-xl font-semibold text-text">Your generated progression will appear here.</p>
        <p className="text-text/60">Select a key and mode, then click "Generate".</p>
      </div>
    );
  }

  const progressionText = useMemo(() =>
    progression.map(p => p.chordName).join(' - '),
    [progression]
  );

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="text-center bg-surface p-4 rounded-lg shadow-md border border-border">
        <h2 className="font-bebas text-3xl font-semibold text-text/80 tracking-wide mb-1">
          Generated Progression
        </h2>
        <p className="text-3xl tracking-wider text-text">
            {progressionText}
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 justify-items-center w-full max-w-5xl">
        {progression.map((chord, index) => {
          const currentVoicingIndex = voicingIndices[index] ?? 0;
          const currentVoicing = chord.voicings[currentVoicingIndex];
          
          if (!currentVoicing) return null;

          return (
            <div key={`${chord.chordName}-${index}`} className="flex flex-col items-center gap-4">
              <div
                onClick={() => handleChordClick(index)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleChordClick(index); } }}
                tabIndex={0}
                role="button"
                className={`cursor-pointer rounded-xl transition-all duration-300 ${expandedChordIndex === index ? 'scale-105 shadow-primary/40 shadow-2xl ring-2 ring-primary ring-offset-4 ring-offset-background' : 'hover:scale-105 hover:shadow-xl'} focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-4 focus:ring-offset-background`}
                aria-label={`View details for ${chord.chordName}`}
                aria-expanded={expandedChordIndex === index}
              >
                <div key={currentVoicingIndex} className="animate-cross-fade-in">
                  <VoicingDiagram chordName={chord.chordName} voicing={currentVoicing} />
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 w-full">
                <ArrowButton direction="left" onClick={() => handleVoicingChange(index, 'prev')} />
                <span className="text-sm text-text/80 w-12 text-center font-semibold tabular-nums">
                  {currentVoicingIndex + 1} / {chord.voicings.length}
                </span>
                <ArrowButton direction="right" onClick={() => handleVoicingChange(index, 'next')} />
              </div>
            </div>
          );
        })}
      </div>
      
      {expandedChordIndex !== null && progression[expandedChordIndex] && (
        <ChordDetailView
          chord={progression[expandedChordIndex]}
          onClose={() => setExpandedChordIndex(null)}
        />
      )}
    </div>
  );
};