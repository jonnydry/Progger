import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '@/App';
import type { CustomChordInput } from '@/types';
import type { ReactNode } from 'react';
import { act } from '@testing-library/react';

const analyzeMutateMock = vi.fn();
const generateMutateMock = vi.fn();

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,
  }),
}));

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'dark',
    themes: [],
    themeIndex: 0,
    setThemeIndex: vi.fn(),
    toggleTheme: vi.fn(),
  }),
}));

vi.mock('@/hooks/useProgression', () => ({
  useGenerateProgression: () => ({
    mutate: generateMutateMock,
    isPending: false,
  }),
  useAnalyzeCustomProgression: () => ({
    mutate: analyzeMutateMock,
    isPending: false,
  }),
}));

vi.mock('@/utils/chordLibrary', () => ({
  validateChordLibrary: vi.fn(),
  preloadAllChords: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/components/Layout/MainLayout', () => ({
  MainLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/PixelCard', () => ({
  PixelCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/VoicingsGrid', () => ({
  VoicingsGrid: ({
    musicalKey,
    currentMode,
  }: {
    musicalKey: string;
    currentMode: string;
  }) => <div data-testid="voicings-grid-props">{musicalKey}|{currentMode}</div>,
}));

vi.mock('@/components/SkeletonScaleDiagram', () => ({
  SkeletonScaleDiagram: () => <div>skeleton-scale</div>,
}));

vi.mock('@/components/Controls', () => ({
  Controls: (props: {
    onAnalyzeCustom?: () => void;
    onCustomProgressionChange?: (progression: CustomChordInput[]) => void;
  }) => (
    <div>
      <button
        onClick={() =>
          props.onCustomProgressionChange?.([
            { id: '1', root: 'F♯', quality: '7b9' },
            { id: '2', root: 'Bb', quality: 'major' },
            { id: '3', root: 'C', quality: 'min7' },
          ])
        }
      >
        set-custom-progression
      </button>
      <button onClick={() => props.onAnalyzeCustom?.()}>analyze-custom</button>
    </div>
  ),
}));

describe('App custom analyze flow', () => {
  beforeEach(() => {
    analyzeMutateMock.mockReset();
    generateMutateMock.mockReset();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('sends canonical chord names to analyze mutation', () => {
    render(<App />);

    fireEvent.click(screen.getByText('set-custom-progression'));
    fireEvent.click(screen.getByText('analyze-custom'));

    expect(analyzeMutateMock).toHaveBeenCalledTimes(1);
    expect(analyzeMutateMock).toHaveBeenCalledWith(
      ['F#7b9', 'Bb', 'Cmin7'],
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it('uses detected custom key/mode when rendering analyzed results', async () => {
    render(<App />);

    fireEvent.click(screen.getByText('set-custom-progression'));
    fireEvent.click(screen.getByText('analyze-custom'));

    const mutationOptions = analyzeMutateMock.mock.calls[0][1];
    await act(async () => {
      mutationOptions.onSuccess({
        progression: [
          {
            chordName: 'Amin7',
            voicings: [{ frets: ['x', 0, 2, 0, 1, 0] }],
            musicalFunction: 'i',
            relationToKey: 'i',
          },
        ],
        scales: [],
        detectedKey: 'Am',
        detectedMode: 'Minor',
      });
    });

    expect(screen.getByTestId('voicings-grid-props')).toHaveTextContent('A|Minor');
  });
});
