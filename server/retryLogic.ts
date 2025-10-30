/**
 * Intelligent retry logic with exponential backoff and circuit breaker
 */

import { logger } from './utils/logger';

export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitterFactor: number;
}

export interface RetryStats {
  attemptNumber: number;
  totalRetries: number;
  lastError?: Error;
  totalDelay: number;
}

const DEFAULT_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
  jitterFactor: 0.1, // 10% jitter
};

/**
 * Calculates the delay for the next retry attempt with jitter
 */
export function calculateRetryDelay(
  attemptNumber: number,
  config: Partial<RetryConfig> = {}
): number {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  // Exponential backoff
  const baseDelay = cfg.initialDelay * Math.pow(cfg.backoffMultiplier, attemptNumber - 1);

  // Cap at maximum delay
  const cappedDelay = Math.min(baseDelay, cfg.maxDelay);

  // Add jitter to prevent thundering herd
  const jitter = cappedDelay * cfg.jitterFactor * (Math.random() * 2 - 1);
  const delayWithJitter = cappedDelay + jitter;

  return Math.max(0, Math.floor(delayWithJitter));
}

/**
 * Determines if an error is retryable
 */
export function isRetryableError(error: any): boolean {
  // Network errors
  if (error.code === 'ENOTFOUND' ||
      error.code === 'ECONNREFUSED' ||
      error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT') {
    return true;
  }

  // HTTP status codes
  if (error.status) {
    switch (error.status) {
      case 408: // Request Timeout
      case 429: // Too Many Requests
      case 500: // Internal Server Error
      case 502: // Bad Gateway
      case 503: // Service Unavailable
      case 504: // Gateway Timeout
        return true;
      default:
        return false;
    }
  }

  // Timeout errors
  if (error.message && error.message.includes('timed out')) {
    return true;
  }

  // Parse errors (might be temporary API instability)
  if (error instanceof SyntaxError) {
    return error.message.includes('JSON');
  }

  return false;
}

/**
 * Retry wrapper with intelligent backoff and error classification
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {},
  onRetry?: (stats: RetryStats) => void
): Promise<T> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  let lastError: Error;

  for (let attempt = 1; attempt <= cfg.maxRetries + 1; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on the last attempt
      if (attempt > cfg.maxRetries) {
        break;
      }

      // Check if the error is retryable
      if (!isRetryableError(error)) {
        logger.warn('Non-retryable error encountered', { attempt, totalRetries: cfg.maxRetries, error });
        break;
      }

      const delay = calculateRetryDelay(attempt, cfg);
      logger.debug('Retrying operation', {
        attempt,
        totalRetries: cfg.maxRetries,
        delayMs: delay,
        error: lastError.message,
      });

      // Call retry hook if provided
      if (onRetry) {
        onRetry({
          attemptNumber: attempt,
          totalRetries: cfg.maxRetries,
          lastError,
          totalDelay: cfg.initialDelay
        });
      }

      // Wait for the delay
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // All retries failed
  throw new Error(`Operation failed after ${cfg.maxRetries + 1} attempts. Last error: ${lastError.message}`);
}

/**
 * Circuit breaker implementation to prevent cascading failures
 */
export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private readonly failureThreshold: number = 5,
    private readonly recoveryTimeout: number = 60000, // 1 minute
    private readonly monitoringPeriod: number = 600000 // 10 minutes
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    const now = Date.now();

    // Reset failure count if monitoring period has passed
    if (now - this.lastFailureTime > this.monitoringPeriod) {
      this.failureCount = 0;
      this.state = 'closed';
    }

    // Check circuit state
    if (this.state === 'open') {
      // Check if we should transition to half-open
      if (now - this.lastFailureTime > this.recoveryTimeout) {
        this.state = 'half-open';
        logger.info('Circuit breaker transitioning to half-open');
      } else {
        throw new Error('Circuit breaker is OPEN - operation rejected');
      }
    }

    try {
      const result = await operation();

      // Success - reset on half-open, stay closed otherwise
      if (this.state === 'half-open') {
        logger.info('Circuit breaker recovered to closed');
        this.state = 'closed';
        this.failureCount = 0;
      }

      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = now;

      // Check if we should open the circuit
      if (this.failureCount >= this.failureThreshold) {
        this.state = 'open';
        logger.warn('Circuit breaker OPEN', {
          failureCount: this.failureCount,
          threshold: this.failureThreshold,
        });
      }

      throw error;
    }
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime
    };
  }
}

// Global circuit breaker instance for XAI API
export const xaiCircuitBreaker = new CircuitBreaker();
