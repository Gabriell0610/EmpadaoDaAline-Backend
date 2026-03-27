import { AccessProfile } from "@/shared/constants/accessProfile";
import { Logger } from "pino";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      log: Logger;
      user?: {
        id: string;
        email: string;
        role: AccessProfile;
      };
    }
  }
}

export {};
