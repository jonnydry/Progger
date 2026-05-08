import type { Request, Response } from "express";
import { generateChordProgression, analyzeCustomProgression } from "../xaiService";
import { ValidationError } from "../utils/validation";
import { validateCustomProgressionRequest } from "../utils/validation";
import { logger } from "../utils/logger";

export async function handleGenerateProgression(req: Request, res: Response): Promise<void> {
  try {
    const {
      key,
      mode,
      includeTensions,
      generationStyle,
      numChords,
      selectedProgression,
    } = req.body;

    logger.info("POST /api/generate-progression - Request received", {
      requestId: req.id,
      key,
      mode,
      includeTensions,
      generationStyle,
      numChords,
      selectedProgression,
      numChordsType: typeof numChords,
    });

    const result = await generateChordProgression(
      key,
      mode,
      includeTensions,
      generationStyle,
      numChords,
      selectedProgression
    );

    if (result.progression.length !== numChords) {
      logger.warn("Chord count mismatch detected", {
        requestId: req.id,
        requestedNumChords: numChords,
        returnedChordCount: result.progression.length,
        key,
        mode,
        selectedProgression,
      });
    }

    logger.info("Chord progression generated successfully", {
      requestId: req.id,
      key,
      mode,
      requestedNumChords: numChords,
      returnedChordCount: result.progression.length,
      chordCountMatch: result.progression.length === numChords,
    });

    res.set("Cache-Control", "public, max-age=86400");
    res.json(result);
  } catch (error) {
    logger.error("Error in /api/generate-progression", error, {
      requestId: req.id,
      body: req.body,
    });
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    res.status(500).json({ error: errorMessage });
  }
}

export async function handleAnalyzeCustomProgression(req: Request, res: Response): Promise<void> {
  try {
    const { chords } = validateCustomProgressionRequest(req.body);
    const result = await analyzeCustomProgression(chords);

    logger.info("Custom progression analyzed successfully", {
      requestId: req.id,
      chordCount: chords.length,
      resultChordCount: result.progression.length,
      scaleCount: result.scales.length,
    });

    res.set("Cache-Control", "public, max-age=86400");
    res.json(result);
  } catch (error) {
    logger.error("Error in /api/analyze-custom-progression", error, {
      requestId: req.id,
      body: req.body,
    });

    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }
}
