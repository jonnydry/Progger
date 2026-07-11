/**
 * Shared pitch-class helpers for scale/key alignment checks.
 */

const ROOT_TO_PITCH_CLASS: Record<string, number> = {
  C: 0,
  "B#": 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  F: 5,
  "E#": 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
  Cb: 11,
};

export function toPitchClass(root: string): number | null {
  const ascii = root.replace(/♯/g, "#").replace(/♭/g, "b").trim();
  if (!ascii) return null;
  const normalized = ascii.charAt(0).toUpperCase() + ascii.slice(1);
  return Object.prototype.hasOwnProperty.call(ROOT_TO_PITCH_CLASS, normalized)
    ? ROOT_TO_PITCH_CLASS[normalized]
    : null;
}

export function rootsMatch(a: string, b: string): boolean {
  const pitchA = toPitchClass(a);
  const pitchB = toPitchClass(b);
  return pitchA !== null && pitchB !== null && pitchA === pitchB;
}
