import { UnauthorizedException } from "@/shared/error/exceptions/unauthorized-exception";
import { NextFunction, Request, Response } from "express";
import { verify, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import "dotenv/config";
import { InternalServerException } from "@/shared/error/exceptions/internalServer-exception";
import { AccessProfile } from "@/shared/constants/accessProfile";
import { createLogger, setRequestContextUserId } from "@/libs/logger";

const authMiddlewareLogger = createLogger("auth-middleware");

class JWTAuthenticator {
  authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.access_token;

      if (!token) {
        authMiddlewareLogger.warn({ requestId: req.requestId, path: req.originalUrl }, "Access token not provided");
        throw new UnauthorizedException("Token não fornecido.");
      }

      if (!process.env.JWT_SECRET) {
        authMiddlewareLogger.error({ requestId: req.requestId }, "JWT secret is not configured");
        throw new InternalServerException("JWT_SECRET não está definido");
      }

      const payload = verify(token, process.env.JWT_SECRET) as JwtPayload;

      req.user = {
        id: payload.id,
        email: payload.email,
        role: payload.role as AccessProfile,
      };
      setRequestContextUserId(payload.id as string);

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        authMiddlewareLogger.warn({ requestId: req.requestId, path: req.originalUrl }, "Access token expired");
        return next(new UnauthorizedException("Token expirado"));
      }

      authMiddlewareLogger.warn({ requestId: req.requestId, path: req.originalUrl }, "Access token invalid");
      next(new UnauthorizedException("Token inválido"));
    }
  };
}

export { JWTAuthenticator };
