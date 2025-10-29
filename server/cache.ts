import { createClient, RedisClientType } from 'redis';

class RedisCache {
  private client: RedisClientType;
  private isConnected = false;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.client.on('connect', () => {
      this.isConnected = true;
      console.log('Redis cache connected');
    });

    this.client.on('error', (err) => {
      console.warn('Redis cache connection error:', err.message);
      this.isConnected = false;
    });

    // Connect asynchronously - don't block startup
    this.connect();
  }

  private async connect() {
    try {
      await this.client.connect();
    } catch (error) {
      console.warn('Failed to connect to Redis cache, falling back to in-memory caching:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected) return null;

    try {
      const value = await this.client.get(key);
      if (!value || value === '{}') return null;

      return JSON.parse(value) as T;
    } catch (error) {
      console.warn('Redis cache get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    if (!this.isConnected) return;

    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (error) {
      console.warn('Redis cache set error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConnected) return false;

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.warn('Redis cache exists error:', error);
      return false;
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.isConnected) return;

    try {
      await this.client.del(key);
    } catch (error) {
      console.warn('Redis cache delete error:', error);
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
    // Create a semantic fingerprint based on the meaningful parts of the request
    const semanticParts = [
      key.toLowerCase(),
      mode.toLowerCase(),
      includeTensions ? 'tensions' : 'no-tensions',
      numChords.toString(),
      selectedProgression.toLowerCase().replace(/[^a-z0-9]/g, '-')
    ];

    return `progression:${semanticParts.join(':')}`;
  }

  // Check if similar requests exist (for deduplication)
  async findSimilarRequests(cacheKey: string): Promise<string | null> {
    if (!this.isConnected) return null;

    try {
      // Look for patterns like the cache key but allowing some variation
      const basePattern = cacheKey.replace(/progression:[^:]+:[^:]+:[^:]+:[^:]+:.*/, 'progression:*');

      // For now, just check exact match - we can enhance this later
      const exists = await this.exists(cacheKey);
      return exists ? cacheKey : null;
    } catch (error) {
      console.warn('Redis cache similarity check error:', error);
      return null;
    }
  }
}

// Export singleton instance
export const redisCache = new RedisCache();
export { RedisCache };

// Utility function for cache key generation
export function getProgressionCacheKey(
  key: string,
  mode: string,
  includeTensions: boolean,
  numChords: number,
  selectedProgression: string
): string {
  // Create a semantic fingerprint based on the meaningful parts of the request
  const semanticParts = [
    key.toLowerCase(),
    mode.toLowerCase(),
    includeTensions ? 'tensions' : 'no-tensions',
    numChords.toString(),
    selectedProgression.toLowerCase().replace(/[^a-z0-9]/g, '-')
  ];

  return `progression:${semanticParts.join(':')}`;
}
