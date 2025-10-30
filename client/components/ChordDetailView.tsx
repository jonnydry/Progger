import React from 'react';
import type { ChordInProgression, ChordVoicing } from '@/types';
import { VoicingDiagram } from './VoicingDiagram';
import { displayChordName } from '@/utils/musicTheory';
import { analyzeChord, getChordFormula, getChordIntervals, getChordNotes, getScalesContainingChord } from '@/utils/chordAnalysis';
import { getChordVoicings } from '@/utils/chordLibrary';

interface ChordDetailViewProps {
  chord: ChordInProgression;
  musicalKey: string;
  onClose: () => void;
}


const VoicingGroup: React.FC<{
  title: string;
  voicings: ChordVoicing[];
  chordName: string;
  displayedChordName: string;
}> = ({ title, voicings, chordName, displayedChordName }) => {
  if (voicings.length === 0) return null;

  return (
    <div className="mb-6">
      <h4 className="text-md font-semibold text-text/80 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-primary rounded-full"></span>
        {title} ({voicings.length})
      </h4>
      <div className="flex flex-row flex-wrap gap-4">
        {voicings.map((voicing, index) => {
          const voicingKey = `${chordName}-${title}-${index}-${voicing.position || 'std'}-${voicing.frets.join('-')}`;
          return <VoicingDiagram key={voicingKey} chordName={displayedChordName} voicing={voicing} />;
        })}
      </div>
    </div>
  );
};

export const ChordDetailView: React.FC<ChordDetailViewProps> = ({ chord, musicalKey, onClose }) => {
  const displayedChordName = displayChordName(chord.chordName, musicalKey);

  // Analyze chord using our new utility
  const chordAnalysis = analyzeChord(chord.chordName, musicalKey);

  // Fetch ALL available voicings directly from the chord library
  // This ensures we get the complete set, not just what was in the progression
  const allVoicings = React.useMemo(() => {
    return getChordVoicings(chord.chordName);
  }, [chord.chordName]);

  // Organize voicings by type
  const voicingGroups = React.useMemo(() => {
    const groups: Record<string, ChordVoicing[]> = {
      'Open': [],
      'Barre': [],
      'Partial': [],
      'A-string Root': [],
      'Quartal': [],
      'Interior': [],
      'Other': []
    };

    allVoicings.forEach(voicing => {
      const position = voicing.position || '';
      const positionLower = position.toLowerCase();
      
      if (positionLower.includes('open')) {
        groups['Open'].push(voicing);
      } else if (positionLower.includes('barre') || position.includes('Barre')) {
        groups['Barre'].push(voicing);
      } else if (positionLower.includes('partial')) {
        groups['Partial'].push(voicing);
      } else if (positionLower.includes('a-string root') || positionLower.includes('a-string')) {
        groups['A-string Root'].push(voicing);
      } else if (positionLower.includes('quartal')) {
        groups['Quartal'].push(voicing);
      } else if (positionLower.includes('interior')) {
        groups['Interior'].push(voicing);
      } else if (position === '') {
        // Default to Open if no position specified
        groups['Open'].push(voicing);
      } else {
        // Unknown position types go to "Other"
        groups['Other'].push(voicing);
      }
    });

    return groups;
  }, [allVoicings]);

  return (
    <div className="mt-8 max-w-6xl mx-auto w-full animate-slide-in">
      <div className="bg-surface rounded-lg p-6 shadow-2xl border border-border relative space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-4xl font-bebas tracking-wider text-text/90">{displayedChordName}</h2>
            <div className="flex items-center flex-wrap gap-3 mt-3 text-text/70">
              <span className="bg-primary/20 text-primary font-semibold px-3 py-1 rounded-md text-sm uppercase tracking-wide">
                {chord.relationToKey}
              </span>
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

        {/* Chord Theory Section */}
        <div className="border-t border-border pt-6">
          <h3 className="text-xl font-semibold text-text/90 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-sm"></span>
            Chord Theory
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background/50 rounded-lg p-4 border border-border/50">
              <h4 className="text-sm font-semibold text-text/70 uppercase tracking-wide mb-2">Formula</h4>
              <p className="text-lg font-mono text-text">{chordAnalysis.formula}</p>
            </div>
            <div className="bg-background/50 rounded-lg p-4 border border-border/50">
              <h4 className="text-sm font-semibold text-text/70 uppercase tracking-wide mb-2">Intervals</h4>
              <div className="flex flex-wrap gap-1">
                {chordAnalysis.intervals.map((interval, index) => (
                  <span key={index} className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                    {interval}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-background/50 rounded-lg p-4 border border-border/50">
              <h4 className="text-sm font-semibold text-text/70 uppercase tracking-wide mb-2">Notes</h4>
              <div className="flex flex-wrap gap-1">
                {chordAnalysis.notes.map((note, index) => (
                  <span key={index} className="text-sm font-mono bg-surface text-text px-2 py-0.5 rounded border border-border/30">
                    {note}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-background/50 rounded-lg p-4 border border-border/50">
              <h4 className="text-sm font-semibold text-text/70 uppercase tracking-wide mb-2">Scales</h4>
              <div className="flex flex-wrap gap-1">
                {chordAnalysis.compatibleScales.slice(0, 2).map((scale, index) => (
                  <span key={index} className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">
                    {scale}
                  </span>
                ))}
                {chordAnalysis.compatibleScales.length > 2 && (
                  <span className="text-xs text-text/50">+{chordAnalysis.compatibleScales.length - 2} more</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Voicings Section */}
        <div className="border-t border-border pt-6">
          <h3 className="text-xl font-semibold text-text/90 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-sm"></span>
            Guitar Voicings
          </h3>

          {(() => {
            // Check if we have any grouped voicings
            const hasGroupedVoicings = Object.values(voicingGroups).some(group => group.length > 0);
            
            if (!hasGroupedVoicings) {
              // Fallback: show all voicings ungrouped
              return (
                <div className="flex flex-row flex-wrap gap-4 justify-start">
                  {allVoicings.map((voicing, index) => {
                    const voicingKey = `${chord.chordName}-${index}-${voicing.position || 'std'}-${voicing.frets.join('-')}`;
                    return <VoicingDiagram key={voicingKey} chordName={displayedChordName} voicing={voicing} />;
                  })}
                </div>
              );
            }

            // Display groups in order of importance, only showing non-empty groups
            const groupOrder = ['Open', 'Barre', 'Partial', 'A-string Root', 'Quartal', 'Interior', 'Other'];
            const groupTitles: Record<string, string> = {
              'Open': 'Open Position',
              'Barre': 'Barre Position',
              'Partial': 'Partial Position',
              'A-string Root': 'A-string Root',
              'Quartal': 'Quartal Voicings',
              'Interior': 'Interior Position',
              'Other': 'Other Voicings'
            };

            return (
              <div className="space-y-6">
                {groupOrder.map(groupKey => {
                  const voicings = voicingGroups[groupKey];
                  if (voicings.length === 0) return null;
                  
                  return (
                    <VoicingGroup
                      key={groupKey}
                      title={groupTitles[groupKey]}
                      voicings={voicings}
                      chordName={chord.chordName}
                      displayedChordName={displayedChordName}
                    />
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
