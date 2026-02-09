import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import { logger } from './utils/logger';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  logger.warn('DATABASE_URL environment variable is not set; database-backed features are disabled');
}

// Configure connection pool for better concurrent request handling when DB is configured
const client = databaseUrl
  ? postgres(databaseUrl, {
      max: 10, // Maximum number of connections in the pool
      idle_timeout: 20, // Close idle connections after 20 seconds
      connect_timeout: 10, // Connection timeout in seconds
      // Query timeout to prevent slow query attacks
      max_lifetime: 60 * 30, // Maximum connection lifetime: 30 minutes
    })
  : null;

const unavailableDb = new Proxy(
  {},
  {
    get() {
      throw new Error('Database is not configured. Set DATABASE_URL environment variable.');
    },
  }
);

export const db = client ? drizzle(client, { schema }) : (unavailableDb as any);
