import { carregarEnvLocal } from "./carregar-env.js";

carregarEnvLocal();

function parsePort(value: string | undefined, fallback: number): number {
  const port = Number(value ?? fallback);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  return port;
}

export const env = {
  port: parsePort(process.env.PORT, 3002),
  nodeEnv: process.env.NODE_ENV ?? "development",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3001",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
};
