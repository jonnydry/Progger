import React from "react";
import footerBg from "../assets/footer_bg_new_wide.webp";

interface FooterProps {
  onAboutClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAboutClick }) => {
  return (
    <footer className="relative w-full mt-16 overflow-hidden">
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--color-background)) 0%, transparent 50%)",
        }}
      />
      <div
        className="w-full h-40 md:h-52 bg-center bg-cover"
        style={{
          backgroundImage: `url(${footerBg})`,
          backgroundPosition: "center 45%",
          imageRendering: "pixelated",
        }}
        role="img"
        aria-label="Pixel art pond landscape with frog playing guitar"
      />
      <div className="absolute bottom-0 w-full py-2 bg-black/30 backdrop-blur-[2px] text-white/80 text-sm font-medium">
        <div className="flex justify-center items-center gap-4 px-4">
          <span className="text-center">Powered by xAI Grok</span>
          {onAboutClick && (
            <button
              onClick={onAboutClick}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs border border-white/30 hover:border-white/50 transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md font-mono tracking-wider whitespace-nowrap"
              style={{ imageRendering: "pixelated" }}
            >
              [?] ABOUT
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
