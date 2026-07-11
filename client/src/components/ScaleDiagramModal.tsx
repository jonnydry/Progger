import React from "react";
import type { ScaleInfo } from "../types";
import { ScaleDiagram } from "./ScaleDiagram";
import { PixelCard } from "./PixelCard";

interface ScaleDiagramModalProps {
  scaleInfo: ScaleInfo;
  musicalKey: string;
  mode?: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Full-screen modal wrapper around ScaleDiagram (presentation="modal").
 * Keeps overlay/chrome here; fretboard logic lives in ScaleDiagram.
 */
const ScaleDiagramModal: React.FC<ScaleDiagramModalProps> = ({
  scaleInfo,
  musicalKey,
  mode,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <PixelCard
        noAnimate
        className="w-[95vw] max-w-7xl max-h-[90vh] !p-0 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end items-center px-4 py-3 border-b border-border bg-background/50">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-background text-text/70 hover:text-text transition-colors duration-200"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-auto p-4 md:p-6">
          <ScaleDiagram
            scaleInfo={scaleInfo}
            musicalKey={musicalKey}
            mode={mode}
            presentation="modal"
          />
        </div>
      </PixelCard>
    </div>
  );
};

export default React.memo(ScaleDiagramModal);
