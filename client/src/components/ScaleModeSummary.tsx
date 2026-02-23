import React, { useMemo } from "react";
import { getScaleModeInsight } from "../utils/scaleModeInsights";

interface ScaleModeSummaryProps {
  scaleName: string;
  rootNote: string;
  musicalKey: string;
  className?: string;
}

const ScaleModeSummary: React.FC<ScaleModeSummaryProps> = ({
  scaleName,
  rootNote,
  musicalKey,
  className = "",
}) => {
  const insight = useMemo(
    () => getScaleModeInsight(scaleName, rootNote, musicalKey),
    [scaleName, rootNote, musicalKey],
  );

  const chips = useMemo(() => {
    const base: Array<{ label: string; value: string }> = [
      { label: "Formula", value: insight.formula || "N/A" },
    ];

    if (insight.isMajorSystemMode && insight.relativeMajor && insight.modeDegree) {
      base.push({
        label: "Relative",
        value: `${insight.relativeMajor} (${insight.modeDegree})`,
      });
    }

    if (insight.isMajorSystemMode) {
      if (insight.majorDelta && insight.majorDelta !== "none") {
        base.push({ label: "Color", value: insight.majorDelta });
      }
      return base;
    }

    base.push({ label: "Steps", value: insight.stepPattern || "N/A" });
    return base;
  }, [insight]);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <div
            key={chip.label}
            className="rounded-md border border-border bg-background/60 px-2.5 py-1.5"
          >
            <p className="text-[10px] leading-tight uppercase tracking-wide text-text/60">
              {chip.label}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-text/85">
              {chip.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ScaleModeSummary);
