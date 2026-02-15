import { UnauthorizedException } from "@/shared/error/exceptions/unauthorized-exception";
import { NextFunction, Request, Response } from "express";
import { verify, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import "dotenv/config";
import { InternalServerException } from "@/shared/error/exceptions/internalServer-exception";
import { AccessProfile } from "@/shared/constants/accessProfile";

class JWTAuthenticator {
  authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.access_token;

      if (!token) {
        throw new UnauthorizedException("Token não fornecido.");
      }

      if (!process.env.JWT_SECRET) {
        throw new InternalServerException("JWT_SECRET não está definido");
      }

      const payload = verify(token, process.env.JWT_SECRET) as JwtPayload;

      req.user = {
        id: payload.id,
        email: payload.email,
        role: payload.role as AccessProfile,
      };

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) throw new UnauthorizedException("Token expirado");
      next(new UnauthorizedException("Token inválido"));
    }
  };
}

export { JWTAuthenticator };
