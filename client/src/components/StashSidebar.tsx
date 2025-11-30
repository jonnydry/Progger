import React, { useState, useMemo } from 'react';
import { useStash, useSaveToStash, useDeleteFromStash } from '../hooks/useStash';
import type { ProgressionResult, StashItemData } from '../types';

interface StashSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  currentKey?: string;
  currentMode?: string;
  currentProgression?: ProgressionResult | null;
  onLoadProgression?: (key: string, mode: string, progression: ProgressionResult) => void;
}

export const StashSidebar: React.FC<StashSidebarProps> = ({
  isOpen,
  onClose,
  theme,
  currentKey,
  currentMode,
  currentProgression,
  onLoadProgression,
}) => {
  const { data: stashItems = [], isLoading } = useStash();
  const saveToStash = useSaveToStash();
  const deleteFromStash = useDeleteFromStash();
  const [saveName, setSaveName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const sidebarStyle = useMemo(() => ({
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    background: theme === 'dark'
      ? 'rgba(0, 0, 0, 0.75)'
      : 'rgba(255, 255, 255, 0.75)',
    borderLeft: theme === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: theme === 'dark'
      ? '-4px 0 6px -1px rgba(0, 0, 0, 0.3), -2px 0 4px -1px rgba(0, 0, 0, 0.2)'
      : '-4px 0 6px -1px rgba(0, 0, 0, 0.1), -2px 0 4px -1px rgba(0, 0, 0, 0.06)',
  }), [theme]);

  const cardStyle = useMemo(() => ({
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    background: theme === 'dark'
      ? 'rgba(30, 30, 30, 0.6)'
      : 'rgba(240, 240, 240, 0.6)',
    border: theme === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.1)',
  }), [theme]);

  const handleSave = async () => {
    if (!saveName.trim() || !currentProgression || !currentKey || !currentMode) {
      return;
    }

    // Clear any previous errors
    setSaveError(null);

    try {
      await saveToStash.mutateAsync({
        name: saveName.trim(),
        key: currentKey,
        mode: currentMode,
        progressionData: currentProgression,
      });
      setSaveName('');
      setShowSaveForm(false);
      setSaveError(null);
    } catch (error) {
      console.error('Failed to save to stash:', error);
      // Extract error message from the error object
      const errorMessage = error instanceof Error ? error.message : 'Failed to save to stash. Please try again.';
      setSaveError(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item from your stash?')) {
      try {
        await deleteFromStash.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete from stash:', error);
      }
    }
  };

  const handleLoad = (item: StashItemData) => {
    if (onLoadProgression) {
      onLoadProgression(item.key, item.mode, item.progressionData);
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={sidebarStyle}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/30">
            <h2 className="text-2xl font-bebas tracking-wide text-text/90">
              MY STASH
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-text/70 hover:bg-surface/50 hover:text-text transition-all duration-300"
              aria-label="Close stash"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Save Current Progression Section */}
          {currentProgression && (
            <div className="p-6 border-b border-border/30">
              {!showSaveForm ? (
                <button
                  onClick={() => setShowSaveForm(true)}
                  className="w-full py-3 px-4 rounded-lg bg-primary/90 hover:bg-primary text-background font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Save Current</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => {
                      setSaveName(e.target.value);
                      // Clear error when user starts typing
                      if (saveError) {
                        setSaveError(null);
                      }
                    }}
                    placeholder="Enter a name..."
                    className={`w-full px-4 py-2 rounded-lg bg-surface/50 border text-text placeholder-text/50 focus:outline-none focus:ring-2 ${
                      saveError
                        ? 'border-red-500/50 focus:ring-red-500/50'
                        : 'border-border/30 focus:ring-primary/50'
                    }`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSave();
                      }
                    }}
                  />
                  {saveError && (
                    <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
                      <p className="text-sm text-red-500/90">{saveError}</p>
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={!saveName.trim() || saveToStash.isPending}
                      className="flex-1 py-2 px-4 rounded-lg bg-primary/90 hover:bg-primary text-background font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saveToStash.isPending ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setShowSaveForm(false);
                        setSaveName('');
                        setSaveError(null);
                      }}
                      className="flex-1 py-2 px-4 rounded-lg bg-surface/50 hover:bg-surface text-text font-medium transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stash Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isLoading ? (
              <div className="text-center text-text/60 py-8">
                Loading stash...
              </div>
            ) : stashItems.length === 0 ? (
              <div className="text-center text-text/60 py-8">
                <p className="mb-2">Your stash is empty</p>
                <p className="text-sm">Generate a progression and save it here!</p>
              </div>
            ) : (
              stashItems.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-lg p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-fade-scale-in"
                  style={{
                    ...cardStyle,
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'backwards',
                  }}
                  onClick={() => handleLoad(item)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-text/90 text-lg">
                      {item.name}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="p-1 rounded-full text-text/50 hover:text-red-500 hover:bg-red-500/20 transition-all duration-300"
                      aria-label="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-text/70">
                    <span className="font-medium text-primary">{item.key}</span>
                    <span>•</span>
                    <span>{item.mode}</span>
                    <span>•</span>
                    <span>{item.progressionData.progression.length} chords</span>
                  </div>
                  <div className="mt-2 text-xs text-text/50">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
