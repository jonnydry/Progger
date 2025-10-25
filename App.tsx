import React, { useState, useCallback, useEffect, lazy, Suspense, useRef } from 'react';
import { Controls } from './components/Controls';
import { VoicingsGrid } from './components/VoicingsGrid';
import { SkeletonScaleDiagram } from './components/ScaleDiagram';
import { GlassmorphicHeader } from './components/GlassmorphicHeader';
import { generateChordProgression } from './services/xaiService';
import type { ProgressionResult } from './types';
import { KEYS, MODES, THEMES, COMMON_PROGRESSIONS } from './constants';

const LazyScaleDiagram = lazy(() => import('./components/ScaleDiagram'));

const getInitialThemeIndex = (): number => {
  const savedIndex = localStorage.getItem('themeColorIndex');
  if (savedIndex) {
    const index = parseInt(savedIndex, 10);
    if (index >= 0 && index < THEMES.length) {
      return index;
    }
  }
  return 5; // Default to the Crimson Noir theme
};

const App: React.FC = () => {
  const [key, setKey] = useState<string>(KEYS[0]);
  const [mode, setMode] = useState<string>(MODES[0]);
  const [selectedProgression, setSelectedProgression] = useState<string>(COMMON_PROGRESSIONS[0].value);
  const [numChords, setNumChords] = useState<number>(4);
  const [includeTensions, setIncludeTensions] = useState<boolean>(false);
  const [progressionResult, setProgressionResult] = useState<ProgressionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [themeIndex, setThemeIndex] = useState<number>(getInitialThemeIndex);
  const resultsRef = useRef<HTMLElement>(null);

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

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setProgressionResult(null);

    try {
      const progressionLength = selectedProgression === 'auto' ? numChords : selectedProgression.split('-').length;
      const result = await generateChordProgression(key, mode, includeTensions, progressionLength, selectedProgression);
      setProgressionResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [key, mode, includeTensions, numChords, selectedProgression]);

  const skeletonCount = selectedProgression === 'auto' ? numChords : selectedProgression.split('-').length;

  return (
    <div className="min-h-screen">
      <GlassmorphicHeader
        theme={theme}
        toggleTheme={toggleTheme}
        themes={THEMES}
        selectedThemeIndex={themeIndex}
        onThemeSelect={setThemeIndex}
        userProfile={null}
        onLogin={() => console.log('Login clicked')}
        onLogout={() => console.log('Logout clicked')}
      />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12">
          <h1 className="font-bebas text-5xl sm:text-6xl md:text-8xl font-bold text-text/90 tracking-wider">
            Chord & Scale Generator
          </h1>
          <p className="text-lg text-text/60 mt-2 max-w-2xl mx-auto">
            Discover unique progressions and voicings with AI
          </p>
        </header>

        <section className="max-w-3xl mx-auto bg-surface rounded-lg p-6 shadow-lg border border-border">
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
              <VoicingsGrid progression={[]} isLoading={true} skeletonCount={skeletonCount} />
              <SkeletonScaleDiagram />
            </div>
          )}

          {/* Result State */}
          {!isLoading && progressionResult && (
            <div className="space-y-16">
              <VoicingsGrid progression={progressionResult.progression} isLoading={false} />
              
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
                      <LazyScaleDiagram scaleInfo={scale} />
                    </div>
                  ))}
                </Suspense>
              </div>
            </div>
          )}

          {/* Initial/Empty State */}
          {!isLoading && !progressionResult && !error && (
            <VoicingsGrid progression={[]} isLoading={false} />
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