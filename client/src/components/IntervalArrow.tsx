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
        flex flex-col items-center justify-center
        ${isCompact ? 'mx-1 min-w-[32px]' : 'mx-2 min-w-[40px]'}
      `}
      aria-label={`Interval from ${fromChord} to ${toChord}: ${interval}`}
    >
      <div 
        className={`
          flex items-center justify-center
          bg-surface/60 backdrop-blur-sm
          border border-border/50 rounded-full
          text-text/70 font-mono font-semibold
          shadow-sm
          ${isCompact ? 'w-8 h-8 text-[10px]' : 'w-10 h-10 text-xs'}
        `}
      >
        {interval}
      </div>
      <svg 
        className={`text-text/40 ${isCompact ? 'w-4 h-2 mt-0.5' : 'w-5 h-3 mt-1'}`}
        viewBox="0 0 20 12" 
        fill="none"
        aria-hidden="true"
      >
        <path 
          d="M2 6h14M12 2l4 4-4 4" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
