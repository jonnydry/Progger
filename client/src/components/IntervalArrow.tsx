import React from 'react';
import { getIntervalBetweenChords } from '@/utils/musicTheory';

interface IntervalArrowProps {
  fromChord: string;
  toChord: string;
  isCompact?: boolean;
}

export const IntervalArrow: React.FC<IntervalArrowProps> = ({ 
  fromChord, 
  toChord, 
  isCompact = false 
}) => {
  const interval = getIntervalBetweenChords(fromChord, toChord);
  
  return (
    <div 
      className={`
        flex items-center justify-center self-center
        ${isCompact ? 'mx-2 my-2' : 'mx-3 my-2'}
      `}
      aria-label={`Interval from ${fromChord} to ${toChord}: ${interval}`}
    >
      <div 
        className={`
          flex items-center gap-1
          bg-surface/60 backdrop-blur-sm
          border border-border/50 rounded-full
          text-text/70 font-mono font-semibold
          shadow-sm px-2
          ${isCompact ? 'h-7 text-[10px]' : 'h-8 text-xs'}
        `}
      >
        <span>{interval}</span>
        <svg 
          className={`text-text/50 ${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`}
          viewBox="0 0 16 16" 
          fill="none"
          aria-hidden="true"
        >
          <path 
            d="M3 8h10M10 5l3 3-3 3" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
