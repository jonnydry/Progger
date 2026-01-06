import React, { useState, useEffect, useMemo, useCallback } from "react";
import { VoicingDiagram } from "./VoicingDiagram";
import type { ChordInProgression, ProgressionResult } from "@/types";
import { ChordDetailView } from "./ChordDetailView";
import { displayChordName } from "@/utils/musicTheory";
import { useSaveToStash } from "../hooks/useStash";
import { PixelCard } from "./PixelCard";
import { PixelButton } from "./PixelButton";
import { IntervalArrow } from "./IntervalArrow";

interface VoicingsGridProps {
  progression: ChordInProgression[];
  isLoading: boolean;
  skeletonCount?: number;
  musicalKey: string;
  currentMode?: string;
  progressionResult?: ProgressionResult | null;
}

const SkeletonDiagram: React.FC = () => (
  <div className="flex flex-col items-center animate-pulse">
    <div className="h-7 w-24 bg-surface/80 rounded-md mb-3"></div>
    <div className="w-[180px] h-[202px] bg-surface rounded-lg border border-border"></div>
    <div className="h-8 w-20 bg-surface/80 rounded-full mt-4"></div>
  </div>
);

const ArrowButton: React.FC<{
  direction: "left" | "right";
  onClick: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  ariaLabel?: string;
}> = React.memo(({ direction, onClick, onKeyDown, ariaLabel }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
    // Also handle Enter/Space for accessibility
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={
        ariaLabel ||
        `Navigate to ${direction === "left" ? "previous" : "next"} voicing`
      }
      className="p-2 md:p-1.5 rounded-full bg-surface hover:bg-background text-text/80 hover:text-text transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] border-2 border-border active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        {direction === "left" ? (
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        )}
      </svg>
    </button>
  );
});

const generateAutoName = (
  key: string,
  mode: string,
  progression: ChordInProgression[],
): string => {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  // Create chord progression string (limit to first 4 chords to keep it concise)
  const chordNames = progression
    .slice(0, 4)
    .map((p) => displayChordName(p.chordName, key));
  const progressionStr = chordNames.join(" - ");
  const suffix = progression.length > 4 ? "..." : "";

  return `${key} ${mode} - ${progressionStr}${suffix} - ${dateStr} ${timeStr}`;
};

export const VoicingsGrid: React.FC<VoicingsGridProps> = ({
  progression,
  isLoading,
  skeletonCount = 4,
  musicalKey,
  currentMode,
  progressionResult,
}) => {
  const [voicingIndices, setVoicingIndices] = useState<number[]>([]);
  const [expandedChordIndex, setExpandedChordIndex] = useState<number | null>(
    null,
  );
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveName, setSaveName] = useState("");
  const saveToStash = useSaveToStash();

  useEffect(() => {
    // Reset indices when a new progression is loaded
    setVoicingIndices(new Array(progression.length).fill(0));
    setExpandedChordIndex(null);
    setShowSaveForm(false);
    setSaveName("");
  }, [progression]);

  const handleSave = async () => {
    if (!saveName.trim() || !progressionResult || !musicalKey || !currentMode) {
      return;
    }

    try {
      await saveToStash.mutateAsync({
        name: saveName.trim(),
        key: musicalKey,
        mode: currentMode,
        progressionData: progressionResult,
      });
      setSaveName("");
      setShowSaveForm(false);
    } catch (error) {
      console.error("Failed to save to stash:", error);
    }
  };

  const handleVoicingChange = useCallback(
    (chordIndex: number, direction: "next" | "prev") => {
      const numVoicings = progression[chordIndex].voicings.length;
      setVoicingIndices((prev) => {
        const newIndices = [...prev];
        const current = newIndices[chordIndex];
        if (direction === "next") {
          newIndices[chordIndex] = (current + 1) % numVoicings;
        } else {
          newIndices[chordIndex] = (current - 1 + numVoicings) % numVoicings;
        }
        return newIndices;
      });
    },
    [progression],
  );

  const handleChordClick = useCallback((index: number) => {
    setExpandedChordIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleOpenSaveForm = useCallback(() => {
    if (progressionResult && musicalKey && currentMode) {
      const autoName = generateAutoName(
        musicalKey,
        currentMode,
        progressionResult.progression,
      );
      setSaveName(autoName);
      setShowSaveForm(true);
    }
  }, [progressionResult, musicalKey, currentMode]);

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-6 mt-8 w-full max-w-6xl">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonDiagram key={i} />
        ))}
      </div>
    );
  }

  if (progression.length === 0) {
    return (
      <PixelCard className="text-center py-20 px-6 max-w-3xl mx-auto flex flex-col items-center">
        <div className="relative mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-text/30 relative"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3"
            />
          </svg>
        </div>
        <p className="text-xl font-semibold text-text">
          Your generated progression will appear here.
        </p>
        <p className="text-text/60">
          Select a key and mode, then click "Generate".
        </p>
      </PixelCard>
    );
  }

  const progressionText = useMemo(
    () =>
      progression
        .map((p) => displayChordName(p.chordName, musicalKey))
        .join(" - "),
    [progression, musicalKey],
  );

  const isCompact = progression.length > 4;

  return (
    <div className="flex flex-col items-center gap-10">
      <PixelCard className="text-center p-4 w-full max-w-4xl">
        <div className="flex items-center justify-center gap-4 mb-1">
          <h2 className="font-bebas text-3xl font-semibold text-text/80 tracking-wide">
            Generated Progression
          </h2>
          {progressionResult && currentMode && (
            <PixelButton
              onClick={handleOpenSaveForm}
              className="p-2 rounded-full"
              title="Save to Stash"
              aria-label="Save progression to stash"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
            </PixelButton>
          )}
        </div>
        <p className="text-3xl tracking-wider text-text">{progressionText}</p>
        {showSaveForm && (
          <div className="mt-4 space-y-3 max-w-md mx-auto">
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Enter a name for this progression..."
              className="w-full px-4 py-2 bg-background border-2 border-border text-text placeholder-text/50 focus:outline-none focus:border-primary"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
              onFocus={(e) => e.target.select()}
              autoFocus
            />
            <div className="flex space-x-2">
              <PixelButton
                onClick={handleSave}
                disabled={!saveName.trim() || saveToStash.isPending}
                className="flex-1"
              >
                {saveToStash.isPending ? "Saving..." : "Save"}
              </PixelButton>
              <PixelButton
                variant="secondary"
                onClick={() => {
                  setShowSaveForm(false);
                  setSaveName("");
                }}
                className="flex-1"
              >
                Cancel
              </PixelButton>
            </div>
          </div>
        )}
      </PixelCard>
      <div className="flex flex-wrap justify-center items-center w-full max-w-7xl px-4">
        {progression.map((chord, index) => {
          const currentVoicingIndex = voicingIndices[index] ?? 0;
          const currentVoicing = chord.voicings[currentVoicingIndex];

          if (!currentVoicing) return null;

          const displayedChordName = displayChordName(
            chord.chordName,
            musicalKey,
          );
          const isExpanded = expandedChordIndex === index;
          const nextChord = progression[index + 1];

          return (
            <React.Fragment key={`${chord.chordName}-${index}`}>
              <PixelCard
                noAnimate
                className={`
                      flex flex-col items-center transition-all duration-300 relative
                      ${isCompact ? "w-[160px] p-1.5 gap-1" : "w-[220px] p-4 gap-2"}
                      ${isExpanded ? "scale-105 z-10 border-primary" : "hover:scale-105"}
                  `}
              >
                <div
                  onClick={() => handleChordClick(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleChordClick(index);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  className="cursor-pointer w-full focus:outline-none"
                  aria-label={`View details for ${displayedChordName}`}
                  aria-expanded={isExpanded}
                >
                  <div
                    key={currentVoicingIndex}
                    className="animate-cross-fade-in w-full"
                  >
                    <VoicingDiagram
                      chordName={displayedChordName}
                      voicing={currentVoicing}
                      className="w-full border-none shadow-none bg-transparent p-0"
                    />
                  </div>
                </div>

                <div
                  className={`flex items-center justify-between w-full ${isCompact ? "mt-1" : "mt-3"}`}
                  role="group"
                  aria-label={`Voicing navigation for ${displayedChordName}`}
                >
                  <ArrowButton
                    direction="left"
                    onClick={() => handleVoicingChange(index, "prev")}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowLeft") {
                        e.preventDefault();
                        handleVoicingChange(index, "prev");
                      }
                    }}
                    ariaLabel={`Previous voicing for ${displayedChordName}`}
                  />
                  <span className="text-xs text-text/60 font-medium tabular-nums">
                    {currentVoicingIndex + 1}/{chord.voicings.length}
                  </span>
                  <ArrowButton
                    direction="right"
                    onClick={() => handleVoicingChange(index, "next")}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight") {
                        e.preventDefault();
                        handleVoicingChange(index, "next");
                      }
                    }}
                    ariaLabel={`Next voicing for ${displayedChordName}`}
                  />
                </div>
              </PixelCard>

              {nextChord && (
                <IntervalArrow
                  fromChord={chord.chordName}
                  toChord={nextChord.chordName}
                  isCompact={isCompact}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {expandedChordIndex !== null && progression[expandedChordIndex] && (
        <ChordDetailView
          chord={progression[expandedChordIndex]}
          musicalKey={musicalKey}
          onClose={() => setExpandedChordIndex(null)}
        />
      )}
    </div>
  );
};
