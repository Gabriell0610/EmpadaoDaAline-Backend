import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";
import { DistanceResponse, IDistanceProvider } from "./IDistanceProvider";
import { InternalServerException } from "@/shared/error/exceptions/internalServer-exception";


export class DistanceProvider implements IDistanceProvider {

    private API_KEY = process.env.KEY_DISTANCEMATRIX

    getDistance = async (origin: string, destination: string) => {
        const url = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=
                ${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${this.API_KEY}`;

        try {
            const req = await fetch(url)

            const res: DistanceResponse = await req.json();

            if (res.status !== "OK" || !res.rows[0].elements[0]) {
                console.log("IF 1", res)
                throw new BadRequestException("Erro ao buscar distância, verifique se não está faltando alguma informação");
            }


            const element = res.rows[0].elements[0];

            if (element.status !== "OK" || !element.distance?.value) {
                console.log("IF 2 ", element)
                throw new BadRequestException("Não foi possível calcular a distância entre os endereços, verifique se não está faltando alguma informação");
            }


            return res;

        } catch (error) {
            if (error instanceof BadRequestException) throw error;

            throw new InternalServerException(
                "Falha ao se comunicar com o serviço de distância"
            );
        }
    }
    
}