import { AccessProfile } from "@/shared/constants/accessProfile";
import { Authorization } from "./authorization";

class AuthorizationFactory {
  instances: Authorization[] = [];

  private createInstance(instanceName: string): Authorization {
    return new Authorization(instanceName);
  }

  private getInstance(instanceName: string): Authorization {
    let instance = this.instances.find((instance) => instance.instanceName === instanceName);

    if (!instance) {
      instance = this.createInstance(instanceName);
      this.instances.push(instance);
      console.log("Nova instância criada:", instance);
    }

    return instance;
  }

  ofRoles = (roles: AccessProfile[]): Authorization => {
    const formartInstanceName = roles.sort().join("-");
    return this.getInstance(formartInstanceName).ofRoles(roles);
  };

  anyRole = (): Authorization => {
    return this.getInstance("any-roles-instance").anyRole();
  };
}

export { AuthorizationFactory };
