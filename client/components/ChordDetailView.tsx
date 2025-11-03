import React from 'react';
import type { ChordInProgression, ChordVoicing } from '@/types';
import { VoicingDiagram } from './VoicingDiagram';
import { displayChordName } from '@/utils/musicTheory';
import { analyzeChord, getChordFormula, getChordIntervals, getChordNotes, getScalesContainingChord } from '@/utils/chordAnalysis';
import { getChordVoicings, isMutedVoicing } from '@/utils/chordLibrary';
import { normalizeChordQuality } from '@shared/music/chordQualities';

interface ChordDetailViewProps {
  chord: ChordInProgression;
  musicalKey: string;
  onClose: () => void;
}


const VoicingGroup: React.FC<{
  title: string;
  voicings: Array<{ voicing: ChordVoicing; chordName: string }>;
  musicalKey: string;
}> = ({ title, voicings, musicalKey }) => {
  if (voicings.length === 0) return null;

  return (
    <div className="mb-6">
      <h4 className="text-md font-semibold text-text/80 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-primary rounded-full"></span>
        {title} ({voicings.length})
      </h4>
      <div className="flex flex-row flex-wrap gap-4">
        {voicings.map(({ voicing, chordName }, index) => {
          const displayedVariantName = displayChordName(chordName, musicalKey);
          const voicingKey = `${chordName}-${title}-${index}-${voicing.position || 'std'}-${voicing.frets.join('-')}`;
          return <VoicingDiagram key={voicingKey} chordName={displayedVariantName} voicing={voicing} />;
        })}
      </div>
    </div>
  );
};

export const ChordDetailView: React.FC<ChordDetailViewProps> = ({ chord, musicalKey, onClose }) => {
  const displayedChordName = displayChordName(chord.chordName, musicalKey);

  // Analyze chord using our new utility
  const chordAnalysis = analyzeChord(chord.chordName, musicalKey);

  // Extract root and quality for advanced variants
  const { root, quality } = React.useMemo(() => {
    const match = chord.chordName.match(/^([A-G][#b]?)(.*)/i);
    if (!match) return { root: 'C', quality: 'major' };
    const [, rawRoot, rawSuffix] = match;
    const qualitySegment = (rawSuffix || '').split('/')[0] ?? '';
    
    // Use proper normalization from shared chord qualities
    const normalizedQuality = normalizeChordQuality(qualitySegment);
    
    return { 
      root: rawRoot.toUpperCase(), 
      quality: normalizedQuality 
    };
  }, [chord.chordName]);

  // Collect ALL voicings including advanced variants, with their chord names
  // This includes base chord voicings and all variant voicings merged together
  const allVoicingsWithNames = React.useMemo(() => {
    type VoicingWithName = { voicing: ChordVoicing; chordName: string };
    const voicings: VoicingWithName[] = [];
    
    // Add base chord voicings
    const baseVoicings = getChordVoicings(chord.chordName);
    baseVoicings.forEach(voicing => {
      voicings.push({ voicing, chordName: chord.chordName });
    });
    
    // Generate and add advanced variant voicings
    const variantMap: Record<string, string[]> = {
      'major': ['maj7', 'maj9', '6/9', 'maj13', 'add9'],
      'maj7': ['maj9', '6/9', 'maj13'],
      'minor': ['min7', 'min9', 'min11', 'min13'],
      'min7': ['min9', 'min11', 'min13'],
      '7': ['9', '13', '7b9', '7#9', '7#11', '7b13', '7alt', '9#11', '9sus4'],
      'min7b5': [] // Skip if no variants typically available
    };
    
    const candidateQualities = variantMap[quality] || [];
    
    candidateQualities.forEach(variantQuality => {
      // Construct chord name
      let variantChordName = root;
      if (variantQuality === 'maj7' || variantQuality === 'maj9' || variantQuality === 'maj13') {
        variantChordName += variantQuality;
      } else if (variantQuality === 'min7' || variantQuality === 'min9' || variantQuality === 'min11' || variantQuality === 'min13') {
        variantChordName += variantQuality.replace('min', 'm');
      } else if (variantQuality === '6/9') {
        variantChordName += '6/9';
      } else if (variantQuality === 'add9') {
        variantChordName += 'add9';
      } else {
        variantChordName += variantQuality;
      }
      
      // Check if voicings exist for this variant
      const variantVoicings = getChordVoicings(variantChordName);
      
      // Only include if we have real voicings (not all muted)
      if (variantVoicings.length > 0 && !variantVoicings.every(v => isMutedVoicing(v))) {
        variantVoicings.forEach(voicing => {
          voicings.push({ voicing, chordName: variantChordName });
        });
      }
    });
    
    return voicings;
  }, [chord.chordName, root, quality]);

  // Organize voicings by type (includes base chord + all variants)
  const voicingGroups = React.useMemo(() => {
    type VoicingWithName = { voicing: ChordVoicing; chordName: string };
    const groups: Record<string, VoicingWithName[]> = {
      'Open': [],
      'Barre': [],
      'Partial': [],
      'A-string Root': [],
      'Quartal': [],
      'Interior': [],
      'Other': []
    };

    allVoicingsWithNames.forEach(({ voicing, chordName }) => {
      const position = voicing.position || '';
      const positionLower = position.toLowerCase();
      
      if (positionLower.includes('open')) {
        groups['Open'].push({ voicing, chordName });
      } else if (positionLower.includes('barre') || position.includes('Barre')) {
        groups['Barre'].push({ voicing, chordName });
      } else if (positionLower.includes('partial')) {
        groups['Partial'].push({ voicing, chordName });
      } else if (positionLower.includes('a-string root') || positionLower.includes('a-string')) {
        groups['A-string Root'].push({ voicing, chordName });
      } else if (positionLower.includes('quartal')) {
        groups['Quartal'].push({ voicing, chordName });
      } else if (positionLower.includes('interior')) {
        groups['Interior'].push({ voicing, chordName });
      } else if (position === '') {
        // Default to Open if no position specified
        groups['Open'].push({ voicing, chordName });
      } else {
        // Unknown position types go to "Other"
        groups['Other'].push({ voicing, chordName });
      }
    });

    return groups;
  }, [allVoicingsWithNames]);

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
                  {allVoicingsWithNames.map(({ voicing, chordName }, index) => {
                    const displayedVariantName = displayChordName(chordName, musicalKey);
                    const voicingKey = `${chordName}-${index}-${voicing.position || 'std'}-${voicing.frets.join('-')}`;
                    return <VoicingDiagram key={voicingKey} chordName={displayedVariantName} voicing={voicing} />;
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
                      musicalKey={musicalKey}
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
