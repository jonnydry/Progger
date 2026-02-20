import { RedisClientType } from 'redis';
import { getProgressionCacheKey as getSharedCacheKey } from '../shared/cacheUtils';
import { logger } from './utils/logger';
import { getSharedRedisClient, isRedisAvailable } from './redisClient';

class RedisCache {
  private client: RedisClientType | null = null;
  private isConnected = false;

  constructor() {
    // Initialize connection asynchronously using shared Redis client
    this.connect().catch(err => {
      logger.error('Unexpected error during Redis cache initialization', { error: err });
      this.isConnected = false;
      this.client = null;
    });
  }

  private async connect() {
    try {
      this.client = await getSharedRedisClient();
      this.isConnected = isRedisAvailable();
      if (this.isConnected) {
        logger.info('Redis cache using shared client');
      } else {
        logger.warn('Redis cache: shared client not available, falling back to in-memory caching');
      }
    } catch (error) {
      logger.warn('Failed to connect to Redis cache, falling back to in-memory caching', { error });
      this.isConnected = false;
      this.client = null;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected || !this.client) return null;

    try {
      const value = await this.client.get(key);
      if (typeof value !== 'string' || value === '{}' || value === '') {
        logger.debug('Redis cache miss', { key });
        return null;
      }

      const parsed = JSON.parse(value) as T;
      
      // Log cache hit with progression length if available
      const progressionLength = (parsed as any)?.progression?.length;
      logger.debug('Redis cache hit', { 
        key, 
        progressionLength: progressionLength ?? 'N/A',
      });
      
      return parsed;
    } catch (error) {
      logger.warn('Redis cache get error', { error, key });
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    if (!this.isConnected || !this.client) return;

    try {
      const serialized = JSON.stringify(value);
      
      // Log cache write with progression length if available
      const progressionLength = (value as any)?.progression?.length;
      logger.debug('Redis cache set', { 
        key, 
        ttlSeconds,
        progressionLength: progressionLength ?? 'N/A',
      });
      
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (error) {
      logger.warn('Redis cache set error', { error, key });
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConnected || !this.client) return false;

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.warn('Redis cache exists error', { error, key });
      return false;
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.isConnected || !this.client) return;

    try {
      await this.client.del(key);
    } catch (error) {
      logger.warn('Redis cache delete error', { error, key });
    }
  }

  // Get cache key for a progression request with semantic awareness
  static getProgressionCacheKey(
    key: string,
    mode: string,
    includeTensions: boolean,
    numChords: number,
    selectedProgression: string
  ): string {
    return getSharedCacheKey(key, mode, includeTensions, numChords, selectedProgression);
  }

  // Check if similar requests exist (for deduplication)
  async findSimilarRequests(cacheKey: string): Promise<string | null> {
    if (!this.isConnected || !this.client) return null;

    try {
      // For now, just check exact match - we can enhance this later
      const exists = await this.exists(cacheKey);
      return exists ? cacheKey : null;
    } catch (error) {
      logger.warn('Redis cache similarity check error', { error, cacheKey });
      return null;
    }
  }
}

// Export singleton instance
export const redisCache = new RedisCache();
export { RedisCache };

// Re-export shared cache key utility for convenience
export { getProgressionCacheKey } from '../shared/cacheUtils';
