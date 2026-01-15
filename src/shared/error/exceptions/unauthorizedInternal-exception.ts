import { HttpStatus } from "@/shared/constants";

export class ExternalServiceUnauthorizedException extends Error {
  public readonly status = HttpStatus.UNAUTHORIZED;

  constructor(message = "Falha de autenticação com serviço externo") {
    super(message);
    this.name = "ExternalServiceUnauthorizedException";
  }
}
