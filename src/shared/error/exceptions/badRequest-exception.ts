import { HttpStatus } from "@/shared/constants";

class BadRequestException extends Error {
  public readonly status = HttpStatus.BAD_REQUEST;
  constructor(message: string) {
    super(message);
    this.name = "BadRequestException";
  }
}

export { BadRequestException };
