import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";
import { InternalServerException } from "@/shared/error/exceptions/internalServer-exception";
import { ExternalServiceUnauthorizedException } from "@/shared/error/exceptions/unauthorizedInternal-exception";
import { DistanceResponse, IDistanceProvider } from "./IDistanceProvider";
import { createLogger } from "@/libs/logger";

const distanceProviderLogger = createLogger("distance-provider");

export class DistanceProvider implements IDistanceProvider {
  private API_KEY = process.env.KEY_DISTANCEMATRIX;

  getDistance = async (origin: string, destination: string) => {
    if (!this.API_KEY) {
      throw new InternalServerException("Servico de frete indisponivel no momento");
    }

    const url = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=
                ${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${this.API_KEY}`;

    try {
      const start = Date.now();
      const req = await fetch(url);
      const res: DistanceResponse = await req.json();
      const durationMs = Date.now() - start;

      if (res.status === "INVALID_REQUEST") {
        distanceProviderLogger.warn({ status: res.status, durationMs }, "Distance API rejected request");
        throw new BadRequestException("Nao foi possivel calcular o frete com os dados informados");
      }

      if (res.status === "REQUEST_DENIED") {
        distanceProviderLogger.error({ status: res.status, durationMs }, "Distance API request denied");
        throw new ExternalServiceUnauthorizedException();
      }

      const element = res.rows?.[0]?.elements?.[0];

      if (!element) {
        throw new InternalServerException("Resposta invalida do servico de frete");
      }

      if (element.status !== "OK" || !element.distance?.value) {
        distanceProviderLogger.warn({ elementStatus: element.status, durationMs }, "Distance API response missing distance");
        throw new BadRequestException(
          "Nao foi possivel calcular a distancia entre os enderecos, verifique se nao esta faltando alguma informacao",
        );
      }

      distanceProviderLogger.info({ durationMs }, "Distance API request succeeded");
      return res;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ExternalServiceUnauthorizedException) {
        throw error;
      }

      distanceProviderLogger.error({ err: error }, "Distance API request failed");
      throw new InternalServerException("Falha ao se comunicar com o servico de frete");
    }
  };
}
