export interface ChordVoicing {
  frets: (number | 'x')[];
  firstFret?: number;
  position?: string;
}

export interface ChordData {
  name: string;
  voicings: ChordVoicing[];
}

type ChordLibrary = Record<string, ChordVoicing[]>;

export const CHORD_LIBRARY: ChordLibrary = {
  'major': [
    { frets: ['x', 3, 2, 0, 1, 0], position: 'C open' },
    { frets: [3, 2, 0, 0, 0, 3], position: 'G open' },
    { frets: ['x', 0, 2, 2, 2, 0], position: 'A open' },
    { frets: [0, 2, 2, 1, 0, 0], position: 'E open' },
    { frets: ['x', 'x', 0, 2, 3, 2], position: 'D open' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 1, position: 'F barre' },
    { frets: [1, 1, 3, 3, 3, 1], firstFret: 3, position: 'barre form 1' },
    { frets: [1, 3, 3, 2, 1, 1], firstFret: 5, position: 'barre form 2' },
    { frets: ['x', 1, 3, 3, 3, 1], firstFret: 7, position: 'barre form 3' },
  ],
  
  'minor': [
    { frets: ['x', 3, 1, 0, 1, 0], position: 'Cm open' },
    { frets: ['x', 0, 2, 2, 1, 0], position: 'Am open' },
    { frets: [0, 2, 2, 0, 0, 0], position: 'Em open' },
    { frets: ['x', 'x', 0, 2, 3, 1], position: 'Dm open' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 1, position: 'Fm barre' },
    { frets: [1, 3, 3, 1, 1, 1], firstFret: 3, position: 'barre form 1' },
    { frets: [1, 1, 3, 3, 2, 1], firstFret: 5, position: 'barre form 2' },
    { frets: ['x', 1, 3, 3, 2, 1], firstFret: 7, position: 'barre form 3' },
  ],
  
  'maj7': [
    { frets: ['x', 3, 2, 0, 0, 0], position: 'Cmaj7 open' },
    { frets: ['x', 0, 2, 1, 2, 0], position: 'Amaj7 open' },
    { frets: [0, 2, 1, 1, 0, 0], position: 'Emaj7 open' },
    { frets: ['x', 'x', 0, 2, 2, 2], position: 'Dmaj7 open' },
    { frets: [1, 3, 2, 2, 1, 1], firstFret: 1, position: 'Fmaj7' },
    { frets: ['x', 1, 3, 2, 3, 1], firstFret: 3, position: 'jazzy' },
    { frets: ['x', 'x', 1, 1, 1, 3], firstFret: 5, position: 'top strings' },
  ],
  
  'min7': [
    { frets: ['x', 3, 1, 3, 1, 1], position: 'Cm7' },
    { frets: ['x', 0, 2, 0, 1, 0], position: 'Am7 open' },
    { frets: [0, 2, 0, 0, 0, 0], position: 'Em7 open' },
    { frets: ['x', 'x', 0, 2, 1, 1], position: 'Dm7 open' },
    { frets: [1, 3, 1, 1, 1, 1], firstFret: 1, position: 'Fm7 barre' },
    { frets: ['x', 1, 3, 1, 2, 1], firstFret: 5, position: 'jazzy' },
    { frets: ['x', 'x', 1, 1, 1, 2], firstFret: 7, position: 'top strings' },
  ],
  
  '7': [
    { frets: ['x', 3, 2, 3, 1, 0], position: 'C7 open' },
    { frets: ['x', 0, 2, 0, 2, 0], position: 'A7 open' },
    { frets: [0, 2, 0, 1, 0, 0], position: 'E7 open' },
    { frets: ['x', 'x', 0, 2, 1, 2], position: 'D7 open' },
    { frets: [3, 2, 0, 0, 0, 1], position: 'G7 open' },
    { frets: [1, 3, 1, 2, 1, 1], firstFret: 1, position: 'F7 barre' },
    { frets: ['x', 1, 3, 1, 3, 1], firstFret: 3, position: 'barre form' },
    { frets: ['x', 'x', 1, 1, 1, 2], firstFret: 5, position: 'top strings' },
  ],
  
  'dim': [
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'form 1' },
    { frets: ['x', 3, 1, 0, 1, 'x'], position: 'open' },
    { frets: ['x', 'x', 0, 1, 0, 1], position: 'open' },
    { frets: ['x', 1, 2, 0, 2, 'x'], firstFret: 3, position: 'form 2' },
  ],
  
  'dim7': [
    { frets: ['x', 'x', 1, 2, 1, 2], firstFret: 1, position: 'form 1' },
    { frets: ['x', 1, 2, 0, 2, 0], firstFret: 2, position: 'form 2' },
    { frets: [1, 2, 0, 1, 0, 1], firstFret: 3, position: 'form 3' },
  ],
  
  'min7b5': [
    { frets: ['x', 'x', 1, 2, 2, 2], firstFret: 1, position: 'form 1' },
    { frets: ['x', 1, 2, 1, 3, 'x'], firstFret: 3, position: 'form 2' },
    { frets: [1, 2, 3, 2, 'x', 'x'], firstFret: 5, position: 'low strings' },
  ],
  
  'aug': [
    { frets: ['x', 'x', 2, 1, 1, 0], position: 'open' },
    { frets: ['x', 0, 3, 2, 2, 1], position: 'A aug' },
    { frets: ['x', 'x', 1, 0, 0, 3], firstFret: 3, position: 'form 1' },
  ],
  
  'sus2': [
    { frets: ['x', 3, 0, 0, 3, 3], position: 'Csus2' },
    { frets: ['x', 0, 2, 2, 0, 0], position: 'Asus2 open' },
    { frets: [0, 2, 2, 2, 0, 0], position: 'Esus2 open' },
    { frets: ['x', 'x', 0, 2, 3, 0], position: 'Dsus2 open' },
    { frets: [1, 3, 3, 0, 1, 1], firstFret: 3, position: 'barre' },
  ],
  
  'sus4': [
    { frets: ['x', 3, 3, 0, 1, 1], position: 'Csus4' },
    { frets: ['x', 0, 2, 2, 3, 0], position: 'Asus4 open' },
    { frets: [0, 2, 2, 2, 0, 0], position: 'Esus4 open' },
    { frets: ['x', 'x', 0, 2, 3, 3], position: 'Dsus4 open' },
    { frets: [1, 3, 3, 3, 1, 1], firstFret: 1, position: 'Fsus4' },
  ],
  
  '9': [
    { frets: ['x', 3, 2, 3, 3, 3], position: 'C9' },
    { frets: ['x', 0, 2, 4, 2, 3], position: 'A9' },
    { frets: [0, 2, 0, 1, 0, 2], position: 'E9 open' },
    { frets: ['x', 'x', 0, 2, 1, 0], position: 'D9 open' },
    { frets: [1, 3, 1, 2, 1, 3], firstFret: 1, position: 'F9' },
    { frets: ['x', 1, 2, 1, 1, 2], firstFret: 5, position: 'jazzy' },
  ],
  
  'maj9': [
    { frets: ['x', 3, 2, 4, 3, 0], position: 'Cmaj9' },
    { frets: ['x', 0, 2, 1, 0, 0], position: 'Amaj9' },
    { frets: [0, 2, 1, 1, 0, 2], position: 'Emaj9' },
    { frets: ['x', 1, 3, 2, 1, 3], firstFret: 5, position: 'jazzy' },
  ],
  
  'min9': [
    { frets: ['x', 3, 1, 3, 3, 3], position: 'Cm9' },
    { frets: ['x', 0, 2, 0, 0, 0], position: 'Am9 open' },
    { frets: [0, 2, 0, 0, 0, 2], position: 'Em9 open' },
    { frets: ['x', 1, 3, 1, 1, 3], firstFret: 5, position: 'jazzy' },
  ],
  
  '11': [
    { frets: ['x', 3, 3, 3, 3, 3], position: 'C11' },
    { frets: ['x', 0, 0, 0, 2, 0], position: 'A11' },
    { frets: [0, 0, 0, 1, 0, 0], position: 'E11 open' },
  ],
  
  '13': [
    { frets: ['x', 3, 2, 3, 5, 5], position: 'C13' },
    { frets: ['x', 0, 2, 0, 2, 2], position: 'A13' },
    { frets: [0, 2, 0, 1, 2, 0], position: 'E13' },
    { frets: ['x', 1, 1, 1, 3, 3], firstFret: 5, position: 'jazzy' },
  ],
  
  '7sus4': [
    { frets: ['x', 3, 3, 3, 1, 1], position: 'C7sus4' },
    { frets: ['x', 0, 2, 0, 3, 0], position: 'A7sus4' },
    { frets: [0, 2, 0, 2, 0, 0], position: 'E7sus4 open' },
    { frets: [1, 3, 1, 3, 1, 1], firstFret: 1, position: 'F7sus4' },
  ],
  
  '7b5': [
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 1, position: 'altered' },
    { frets: ['x', 1, 2, 1, 3, 0], firstFret: 3, position: 'altered' },
  ],
  
  '7#5': [
    { frets: ['x', 'x', 1, 2, 2, 3], firstFret: 2, position: 'altered' },
    { frets: ['x', 0, 3, 0, 2, 1], position: 'A7#5' },
  ],
  
  '7b9': [
    { frets: ['x', 3, 2, 3, 2, 0], position: 'C7b9' },
    { frets: ['x', 0, 2, 0, 2, 1], position: 'A7b9' },
    { frets: [0, 2, 0, 1, 3, 1], position: 'E7b9' },
    { frets: ['x', 1, 3, 1, 3, 2], firstFret: 5, position: 'jazzy' },
  ],
  
  '7#9': [
    { frets: ['x', 3, 2, 3, 4, 4], position: 'C7#9' },
    { frets: ['x', 0, 2, 0, 2, 3], position: 'A7#9' },
    { frets: [0, 2, 0, 1, 3, 3], position: 'E7#9' },
    { frets: ['x', 1, 3, 1, 3, 4], firstFret: 5, position: 'jazzy' },
  ],
  
  'add9': [
    { frets: ['x', 3, 2, 0, 3, 0], position: 'Cadd9' },
    { frets: ['x', 0, 2, 4, 2, 0], position: 'Aadd9' },
    { frets: [0, 2, 2, 1, 0, 2], position: 'Eadd9' },
    { frets: ['x', 'x', 0, 2, 3, 0], position: 'Dadd9 open' },
  ],
  
  '6': [
    { frets: ['x', 3, 2, 2, 1, 0], position: 'C6 open' },
    { frets: ['x', 0, 2, 2, 2, 2], position: 'A6' },
    { frets: [0, 2, 2, 1, 2, 0], position: 'E6' },
    { frets: ['x', 'x', 0, 2, 0, 2], position: 'D6 open' },
  ],
  
  'min6': [
    { frets: ['x', 3, 1, 2, 1, 0], position: 'Cm6' },
    { frets: ['x', 0, 2, 2, 1, 2], position: 'Am6' },
    { frets: [0, 2, 2, 0, 2, 0], position: 'Em6' },
    { frets: ['x', 'x', 0, 2, 0, 1], position: 'Dm6 open' },
  ],
  
  '6/9': [
    { frets: ['x', 3, 2, 2, 3, 3], position: 'C6/9' },
    { frets: ['x', 0, 2, 4, 2, 2], position: 'A6/9' },
    { frets: [0, 2, 2, 1, 2, 2], position: 'E6/9' },
  ],
};

const ALL_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

function noteToValue(note: string): number {
  if (!note) return 0;
  const normalized = note.charAt(0).toUpperCase() + note.slice(1).toLowerCase();
  let index = ALL_NOTES.indexOf(normalized);
  if (index !== -1) return index;
  index = FLAT_NOTES.indexOf(normalized);
  return index !== -1 ? index : 0;
}

function extractRootAndQuality(chordName: string): { root: string; quality: string } {
  const match = chordName.match(/^([A-G][#b]?)(.*)/);
  if (!match) return { root: 'C', quality: chordName.toLowerCase() };
  return { root: match[1], quality: match[2].toLowerCase().trim() };
}

function extractVoicingBaseRoot(voicing: ChordVoicing): string {
  if (!voicing.position) return 'C';
  
  const rootMatch = voicing.position.match(/^([A-G][#b]?)/);
  if (rootMatch) {
    return rootMatch[1];
  }
  
  const baseFret = voicing.firstFret || 0;
  const fretToNote = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'];
  return fretToNote[baseFret % 12];
}

export function getChordVoicings(chordName: string): ChordVoicing[] {
  const { root, quality } = extractRootAndQuality(chordName);
  const targetRootValue = noteToValue(root);
  
  const normalized = normalizeChordQuality(quality);
  
  let baseVoicings = CHORD_LIBRARY[normalized];
  
  if (!baseVoicings) {
    for (const [key, voicings] of Object.entries(CHORD_LIBRARY)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        baseVoicings = voicings;
        break;
      }
    }
  }
  
  if (!baseVoicings) {
    if (normalized.includes('maj')) baseVoicings = CHORD_LIBRARY['major'];
    else if (normalized.includes('min') || normalized.includes('m')) baseVoicings = CHORD_LIBRARY['minor'];
    else baseVoicings = CHORD_LIBRARY['major'];
  }
  
  return baseVoicings.map(voicing => {
    const baseRoot = extractVoicingBaseRoot(voicing);
    const baseRootValue = noteToValue(baseRoot);
    const semitones = ((targetRootValue - baseRootValue) + 12) % 12;
    return transposeVoicing(voicing, semitones);
  });
}

function normalizeChordQuality(quality: string): string {
  let normalized = quality
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/major/g, 'maj')
    .replace(/dominant/g, '')
    .replace(/sharp/g, '#')
    .replace(/flat/g, 'b')
    .trim();
  
  if (normalized.startsWith('m') && !normalized.startsWith('maj')) {
    if (normalized === 'm') {
      normalized = 'minor';
    } else {
      normalized = normalized.replace(/^m/, 'min');
    }
  }
  
  normalized = normalized.replace(/^minor([0-9#b])/, 'min$1');
  
  return normalized;
}

export function transposeVoicing(voicing: ChordVoicing, semitones: number): ChordVoicing {
  if (semitones === 0) return voicing;
  
  const transposedFrets = voicing.frets.map(fret => {
    if (fret === 'x') return 'x';
    const newFret = fret + semitones;
    return newFret < 0 ? 'x' : newFret > 24 ? 'x' : newFret;
  });
  
  const baseFret = voicing.firstFret || 0;
  const newFirstFret = baseFret + semitones;
  
  return {
    ...voicing,
    frets: transposedFrets,
    firstFret: newFirstFret > 0 ? newFirstFret : undefined,
  };
}
