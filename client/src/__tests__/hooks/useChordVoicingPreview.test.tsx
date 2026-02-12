import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChordVoicingPreview } from '@/hooks/useChordVoicingPreview';

const getChordVoicingsAsyncMock = vi.fn();

vi.mock('@/utils/chords', () => ({
  getChordVoicingsAsync: (...args: unknown[]) => getChordVoicingsAsyncMock(...args),
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('useChordVoicingPreview', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    getChordVoicingsAsyncMock.mockReset();
    getChordVoicingsAsyncMock.mockResolvedValue([
      { frets: ['x', 3, 2, 0, 1, 0], position: 'Open' },
    ]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('serializes preview lookup chord names in canonical ASCII form', async () => {
    renderHook(() => useChordVoicingPreview('F♯', '7b9', 10));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(15);
    });

    expect(getChordVoicingsAsyncMock).toHaveBeenCalledWith('F#7b9');
  });

  it('ignores stale async responses when input changes quickly', async () => {
    const first = deferred<Array<{ frets: Array<number | 'x'>; position: string }>>();
    const second = deferred<Array<{ frets: Array<number | 'x'>; position: string }>>();
    getChordVoicingsAsyncMock
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);

    const { result, rerender } = renderHook(
      ({ root, quality }) => useChordVoicingPreview(root, quality, 5),
      { initialProps: { root: 'C', quality: 'major' } }
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });

    rerender({ root: 'D', quality: 'minor' });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });

    await act(async () => {
      first.resolve([{ frets: [3, 3, 2, 0, 1, 0], position: 'Open' }]);
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.voicing).toBeNull();

    await act(async () => {
      second.resolve([{ frets: ['x', 5, 7, 7, 7, 5], position: 'Barre 5th' }]);
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.voicing).toEqual({
      frets: ['x', 5, 7, 7, 7, 5],
      position: 'Barre 5th',
    });
  });
});
