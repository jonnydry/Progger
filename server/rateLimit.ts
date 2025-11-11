import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import { logger } from './utils/logger';

/**
 * Create Redis-backed rate limiter with graceful fallback to in-memory
 *
 * Benefits:
 * - Works across multiple server instances (horizontal scaling)
 * - Persistent rate limits (survives server restarts)
 * - Falls back to in-memory if Redis unavailable
 */

let redisClient: ReturnType<typeof createClient> | null = null;
let isRedisAvailable = false;

// Timeout helper for network calls
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

// Initialize Redis client for rate limiting
async function initializeRedisClient() {
  if (redisClient) return redisClient;

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 5000, // 5 second connection timeout
      },
    });

    redisClient.on('error', (err) => {
      logger.warn('Redis rate limit client error', { error: err.message });
      isRedisAvailable = false;
    });

    redisClient.on('connect', () => {
      logger.info('Redis rate limit client connected');
    });

    // Add timeout wrapper to prevent hanging indefinitely
    await withTimeout(redisClient.connect(), 5000);

    // Set flag synchronously after connection completes
    // Don't rely on 'connect' event which may fire asynchronously
    isRedisAvailable = true;
    logger.info('Redis rate limit client initialized successfully');

    return redisClient;
  } catch (error) {
    logger.warn('Failed to connect Redis for rate limiting, falling back to in-memory', { error });
    redisClient = null;
    isRedisAvailable = false;
    return null;
  }
}

/**
 * Create rate limiter for AI generation endpoints
 * Uses Redis if available, otherwise falls back to in-memory
 *
 * IMPORTANT: This is async to properly await Redis initialization
 */
export async function createAIGenerationLimiter() {
  // Try to initialize Redis connection (waits for connection to complete)
  await initializeRedisClient();

  const config = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per windowMs
    message: { error: 'Too many AI generation requests from this IP, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: any, res: any) => {
      logger.warn('Rate limit exceeded', {
        requestId: req.id,
        ip: req.ip,
        path: req.path,
        userAgent: req.get('user-agent'),
      });
      res.status(429).json({
        error: 'Too many AI generation requests from this IP, please try again later.'
      });
    },
  };

  // Use Redis store if available (flag is now set after await above)
  if (isRedisAvailable && redisClient) {
    logger.info('Using Redis-backed rate limiting for AI generation endpoints');
    return rateLimit({
      ...config,
      store: new RedisStore({
        // @ts-expect-error - RedisStore types expect older redis client
        client: redisClient,
        prefix: 'rl:ai:',
      }),
    });
  }

  // Fallback to in-memory store
  logger.info('Using in-memory rate limiting for AI generation endpoints (Redis unavailable)');
  return rateLimit(config);
}

/**
 * Get rate limiting status for monitoring
 */
export function getRateLimitStatus() {
  return {
    redisAvailable: isRedisAvailable,
    storeType: isRedisAvailable ? 'redis' : 'memory',
  };
}
