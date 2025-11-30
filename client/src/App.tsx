import React, { useState, useCallback, useEffect, useMemo, lazy, Suspense, useRef } from 'react';
import { Controls } from './components/Controls';
import { VoicingsGrid } from './components/VoicingsGrid';
import { SkeletonScaleDiagram } from './components/ScaleDiagram';
import { MainLayout } from './components/Layout/MainLayout';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { useGenerateProgression, useAnalyzeCustomProgression } from './hooks/useProgression';
import { validateChordLibrary, preloadAllChords } from './utils/chordLibrary';
import { formatChordDisplayName } from './utils/chordFormatting';
import { splitChordName, isSupportedChordQuality } from '@shared/music/chordQualities';
import { detectKey } from './utils/smartChordSuggestions';
import type { ProgressionResult } from './types';
import { KEYS, MODES, COMMON_PROGRESSIONS } from './constants';
import proggerMascot from '../../attached_assets/ProggerLogoMono2Lily_1761527600239.png';

const LazyScaleDiagram = lazy(() => import('./components/ScaleDiagram'));

const App: React.FC = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { theme, themes, themeIndex, setThemeIndex, toggleTheme, isProggerTheme } = useTheme();

  const generateMutation = useGenerateProgression();
  const analyzeMutation = useAnalyzeCustomProgression();

  const [key, setKey] = useState<string>(KEYS[0]);
  const [mode, setMode] = useState<string>(MODES[0].value);
  const [selectedProgression, setSelectedProgression] = useState<string>(COMMON_PROGRESSIONS[0].value);
  const [numChords, setNumChords] = useState<number>(4);
  const [includeTensions, setIncludeTensions] = useState<boolean>(false);
  const [progressionResult, setProgressionResult] = useState<ProgressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isStashOpen, setIsStashOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customProgression, setCustomProgression] = useState<Array<{ root: string; quality: string }>>([
    { root: 'C', quality: 'major' },
    { root: 'A', quality: 'minor' },
    { root: 'F', quality: 'major' },
    { root: 'G', quality: 'major' },
  ]);
  const [numCustomChords, setNumCustomChords] = useState<number>(4);
  const [customKey, setCustomKey] = useState<string>('C');
  const [customMode, setCustomMode] = useState<string>('Major');
  const [currentView, setCurrentView] = useState<'home' | 'about'>('home');
  const resultsRef = useRef<HTMLElement>(null);

  const isLoading = generateMutation.isPending || analyzeMutation.isPending;

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  useEffect(() => {
    validateChordLibrary();
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
    if (!isLoading && progressionResult && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isLoading, progressionResult]);

  useEffect(() => {
    (window as any).clearProgCache = () => console.log('Cache clearing is now handled by React Query');
    console.log('💡 Debug: Cache is now handled by React Query');
  }, []);

  useEffect(() => {
    if (isCustomMode && customProgression.length > 0) {
      const detected = detectKey(customProgression);
      if (detected) {
        setCustomKey(detected.key);
        setCustomMode(detected.mode === 'major' ? 'Major' : 'Minor');
      }
    }
  }, [customProgression, isCustomMode]);

  const handleLoadProgression = useCallback((loadedKey: string, loadedMode: string, progression: ProgressionResult) => {
    setKey(loadedKey);
    setMode(loadedMode);
    setProgressionResult(progression);

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

  const handleGenerate = useCallback(() => {
    setError(null);
    setProgressionResult(null);
    generateMutation.mutate({
      key, mode, includeTensions, numChords: progressionLength, selectedProgression
    }, {
      onSuccess: (data) => setProgressionResult(data),
      onError: (err) => setError(err.message)
    });
  }, [key, mode, includeTensions, progressionLength, selectedProgression, generateMutation]);

  const handleAnalyzeCustom = useCallback(() => {
    setError(null);
    setProgressionResult(null);

    const formattedChords = customProgression.map(chord => formatChordDisplayName(chord.root, chord.quality));
    const invalidChords: string[] = [];
    for (const chordName of formattedChords) {
      const parsed = splitChordName(chordName);
      if (!isSupportedChordQuality(parsed.quality)) {
        invalidChords.push(chordName);
      }
    }

    if (invalidChords.length > 0) {
      setError(`Invalid chord${invalidChords.length > 1 ? 's' : ''}: ${invalidChords.join(', ')}. Please check your chord selections.`);
      return;
    }

    analyzeMutation.mutate(formattedChords, {
      onSuccess: (result) => {
        setProgressionResult(result);
        if (result.detectedKey && result.detectedMode) {
          const normalizedKey = result.detectedKey.replace(/m$/i, '');
          setCustomKey(normalizedKey);
          setCustomMode(result.detectedMode);
        }
      },
      onError: (err) => setError(err.message)
    });
  }, [customProgression, analyzeMutation]);

  const skeletonCount = useMemo(() => {
    return isCustomMode ? numCustomChords : progressionLength;
  }, [isCustomMode, numCustomChords, progressionLength]);

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
      isProggerTheme={isProggerTheme}
      currentKey={isCustomMode ? customKey : key}
      currentMode={isCustomMode ? customMode : mode}
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
          Discover unique progressions and voicings with AI
        </p>
      </header>

      <section className="max-w-3xl mx-auto bg-surface rounded-lg p-4 md:p-6 shadow-sm border-2 border-border" style={{ borderStyle: 'solid' }}>
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
    </MainLayout>
  );
};

export default App;