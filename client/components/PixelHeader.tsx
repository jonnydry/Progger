import React, { useMemo } from 'react';
import { ThemeSelector } from './ThemeSelector';
import type { ThemeOption } from '@/constants';
import proggerLogo from '../../attached_assets/ProggerLogoMono2Lily_1761527600239.png';

interface PixelHeaderProps {
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

export const PixelHeader: React.FC<PixelHeaderProps> = ({
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

    return (
        <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur-sm shadow-sm transition-colors duration-300">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo / Brand */}
                    <div className="flex items-center space-x-3 group cursor-pointer">
                        <div className="relative">
                            <img
                                src={proggerLogo}
                                alt="Progger mascot"
                                className="h-10 w-10 image-pixelated transition-transform group-hover:scale-110 duration-200"
                            />
                            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-accent animate-pulse" style={{ imageRendering: 'pixelated' }}></div>
                        </div>
                        <h1 className="font-grotesk text-2xl font-bold text-text tracking-tight hidden sm:block group-hover:text-accent transition-colors">
                            PROGGER
                        </h1>
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center space-x-3">
                        {/* Stash Button - Only show for logged in users */}
                        {userProfile && onStashClick && (
                            <button
                                onClick={onStashClick}
                                className="p-2 border-2 border-transparent hover:border-border hover:bg-surface text-text/70 hover:text-text transition-all duration-200 active:translate-y-0.5"
                                aria-label="Open stash"
                                title="Your Stash"
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
                            className="p-2 border-2 border-transparent hover:border-border hover:bg-surface text-text/70 hover:text-text transition-all duration-200 active:translate-y-0.5"
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
                                    className="flex items-center space-x-2 p-1 pr-3 border-2 border-transparent hover:border-border hover:bg-surface transition-all duration-200"
                                    aria-label="User menu"
                                >
                                    {userProfile.avatar ? (
                                        <img
                                            src={userProfile.avatar}
                                            alt={userProfile.name}
                                            className="h-8 w-8 border-2 border-primary image-pixelated"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 bg-primary/20 border-2 border-primary flex items-center justify-center text-primary font-bold">
                                            {userProfile.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-sm font-medium hidden md:block max-w-[100px] truncate">
                                        {userProfile.name.split(' ')[0]}
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="bg-surface border-2 border-border shadow-xl p-1">
                                        <div className="px-3 py-2 border-b-2 border-border/50 mb-1">
                                            <p className="text-sm font-bold text-text truncate">{userProfile.name}</p>
                                            <p className="text-xs text-text/60 truncate font-mono">{userProfile.email}</p>
                                        </div>
                                        <button
                                            onClick={onLogout}
                                            className="w-full text-left px-3 py-2 text-sm font-medium text-text/80 hover:bg-primary hover:text-background transition-colors"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={onLogin}
                                className="px-5 py-2 bg-primary text-background font-bold border-b-4 border-primary/50 hover:border-b-0 hover:translate-y-1 active:translate-y-1 transition-all duration-100 shadow-lg"
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
