import React, { useState, useCallback, useEffect, useMemo, lazy, Suspense, useRef } from "react";
import { Controls } from "./components/Controls";
import { VoicingsGrid } from "./components/VoicingsGrid";
import { SkeletonScaleDiagram } from "./components/SkeletonScaleDiagram";
import { MainLayout } from "./components/Layout/MainLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScaleReference } from "./components/ScaleReference";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";
import { useGenerateProgression, useAnalyzeCustomProgression } from "./hooks/useProgression";
import { preloadRoots } from "./utils/chordLibrary";
import { splitChordName, isSupportedChordQuality } from "@shared/music/chordQualities";
import { detectKey } from "./utils/smartChordSuggestions";
import { transposeNote } from "./utils/musicTheory";
import type { CustomChordInput, ProgressionResult } from "./types";
import { KEYS, MODES, COMMON_PROGRESSIONS, MAX_CUSTOM_CHORDS } from "./constants";
import proggerMascot from "./assets/progger-logo.webp";
import { PixelCard } from "./components/PixelCard";
import { createChordId, toCanonicalChordNames } from "./utils/customProgression";

const LazyScaleDiagram = lazy(() => import("./components/ScaleDiagram"));

type WorkspaceMode = "generate" | "custom" | "scales";

interface ResultContext {
  key: string;
  mode: string;
}

const SectionErrorFallback: React.FC<{ label: string }> = ({ label }) => (
  <div className="bg-surface border border-border rounded-md p-6 text-center text-text/70">
    <p className="text-sm">
      Something went wrong rendering the {label}. Try regenerating or reloading the page.
    </p>
  </div>
);

/** Relative major (+3) for minor modes, relative minor (−3) for major modes. */
function getRelativeNeighborRoot(root: string, mode: string): string {
  const isMinor = /minor|aeolian/i.test(mode);
  return transposeNote(root, isMinor ? 3 : -3);
}

const App: React.FC = () => {
  const { user } = useAuth();
  const { theme, themes, themeIndex, setThemeIndex, toggleTheme } = useTheme();

  const generateMutation = useGenerateProgression();
  const analyzeMutation = useAnalyzeCustomProgression();

  const [key, setKey] = useState<string>(KEYS[0]);
  const [mode, setMode] = useState<string>(MODES[0].value);
  const [selectedProgression, setSelectedProgression] = useState<string>(
    COMMON_PROGRESSIONS[0].value
  );
  const [numChords, setNumChords] = useState<number>(4);
  const [includeTensions, setIncludeTensions] = useState<boolean>(false);
  const [generationStyle, setGenerationStyle] = useState<string>("balanced");
  const [progressionResult, setProgressionResult] = useState<ProgressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisWarning, setAnalysisWarning] = useState<string | null>(null);

  const [isStashOpen, setIsStashOpen] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("generate");
  const isCustomMode = workspaceMode === "custom";
  const [customProgression, setCustomProgression] = useState<CustomChordInput[]>(() => [
    { id: createChordId(), root: "C", quality: "major" },
    { id: createChordId(), root: "A", quality: "minor" },
    { id: createChordId(), root: "F", quality: "major" },
    { id: createChordId(), root: "G", quality: "major" },
  ]);
  const [customKey, setCustomKey] = useState<string>("C");
  const [customMode, setCustomMode] = useState<string>("Major");
  const [currentView, setCurrentView] = useState<"home" | "about">("home");
  const [resultContext, setResultContext] = useState<ResultContext | null>(null);
  const resultsRef = useRef<HTMLElement>(null);

  const isLoading = generateMutation.isPending || analyzeMutation.isPending;

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  // On-demand preload: current key + relative major/minor neighbor
  useEffect(() => {
    const activeRoot = isCustomMode ? customKey : key;
    const activeModeValue = isCustomMode ? customMode : mode;
    const roots = [activeRoot, getRelativeNeighborRoot(activeRoot, activeModeValue)];

    if (isCustomMode) {
      for (const chord of customProgression) {
        roots.push(chord.root);
      }
    }

    preloadRoots(roots);
  }, [key, mode, isCustomMode, customKey, customMode, customProgression]);

  const userProfile = useMemo(
    () =>
      user
        ? {
            name:
              user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`.trim()
                : user.email || "User",
            email: user.email || "",
            avatar: user.profileImageUrl || undefined,
          }
        : null,
    [user]
  );

  useEffect(() => {
    if (!isLoading && progressionResult && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isLoading, progressionResult]);

  useEffect(() => {
    if (!isLoading && !progressionResult && resultContext) {
      setResultContext(null);
    }
  }, [isLoading, progressionResult, resultContext]);

  useEffect(() => {
    if (isCustomMode && customProgression.length > 0) {
      const detected = detectKey(customProgression);
      if (detected) {
        setCustomKey(detected.key);
        setCustomMode(detected.mode === "major" ? "Major" : "Minor");
      }
    }
  }, [customProgression, isCustomMode]);

  const handleLoadProgression = useCallback(
    (loadedKey: string, loadedMode: string, progression: ProgressionResult) => {
      setKey(loadedKey);
      setMode(loadedMode);
      setProgressionResult(progression);
      setResultContext({ key: loadedKey, mode: loadedMode });
      setAnalysisWarning(null);
      setError(null);

      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    },
    []
  );

  const progressionLength = useMemo(
    () => (selectedProgression === "auto" ? numChords : selectedProgression.split("-").length),
    [selectedProgression, numChords]
  );

  const handleGenerate = useCallback(() => {
    setError(null);
    setAnalysisWarning(null);
    setProgressionResult(null);
    setResultContext({ key, mode });
    generateMutation.mutate(
      {
        key,
        mode,
        includeTensions,
        generationStyle,
        numChords: progressionLength,
        selectedProgression,
      },
      {
        onSuccess: (data) => setProgressionResult(data),
        onError: (err) => setError(err.message),
      }
    );
  }, [
    key,
    mode,
    includeTensions,
    generationStyle,
    progressionLength,
    selectedProgression,
    generateMutation,
  ]);

  const handleAnalyzeCustom = useCallback(() => {
    setError(null);
    setAnalysisWarning(null);
    setProgressionResult(null);
    setResultContext({ key: customKey, mode: customMode });

    if (customProgression.length > MAX_CUSTOM_CHORDS) {
      setError(`Custom progressions support up to ${MAX_CUSTOM_CHORDS} chords.`);
      return;
    }

    const formattedChords = toCanonicalChordNames(customProgression);
    const invalidChords: string[] = [];
    for (const chordName of formattedChords) {
      const parsed = splitChordName(chordName);
      if (!isSupportedChordQuality(parsed.quality)) {
        invalidChords.push(chordName);
      }
    }

    if (invalidChords.length > 0) {
      setError(
        `Invalid chord${invalidChords.length > 1 ? "s" : ""}: ${invalidChords.join(", ")}. Please check your chord selections.`
      );
      return;
    }

    analyzeMutation.mutate(formattedChords, {
      onSuccess: (result) => {
        setProgressionResult(result);
        if (result.analysisFailed) {
          setAnalysisWarning(
            result.analysisError ??
              "Analysis unavailable. Showing chord voicings without AI functions/scales."
          );
        } else {
          setAnalysisWarning(null);
        }
        let nextKey = customKey;
        let nextMode = customMode;
        if (result.detectedKey && result.detectedMode) {
          const normalizedKey = result.detectedKey.replace(/m$/i, "");
          setCustomKey(normalizedKey);
          setCustomMode(result.detectedMode);
          nextKey = normalizedKey;
          nextMode = result.detectedMode;
        }
        setResultContext({ key: nextKey, mode: nextMode });
      },
      onError: (err) => setError(err.message),
    });
  }, [customProgression, customKey, customMode, analyzeMutation]);

  const skeletonCount = useMemo(() => {
    return isCustomMode ? customProgression.length : progressionLength;
  }, [isCustomMode, customProgression.length, progressionLength]);

  const activeKey = resultContext?.key ?? (isCustomMode ? customKey : key);
  const activeMode = resultContext?.mode ?? (isCustomMode ? customMode : mode);

  return (
    <MainLayout
      theme={theme}
      toggleTheme={toggleTheme}
      themes={themes}
      selectedThemeIndex={themeIndex}
      onThemeSelect={setThemeIndex}
      userProfile={userProfile}
      onLogin={handleLogin}
      onLogout={handleLogout}
      isStashOpen={isStashOpen}
      setIsStashOpen={setIsStashOpen}
      currentView={currentView}
      setCurrentView={setCurrentView}
      currentKey={activeKey}
      currentMode={activeMode}
      currentProgression={progressionResult}
      onLoadProgression={handleLoadProgression}
    >
      <header className="text-center mb-16">
        <img
          src={proggerMascot}
          alt="Progger - the guitar-playing frog mascot"
          className="w-32 sm:w-40 md:w-52 mx-auto mb-3 animate-slide-in"
        />
        <h1 className="font-grotesk text-4xl sm:text-5xl md:text-6xl font-bold text-text/90 tracking-wider">
          PROGGER
        </h1>
        <p className="text-lg text-text/60 mt-2 max-w-2xl mx-auto">
          Chord &amp; scale reference for guitar — with AI progression inspiration
        </p>
      </header>

      <div className="mb-4 flex justify-center gap-1 bg-text/10 p-1 rounded-md w-fit mx-auto">
        {(
          [
            { id: "generate", label: "Generate" },
            { id: "custom", label: "Custom" },
            { id: "scales", label: "Scales" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setWorkspaceMode(tab.id)}
            className={`px-3 sm:px-4 py-1.5 text-sm font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
              workspaceMode === tab.id
                ? "bg-surface text-text shadow"
                : "text-text/60 hover:text-text"
            }`}
            aria-pressed={workspaceMode === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <PixelCard className="max-w-3xl mx-auto" noAnimate>
        {workspaceMode === "scales" ? (
          <ScaleReference />
        ) : (
          <Controls
            selectedKey={key}
            onKeyChange={setKey}
            selectedMode={mode}
            onModeChange={setMode}
            selectedProgression={selectedProgression}
            onProgressionChange={setSelectedProgression}
            numChords={numChords}
            onNumChordsChange={setNumChords}
            includeTensions={includeTensions}
            onTensionsChange={setIncludeTensions}
            generationStyle={generationStyle}
            onGenerationStyleChange={setGenerationStyle}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            isCustomMode={isCustomMode}
            onCustomChange={(enabled) => setWorkspaceMode(enabled ? "custom" : "generate")}
            customProgression={customProgression}
            onCustomProgressionChange={setCustomProgression}
            onAnalyzeCustom={handleAnalyzeCustom}
            detectedKey={customKey}
            detectedMode={customMode}
          />
        )}
      </PixelCard>

      {workspaceMode !== "scales" && (
      <section ref={resultsRef} className="mt-16">
        {error && (
          <div className="text-center bg-red-400/20 border border-red-500/30 text-red-800 dark:bg-red-900/30 dark:border-red-700/50 dark:text-red-300 p-4 rounded-lg max-w-2xl mx-auto mb-8">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {analysisWarning && !error && (
          <div className="text-center bg-amber-400/15 border border-amber-500/30 text-amber-900 dark:bg-amber-900/20 dark:border-amber-700/40 dark:text-amber-200 p-4 rounded-lg max-w-2xl mx-auto mb-8">
            <p className="font-semibold">Analysis unavailable</p>
            <p className="text-sm mt-1">{analysisWarning}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-16">
            <ErrorBoundary fallback={<SectionErrorFallback label="voicings" />}>
              <VoicingsGrid
                progression={[]}
                isLoading={true}
                skeletonCount={skeletonCount}
                musicalKey={activeKey}
                currentMode={activeMode}
                progressionResult={progressionResult}
              />
            </ErrorBoundary>
            <SkeletonScaleDiagram />
          </div>
        )}

        {/* Result State */}
        {!isLoading && progressionResult && (
          <div className="space-y-16">
            <ErrorBoundary fallback={<SectionErrorFallback label="voicings" />}>
              <VoicingsGrid
                progression={progressionResult.progression}
                isLoading={false}
                musicalKey={activeKey}
                currentMode={activeMode}
                progressionResult={progressionResult}
              />
            </ErrorBoundary>

            {progressionResult.scales.length > 0 && (
              <>
                <div className="text-center border-t border-border pt-12">
                  <h2 className="font-bebas text-4xl font-semibold text-text/80 tracking-wide">
                    Suggested Scales
                  </h2>
                </div>
                <div className="space-y-12">
                  <Suspense fallback={<SkeletonScaleDiagram />}>
                    {progressionResult.scales.map((scale, index) => (
                      <div
                        key={index}
                        className="animate-fade-scale-in"
                        style={{
                          animationDelay: `${index * 150}ms`,
                          animationFillMode: "backwards",
                        }}
                      >
                        <ErrorBoundary fallback={<SectionErrorFallback label="scale diagram" />}>
                          <LazyScaleDiagram
                            scaleInfo={scale}
                            musicalKey={activeKey}
                            mode={activeMode}
                          />
                        </ErrorBoundary>
                      </div>
                    ))}
                  </Suspense>
                </div>
              </>
            )}
          </div>
        )}

        {/* Initial/Empty State */}
        {!isLoading && !progressionResult && !error && (
          <VoicingsGrid
            progression={[]}
            isLoading={false}
            musicalKey={activeKey}
            currentMode={activeMode}
            progressionResult={progressionResult}
          />
        )}
      </section>
      )}
    </MainLayout>
  );
};

export default App;
