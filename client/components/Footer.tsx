import React from 'react';
import footerBg from '../assets/footer_bg.png';

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full mt-16">
      <img
        src={footerBg}
        alt="Pixel art pond landscape with Progger logo"
        className="w-full h-auto grayscale block"
      />
      <div className="absolute bottom-0 w-full text-center py-2 bg-black/30 backdrop-blur-[2px] text-white/80 text-sm font-medium">
        <p>Powered by xAI Grok</p>
      </div>
    </footer>
  );
};
