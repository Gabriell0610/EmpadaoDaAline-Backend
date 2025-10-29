import { addressEntity } from "@/domain/model/AddressEntity";


export interface IAddressRepository {

    findAddressById(id: string): Promise<Partial<addressEntity | null>>
}