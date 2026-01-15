import { HttpStatus } from "@/shared/constants";

class InternalServerException extends Error {
  public readonly status = HttpStatus.INTERNAL_SERVER_ERROR;
  constructor(message: string) {
    super(message);
    this.name = "InternalServerException";
  }
}

export { InternalServerException };
