import React from "react";
import proggerMascot from "../assets/progger-logo.webp";
import { PixelCard } from "./PixelCard";
import { PixelButton } from "./PixelButton";

interface AboutProps {
  onBackClick: () => void;
}

export const About: React.FC<AboutProps> = ({ onBackClick }) => {
  return (
    <div className="container mx-auto px-4 pt-6 pb-10 md:pt-8 md:pb-16 flex-grow flex flex-col items-center justify-center min-h-[60vh]">
      <PixelCard className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <img
            src={proggerMascot}
            alt="Progger Mascot"
            className="w-24 h-auto mx-auto mb-4 pixelated"
          />
          <h1 className="font-grotesk text-4xl font-bold text-text mb-2 tracking-wider">
            ABOUT PROGGER
          </h1>
          <div className="h-1 w-20 bg-primary mx-auto"></div>
        </div>

        <div className="space-y-6 text-text/80 font-mono text-sm md:text-base leading-relaxed">
          <p>
            <strong className="text-primary">Progger</strong> is an AI-powered
            chord progression generator designed to help musicians discover new
            sounds and voicings.
          </p>

          <p>
            Whether you're stuck in a creative rut or looking for the perfect
            bridge, Progger uses advanced algorithms to suggest unique harmonic
            possibilities tailored to your selected key and mode.
          </p>

          <div className="bg-background/50 p-4 border border-border">
            <h3 className="font-bold text-text mb-2">Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-text/70">
              <li>AI-driven chord generation</li>
              <li>Custom progression analysis</li>
              <li>Interactive scale diagrams</li>
              <li>Guitar voicing visualizations</li>
            </ul>
          </div>

          <p className="text-xs text-center text-text/50 mt-8 pt-4 border-t border-border">
            Powered by xAI Grok • Built with React & TypeScript
          </p>
        </div>

        <div className="mt-10 text-center">
          <PixelButton onClick={onBackClick} className="px-6 py-3">
            ← BACK TO HOME
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  );
};
