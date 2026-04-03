import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redisClient } from "../../libs/redis/redis";
import { Request, Response, NextFunction } from "express";
import { createLogger } from "@/libs/logger";

const rateLimitLogger = createLogger("rate-limit");

let authLimiter: ReturnType<typeof rateLimit> | null = null;
let recoveryLimiter: ReturnType<typeof rateLimit> | null = null;
let publicAndPrivateLimiter: ReturnType<typeof rateLimit> | null = null;

function createLimiter(options: {
  windowMs: number;
  max: number;
  prefix: string;
  message: string;
  keyGenerator?: (req: Request) => string;
}) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: options.message },
    keyGenerator: options.keyGenerator,
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
    keyGenerator: (req) => {
      const email = req.body?.email || "unknown";
      return `${req.ip}:${email}`;
    },
  });

  publicAndPrivateLimiter = createLimiter({
    windowMs: 60 * 1000,
    max: 60,
    prefix: "rl:public",
    message: "Muitas tentativas. Tente novamente em breve.",
  });

  recoveryLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    prefix: "rl:recovery",
    message: "Muitas tentativas. Tente novamente em breve.",
  });
}

export function globalRateLimiter(req: Request, res: Response, next: NextFunction) {
  if (!authLimiter || !publicAndPrivateLimiter || !recoveryLimiter) {
    return next(new Error("RateLimiters não inicializados."));
  }

  const path = req.path;
  const method = req.method;

  const skipRateLimit = path === "/api/auth/refresh" || path === "/api/auth/logout";

  if (skipRateLimit) {
    return next();
  }

  if (path === "/api/auth/login") {
    return authLimiter(req, res, next);
  }

  if (
    path === "/api/auth/forgot-password" ||
    path === "/api/auth/reset-password" ||
    path === "/api/auth/validate-token"
  ) {
    return recoveryLimiter(req, res, next);
  }

  const isPublicRoute =
    (method === "GET" && path === "/api/itens/active") || (method === "GET" && path.match(/^\/api\/itens\/[^/]+$/));

  if (isPublicRoute) {
    return publicAndPrivateLimiter(req, res, next);
  }

  return publicAndPrivateLimiter(req, res, next);
}
