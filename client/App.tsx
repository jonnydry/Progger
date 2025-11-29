import React, { useState, useCallback, useEffect, useMemo, lazy, Suspense, useRef } from 'react';
import { Controls } from './components/Controls';
import { VoicingsGrid } from './components/VoicingsGrid';
import { SkeletonScaleDiagram } from './components/ScaleDiagram';
import { PixelHeader } from './components/PixelHeader';
import { StashSidebar } from './components/StashSidebar';
import { useAuth } from './hooks/useAuth';
import { generateChordProgression, analyzeCustomProgression, clearAllProgressionCache } from './services/xaiService';
import { validateChordLibrary, preloadAllChords } from './utils/chordLibrary';
import { formatChordDisplayName } from './utils/chordFormatting';
import { splitChordName, isSupportedChordQuality } from '@shared/music/chordQualities';
import { detectKey } from './utils/smartChordSuggestions';
import type { ProgressionResult } from './types';
import { KEYS, MODES, THEMES, COMMON_PROGRESSIONS } from './constants';
import proggerMascot from '../attached_assets/ProggerLogoMono2Lily_1761527600239.png';
import { PixelLoader } from './components/PixelLoader';

const LazyScaleDiagram = lazy(() => import('./components/ScaleDiagram'));

const getInitialThemeIndex = (): number => {
  const savedIndex = localStorage.getItem('themeColorIndex');
  if (savedIndex) {
    const index = parseInt(savedIndex, 10);
    if (index >= 0 && index < THEMES.length) {
      return index;
    }
  }
  return 5; // Default to Crimson Noir theme
};

const App: React.FC = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [key, setKey] = useState<string>(KEYS[0]);
  const [mode, setMode] = useState<string>(MODES[0].value);
  const [selectedProgression, setSelectedProgression] = useState<string>(COMMON_PROGRESSIONS[0].value);
  const [numChords, setNumChords] = useState<number>(4);
  const [includeTensions, setIncludeTensions] = useState<boolean>(false);
  const [progressionResult, setProgressionResult] = useState<ProgressionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [themeIndex, setThemeIndex] = useState<number>(getInitialThemeIndex);
  const [isStashOpen, setIsStashOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customProgression, setCustomProgression] = useState<Array<{ root: string; quality: string }>>([
    { root: 'C', quality: 'major' },
    { root: 'A', quality: 'minor' },
    { root: 'F', quality: 'major' },
    { root: 'G', quality: 'major' },
  ]);
  const [numCustomChords, setNumCustomChords] = useState<number>(4);
  // Custom mode key/mode detection (for accurate stash metadata)
  const [customKey, setCustomKey] = useState<string>('C');
  const [customMode, setCustomMode] = useState<string>('Major');
  const resultsRef = useRef<HTMLElement>(null);

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  useEffect(() => {
    validateChordLibrary();

    // Preload all chord data for code splitting optimization
    // This runs in background and enables ~90% bundle size reduction (220KB → 22KB initial)
    preloadAllChords().catch(err => {
      console.warn('Failed to preload chord data:', err);
    });
  }, []);

  const userProfile = useMemo(() => user ? {
    name: user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : user.email || 'User',
    email: user.email || '',
    avatar: user.profileImageUrl || undefined,
  } : null, [user]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const currentTheme = THEMES[themeIndex];
    localStorage.setItem('themeColorIndex', String(themeIndex));

    const colors = theme === 'dark' ? currentTheme.dark : currentTheme.light;

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

  }, [themeIndex, theme]);

  useEffect(() => {
    if (!isLoading && progressionResult && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isLoading, progressionResult]);

  // Expose cache clearing function for debugging
  useEffect(() => {
    (window as any).clearProgCache = clearAllProgressionCache;
    console.log('💡 Debug: Call window.clearProgCache() to clear all progression cache');
  }, []);

  // Auto-detect key/mode for custom progressions (for accurate stash metadata)
  useEffect(() => {
    if (isCustomMode && customProgression.length > 0) {
      const detected = detectKey(customProgression);
      if (detected) {
        setCustomKey(detected.key);
        setCustomMode(detected.mode === 'major' ? 'Major' : 'Minor');
      }
    }
  }, [customProgression, isCustomMode]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleLoadProgression = useCallback((loadedKey: string, loadedMode: string, progression: ProgressionResult) => {
    setKey(loadedKey);
    setMode(loadedMode);
    setProgressionResult(progression);

    // Scroll to results after a brief delay to allow state to update
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, []);

  const progressionLength = useMemo(() =>
    selectedProgression === 'auto' ? numChords : selectedProgression.split('-').length,
    [selectedProgression, numChords]
  );

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setProgressionResult(null);

    try {
      const result = await generateChordProgression(key, mode, includeTensions, progressionLength, selectedProgression);
      setProgressionResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [key, mode, includeTensions, progressionLength, selectedProgression]);

  const handleAnalyzeCustom = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setProgressionResult(null);

    try {
      // Format chord names from root + quality
      const formattedChords = customProgression.map(chord => formatChordDisplayName(chord.root, chord.quality));

      // Pre-validate chords before sending to API
      const invalidChords: string[] = [];
      for (const chordName of formattedChords) {
        const parsed = splitChordName(chordName);
        if (!isSupportedChordQuality(parsed.quality)) {
          invalidChords.push(chordName);
        }
      }

      if (invalidChords.length > 0) {
        throw new Error(`Invalid chord${invalidChords.length > 1 ? 's' : ''}: ${invalidChords.join(', ')}. Please check your chord selections.`);
      }

      const result = await analyzeCustomProgression(formattedChords);
      setProgressionResult(result);

      // Hybrid approach: Use server-detected key/mode if available (most accurate)
      // Otherwise, client-side detection provides immediate feedback
      if (result.detectedKey && result.detectedMode) {
        // Normalize detectedKey: strip 'm' suffix if present
        const normalizedKey = result.detectedKey.replace(/m$/i, '');
        setCustomKey(normalizedKey);
        setCustomMode(result.detectedMode);

        console.debug('Using server-detected key/mode', {
          detectedKey: result.detectedKey,
          detectedMode: result.detectedMode,
          normalizedKey,
        });
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [customProgression]);

  const skeletonCount = useMemo(() => {
    return isCustomMode ? numCustomChords : progressionLength;
  }, [isCustomMode, numCustomChords, progressionLength]);

  const isProggerTheme = THEMES[themeIndex].name === 'PROGGER';

  return (
    <div className={`min-h-screen bg-background ${isProggerTheme ? 'progger-theme' : ''}`}>
      <PixelHeader
        theme={theme}
        toggleTheme={toggleTheme}
        themes={THEMES}
        selectedThemeIndex={themeIndex}
        onThemeSelect={setThemeIndex}
        userProfile={userProfile}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onStashClick={() => setIsStashOpen(true)}
      />
      <StashSidebar
        isOpen={isStashOpen}
        onClose={() => setIsStashOpen(false)}
        theme={theme}
        currentKey={isCustomMode ? customKey : key}
        currentMode={isCustomMode ? customMode : mode}
        currentProgression={progressionResult}
        onLoadProgression={handleLoadProgression}
      />
      <main className="container mx-auto px-4 pt-6 pb-10 md:pt-8 md:pb-16">
        <header className="text-center mb-16">
          <img
            src={proggerMascot}
            alt="Progger - the guitar-playing frog mascot"
            className="w-32 sm:w-40 md:w-52 mx-auto mb-3 animate-slide-in image-pixelated"
          />
          <h1 className="font-grotesk text-4xl sm:text-5xl md:text-6xl font-bold text-text/90 tracking-wider">
            PROGGER
          </h1>
          <p className="text-lg text-text/60 mt-2 max-w-2xl mx-auto">
            Discover unique progressions and voicings with AI
          </p>
        </header>

        <section className="max-w-3xl mx-auto bg-surface rounded-lg p-4 md:p-6 shadow-sm border-2 border-border">
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
            onGenerate={handleGenerate}
            isLoading={isLoading}
            isCustomMode={isCustomMode}
            onCustomChange={setIsCustomMode}
            customProgression={customProgression}
            onCustomProgressionChange={setCustomProgression}
            numCustomChords={numCustomChords}
            onNumCustomChordsChange={setNumCustomChords}
            onAnalyzeCustom={handleAnalyzeCustom}
            detectedKey={customKey}
            detectedMode={customMode}
          />
        </section>

        <section ref={resultsRef} className="mt-16">
          {error && (
            <div className="text-center bg-red-400/20 border border-red-500/30 text-red-800 dark:bg-red-900/30 dark:border-red-700/50 dark:text-red-300 p-4 rounded-lg max-w-2xl mx-auto mb-8">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-16">
              <div className="flex justify-center py-12">
                <PixelLoader size="lg" />
              </div>
              <VoicingsGrid progression={[]} isLoading={true} skeletonCount={skeletonCount} musicalKey={key} currentMode={mode} progressionResult={progressionResult} />
              <SkeletonScaleDiagram />
            </div>
          )}

          {/* Result State */}
          {!isLoading && progressionResult && (
            <div className="space-y-16">
              <VoicingsGrid progression={progressionResult.progression} isLoading={false} musicalKey={key} currentMode={mode} progressionResult={progressionResult} />

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
                      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'backwards' }}
                    >
                      <LazyScaleDiagram scaleInfo={scale} musicalKey={key} />
                    </div>
                  ))}
                </Suspense>
              </div>
            </div>
          )}

          {/* Initial/Empty State */}
          {!isLoading && !progressionResult && !error && (
            <VoicingsGrid progression={[]} isLoading={false} musicalKey={key} currentMode={mode} progressionResult={progressionResult} />
          )}
        </section>
      </main>
      <footer className="text-center py-6 text-text/50">
        <p>Powered by xAI Grok</p>
      </footer>
    </div>
  );
};

export default App;