import express from "express";
import { registerRoutes } from "./routes";
import { pendingRequests } from "./pendingRequests";
import { logger } from "./utils/logger";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function main() {
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
