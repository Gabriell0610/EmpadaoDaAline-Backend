import { createClient } from "redis";
import { createLogger } from "@/libs/logger";

const redisLogger = createLogger("redis");

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  redisLogger.error({ err }, "Redis client error");
});

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    redisLogger.info("Redis connection established");
  }
}
