import React, { useState, useCallback, useEffect, useMemo, lazy, Suspense, useRef } from 'react';
import { Controls } from './components/Controls';
import { VoicingsGrid } from './components/VoicingsGrid';
import { SkeletonScaleDiagram } from './components/ScaleDiagram';
import { GlassmorphicHeader } from './components/GlassmorphicHeader';
import { StashSidebar } from './components/StashSidebar';
import { useAuth } from './hooks/useAuth';
import { generateChordProgression, clearAllProgressionCache } from './services/xaiService';
import { validateChordLibrary } from './utils/chordLibrary';
import type { ProgressionResult } from './types';
import { KEYS, MODES, THEMES, COMMON_PROGRESSIONS } from './constants';
import proggerMascot from '../attached_assets/ProggerLogoMono2Lily_1761527600239.png';

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
  const resultsRef = useRef<HTMLElement>(null);

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  useEffect(() => {
    validateChordLibrary();
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

  const skeletonCount = progressionLength;

  const isProggerTheme = THEMES[themeIndex].name === 'PROGGER';

  return (
    <div className={`min-h-screen bg-background ${isProggerTheme ? 'progger-theme' : ''}`}>
      <GlassmorphicHeader
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
        currentKey={key}
        currentMode={mode}
        currentProgression={progressionResult}
        onLoadProgression={handleLoadProgression}
      />
      <main className="container mx-auto px-4 pt-6 pb-10 md:pt-8 md:pb-16">
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

        <section className="max-w-3xl mx-auto bg-surface rounded-lg p-6 shadow-sm border-2 border-border" style={{ borderStyle: 'solid' }}>
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
      </main>
      <footer className="text-center py-6 text-text/50">
        <p>Powered by xAI Grok</p>
      </footer>
    </div>
  );
};

export default App;