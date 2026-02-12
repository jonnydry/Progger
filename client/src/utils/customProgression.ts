import type { CustomChordInput } from '@/types';
import { formatChordCanonicalName } from './chordFormatting';

export function createChordId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `chord-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function toCanonicalChordNames(
  progression: Array<Pick<CustomChordInput, 'root' | 'quality'>>
): string[] {
  return progression.map((chord) =>
    formatChordCanonicalName(chord.root, chord.quality)
  );
}
