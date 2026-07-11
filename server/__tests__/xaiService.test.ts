import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as xaiService from "../xaiService";
import OpenAI from "openai";

vi.mock("openai");

describe("xaiService", () => {
  let mockOpenAI: any;
  const originalApiKey = process.env.XAI_API_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.XAI_API_KEY = "xai-test-key";
    xaiService.__resetXaiClientForTests();

    mockOpenAI = {
      chat: {
        completions: {
          create: vi.fn(),
        },
      },
    };

    vi.mocked(OpenAI).mockImplementation(function () {
      return mockOpenAI;
    } as any);
  });

  afterEach(() => {
    process.env.XAI_API_KEY = originalApiKey;
    vi.restoreAllMocks();
  });

  describe("generateChordProgression", () => {
    const validRequest = {
      key: "C",
      mode: "major",
      includeTensions: false,
      generationStyle: "balanced" as const,
      numChords: 4,
      selectedProgression: "auto",
    };

    const validAPIResponse = {
      progression: [
        { chordName: "C", musicalFunction: "Tonic", relationToKey: "I" },
        { chordName: "Am", musicalFunction: "Relative Minor", relationToKey: "vi" },
        { chordName: "F", musicalFunction: "Subdominant", relationToKey: "IV" },
        { chordName: "G", musicalFunction: "Dominant", relationToKey: "V" },
      ],
      scales: [
        { name: "C Major", rootNote: "C" },
        { name: "A Minor", rootNote: "A" },
      ],
    };

    it("should generate progression via OpenAI", async () => {
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(validAPIResponse) } }],
      });

      const result = await xaiService.generateChordProgression(
        validRequest.key,
        validRequest.mode,
        validRequest.includeTensions,
        validRequest.generationStyle,
        validRequest.numChords,
        validRequest.selectedProgression
      );

      expect(result).toEqual(validAPIResponse);
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(1);
    });

    it("should call OpenAI with structured output schema", async () => {
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(validAPIResponse) } }],
      });

      await xaiService.generateChordProgression(
        validRequest.key,
        validRequest.mode,
        validRequest.includeTensions,
        validRequest.generationStyle,
        validRequest.numChords,
        validRequest.selectedProgression
      );

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "grok-4.3",
          response_format: expect.objectContaining({
            type: "json_schema",
            json_schema: expect.objectContaining({
              name: "ChordProgressionResponse",
              strict: true,
            }),
          }),
          temperature: 0.7,
          max_tokens: 2048,
        })
      );
    });

    it("should enforce exact chord count in response_format schema", async () => {
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(validAPIResponse) } }],
      });

      await xaiService.generateChordProgression(
        validRequest.key,
        validRequest.mode,
        validRequest.includeTensions,
        validRequest.generationStyle,
        4,
        validRequest.selectedProgression
      );

      const callArg = mockOpenAI.chat.completions.create.mock.calls[0][0];
      const progressionSchema = callArg.response_format.json_schema.schema.properties.progression;
      expect(progressionSchema.minItems).toBe(4);
      expect(progressionSchema.maxItems).toBe(4);
    });

    it("should propagate varying numChords into response_format minItems/maxItems", async () => {
      for (const numChords of [2, 6, 8]) {
        const progression = Array.from({ length: numChords }, (_, i) => ({
          chordName: "C",
          musicalFunction: `F${i}`,
          relationToKey: "I",
        }));
        mockOpenAI.chat.completions.create.mockResolvedValueOnce({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  progression,
                  scales: validAPIResponse.scales,
                }),
              },
            },
          ],
        });

        await xaiService.generateChordProgression(
          validRequest.key,
          validRequest.mode,
          validRequest.includeTensions,
          validRequest.generationStyle,
          numChords,
          validRequest.selectedProgression
        );

        const calls = mockOpenAI.chat.completions.create.mock.calls;
        const callArg = calls[calls.length - 1][0];
        const progressionSchema = callArg.response_format.json_schema.schema.properties.progression;
        expect(progressionSchema.minItems).toBe(numChords);
        expect(progressionSchema.maxItems).toBe(numChords);
      }
    });

    it("should throw error when API returns empty response", async () => {
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [{ message: { content: null } }],
      });

      await expect(
        xaiService.generateChordProgression(
          validRequest.key,
          validRequest.mode,
          validRequest.includeTensions,
          validRequest.generationStyle,
          validRequest.numChords,
          validRequest.selectedProgression
        )
      ).rejects.toThrow("Empty response from API");
    });

    it("should throw error when API returns invalid JSON", async () => {
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [{ message: { content: "not valid json" } }],
      });

      await expect(
        xaiService.generateChordProgression(
          validRequest.key,
          validRequest.mode,
          validRequest.includeTensions,
          validRequest.generationStyle,
          validRequest.numChords,
          validRequest.selectedProgression
        )
      ).rejects.toThrow();
    });

    it("should validate API response structure", async () => {
      const invalidResponse = {
        progression: [{ chordName: "C" }],
        scales: [],
      };

      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(invalidResponse) } }],
      });

      await expect(
        xaiService.generateChordProgression(
          validRequest.key,
          validRequest.mode,
          validRequest.includeTensions,
          validRequest.generationStyle,
          validRequest.numChords,
          validRequest.selectedProgression
        )
      ).rejects.toThrow();
    });

    it("should enforce advanced chord density when includeTensions is true", async () => {
      const nonAdvancedResponse = {
        progression: [
          { chordName: "C", musicalFunction: "Tonic", relationToKey: "I" },
          { chordName: "Am7", musicalFunction: "Relative Minor", relationToKey: "vi" },
          { chordName: "Fmaj7", musicalFunction: "Subdominant", relationToKey: "IV" },
          { chordName: "G7", musicalFunction: "Dominant", relationToKey: "V" },
        ],
        scales: [
          { name: "C Major", rootNote: "C" },
          { name: "A Minor", rootNote: "A" },
        ],
      };

      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(nonAdvancedResponse) } }],
      });

      await expect(
        xaiService.generateChordProgression("C", "major", true, "balanced", 4, "auto")
      ).rejects.toThrow("includeTensions was enabled");
    });

    it("should reject when matching primary scale exists but is not first", async () => {
      const outOfOrderScalesResponse = {
        progression: [
          { chordName: "C", musicalFunction: "Tonic", relationToKey: "I" },
          { chordName: "Am", musicalFunction: "Relative Minor", relationToKey: "vi" },
          { chordName: "F", musicalFunction: "Subdominant", relationToKey: "IV" },
          { chordName: "G", musicalFunction: "Dominant", relationToKey: "V" },
        ],
        scales: [
          { name: "A Minor", rootNote: "A" },
          { name: "C Major", rootNote: "C" },
        ],
      };

      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(outOfOrderScalesResponse) } }],
      });

      await expect(
        xaiService.generateChordProgression("C", "major", false, "balanced", 4, "auto")
      ).rejects.toThrow("Primary scale must be listed first");
    });
  });

  describe("analyzeCustomProgression", () => {
    const validChords = ["C", "Am", "F", "G"];

    const validAPIResponse = {
      progression: [
        { chordName: "C", musicalFunction: "Tonic", relationToKey: "I" },
        { chordName: "Am", musicalFunction: "Relative Minor", relationToKey: "vi" },
        { chordName: "F", musicalFunction: "Subdominant", relationToKey: "IV" },
        { chordName: "G", musicalFunction: "Dominant", relationToKey: "V" },
      ],
      scales: [
        { name: "C Major", rootNote: "C" },
        { name: "A Minor", rootNote: "A" },
      ],
    };

    it("should analyze progression via OpenAI", async () => {
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(validAPIResponse) } }],
      });

      const result = await xaiService.analyzeCustomProgression(validChords);

      expect(result).toEqual(validAPIResponse);
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(1);
    });

    it("should call OpenAI with analysis schema and lower temperature", async () => {
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(validAPIResponse) } }],
      });

      await xaiService.analyzeCustomProgression(validChords);

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "grok-4.3",
          response_format: expect.objectContaining({
            type: "json_schema",
            json_schema: expect.objectContaining({
              name: "ProgressionAnalysisResponse",
              strict: true,
            }),
          }),
          temperature: 0.3,
          max_tokens: 2048,
        })
      );
    });

    it("should handle API errors gracefully", async () => {
      mockOpenAI.chat.completions.create.mockRejectedValueOnce(new Error("API Error"));

      await expect(xaiService.analyzeCustomProgression(validChords)).rejects.toThrow();
    });
  });

  describe("Error handling", () => {
    it("should provide user-friendly error for timeout", async () => {
      vi.useFakeTimers();
      try {
        mockOpenAI.chat.completions.create.mockRejectedValue(new Error("Request timed out"));

        const pending = xaiService.generateChordProgression(
          "C",
          "major",
          false,
          "balanced",
          4,
          "auto"
        );
        const assertion = expect(pending).rejects.toThrow(/XAI API request timed out|timed out/);
        await vi.runAllTimersAsync();
        await assertion;
      } finally {
        vi.useRealTimers();
      }
    });

    it("should provide user-friendly error for validation failure", async () => {
      mockOpenAI.chat.completions.create.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({
                progression: [],
                scales: [],
              }),
            },
          },
        ],
      });

      await expect(
        xaiService.generateChordProgression("C", "major", false, "balanced", 4, "auto")
      ).rejects.toThrow(/Invalid response from AI|Empty response|validation/i);
    });
  });
});
