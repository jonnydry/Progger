import express from "express";
import helmet from "helmet";
import { registerRoutes } from "./routes";
import { pendingRequests } from "./pendingRequests";
import { logger } from "./utils/logger";

const app = express();

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
}));

// Request body size limits to prevent memory exhaustion attacks
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

async function main() {
  // Validate required environment variables
  // Note: SESSION_SECRET, DATABASE_URL, REPL_ID, REPLIT_DOMAINS are auto-provided by Replit
  if (!process.env.XAI_API_KEY) {
    logger.error("XAI_API_KEY environment variable is not set");
    throw new Error("XAI_API_KEY environment variable is required. Please add it via Replit Secrets.");
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
