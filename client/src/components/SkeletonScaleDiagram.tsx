import React from 'react';

/**
 * Loading skeleton for ScaleDiagram component
 * Extracted to separate file to enable proper code-splitting of ScaleDiagram
 */
export const SkeletonScaleDiagram: React.FC = () => (
  <div className="flex flex-col items-center animate-pulse w-full max-w-4xl mx-auto">
    <div className="h-6 w-1/3 bg-surface/80 rounded-md mb-3 self-start"></div>
    <div className="w-full h-32 bg-surface rounded-lg border border-border"></div>
  </div>
);
