import { useState, useEffect, useRef } from 'react';
import type { ChordVoicing } from '@/types';
import { getChordVoicingsAsync } from '@/utils/chords';
import { formatChordDisplayName } from '@/utils/chordFormatting';

/**
 * Hook to manage live chord voicing preview with debouncing
 *
 * Debounces chord voicing loading to avoid performance issues during
 * rapid wheel picker scrolling
 */
export function useChordVoicingPreview(
  root: string,
  quality: string,
  debounceMs: number = 150
): {
  voicing: ChordVoicing | null;
  isLoading: boolean;
} {
  const [voicing, setVoicing] = useState<ChordVoicing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsLoading(true);

    // Debounce the voicing load
    timeoutRef.current = setTimeout(async () => {
      try {
        const chordName = formatChordDisplayName(root, quality);
        const voicings = await getChordVoicingsAsync(chordName);

        // Use the first voicing (typically the lowest/most common position)
        const firstVoicing = voicings[0] || null;
        setVoicing(firstVoicing);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load chord voicing preview:', error);
        setVoicing(null);
        setIsLoading(false);
      }
    }, debounceMs);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [root, quality, debounceMs]);

  return { voicing, isLoading };
}
