import rateLimit from "express-rate-limit";
import { logger } from "./utils/logger";

/**
 * In-memory rate limiter for AI generation endpoints.
 * Sufficient for a single Replit instance.
 */
export async function createAIGenerationLimiter() {
  logger.info("Using in-memory rate limiting for AI generation endpoints");
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { error: "Too many AI generation requests from this IP, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: any, res: any) => {
      logger.warn("Rate limit exceeded", {
        requestId: req.id,
        ip: req.ip,
        path: req.path,
        userAgent: req.get("user-agent"),
      });
      res.status(429).json({
        error: "Too many AI generation requests from this IP, please try again later.",
      });
    },
  });
}

export function getRateLimitStatus() {
  return {
    storeType: "memory" as const,
  };
}
