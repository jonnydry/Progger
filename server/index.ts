import express from "express";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";
import { logger } from "./utils/logger";
import { env, isProduction } from "./env";

const app = express();

// Response compression for JSON and text responses
app.use(compression({ level: 6, threshold: 1024 }));

// Request timeout middleware - prevent hanging requests
app.use((req, res, next) => {
  const timeout = 30000; // 30 seconds
  req.setTimeout(timeout, () => {
    if (!res.headersSent) {
      res.status(408).json({ error: "Request timeout" });
    }
  });
  next();
});

// Security headers via Helmet.js
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
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
    xFrameOptions: { action: "deny" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

// Request body size limits to prevent memory exhaustion attacks
// Global limit: 10mb (generous for JSON payloads)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

async function main() {
  // Env is validated at module load time by `./env` (zod schema). If anything
  // is missing/invalid, the import itself throws before reaching here.
  logger.info("Environment variables validated", {
    nodeEnv: env.NODE_ENV,
    hasXaiApiKey: !!env.XAI_API_KEY,
    hasDatabaseUrl: !!env.DATABASE_URL,
    hasSessionSecret: !!env.SESSION_SECRET,
  });

  const server = await registerRoutes(app);

  // Serve built client in production (after API routes so /api/* takes precedence)
  if (isProduction) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const clientDist = path.resolve(__dirname);
    app.use(
      express.static(clientDist, {
        index: false,
        maxAge: "1y",
        setHeaders: (res, filePath) => {
          if (filePath.endsWith("index.html")) {
            res.setHeader("Cache-Control", "no-cache");
          }
        },
      })
    );
    // SPA fallback: send index.html for any non-API route
    app.get(/^(?!\/api\/).*/, (_req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });
    logger.info("Serving static client files", { dir: clientDist });
  }

  const PORT = env.PORT;

  server.listen(PORT, "0.0.0.0", () => {
    logger.info("Server started", { port: PORT, host: "0.0.0.0" });
  });

  // Graceful shutdown handling
  const shutdown = () => {
    logger.info("Shutting down gracefully");
    server.close(() => {
      logger.info("Server closed");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((error) => {
  logger.error("Failed to start server", error);
  process.exit(1);
});
