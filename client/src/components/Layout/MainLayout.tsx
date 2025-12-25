import React from "react";
import { GlassmorphicHeader } from "../GlassmorphicHeader";
import { Footer } from "../Footer";
import { StashSidebar } from "../StashSidebar";
import { About } from "../About";
import type { ProgressionResult } from "../../types";

interface MainLayoutProps {
  children: React.ReactNode;
  theme: string;
  toggleTheme: () => void;
  themes: any[];
  selectedThemeIndex: number;
  onThemeSelect: (index: number) => void;
  userProfile: any;
  onLogin: () => void;
  onLogout: () => void;
  isStashOpen: boolean;
  setIsStashOpen: (isOpen: boolean) => void;
  currentView: "home" | "about";
  setCurrentView: (view: "home" | "about") => void;
  isProggerTheme: boolean;
  // Stash props
  currentKey: string;
  currentMode: string;
  currentProgression: ProgressionResult | null;
  onLoadProgression: (
    key: string,
    mode: string,
    progression: ProgressionResult,
  ) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  theme,
  toggleTheme,
  themes,
  selectedThemeIndex,
  onThemeSelect,
  userProfile,
  onLogin,
  onLogout,
  isStashOpen,
  setIsStashOpen,
  currentView,
  setCurrentView,
  isProggerTheme,
  currentKey,
  currentMode,
  currentProgression,
  onLoadProgression,
}) => {
  return (
    <div
      className={`min-h-screen bg-background flex flex-col ${isProggerTheme ? "progger-theme" : ""}`}
    >
      <GlassmorphicHeader
        theme={theme}
        toggleTheme={toggleTheme}
        themes={themes}
        selectedThemeIndex={selectedThemeIndex}
        onThemeSelect={onThemeSelect}
        userProfile={userProfile}
        onLogin={onLogin}
        onLogout={onLogout}
        onStashClick={() => setIsStashOpen(true)}
        onAboutClick={() => setCurrentView("about")}
      />
      <StashSidebar
        isOpen={isStashOpen}
        onClose={() => setIsStashOpen(false)}
        theme={theme}
        currentKey={currentKey}
        currentMode={currentMode}
        currentProgression={currentProgression}
        onLoadProgression={onLoadProgression}
      />
      <main className="container mx-auto px-4 pt-6 pb-10 md:pt-8 md:pb-16 flex-grow">
        {currentView === "home" ? (
          children
        ) : (
          <About onBackClick={() => setCurrentView("home")} />
        )}
      </main>
      <Footer onAboutClick={() => setCurrentView("about")} />
    </div>
  );
};
