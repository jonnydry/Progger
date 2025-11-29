import React from 'react';

interface PixelLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PixelLoader: React.FC<PixelLoaderProps> = ({ 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`pixel-loader ${sizeClasses[size]} ${className}`} role="status" aria-label="Loading">
      <div className="pixel-loader-inner"></div>
    </div>
  );
};
