import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";
import { InternalServerException } from "@/shared/error/exceptions/internalServer-exception";
import { ExternalServiceUnauthorizedException } from "@/shared/error/exceptions/unauthorizedInternal-exception";
import { DistanceResponse, IDistanceProvider } from "./IDistanceProvider";

export class DistanceProvider implements IDistanceProvider {
  private API_KEY = process.env.KEY_DISTANCEMATRIX;

  getDistance = async (origin: string, destination: string) => {
    if (!this.API_KEY) {
      throw new InternalServerException("Servico de frete indisponivel no momento");
    }

    const url = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=
                ${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${this.API_KEY}`;

    try {
      const req = await fetch(url);
      const res: DistanceResponse = await req.json();

      if (res.status === "INVALID_REQUEST") {
        throw new BadRequestException("Nao foi possivel calcular o frete com os dados informados");
      }

      if (res.status === "REQUEST_DENIED") {
        throw new ExternalServiceUnauthorizedException();
      }

      const element = res.rows?.[0]?.elements?.[0];

      if (!element) {
        throw new InternalServerException("Resposta invalida do servico de frete");
      }

      if (element.status !== "OK" || !element.distance?.value) {
        throw new BadRequestException(
          "Nao foi possivel calcular a distancia entre os enderecos, verifique se nao esta faltando alguma informacao",
        );
      }

      return res;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ExternalServiceUnauthorizedException) {
        throw error;
      }

      throw new InternalServerException("Falha ao se comunicar com o servico de frete");
    }
  };
}
