import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomProgressionInput } from '@/components/CustomProgressionInput';
import type { CustomChordInput } from '@/types';
import type { ReactNode } from 'react';
import { MAX_CUSTOM_CHORDS } from '@/constants';

const playProgressionMock = vi.fn();

vi.mock('@/components/PixelButton', () => ({
  PixelButton: ({
    children,
    onClick,
    disabled,
    isLoading,
    variant,
    ...props
  }: {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    variant?: string;
  }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/utils/audioEngine', () => ({
  playProgression: (...args: unknown[]) => playProgressionMock(...args),
}));

vi.mock('@/components/ChordInputCard', () => ({
  ChordInputCard: ({
    index,
    onMoveUp,
    onMoveDown,
    onRemove,
  }: {
    index: number;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onRemove: () => void;
  }) => (
    <div data-testid={`card-${index}`}>
      <button onClick={onMoveUp}>move-up-{index}</button>
      <button onClick={onMoveDown}>move-down-{index}</button>
      <button onClick={onRemove}>remove-{index}</button>
    </div>
  ),
}));

const baseProps = {
  onAnalyze: vi.fn(),
  isLoading: false,
  detectedKey: 'C',
  detectedMode: 'Major',
};

function makeChord(id: string, root: string, quality: string): CustomChordInput {
  return { id, root, quality };
}

describe('CustomProgressionInput', () => {
  it('cancels playback callbacks on unmount', () => {
    const progression = [
      makeChord('a', 'C', 'major'),
      makeChord('b', 'G', '7'),
    ];
    const onCustomProgressionChange = vi.fn();
    const cleanupMock = vi.fn();
    playProgressionMock.mockReset();
    playProgressionMock.mockReturnValue(cleanupMock);

    const { unmount } = render(
      <CustomProgressionInput
        {...baseProps}
        customProgression={progression}
        onCustomProgressionChange={onCustomProgressionChange}
      />
    );

    fireEvent.click(screen.getByText('Play Progression'));
    expect(playProgressionMock).toHaveBeenCalledTimes(1);

    unmount();
    expect(cleanupMock).toHaveBeenCalledTimes(1);
  });

  it('reorders chords while preserving stable ids', () => {
    const progression = [
      makeChord('a', 'C', 'major'),
      makeChord('b', 'G', '7'),
    ];
    const onCustomProgressionChange = vi.fn();

    render(
      <CustomProgressionInput
        {...baseProps}
        customProgression={progression}
        onCustomProgressionChange={onCustomProgressionChange}
      />
    );

    fireEvent.click(screen.getByText('move-down-0'));

    expect(onCustomProgressionChange).toHaveBeenCalledTimes(1);
    expect(onCustomProgressionChange).toHaveBeenCalledWith([
      makeChord('b', 'G', '7'),
      makeChord('a', 'C', 'major'),
    ]);
  });

  it('removes a chord and emits updated progression', () => {
    const progression = [
      makeChord('a', 'C', 'major'),
      makeChord('b', 'A', 'minor'),
      makeChord('c', 'F', 'major'),
    ];
    const onCustomProgressionChange = vi.fn();

    render(
      <CustomProgressionInput
        {...baseProps}
        customProgression={progression}
        onCustomProgressionChange={onCustomProgressionChange}
      />
    );

    fireEvent.click(screen.getByText('remove-1'));

    expect(onCustomProgressionChange).toHaveBeenCalledWith([
      makeChord('a', 'C', 'major'),
      makeChord('c', 'F', 'major'),
    ]);
  });

  it('disables add chord at max limit', () => {
    const progression = Array.from({ length: MAX_CUSTOM_CHORDS }, (_, i) =>
      makeChord(`id-${i}`, 'C', 'major')
    );
    const onCustomProgressionChange = vi.fn();

    render(
      <CustomProgressionInput
        {...baseProps}
        customProgression={progression}
        onCustomProgressionChange={onCustomProgressionChange}
      />
    );

    const addButton = screen.getByText('Add Chord').closest('button');
    expect(addButton).toBeDisabled();
    expect(
      screen.getByText(new RegExp(`Maximum of ${MAX_CUSTOM_CHORDS} chords reached`, 'i'))
    ).toBeInTheDocument();

    fireEvent.click(addButton!);
    expect(onCustomProgressionChange).not.toHaveBeenCalled();
  });
});
