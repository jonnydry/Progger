import React, { useMemo } from 'react';
import { ThemeSelector } from './ThemeSelector';
import type { ThemeOption } from '@/constants';
import proggerLogo from '../../attached_assets/Progger1MonoTransX32_1761526977420.png';

interface GlassmorphicHeaderProps {
  theme: string;
  toggleTheme: () => void;
  themes: ThemeOption[];
  selectedThemeIndex: number;
  onThemeSelect: (index: number) => void;
  userProfile?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
  onLogin?: () => void;
  onLogout?: () => void;
  onStashClick?: () => void;
}

export const GlassmorphicHeader: React.FC<GlassmorphicHeaderProps> = ({
  theme,
  toggleTheme,
  themes,
  selectedThemeIndex,
  onThemeSelect,
  userProfile,
  onLogin,
  onLogout,
  onStashClick,
}) => {
  const headerStyle = useMemo(() => ({
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    background: theme === 'dark'
      ? 'rgba(0, 0, 0, 0.75)'
      : 'rgba(255, 255, 255, 0.75)',
    borderBottom: theme === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.15)'
      : '1px solid rgba(0, 0, 0, 0.15)',
    boxShadow: theme === 'dark'
      ? '0 1px 3px rgba(0, 0, 0, 0.2)'
      : '0 1px 3px rgba(0, 0, 0, 0.1)',
  }), [theme]);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={headerStyle}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-2">
            <img 
              src={proggerLogo} 
              alt="Progger mascot" 
              className="h-8 w-8"
            />
            <h1 className="font-grotesk text-2xl font-bold text-text/90 tracking-tight hidden sm:block">
              PROGGER
            </h1>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2">
            {/* Stash Button - Only show for logged in users */}
            {userProfile && onStashClick && (
              <button
                onClick={onStashClick}
                className="p-2 rounded-full text-text/70 hover:bg-surface/50 hover:text-text transition-all duration-300"
                aria-label="Open stash"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </button>
            )}

            {/* Theme Color Selector */}
            <ThemeSelector
              themes={themes}
              selectedIndex={selectedThemeIndex}
              onSelect={onThemeSelect}
            />

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-text/70 hover:bg-surface/50 hover:text-text transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Login/Profile Section */}
            {userProfile ? (
              <div className="relative group">
                <button
                  className="flex items-center space-x-2 p-2 rounded-full text-text/70 hover:bg-surface/50 hover:text-text transition-all duration-300"
                  aria-label="User menu"
                >
                  {userProfile.avatar ? (
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="h-8 w-8 rounded-full border-2 border-primary/50"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-primary font-semibold">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  style={{
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    background: theme === 'dark' 
                      ? 'rgba(20, 20, 20, 0.9)' 
                      : 'rgba(255, 255, 255, 0.9)',
                    border: theme === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <div className="px-4 py-3 border-b border-border/30">
                    <p className="text-sm font-medium text-text">{userProfile.name}</p>
                    <p className="text-xs text-text/60 truncate">{userProfile.email}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-text/80 hover:bg-primary/20 hover:text-primary transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="px-4 py-2 rounded-full bg-primary/90 hover:bg-primary text-background font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
