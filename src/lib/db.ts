import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a SQL query function using the Neon serverless driver
// Usage: sql`SELECT * FROM users WHERE id = ${userId}`
export const sql = neon(process.env.DATABASE_URL);
