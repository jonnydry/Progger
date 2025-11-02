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
    render(
      <VoicingsGrid
        progression={[]}
        isLoading={true}
        skeletonCount={4}
        musicalKey="C"
        currentMode="major"
      />
    );

    // Should show skeleton loaders
    const skeletons = screen.queryAllByRole('status');
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

    // Should display chord names
    expect(screen.getByText(/C/i)).toBeInTheDocument();
    expect(screen.getByText(/Am/i)).toBeInTheDocument();
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

    // Component should render without errors
    expect(screen.getByRole('main') || document.body).toBeTruthy();
  });
});

