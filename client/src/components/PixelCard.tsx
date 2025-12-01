import React from 'react';

interface PixelCardProps {
    children: React.ReactNode;
    className?: string;
    noAnimate?: boolean;
}

export const PixelCard: React.FC<PixelCardProps> = ({
    children,
    className = '',
    noAnimate = false
}) => {
    return (
        <div className={`bg-surface border-2 border-border p-4 md:p-8 shadow-lg relative ${!noAnimate ? 'animate-fade-scale-in' : ''} ${className}`}>
            {/* Pixel corners decoration */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary"></div>

            {children}
        </div>
    );
};
