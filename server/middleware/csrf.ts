import type { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';
import { logger } from '../utils/logger';

/**
 * Simple CSRF protection middleware
 * Generates and validates CSRF tokens stored in session
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Skip CSRF for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip CSRF for OAuth callback routes (handled by Replit Auth)
  if (req.path === '/api/callback' || req.path === '/api/login' || req.path === '/api/logout') {
    return next();
  }

  // Get token from header or body
  const token = req.headers['x-csrf-token'] || req.body?._csrf;
  const sessionToken = (req.session as any)?.csrfToken;

  // If no session token exists, generate one
  if (!sessionToken) {
    (req.session as any).csrfToken = generateToken();
    logger.debug('Generated new CSRF token', { path: req.path });
  }

  // For state-changing requests, validate token
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    if (!token || token !== sessionToken) {
      logger.warn('CSRF token validation failed', {
        path: req.path,
        method: req.method,
        hasToken: !!token,
        hasSessionToken: !!sessionToken,
      });
      res.status(403).json({
        error: 'Invalid CSRF token. Please refresh the page and try again.',
        code: 'CSRF_ERROR',
      });
      return;
    }
  }

  // Set CSRF token in response for client to use
  res.locals.csrfToken = (req.session as any).csrfToken;
  next();
}

/**
 * Generate a random CSRF token
 */
function generateToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Middleware to expose CSRF token to client via API endpoint
 * Client can fetch this token and include it in subsequent requests
 */
export function getCsrfToken(req: Request, res: Response): void {
  if (!(req.session as any)?.csrfToken) {
    (req.session as any).csrfToken = generateToken();
  }
  res.json({ csrfToken: (req.session as any).csrfToken });
}

