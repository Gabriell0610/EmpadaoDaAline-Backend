import { AccessProfile } from "@/shared/constants/accessProfile";
import { Authorization } from "./authorization";

class AuthorizationFactory {
  ofRoles = (roles: AccessProfile[]): Authorization => {
    return new Authorization().ofRoles([...roles]);
  };

  anyRole = (): Authorization => {
    return new Authorization().anyRole();
  };
}

export { AuthorizationFactory };
