import { HttpStatus } from "@/shared/constants";

class ForbiddenException extends Error {
  public readonly status = HttpStatus.FORBIDDEN;
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenException";
  }
}

export { ForbiddenException };
