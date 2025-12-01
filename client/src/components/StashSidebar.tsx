import React, { useState } from 'react';
import { useStash, useSaveToStash, useDeleteFromStash } from '../hooks/useStash';
import type { ProgressionResult, StashItemData } from '../types';
import { PixelCard } from './PixelCard';
import { PixelButton } from './PixelButton';

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
        className={`fixed inset-0 bg-black/30 transition-opacity duration-300 z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 z-50 transition-transform duration-300 ease-in-out bg-surface border-l-2 border-border shadow-[-4px_0_0_0_rgba(0,0,0,0.2)] ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-border bg-background/50">
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
            <div className="p-6 border-b-2 border-border">
              {!showSaveForm ? (
                <PixelButton
                  onClick={() => setShowSaveForm(true)}
                  className="w-full py-3 px-4 flex items-center justify-center space-x-2"
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
                </PixelButton>
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
                    className={`w-full px-4 py-2 bg-surface/50 border-2 text-text placeholder-text/50 focus:outline-none ${saveError
                        ? 'border-red-500/50'
                        : 'border-border focus:border-primary'
                      }`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSave();
                      }
                    }}
                  />
                  {saveError && (
                    <div className="px-3 py-2 bg-red-500/10 border-2 border-red-500/30 text-sm text-red-500/90">
                      {saveError}
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <PixelButton
                      onClick={handleSave}
                      disabled={!saveName.trim() || saveToStash.isPending}
                      className="flex-1"
                    >
                      {saveToStash.isPending ? 'Saving...' : 'Save'}
                    </PixelButton>
                    <PixelButton
                      variant="secondary"
                      onClick={() => {
                        setShowSaveForm(false);
                        setSaveName('');
                        setSaveError(null);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </PixelButton>
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
                <PixelCard
                  key={item.id}
                  noAnimate
                  className="p-4 cursor-pointer hover:border-primary transition-colors duration-200"
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
                      className="p-1 text-text/50 hover:text-red-500 transition-colors duration-200"
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
                </PixelCard>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
