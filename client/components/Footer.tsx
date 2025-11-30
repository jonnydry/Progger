import React from 'react';
import footerBg from '../assets/footer_bg.png';

interface FooterProps {
  onAboutClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAboutClick }) => {
  return (
    <footer className="relative w-full mt-16">
      <img
        src={footerBg}
        alt="Pixel art pond landscape with Progger logo"
        className="w-full h-auto grayscale block"
      />
      <div className="absolute bottom-0 w-full text-center py-2 bg-black/30 backdrop-blur-[2px] text-white/80 text-sm font-medium flex justify-between items-center px-4">
        <span className="flex-grow text-center ml-20">Powered by xAI Grok</span>
        {onAboutClick && (
          <button
            onClick={onAboutClick}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs border border-white/30 hover:border-white/50 transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md font-mono tracking-wider"
            style={{ imageRendering: 'pixelated' }}
          >
            [?] ABOUT
          </button>
        )}
      </div>
    </footer>
  );
};
