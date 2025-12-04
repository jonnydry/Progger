import express from "express";
import helmet from "helmet";
import compression from "compression";
import { registerRoutes } from "./routes";
import { pendingRequests } from "./pendingRequests";
import { logger } from "./utils/logger";

const app = express();

// Response compression for JSON and text responses
app.use(compression({ level: 6, threshold: 1024 }));

// Request timeout middleware - prevent hanging requests
app.use((req, res, next) => {
  const timeout = 30000; // 30 seconds
  req.setTimeout(timeout, () => {
    if (!res.headersSent) {
      res.status(408).json({ error: 'Request timeout' });
    }
  });
  next();
});

// Security headers via Helmet.js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  xContentTypeOptions: true,
  xFrameOptions: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// Request body size limits to prevent memory exhaustion attacks
// Global limit: 10mb (generous for JSON payloads)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Per-route size validation middleware for specific endpoints
export function validateRequestSize(maxSizeBytes: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const contentLength = req.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > maxSizeBytes) {
      return res.status(413).json({
        error: `Request body too large. Maximum size: ${Math.round(maxSizeBytes / 1024)}KB`
      });
    }
    next();
  };
}

async function main() {
  // Validate required environment variables
  // Note: SESSION_SECRET, DATABASE_URL, REPL_ID, REPLIT_DOMAINS are auto-provided by Replit
  if (!process.env.XAI_API_KEY) {
    logger.error("XAI_API_KEY environment variable is not set");
    throw new Error("XAI_API_KEY environment variable is required. Please add it via Replit Secrets.");
  }

  // Validate XAI_API_KEY format (should start with 'xai-' or similar)
  if (typeof process.env.XAI_API_KEY === 'string' && process.env.XAI_API_KEY.length < 10) {
    logger.error("XAI_API_KEY appears to be invalid (too short)");
    throw new Error("XAI_API_KEY appears to be invalid. Please check your Replit Secrets configuration.");
  }

  // Validate DATABASE_URL format if present
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgres://') && !process.env.DATABASE_URL.startsWith('postgresql://')) {
    logger.warn("DATABASE_URL does not appear to be a PostgreSQL connection string");
  }

  logger.info("Environment variables validated", {
    hasXaiApiKey: !!process.env.XAI_API_KEY,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasSessionSecret: !!process.env.SESSION_SECRET,
  });

  const server = await registerRoutes(app);
  const PORT = 3001;
  
  server.listen(PORT, "0.0.0.0", () => {
    logger.info("Server started", { port: PORT, host: "0.0.0.0" });
  });

  // Graceful shutdown handling
  const shutdown = () => {
    logger.info("Shutting down gracefully");
    pendingRequests.destroy();
    server.close(() => {
      logger.info("Server closed");
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch((error) => {
  logger.error("Failed to start server", error);
  process.exit(1);
});
