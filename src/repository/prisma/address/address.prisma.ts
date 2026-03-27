import { prisma } from "@/libs/prisma";
import { IAddressRepository } from "@/repository/interfaces/address.type";


export class AddressRepository implements IAddressRepository {

    findAddressById = async (id: string) => {
        return await prisma.endereco.findUnique({ 
            where: {id: id},
            select: {
                id: true,
                bairro: true,
                cep: true,
                cidade: true,
                complemento: true,
                estado: true,
                numero: true,
                rua: true,
            }
        })
    }

    findAddressByUserId = async (userId: string) => {
        return await prisma.usuarioEndereco.findMany({
            where: {usuarioId: userId},
            select: {
                endereco: {
                    select: {
                        bairro: true,
                        cep: true,
                        cidade: true,
                        complemento: true,
                        estado: true,
                        numero: true,
                        rua: true,
                        id: true
                    }
                }
            }
        })
    }
}