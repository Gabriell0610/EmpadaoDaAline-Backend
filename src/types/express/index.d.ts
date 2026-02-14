import { AccessProfile } from "@/domain/enums/AccessProfile";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: AccessProfile;
      };
    }
  }
}

export {};
