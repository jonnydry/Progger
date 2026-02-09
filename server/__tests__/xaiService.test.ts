import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as xaiService from '../xaiService';
import { redisCache, getProgressionCacheKey } from '../cache';
import { pendingRequests } from '../pendingRequests';
import { xaiCircuitBreaker } from '../retryLogic';
import OpenAI from 'openai';

// Mock dependencies
vi.mock('../cache');
vi.mock('../pendingRequests');
vi.mock('openai');

describe('xaiService', () => {
  let mockOpenAI: any;
  const originalApiKey = process.env.XAI_API_KEY;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    process.env.XAI_API_KEY = 'xai-test-key';

    // Setup OpenAI mock
    mockOpenAI = {
      chat: {
        completions: {
          create: vi.fn(),
        },
      },
    };

    // Mock OpenAI constructor
    vi.mocked(OpenAI).mockImplementation((function () {
      return mockOpenAI;
    }) as any);

    // Mock cache methods
    vi.mocked(redisCache.get).mockResolvedValue(null);
    vi.mocked(redisCache.set).mockResolvedValue(undefined);
    vi.mocked(getProgressionCacheKey).mockReturnValue('progression:test-key');

    // Mock pending requests
    vi.mocked(pendingRequests.get).mockReturnValue(undefined);
    vi.mocked(pendingRequests.set).mockReturnValue(undefined);

    // Reset circuit breaker state
    const state = xaiCircuitBreaker.getState();
    if (state.state === 'open') {
      // Force reset by waiting or manually resetting internal state
      (xaiCircuitBreaker as any).state = 'closed';
      (xaiCircuitBreaker as any).failureCount = 0;
    }
  });

  afterEach(() => {
    process.env.XAI_API_KEY = originalApiKey;
    vi.restoreAllMocks();
  });

  describe('generateChordProgression', () => {
    const validRequest = {
      key: 'C',
      mode: 'major',
      includeTensions: false,
      numChords: 4,
      selectedProgression: 'auto',
    };

    const validAPIResponse = {
      progression: [
        { chordName: 'C', musicalFunction: 'Tonic', relationToKey: 'I' },
        { chordName: 'Am', musicalFunction: 'Relative Minor', relationToKey: 'vi' },
        { chordName: 'F', musicalFunction: 'Subdominant', relationToKey: 'IV' },
        { chordName: 'G', musicalFunction: 'Dominant', relationToKey: 'V' },
      ],
      scales: [
        { name: 'C Major', rootNote: 'C' },
        { name: 'A Minor', rootNote: 'A' },
      ],
    };

    it('should return cached result if available', async () => {
      // Mock cache hit
      vi.mocked(redisCache.get).mockResolvedValueOnce(validAPIResponse);

      const result = await xaiService.generateChordProgression(
        validRequest.key,
        validRequest.mode,
        validRequest.includeTensions,
        validRequest.numChords,
        validRequest.selectedProgression
      );

      expect(result).toEqual(validAPIResponse);
      expect(redisCache.get).toHaveBeenCalledTimes(1);
      expect(mockOpenAI.chat.completions.create).not.toHaveBeenCalled();
    });

    it('should return pending request if duplicate detected', async () => {
      const pendingPromise = Promise.resolve(validAPIResponse);
      vi.mocked(pendingRequests.get).mockReturnValueOnce(pendingPromise);

      const result = await xaiService.generateChordProgression(
        validRequest.key,
        validRequest.mode,
        validRequest.includeTensions,
        validRequest.numChords,
        validRequest.selectedProgression
      );

      expect(result).toEqual(validAPIResponse);
      expect(pendingRequests.get).toHaveBeenCalledTimes(1);
      expect(mockOpenAI.chat.completions.create).not.toHaveBeenCalled();
    });

    it('should generate progression via OpenAI when no cache or pending request', async () => {
      // Mock successful API response
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify(validAPIResponse),
            },
          },
        ],
      });

      const result = await xaiService.generateChordProgression(
        validRequest.key,
        validRequest.mode,
        validRequest.includeTensions,
        validRequest.numChords,
        validRequest.selectedProgression
      );

      expect(result).toEqual(validAPIResponse);
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(1);
      expect(redisCache.set).toHaveBeenCalledWith(
        expect.stringContaining('progression:'),
        validAPIResponse,
        86400
      );
    });

    it('should call OpenAI with correct parameters', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify(validAPIResponse),
            },
          },
        ],
      });

      await xaiService.generateChordProgression(
        validRequest.key,
        validRequest.mode,
        validRequest.includeTensions,
        validRequest.numChords,
        validRequest.selectedProgression
      );

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'grok-4-1-fast-non-reasoning',
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 1500,
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'system' }),
            expect.objectContaining({ role: 'user' }),
          ]),
        })
      );
    });

    it('should throw error when API returns empty response', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: null,
            },
          },
        ],
      });

      await expect(
        xaiService.generateChordProgression(
          validRequest.key,
          validRequest.mode,
          validRequest.includeTensions,
          validRequest.numChords,
          validRequest.selectedProgression
        )
      ).rejects.toThrow('Empty response from API');
    });

    it('should throw error when API returns invalid JSON', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'not valid json',
            },
          },
        ],
      });

      await expect(
        xaiService.generateChordProgression(
          validRequest.key,
          validRequest.mode,
          validRequest.includeTensions,
          validRequest.numChords,
          validRequest.selectedProgression
        )
      ).rejects.toThrow();
    });

    it('should validate API response structure', async () => {
      // Missing required fields
      const invalidResponse = {
        progression: [
          { chordName: 'C' }, // Missing musicalFunction and relationToKey
        ],
        scales: [],
      };

      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify(invalidResponse),
            },
          },
        ],
      });

      await expect(
        xaiService.generateChordProgression(
          validRequest.key,
          validRequest.mode,
          validRequest.includeTensions,
          validRequest.numChords,
          validRequest.selectedProgression
        )
      ).rejects.toThrow();
    });

    it('should handle circuit breaker open state', async () => {
      // Force circuit breaker to open state
      (xaiCircuitBreaker as any).state = 'open';
      (xaiCircuitBreaker as any).failureCount = 5;
      (xaiCircuitBreaker as any).lastFailureTime = Date.now();

      await expect(
        xaiService.generateChordProgression(
          validRequest.key,
          validRequest.mode,
          validRequest.includeTensions,
          validRequest.numChords,
          validRequest.selectedProgression
        )
      ).rejects.toThrow('XAI API is temporarily unavailable');
    });

    it('should cache successful results with 24hr TTL', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify(validAPIResponse),
            },
          },
        ],
      });

      await xaiService.generateChordProgression(
        validRequest.key,
        validRequest.mode,
        validRequest.includeTensions,
        validRequest.numChords,
        validRequest.selectedProgression
      );

      expect(redisCache.set).toHaveBeenCalledWith(
        expect.any(String),
        validAPIResponse,
        86400 // 24 hours
      );
    });

    it('should register pending request during generation', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify(validAPIResponse),
            },
          },
        ],
      });

      await xaiService.generateChordProgression(
        validRequest.key,
        validRequest.mode,
        validRequest.includeTensions,
        validRequest.numChords,
        validRequest.selectedProgression
      );

      expect(pendingRequests.set).toHaveBeenCalledWith(
        expect.stringContaining('progression:'),
        expect.any(Promise)
      );
    });
  });

  describe('analyzeCustomProgression', () => {
    const validChords = ['C', 'Am', 'F', 'G'];

    const validAPIResponse = {
      progression: [
        { chordName: 'C', musicalFunction: 'Tonic', relationToKey: 'I' },
        { chordName: 'Am', musicalFunction: 'Relative Minor', relationToKey: 'vi' },
        { chordName: 'F', musicalFunction: 'Subdominant', relationToKey: 'IV' },
        { chordName: 'G', musicalFunction: 'Dominant', relationToKey: 'V' },
      ],
      scales: [
        { name: 'C Major', rootNote: 'C' },
        { name: 'A Minor', rootNote: 'A' },
      ],
    };

    it('should return cached result if available', async () => {
      vi.mocked(redisCache.get).mockResolvedValueOnce(validAPIResponse);

      const result = await xaiService.analyzeCustomProgression(validChords);

      expect(result).toEqual(validAPIResponse);
      expect(redisCache.get).toHaveBeenCalledTimes(1);
      expect(mockOpenAI.chat.completions.create).not.toHaveBeenCalled();
    });

    it('should return pending request if duplicate detected', async () => {
      const pendingPromise = Promise.resolve(validAPIResponse);
      vi.mocked(pendingRequests.get).mockReturnValueOnce(pendingPromise);

      const result = await xaiService.analyzeCustomProgression(validChords);

      expect(result).toEqual(validAPIResponse);
      expect(pendingRequests.get).toHaveBeenCalledTimes(1);
      expect(mockOpenAI.chat.completions.create).not.toHaveBeenCalled();
    });

    it('should analyze progression via OpenAI when no cache or pending request', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify(validAPIResponse),
            },
          },
        ],
      });

      const result = await xaiService.analyzeCustomProgression(validChords);

      expect(result).toEqual(validAPIResponse);
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(1);
      expect(redisCache.set).toHaveBeenCalledWith(
        expect.stringContaining('custom:'),
        validAPIResponse,
        86400
      );
    });

    it('should call OpenAI with correct parameters for custom analysis', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify(validAPIResponse),
            },
          },
        ],
      });

      await xaiService.analyzeCustomProgression(validChords);

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'grok-4-1-fast-non-reasoning',
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 1500, // Higher for custom analysis
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'system' }),
            expect.objectContaining({
              role: 'user',
              content: expect.stringContaining(validChords[0]),
            }),
          ]),
        })
      );
    });

    it('should create cache key from chord list', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify(validAPIResponse),
            },
          },
        ],
      });

      await xaiService.analyzeCustomProgression(validChords);

      // Cache key should be "custom:C-Am-F-G"
      expect(redisCache.get).toHaveBeenCalledWith('custom:C-Am-F-G');
      expect(redisCache.set).toHaveBeenCalledWith(
        'custom:C-Am-F-G',
        validAPIResponse,
        86400
      );
    });

    it('should handle API errors gracefully', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValueOnce(
        new Error('API Error')
      );

      await expect(
        xaiService.analyzeCustomProgression(validChords)
      ).rejects.toThrow();
    });

    it('should cache successful custom analysis results', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify(validAPIResponse),
            },
          },
        ],
      });

      await xaiService.analyzeCustomProgression(validChords);

      expect(redisCache.set).toHaveBeenCalledWith(
        expect.any(String),
        validAPIResponse,
        86400
      );
    });
  });

  describe('Error handling', () => {
    it('should provide user-friendly error for timeout', async () => {
      vi.useFakeTimers();
      try {
        mockOpenAI.chat.completions.create.mockRejectedValue(
          new Error('Request timed out')
        );

        const pending = xaiService.generateChordProgression('C', 'major', false, 4, 'auto');
        const assertion = expect(pending).rejects.toThrow('XAI API request timed out');
        await vi.runAllTimersAsync();
        await assertion;
      } finally {
        vi.useRealTimers();
      }
    });

    it('should provide user-friendly error for validation failure', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({
                progression: [], // Empty progression is invalid
                scales: [],
              }),
            },
          },
        ],
      });

      await expect(
        xaiService.generateChordProgression('C', 'major', false, 4, 'auto')
      ).rejects.toThrow();
    });
  });
});
