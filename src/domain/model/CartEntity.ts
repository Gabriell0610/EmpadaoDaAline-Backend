import { Carrinho, CarrinhoItens, ItemSize, StatusCart, TypeItem } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

type CartEntity = Carrinho;
type CartItemsEntity = CarrinhoItens;

export interface Cart {
    id: string;
    status: StatusCart
    dataCriacao: Date;
    valorTotal: Decimal | null;
    usuarioId: string;
}

export interface ListCartDto extends Cart {
    carrinhoItens: {
        id: string;
        quantidade: number,
        precoAtual: Decimal;
        carrinhoId: string;
        itemId: string;
        item: {
            id: string,
            preco: Decimal,
            precoUnitario: Decimal | null,
            tamanho: ItemSize | null;
            unidades: number | null,
            itemDescription: {
                id:string,
                image:string | null,
                descricao:string,
                nome:string,
                tipo: TypeItem | null,
                disponivel:string | null,
            } | null;
        }
    }[]
}

export { CartEntity, CartItemsEntity };
