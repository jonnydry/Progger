import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { VoicingDiagram } from './VoicingDiagram';
import type { ChordInProgression, ProgressionResult } from '@/types';
import { ChordDetailView } from './ChordDetailView';
import { displayChordName } from '@/utils/musicTheory';
import { useSaveToStash } from '../hooks/useStash';

interface VoicingsGridProps {
  progression: ChordInProgression[];
  isLoading: boolean;
  skeletonCount?: number;
  musicalKey: string;
  currentMode?: string;
  progressionResult?: ProgressionResult | null;
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


const generateAutoName = (key: string, mode: string, progression: ChordInProgression[]): string => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  // Create chord progression string (limit to first 4 chords to keep it concise)
  const chordNames = progression.slice(0, 4).map(p => displayChordName(p.chordName, key));
  const progressionStr = chordNames.join(' - ');
  const suffix = progression.length > 4 ? '...' : '';

  return `${key} ${mode} - ${progressionStr}${suffix} - ${dateStr} ${timeStr}`;
};

export const VoicingsGrid: React.FC<VoicingsGridProps> = ({ progression, isLoading, skeletonCount = 4, musicalKey, currentMode, progressionResult }) => {
  const [voicingIndices, setVoicingIndices] = useState<number[]>([]);
  const [expandedChordIndex, setExpandedChordIndex] = useState<number | null>(null);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveName, setSaveName] = useState('');
  const saveToStash = useSaveToStash();

  useEffect(() => {
    // Reset indices when a new progression is loaded
    setVoicingIndices(new Array(progression.length).fill(0));
    setExpandedChordIndex(null);
    setShowSaveForm(false);
    setSaveName('');
  }, [progression]);

  const handleSave = async () => {
    if (!saveName.trim() || !progressionResult || !musicalKey || !currentMode) {
      return;
    }

    try {
      await saveToStash.mutateAsync({
        name: saveName.trim(),
        key: musicalKey,
        mode: currentMode,
        progressionData: progressionResult,
      });
      setSaveName('');
      setShowSaveForm(false);
    } catch (error) {
      console.error('Failed to save to stash:', error);
    }
  };

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

  const handleOpenSaveForm = useCallback(() => {
    if (progressionResult && musicalKey && currentMode) {
      const autoName = generateAutoName(musicalKey, currentMode, progressionResult.progression);
      setSaveName(autoName);
      setShowSaveForm(true);
    }
  }, [progressionResult, musicalKey, currentMode]);

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
    progression.map(p => displayChordName(p.chordName, musicalKey)).join(' - '),
    [progression, musicalKey]
  );

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="text-center bg-surface p-4 rounded-lg shadow-md border border-border">
        <div className="flex items-center justify-center gap-4 mb-1">
          <h2 className="font-bebas text-3xl font-semibold text-text/80 tracking-wide">
            Generated Progression
          </h2>
          {progressionResult && currentMode && (
            <button
              onClick={handleOpenSaveForm}
              className="p-2 rounded-full bg-primary/90 hover:bg-primary text-background transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
              title="Save to Stash"
              aria-label="Save progression to stash"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
            </button>
          )}
        </div>
        <p className="text-3xl tracking-wider text-text">
            {progressionText}
        </p>
        {showSaveForm && (
          <div className="mt-4 space-y-3 max-w-md mx-auto">
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Enter a name for this progression..."
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
              onFocus={(e) => e.target.select()}
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={!saveName.trim() || saveToStash.isPending}
                className="flex-1 py-2 px-4 rounded-lg bg-primary/90 hover:bg-primary text-background font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {saveToStash.isPending ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setShowSaveForm(false);
                  setSaveName('');
                }}
                className="flex-1 py-2 px-4 rounded-lg bg-surface/50 hover:bg-surface text-text font-medium transition-all duration-300 border border-border"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 justify-items-center w-full max-w-5xl">
        {progression.map((chord, index) => {
          const currentVoicingIndex = voicingIndices[index] ?? 0;
          const currentVoicing = chord.voicings[currentVoicingIndex];
          
          if (!currentVoicing) return null;

          const displayedChordName = displayChordName(chord.chordName, musicalKey);
          
          return (
            <div key={`${chord.chordName}-${index}`} className="flex flex-col items-center gap-4">
              <div
                onClick={() => handleChordClick(index)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleChordClick(index); } }}
                tabIndex={0}
                role="button"
                className={`cursor-pointer rounded-xl transition-all duration-300 ${expandedChordIndex === index ? 'scale-105 shadow-primary/40 shadow-2xl ring-2 ring-primary ring-offset-4 ring-offset-background' : 'hover:scale-105 hover:shadow-xl'} focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-4 focus:ring-offset-background`}
                aria-label={`View details for ${displayedChordName}`}
                aria-expanded={expandedChordIndex === index}
              >
                <div key={currentVoicingIndex} className="animate-cross-fade-in">
                  <VoicingDiagram chordName={displayedChordName} voicing={currentVoicing} />
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
          musicalKey={musicalKey}
          onClose={() => setExpandedChordIndex(null)}
        />
      )}
    </div>
  );
};