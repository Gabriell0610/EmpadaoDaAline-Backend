import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redisClient } from "../../libs/redis/redis";
import { Request, Response, NextFunction } from "express";

let loginRateLimiter: ReturnType<typeof rateLimit> | null = null;

export function initLoginRateLimiter() {
  if (!loginRateLimiter) {
    loginRateLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        message: "Muitas tentativas de login. Tente novamente mais tarde.",
      },
      store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
      }),
    });
  }
}
export function loginRateLimiterMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!loginRateLimiter) {
    return next(new Error("LoginRateLimiter não inicializado. Chame initLoginRateLimiter() antes."));
  }

  return loginRateLimiter(req, res, next);
}
