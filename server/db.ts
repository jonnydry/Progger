import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Configure connection pool for better concurrent request handling
const client = postgres(process.env.DATABASE_URL, {
  max: 10, // Maximum number of connections in the pool
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
  // Query timeout to prevent slow query attacks
  max_lifetime: 60 * 30, // Maximum connection lifetime: 30 minutes
});

export const db = drizzle(client, { schema });
