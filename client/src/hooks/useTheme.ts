import { useState, useEffect } from 'react';
import { THEMES } from '../constants';

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

export const useTheme = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [themeIndex, setThemeIndex] = useState<number>(getInitialThemeIndex);

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

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    const isProggerTheme = THEMES[themeIndex].name === 'PROGGER';

    return {
        theme,
        themeIndex,
        setThemeIndex,
        toggleTheme,
        isProggerTheme,
        themes: THEMES
    };
};
