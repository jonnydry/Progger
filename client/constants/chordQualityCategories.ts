/**
 * Categorized chord qualities for progressive disclosure UI
 * Organizes 40 chord types into 5 logical categories from beginner to advanced
 */

export type ChordQualityCategory = 'Basic' | '7ths' | 'Extended' | 'Jazz/Altered' | 'Other';

export interface ChordQualityCategoryInfo {
  name: ChordQualityCategory;
  description: string;
  qualities: string[];
}

/**
 * Chord quality categories organized by complexity and common usage
 */
export const CHORD_QUALITY_CATEGORIES: ChordQualityCategoryInfo[] = [
  {
    name: 'Basic',
    description: 'Essential triads and suspensions',
    qualities: [
      'major',
      'minor',
      'dim',
      'aug',
      'sus2',
      'sus4',
    ],
  },
  {
    name: '7ths',
    description: 'Common seventh chords',
    qualities: [
      '7',
      'maj7',
      'min7',
      'dim7',
      'min7b5',
    ],
  },
  {
    name: 'Extended',
    description: '9th, 11th, and 13th chords',
    qualities: [
      '9',
      'maj9',
      'min9',
      '11',
      'maj11',
      'min11',
      '13',
      'maj13',
      'min13',
    ],
  },
  {
    name: 'Jazz/Altered',
    description: 'Advanced and altered dominants',
    qualities: [
      '7b9',
      '7#9',
      '7b5',
      '7#5',
      '7alt',
      '7sus4',
      '7b9b13',
      '7#9b13',
      '9#11',
      'maj7#11',
      'maj7b13',
      'maj7#9',
      '9sus4',
      'min/maj7',
    ],
  },
  {
    name: 'Other',
    description: 'Sixths, add chords, power chord',
    qualities: [
      '6',
      'min6',
      '6/9',
      'add9',
      'add11',
      'madd9',
      '5', // Power chord
    ],
  },
];

/**
 * Get all chord qualities in a flat array (for backward compatibility)
 */
export function getAllChordQualities(): string[] {
  return CHORD_QUALITY_CATEGORIES.flatMap(cat => cat.qualities);
}

/**
 * Get the category that contains a specific chord quality
 */
export function getCategoryForQuality(quality: string): ChordQualityCategory | null {
  const category = CHORD_QUALITY_CATEGORIES.find(cat =>
    cat.qualities.includes(quality)
  );
  return category ? category.name : null;
}

/**
 * Get chord qualities for a specific category
 */
export function getQualitiesForCategory(categoryName: ChordQualityCategory): string[] {
  const category = CHORD_QUALITY_CATEGORIES.find(cat => cat.name === categoryName);
  return category ? category.qualities : [];
}
