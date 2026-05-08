import { z } from "zod";

const truthy = ["1", "true", "yes", "on"];

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),

  XAI_API_KEY: z.string().min(10, "XAI_API_KEY appears to be invalid (too short)"),
  XAI_MODEL: z.string().default("grok-4.3"),
  XAI_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(25000),
  XAI_MAX_CONCURRENT_REQUESTS: z.coerce.number().int().positive().default(8),

  DATABASE_URL: z
    .string()
    .refine(
      (v) => v.startsWith("postgres://") || v.startsWith("postgresql://"),
      "DATABASE_URL must be a postgres:// or postgresql:// connection string"
    )
    .optional(),

  REDIS_URL: z.string().default("redis://localhost:6379"),

  SESSION_SECRET: z.string().min(16).optional(),
  REPL_ID: z.string().optional(),
  REPLIT_DOMAINS: z.string().optional(),
  ISSUER_URL: z.string().url().default("https://replit.com/oidc"),

  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).optional(),
  DEBUG: z
    .string()
    .optional()
    .transform((v) => (v ? truthy.includes(v.toLowerCase()) : false)),

  VITEST: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }
  return parsed.data;
}

export const env: Env = loadEnv();

export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";
export const isTest = env.NODE_ENV === "test" || Boolean(env.VITEST);
