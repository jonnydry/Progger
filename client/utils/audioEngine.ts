import { noteToValue } from './musicTheory';
import { analyzeChord } from './chordAnalysis';

/**
 * Simple audio engine for playing chords using the Web Audio API
 */

// Keep track of the audio context to reuse it
let audioContext: AudioContext | null = null;

// Base frequency for C4 (Middle C)
const C4_FREQ = 261.63;

/**
 * Get or create the AudioContext
 * Handles browser compatibility and user interaction requirements
 */
function getAudioContext(): AudioContext {
    if (!audioContext) {
        // @ts-ignore - Handle webkit prefix for Safari
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContextClass();
    }

    // Resume context if it was suspended (browser policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    return audioContext;
}

/**
 * Calculate frequency for a note value relative to C4
 * @param noteValue - 0-11 value (C=0, B=11)
 * @param octaveOffset - Octave shift (0 = C4 octave)
 */
function getFrequency(noteValue: number, octaveOffset: number = 0): number {
    // Calculate semitones from C4
    // noteValue is 0-11. C4 is 0.
    // Formula: f = f0 * (2 ^ (n/12))
    const semitones = noteValue + (octaveOffset * 12);
    return C4_FREQ * Math.pow(2, semitones / 12);
}

/**
 * Play a single note
 * @param frequency - Frequency in Hz
 * @param duration - Duration in seconds
 * @param startTime - When to start playing (context time)
 */
function playTone(context: AudioContext, frequency: number, duration: number, startTime: number) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'triangle'; // Triangle wave sounds a bit more like an instrument than sine
    oscillator.frequency.value = frequency;

    // Envelope to avoid clicking
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.05); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Decay

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

/**
 * Play a chord by name
 * @param root - Root note (e.g., "C", "F#")
 * @param quality - Chord quality (e.g., "major", "min7")
 * @param duration - Duration in seconds (default: 1.5s)
 */
export function playChord(root: string, quality: string, duration: number = 1.5): void {
    try {
        const context = getAudioContext();
        const chordName = root + quality;

        // Get chord intervals using existing analysis
        // We use 'C' as key context just to get the intervals, the root note handles the pitch
        const analysis = analyzeChord(chordName);

        // Calculate root note value (0-11)
        const rootValue = noteToValue(root);

        // Base octave for the chord (3rd octave for guitar-like range)
        // Adjust based on root note to keep it in a reasonable range
        // If root is high (e.g. A, B), maybe drop an octave, or keep it.
        // Let's stick to a base octave of 3 (C3-B3 range) for the root
        const baseOctave = -1; // Relative to C4 (so C3)

        // Play root note
        const now = context.currentTime;

        // Stagger notes slightly for a strumming effect (20ms delay between strings)
        const strumDelay = 0.03;

        // Parse intervals from the analysis formula or calculate from notes
        // The analysis.intervals gives us semitone offsets from root: [0, 4, 7] etc.
        // But analyzeChord returns names like "Major 3rd".
        // Let's look at how analyzeChord works. It uses CHORD_FORMULAS which has intervals: [0, 4, 7]

        // We need to access the raw intervals. 
        // Since analyzeChord returns processed strings, we might want to import CHORD_FORMULAS directly 
        // or just re-implement the lookup since it's not exported.
        // However, analyzeChord returns `notes` which are the actual note names.
        // We can use the notes to calculate frequencies, but we need to know the octave.

        // Better approach: Re-import the logic or just use the notes and guess octaves?
        // "Smart" voicing: 
        // Root is at base octave.
        // Subsequent notes: if value < previous value, bump octave.

        const notes = analysis.notes; // e.g. ['C', 'E', 'G']
        let currentOctaveOffset = baseOctave;
        let previousNoteValue = -1;

        notes.forEach((note, index) => {
            const noteValue = noteToValue(note);

            // If this note is lower than the previous one, it must be in the next octave
            // (Simple voicing logic, not perfect but works for basic chords)
            if (noteValue <= previousNoteValue) {
                currentOctaveOffset++;
            }

            // Special case: Root is always first.
            if (index === 0) {
                currentOctaveOffset = baseOctave;
            }

            previousNoteValue = noteValue;

            const freq = getFrequency(noteValue, currentOctaveOffset);
            playTone(context, freq, duration, now + (index * strumDelay));
        });

    } catch (error) {
        console.error("Failed to play chord:", error);
    }
}
