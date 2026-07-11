import React, { useMemo, useState, Suspense, lazy } from "react";
import { KEYS } from "@/constants";
import { CustomSelect } from "./CustomSelect";
import { SkeletonScaleDiagram } from "./SkeletonScaleDiagram";
import { SCALE_LIBRARY, getScaleNotes, getScaleFingering } from "@/utils/scaleLibrary";
import type { ScaleInfo } from "@/types";

const LazyScaleDiagram = lazy(() => import("./ScaleDiagram"));

/** Human-readable labels for SCALE_LIBRARY keys */
const SCALE_TYPE_OPTIONS = Object.keys(SCALE_LIBRARY).map((key) => ({
  name: key
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" "),
  value: key,
}));

/**
 * AI-free scale reference: pick a root + scale type and browse full-neck 3NPS positions.
 */
export const ScaleReference: React.FC = () => {
  const [root, setRoot] = useState("C");
  const [scaleType, setScaleType] = useState("major");

  const scaleInfo = useMemo((): ScaleInfo => {
    const displayName = SCALE_TYPE_OPTIONS.find((o) => o.value === scaleType)?.name ?? scaleType;
    const notes = getScaleNotes(root, scaleType);
    const fingering = getScaleFingering(scaleType, root, 0);
    return {
      name: `${root} ${displayName}`,
      rootNote: root,
      notes,
      fingering,
    };
  }, [root, scaleType]);

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <CustomSelect label="Root" value={root} onChange={setRoot} options={KEYS} />
        <CustomSelect
          label="Scale"
          value={scaleType}
          onChange={setScaleType}
          options={SCALE_TYPE_OPTIONS}
        />
      </div>

      <p className="text-sm text-text/55 text-center">
        Full-neck 3-note-per-string positions — no AI required. Use Pattern, All, or Map.
      </p>

      <Suspense fallback={<SkeletonScaleDiagram />}>
        <LazyScaleDiagram scaleInfo={scaleInfo} musicalKey={root} mode={scaleType} />
      </Suspense>
    </div>
  );
};
