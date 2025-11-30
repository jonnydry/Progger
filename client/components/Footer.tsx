import React from 'react';
import footerBg from '../assets/footer_bg.png';

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full mt-16">
      <div
        className="w-full h-[200px] md:h-[300px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${footerBg})` }}
        role="img"
        aria-label="Pixel art pond landscape with Progger logo"
      />
      <div className="absolute bottom-0 w-full text-center py-2 bg-black/30 backdrop-blur-[2px] text-white/80 text-sm font-medium">
        <p>Powered by xAI Grok</p>
      </div>
    </footer>
  );
};
