import { AccessProfile } from "@/shared/constants/accessProfile";
import { ForbiddenException } from "@/shared/error/exceptions/forbiddenException";
import { NextFunction, Request, Response } from "express";

class Authorization {
  public instanceName: string;
  private authorizedRoles: AccessProfile[] = [];
  private authorizedAnyRole: boolean = false;

  constructor(instanceName: string) {
    this.instanceName = instanceName;
  }

  ofRoles = (roles: AccessProfile[]) => {
    this.authorizedRoles = roles;

    return this;
  };

  anyRole = () => {
    this.authorizedAnyRole = true;

    return this;
  };

  authorize = (req: Request, res: Response, next: NextFunction) => {
    try {
      const role = req.user?.role;

      if (!this.authorizedRoles.includes(role) && !this.authorizedAnyRole) {
        throw new ForbiddenException("Você não tem permissão para executar esta ação.");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export { Authorization };
