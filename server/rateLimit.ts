import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { logger } from './utils/logger';
import { getSharedRedisClient, isRedisAvailable } from './redisClient';

/**
 * Create Redis-backed rate limiter with graceful fallback to in-memory
 *
 * Benefits:
 * - Works across multiple server instances (horizontal scaling)
 * - Persistent rate limits (survives server restarts)
 * - Falls back to in-memory if Redis unavailable
 * - Reuses shared Redis client for better resource efficiency
 */

// Initialize Redis client for rate limiting (uses shared client)
async function initializeRedisClient() {
  const redisClient = await getSharedRedisClient();
  return redisClient;
}

/**
 * Create rate limiter for AI generation endpoints
 * Uses Redis if available, otherwise falls back to in-memory
 *
 * IMPORTANT: This is async to properly await Redis initialization
 */
export async function createAIGenerationLimiter() {
  // Try to initialize Redis connection (waits for connection to complete)
  const redisClient = await initializeRedisClient();

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

  // Use Redis store if available (uses shared Redis client)
  if (isRedisAvailable() && redisClient) {
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
  const available = isRedisAvailable();
  return {
    redisAvailable: available,
    storeType: available ? 'redis' : 'memory',
  };
}
