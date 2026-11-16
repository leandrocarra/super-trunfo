import cors from "cors";
import express from "express";
import { env } from "./env.js";
import { healthRouter } from "./routes/health.js";
import { pixarRouter } from "./routes/pixar.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: "8mb" }));
  app.use("/health", healthRouter);
  app.use("/imagens/pixar", pixarRouter);

  return app;
}
