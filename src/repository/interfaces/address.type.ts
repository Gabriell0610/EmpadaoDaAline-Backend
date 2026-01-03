import { addressEntity } from "@/domain/model/AddressEntity";


interface ListAddressByUserId {
    endereco: {
        bairro: string;
        cidade: string;
        cep: string;
        complemento: string | null;
        estado: string;
        numero: string;
        rua: string;
        id:string
  };
}


export interface IAddressRepository {

    findAddressById(id: string): Promise<Partial<addressEntity | null>>
    findAddressByUserId(userId: string): Promise<ListAddressByUserId[]>
}