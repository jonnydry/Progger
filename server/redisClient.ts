import { createClient, RedisClientType } from 'redis';
import { logger } from './utils/logger';

// Timeout helper for network calls
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

let sharedRedisClient: RedisClientType | null = null;
let isRedisConnected = false;

/**
 * Get or create a shared Redis client instance
 * This allows multiple modules (cache, rate limiting) to reuse the same connection
 */
export async function getSharedRedisClient(): Promise<RedisClientType | null> {
  if (sharedRedisClient && isRedisConnected) {
    return sharedRedisClient;
  }

  try {
    sharedRedisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 5000, // 5 second connection timeout
      },
    });

    sharedRedisClient.on('connect', () => {
      isRedisConnected = true;
      logger.info('Shared Redis client connected');
    });

    sharedRedisClient.on('error', (err) => {
      logger.warn('Shared Redis client connection error', { error: err.message });
      isRedisConnected = false;
    });

    // Connect with timeout
    await withTimeout(sharedRedisClient.connect(), 5000);
    isRedisConnected = true;
    logger.info('Shared Redis client initialized successfully');
    return sharedRedisClient;
  } catch (error) {
    logger.warn('Failed to connect to shared Redis client', { error });
    sharedRedisClient = null;
    isRedisConnected = false;
    return null;
  }
}

/**
 * Check if Redis is available
 */
export function isRedisAvailable(): boolean {
  return isRedisConnected && sharedRedisClient !== null;
}

/**
 * Get the current Redis client (may be null if not connected)
 */
export function getRedisClient(): RedisClientType | null {
  return sharedRedisClient;
}



