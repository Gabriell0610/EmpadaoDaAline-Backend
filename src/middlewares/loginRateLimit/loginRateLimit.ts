import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redisClient } from "../../libs/redis/redis";
import { Request, Response, NextFunction } from "express";
import { createLogger } from "@/libs/logger";

const rateLimitLogger = createLogger("rate-limit");

let authLimiter: ReturnType<typeof rateLimit> | null = null;
let publicLimiter: ReturnType<typeof rateLimit> | null = null;
let privateLimiter: ReturnType<typeof rateLimit> | null = null;

function createLimiter(options: { windowMs: number; max: number; prefix: string; message: string }) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: options.message },
    handler: (req, res, next, opts) => {
      rateLimitLogger.warn(
        {
          requestId: req.requestId,
          ip: req.ip,
          path: req.originalUrl,
          prefix: options.prefix,
        },
        "Rate limit reached",
      );
      res.status(opts.statusCode).send(opts.message);
    },
    store: new RedisStore({
      prefix: options.prefix,
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
  });
}

export function initRateLimiters() {
  authLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    prefix: "rl:auth",
    message: "Muitas tentativas de login. Tente novamente mais tarde.",
  });

  publicLimiter = createLimiter({
    windowMs: 60 * 1000,
    max: 60,
    prefix: "rl:public",
    message: "Muitas requisições. Tente novamente em breve.",
  });

  privateLimiter = createLimiter({
    windowMs: 60 * 1000,
    max: 120,
    prefix: "rl:private",
    message: "Muitas requisições. Tente novamente em breve.",
  });
}

export function globalRateLimiter(req: Request, res: Response, next: NextFunction) {
  if (!authLimiter || !publicLimiter || !privateLimiter) {
    return next(new Error("RateLimiters não inicializados."));
  }

  const path = req.path;
  const method = req.method;

  const skipRateLimit = path === "/api/auth/refresh" || path === "/api/auth/logout";

  if (skipRateLimit) {
    return next();
  }

  if (path.startsWith("/api/auth")) {
    return authLimiter(req, res, next);
  }

  const isPublicRoute =
    (method === "GET" && path === "/api/itens/active") || (method === "GET" && path.match(/^\/api\/itens\/[^/]+$/));

  if (isPublicRoute) {
    return publicLimiter(req, res, next);
  }

  return privateLimiter(req, res, next);
}
