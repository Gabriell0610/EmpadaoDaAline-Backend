import { HttpStatus } from "@/shared/constants";

class ConflitException extends Error {
  public readonly status = HttpStatus.CONFLICT;
  constructor(message: string) {
    super(message);
    this.name = "ConflitException";
  }
}

export { ConflitException };
