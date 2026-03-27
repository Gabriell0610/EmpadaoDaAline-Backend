import { AccessProfile } from "@/shared/constants/accessProfile";
import { ForbiddenException } from "@/shared/error/exceptions/forbiddenException";
import { NextFunction, Request, Response } from "express";

class Authorization {
  private authorizedRoles: AccessProfile[] = [];
  private authorizedAnyRole = false;

  ofRoles = (roles: AccessProfile[]) => {
    this.authorizedRoles = roles;
    this.authorizedAnyRole = false;

    return this;
  };

  anyRole = () => {
    this.authorizedRoles = [];
    this.authorizedAnyRole = true;

    return this;
  };

  authorize = (req: Request, _res: Response, next: NextFunction) => {
    try {
      const role = req.user?.role;

      if (!role) {
        throw new ForbiddenException("Voce não tem permissão para executar esta ação.");
      }

      if (!this.authorizedAnyRole && !this.authorizedRoles.includes(role)) {
        throw new ForbiddenException("Voce não tem permissão para executar esta ação.");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export { Authorization };
