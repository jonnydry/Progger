import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Request ID middleware for request tracing and debugging
 *
 * Adds a unique ID to each request for correlation across services and logs.
 * The ID is:
 * - Generated as UUID v4
 * - Added to request object as req.id
 * - Included in response headers as X-Request-ID
 * - Used in all log entries for this request
 *
 * Benefits:
 * - Trace requests across distributed systems
 * - Correlate frontend errors with backend logs
 * - Debug issues in production
 * - Monitor request lifecycles
 */

// Extend Express Request type to include id
declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Check if request already has an ID (from proxy or load balancer)
  const existingId = req.headers['x-request-id'] as string;

  // Use existing ID or generate new one
  req.id = existingId || randomUUID();

  // Add ID to response headers for client-side correlation
  res.setHeader('X-Request-ID', req.id);

  next();
}

/**
 * Get request ID from request object
 * Safe accessor that returns a default if ID is not set
 */
export function getRequestId(req: Request): string {
  return req.id || 'unknown';
}
