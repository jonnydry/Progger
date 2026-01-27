import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VoicingsGrid } from '@/components/VoicingsGrid';
import type { ProgressionResult } from '@/types';

// Mock the hooks
vi.mock('@/hooks/useStash', () => ({
  useSaveToStash: () => ({
    mutateAsync: vi.fn(),
    isLoading: false,
  }),
}));

describe('VoicingsGrid', () => {
  const mockProgressionResult: ProgressionResult = {
    progression: [
      {
        chordName: 'C',
        musicalFunction: 'Tonic',
        relationToKey: 'I',
        voicings: [
          {
            frets: ['x', 3, 2, 0, 1, 0],
            position: 'Open',
          },
        ],
      },
      {
        chordName: 'Am',
        musicalFunction: 'Submediant',
        relationToKey: 'vi',
        voicings: [
          {
            frets: ['x', 0, 2, 2, 1, 0],
            position: 'Open',
          },
        ],
      },
    ],
    scales: [
      {
        name: 'C Major',
        rootNote: 'C',
        notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        fingering: [[8, 10, 12], [8, 10, 12], [9, 10, 12], [9, 10, 12], [10, 12, 13], [8, 10, 12]],
      },
    ],
  };

  it('should render loading skeleton when isLoading is true', () => {
    const { container } = render(
      <VoicingsGrid
        progression={[]}
        isLoading={true}
        skeletonCount={4}
        musicalKey="C"
        currentMode="major"
      />
    );

    // Should show skeleton loaders (they have animate-pulse class)
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render chord voicings when progression is provided', () => {
    render(
      <VoicingsGrid
        progression={mockProgressionResult.progression}
        isLoading={false}
        musicalKey="C"
        currentMode="major"
        progressionResult={mockProgressionResult}
      />
    );

    // Should display the progression heading
    expect(screen.getByText(/Generated Progression/i)).toBeInTheDocument();
    // The progression text (C - Am) should be visible
    expect(screen.getByText(/C - Am/i)).toBeInTheDocument();
  });

  it('should display empty state when no progression', () => {
    render(
      <VoicingsGrid
        progression={[]}
        isLoading={false}
        musicalKey="C"
        currentMode="major"
      />
    );

    // Should display empty state message
    expect(screen.getByText(/Your generated progression will appear here/i)).toBeInTheDocument();
    expect(screen.getByText(/Select a key and mode/i)).toBeInTheDocument();
  });
});

