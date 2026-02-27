import { randomUUID } from "node:crypto";
import { NextFunction, Request, Response } from "express";
import pinoHttp from "pino-http";
import { logger } from "./logger";
import { runWithRequestContext } from "./request-context";

function getRequestIdFromHeader(header: string | string[] | undefined) {
  if (typeof header === "string" && header.trim().length > 0) {
    return header;
  }

  if (Array.isArray(header) && header.length > 0) {
    return header[0];
  }

  return undefined;
}

const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => {
    const requestId = getRequestIdFromHeader(req.headers["x-request-id"]);
    return requestId || randomUUID();
  },
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) {
      return "error";
    }

    if (res.statusCode >= 400) {
      return "warn";
    }

    return "info";
  },
  customSuccessMessage: () => "request completed",
  customErrorMessage: () => "request failed",
  serializers: {
    req: (req) => {
      const request = req as Request & {
        id?: string;
        socket?: { remoteAddress?: string; remotePort?: number };
        connection?: { remoteAddress?: string; remotePort?: number };
        ip?: string;
      };
      const remoteAddress = request.socket?.remoteAddress || request.connection?.remoteAddress || request.ip;
      const remotePort = request.socket?.remotePort || request.connection?.remotePort;

      return {
        id: request.id,
        method: request.method,
        url: request.url,
        remoteAddress,
        remotePort,
      };
    },
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

function bindRequestContext(req: Request, _res: Response, next: NextFunction) {
  const requestId = (req as Request & { id?: string }).id || getRequestIdFromHeader(req.headers["x-request-id"]) || randomUUID();
  req.requestId = requestId;

  runWithRequestContext({ requestId }, () => next());
}

export { httpLogger, bindRequestContext };
