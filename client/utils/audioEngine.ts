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
 * @param context - AudioContext instance
 */
function playTone(context: AudioContext, frequency: number, duration: number, startTime: number) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const filterNode = context.createBiquadFilter();

    // Use sawtooth for a richer sound, but filtered
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = frequency;

    // Low-pass filter to soften the sound (like a felt piano or rhodes)
    filterNode.type = 'lowpass';
    filterNode.frequency.value = 800; // Cutoff frequency
    filterNode.Q.value = 0.5;

    // Envelope to avoid clicking and give shape
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.02); // Fast attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Decay

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

/**
 * Play a chord by name
 * @param root - Root note (e.g., "C", "F#")
 * @param quality - Chord quality (e.g., "major", "min7")
 * @param duration - Duration in seconds (default: 1.5s)
 * @param startTime - Optional start time (for scheduling)
 * @returns The duration of the chord in seconds
 */
export function playChord(root: string, quality: string, duration: number = 1.5, startTime?: number): number {
    try {
        const context = getAudioContext();
        const chordName = root + quality;
        const start = startTime !== undefined ? startTime : context.currentTime;

        // Get chord intervals using existing analysis
        const analysis = analyzeChord(chordName);

        // Base octave for the chord (3rd octave for guitar-like range)
        const baseOctave = -1; // Relative to C4 (so C3)

        // Stagger notes slightly for a strumming effect (30ms delay between strings)
        const strumDelay = 0.03;

        const notes = analysis.notes; // e.g. ['C', 'E', 'G']
        let currentOctaveOffset = baseOctave;
        let previousNoteValue = -1;

        notes.forEach((note, index) => {
            const noteValue = noteToValue(note);

            // If this note is lower than the previous one, it must be in the next octave
            if (noteValue <= previousNoteValue) {
                currentOctaveOffset++;
            }

            // Special case: Root is always first.
            if (index === 0) {
                currentOctaveOffset = baseOctave;
            }

            previousNoteValue = noteValue;

            const freq = getFrequency(noteValue, currentOctaveOffset);
            playTone(context, freq, duration, start + (index * strumDelay));
        });

        return duration;

    } catch (error) {
        console.error("Failed to play chord:", error);
        return 0;
    }
}

/**
 * Play a sequence of chords
 * @param progression - Array of chords to play
 * @param onChordStart - Callback called when each chord starts playing (with index)
 * @param onComplete - Callback called when the entire progression finishes
 */
export function playProgression(
    progression: Array<{ root: string; quality: string }>,
    onChordStart?: (index: number) => void,
    onComplete?: () => void
) {
    try {
        const context = getAudioContext();
        const now = context.currentTime;
        const chordDuration = 1.2; // Slightly faster for progressions
        const gap = 0.1; // Gap between chords

        progression.forEach((chord, index) => {
            const startTime = now + (index * (chordDuration + gap));

            // Schedule the audio
            playChord(chord.root, chord.quality, chordDuration, startTime);

            // Schedule the callback
            // setTimeout uses wall clock time (ms), AudioContext uses seconds
            // We need to account for the difference, but usually they are close enough for UI sync
            // if we calculate the delay from now.
            const delayMs = (startTime - now) * 1000;

            setTimeout(() => {
                if (onChordStart) onChordStart(index);
            }, delayMs);
        });

        // Schedule completion callback
        const totalDurationMs = (progression.length * (chordDuration + gap)) * 1000;
        setTimeout(() => {
            if (onComplete) onComplete();
        }, totalDurationMs);

    } catch (error) {
        console.error("Failed to play progression:", error);
        if (onComplete) onComplete();
    }
}
