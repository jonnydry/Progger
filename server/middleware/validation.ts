/**
 * Validation middleware for Express routes
 * Provides reusable validation functions that can be applied as middleware
 */

import type { Request, Response, NextFunction } from 'express';
import { validateProgressionRequest, ValidationError } from '../utils/validation';
import { logger } from '../utils/logger';

/**
 * Sanitize user input to prevent XSS attacks
 * Escapes HTML entities and trims whitespace
 */
function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Middleware to validate progression generation requests
 */
export function validateProgressionRequestMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const validatedRequest = validateProgressionRequest(req.body);
    // Replace req.body with validated version (ensures proper types)
    req.body = validatedRequest;
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      logger.warn('Progression request validation failed', {
        error: error.message,
        body: req.body,
      });
      res.status(400).json({
        error: error.message,
        code: 'VALIDATION_ERROR',
      });
      return;
    }
    // Pass through unexpected errors
    next(error);
  }
}

/**
 * Middleware to validate stash creation requests
 */
export function validateStashRequestMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const { name, key, mode, progressionData } = req.body;

    // Validate and sanitize name
    if (!name || typeof name !== 'string') {
      throw new ValidationError('name is required and must be a string');
    }
    
    const sanitizedName = sanitizeString(name);
    
    if (sanitizedName.length === 0) {
      throw new ValidationError('name cannot be empty');
    }
    if (sanitizedName.length > 200) {
      throw new ValidationError('name must be 200 characters or less');
    }
    
    // Replace with sanitized version
    req.body.name = sanitizedName;

    // Validate key
    if (!key || typeof key !== 'string') {
      throw new ValidationError('key is required and must be a string');
    }

    // Validate mode
    if (!mode || typeof mode !== 'string') {
      throw new ValidationError('mode is required and must be a string');
    }

    // Validate progressionData
    if (!progressionData || typeof progressionData !== 'object') {
      throw new ValidationError('progressionData is required and must be an object');
    }
    if (!progressionData.progression || !Array.isArray(progressionData.progression)) {
      throw new ValidationError('progressionData.progression must be an array');
    }
    if (!progressionData.scales || !Array.isArray(progressionData.scales)) {
      throw new ValidationError('progressionData.scales must be an array');
    }

    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      logger.warn('Stash request validation failed', {
        error: error.message,
        body: req.body,
      });
      res.status(400).json({
        error: error.message,
        code: 'VALIDATION_ERROR',
      });
      return;
    }
    next(error);
  }
}

