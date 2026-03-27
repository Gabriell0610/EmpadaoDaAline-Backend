import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redisClient } from "../../libs/redis/redis";
import { Request, Response, NextFunction } from "express";
import { createLogger } from "@/libs/logger";

let loginRateLimiter: ReturnType<typeof rateLimit> | null = null;
const loginRateLimitLogger = createLogger("login-rate-limit");

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
      handler: (req, res, next, options) => {
        loginRateLimitLogger.warn(
          {
            requestId: req.requestId,
            ip: req.ip,
            path: req.originalUrl,
          },
          "Login rate limit reached",
        );
        res.status(options.statusCode).send(options.message);
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
