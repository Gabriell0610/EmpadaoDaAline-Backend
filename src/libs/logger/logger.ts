import pino, { Logger, LoggerOptions } from "pino";
import { getRequestContext } from "./request-context";

const isProduction = process.env.NODE_ENV === "production";

const loggerOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
  base: {
    service: process.env.SERVICE_NAME || "pedido-backend",
    env: process.env.NODE_ENV || "development",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.body.password",
      "req.body.newPassword",
      "req.body.token",
      "req.body.refreshToken",
      "accessToken",
      "refreshToken",
      "password",
      "token",
    ],
    censor: "[REDACTED]",
  },
  mixin() {
    const context = getRequestContext();

    if (!context) {
      return {};
    }

    return {
      requestId: context.requestId,
      userId: context.userId,
    };
  },
};

if (!isProduction) {
  loggerOptions.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
      singleLine: true,
    },
  };
}

const logger = pino(loggerOptions);

function createLogger(module: string): Logger {
  return logger.child({ module });
}

export { logger, createLogger };
