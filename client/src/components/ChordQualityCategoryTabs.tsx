import React from 'react';
import type { ChordQualityCategory } from '@/constants/chordQualityCategories';
import { CHORD_QUALITY_CATEGORIES } from '@/constants/chordQualityCategories';

interface ChordQualityCategoryTabsProps {
  selectedCategory: ChordQualityCategory;
  onCategoryChange: (category: ChordQualityCategory) => void;
}

/**
 * Category tabs for chord quality selection
 * Implements progressive disclosure by organizing 40 chord types into 5 categories
 */
export const ChordQualityCategoryTabs: React.FC<ChordQualityCategoryTabsProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-text/60 text-center">
        Chord Type
      </div>
      <div className="flex items-center justify-between gap-1 md:gap-2">
        {CHORD_QUALITY_CATEGORIES.map(({ name, description, qualities }) => {
          const isSelected = name === selectedCategory;
          const count = qualities.length;

          return (
            <button
              key={name}
              onClick={() => onCategoryChange(name)}
              title={`${description} (${count} chords)`}
              className={`
                relative px-2 py-1.5 md:px-3 md:py-2 rounded-md font-semibold text-xs md:text-sm
                transition-all duration-200 ease-out
                border-2 flex-1 min-w-0
                ${isSelected
                  ? 'bg-primary text-background border-primary shadow-md scale-105'
                  : 'bg-background/40 text-text/70 border-border/50 hover:border-primary/40 hover:text-text hover:scale-102'
                }
              `}
            >
              <div className="truncate">{name}</div>
              <div className={`text-[10px] ${isSelected ? 'text-background/80' : 'text-text/50'}`}>
                {count}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
