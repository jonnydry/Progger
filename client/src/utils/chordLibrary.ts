/**
 * Chord Library — backward-compatible public API
 *
 * All voicing data is now lazy-loaded via dynamic imports in ./chords/.
 * The initial bundle no longer includes the 220 KB voicing database.
 *
 * GUITAR CONVENTION (unchanged):
 * All frets arrays follow standard guitar notation order:
 * [Low E (6th), A (5th), D (4th), G (3rd), B (2nd), High E (1st)]
 *
 * Example: E major open = [0, 2, 2, 1, 0, 0]
 */

export type { ChordVoicing } from "../types";
export type { ChordData, ChordKey, ChordVoicingsMap } from "./chords/types";

export {
  // Chord lookup
  getChordVoicingsAsync,
  loadMultipleChords,
  loadChordsByRoot,

  // Preloading / cache management
  preloadCommonKeys,
  preloadRoots,
  preloadAllChords,
  getCacheStats,
  clearChordCache,

  // Utilities
  normalizeRoot,
  isMutedVoicing,
  extractVoicingNotes,
  validateVoicingNotes,

  // Validation (dev-only)
  validateVoicingFormat,
  validateChordLibraryAsync as validateChordLibrary,
} from "./chords/index";
