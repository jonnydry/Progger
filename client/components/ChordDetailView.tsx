import React from 'react';
import type { ChordInProgression } from '@/types';
import { VoicingDiagram } from './VoicingDiagram';

interface ChordDetailViewProps {
  chord: ChordInProgression;
  onClose: () => void;
}

export const ChordDetailView: React.FC<ChordDetailViewProps> = ({ chord, onClose }) => {
  return (
    <div className="mt-8 max-w-5xl mx-auto w-full animate-slide-in">
      <div className="bg-surface rounded-lg p-6 shadow-2xl border border-border relative">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bebas tracking-wider text-text/90">{chord.chordName}</h2>
            <div className="flex items-center flex-wrap gap-3 mt-2 text-text/70">
              <span className="bg-primary/20 text-primary font-semibold px-2 py-1 rounded-md text-sm">{chord.relationToKey}</span>
              <span className="font-semibold italic">{chord.musicalFunction}</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close details"
            className="p-2 rounded-full text-text/60 hover:bg-background hover:text-text transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <h3 className="text-lg font-semibold text-text/80 border-t border-border pt-4">Alternative Voicings</h3>
        <div className="mt-4 flex flex-row flex-wrap gap-4 justify-start">
          {chord.voicings.map((voicing, index) => {
            // Create stable key from voicing data
            const voicingKey = `${chord.chordName}-${voicing.position}-${voicing.frets.join('-')}`;
            return <VoicingDiagram key={voicingKey} chordName={chord.chordName} voicing={voicing} />;
          })}
        </div>
      </div>
    </div>
  );
};
