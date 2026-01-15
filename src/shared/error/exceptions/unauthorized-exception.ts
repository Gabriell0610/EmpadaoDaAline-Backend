import { HttpStatus } from "@/shared/constants";

class UnauthorizedException extends Error {
  public readonly status = HttpStatus.UNAUTHORIZED;
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedException";
  }
}

export { UnauthorizedException };
