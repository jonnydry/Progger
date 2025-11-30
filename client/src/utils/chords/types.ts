/**
 * Shared types for chord library
 */

import type { ChordVoicing } from '../../types';

export type { ChordVoicing };

export type ChordKey = `${string}_${string}`;

export interface ChordData {
  name: string;
  voicings: ChordVoicing[];
}

export type ChordVoicingsMap = Record<ChordKey, ChordVoicing[]>;
