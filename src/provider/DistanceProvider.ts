import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";
import { DistanceResponse, IDistanceProvider } from "./IDistanceProvider";
import { InternalServerException } from "@/shared/error/exceptions/internalServer-exception";
import { ExternalServiceUnauthorizedException } from "@/shared/error/exceptions/unauthorizedInternal-exception";


export class DistanceProvider implements IDistanceProvider {

    private API_KEY = process.env.KEY_DISTANCEMATRIX

    getDistance = async (origin: string, destination: string) => {
        console.log("key da api",process.env.KEY_DISTANCEMATRIX)
        const url = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=
                ${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${this.API_KEY}`;

        try {
            const req = await fetch(url)

            const res: DistanceResponse = await req.json();

            if (res.status === "INVALID_REQUEST") {
                console.log("DistanceMatrix INVALID_REQUEST:", res);
                throw new BadRequestException("Não foi possível calcular o frete com os dados informados");
            }

            if(res.status === "REQUEST_DENIED") {
                throw new ExternalServiceUnauthorizedException()
            }

            if (!res.rows?.[0]?.elements?.[0]) {
                console.log("Resposta inválida do serviço de frete")
            }


            const element = res.rows[0].elements[0];
            console.log("valores frete: ",element);

            if (element.status !== "OK" || !element.distance?.value) {
                console.log("IF 2 ", element)
                throw new BadRequestException("Não foi possível calcular a distância entre os endereços, verifique se não está faltando alguma informação");
            }


            return res;

        } catch (error) {
            if (error instanceof BadRequestException || ExternalServiceUnauthorizedException ) throw error;

            throw new InternalServerException(
                "Falha ao se comunicar com o serviço de frete"
            );
        }
    }
    
}