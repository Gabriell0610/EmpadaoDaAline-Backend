import { CreateCartDto } from "@/domain/dto/cart/CreateCartDto";
import { CartItemsEntity, CartEntity, ListCartDto } from "@/domain/model";
import { Decimal } from "@prisma/client/runtime/library";
import { ICartRepository } from "../interfaces";
import { randomUUID } from "crypto";
import { StatusCart } from "@prisma/client";
import { PrismaClientOrTx } from "../interfaces/order.type";

class InMemoryCartRepository implements ICartRepository {
  cartDb: CartEntity[] = [];
  cartItemDb: CartItemsEntity[] = [];

  createCart = async (dto: CreateCartDto, priceItem: Decimal, userId: string) => {
    const cart: CartEntity = {
      id: randomUUID(),
      status: dto.status,
      createdAt: new Date(),
      usuarioId: userId,
      valorTotal: priceItem,
    };
    this.cartDb.push(cart);
    const createdCart = await this.createCartItem(dto, priceItem, cart.id);
    return createdCart;
  };

  createCartItem = async (dto: CreateCartDto, priceItem: Decimal, cartId: string) => {
    const cartItem: CartItemsEntity = {
      id: randomUUID(),
      quantidade: dto.quantity,
      itemId: dto.itemId,
      carrinhoId: cartId,
      precoAtual: priceItem,
    };

    this.cartItemDb.push(cartItem);
    return cartItem;
  };

  findCartActiveByUser = async (userId: string): Promise<ListCartDto | null> => {
    const cart = this.cartDb.find((data) => data.usuarioId === userId && data.status === StatusCart.ATIVO);

    if (!cart) return null;

    return {
      id: cart.id,
      status: cart.status,
      createdAt: cart.createdAt,
      usuarioId: cart.usuarioId,
      valorTotal: cart.valorTotal,
      carrinhoItens: this.cartItemDb
        .filter((item) => item.carrinhoId === cart.id)
        .map((cartItem) => ({
          id: cartItem.id,
          quantidade: cartItem.quantidade,
          precoAtual: cartItem.precoAtual,
          carrinhoId: cartItem.carrinhoId,
          itemId: cartItem.itemId,
          item: {
            id: cartItem.itemId,
            preco: cartItem.precoAtual,
            precoUnitario: null,
            tamanho: null,
            unidades: null,
            itemDescription: {
              id: randomUUID(),
              image: null,
              nome: "Item mock",
              descricao: "Descrição mock",
              tipo: null,
              disponivel: null,
            },
          },
        })),
    };
  };

  updateCartItemQuantity = async (cartId: string, quantity: number) => {
    const cartWithItem = this.cartItemDb.find((data) => data.id === cartId);

    cartWithItem!.quantidade = quantity;

    return cartWithItem!;
  };

  updateTotalValueCart = async (cartId: string, totalValue: Decimal | number): Promise<ListCartDto> => {
    const cart = this.cartDb.find((data) => data.id === cartId);

    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.valorTotal = totalValue as Decimal;

    return {
      id: cart.id,
      status: cart.status,
      createdAt: cart.createdAt,
      usuarioId: cart.usuarioId,
      valorTotal: cart.valorTotal,
      carrinhoItens: this.cartItemDb
        .filter((item) => item.carrinhoId === cart.id)
        .map((cartItem) => ({
          id: cartItem.id,
          quantidade: cartItem.quantidade,
          precoAtual: cartItem.precoAtual,
          carrinhoId: cartItem.carrinhoId,
          itemId: cartItem.itemId,
          item: {
            id: cartItem.itemId,
            preco: cartItem.precoAtual,
            precoUnitario: null,
            tamanho: null,
            unidades: null,
            itemDescription: {
              id: randomUUID(),
              image: null,
              nome: "Item mock",
              descricao: "Descrição mock",
              tipo: null,
              disponivel: null,
            },
          },
        })),
    };
  };

  removeItemCart = async (itemId: string, cartItemId: string) => {
    const indexItem = this.cartItemDb.findIndex((cart) => cart.itemId === itemId && cart.id === cartItemId);
    if (indexItem !== -1) {
      this.cartItemDb.splice(indexItem, 1);
    }
  };

  listAllCartByUser = async (userId: string): Promise<ListCartDto[]> => {
    const carts = this.cartDb.filter((cart) => cart.usuarioId === userId);

    return carts.map((cart) => ({
      id: cart.id,
      status: cart.status,
      createdAt: cart.createdAt,
      usuarioId: cart.usuarioId,
      valorTotal: cart.valorTotal,
      carrinhoItens: this.cartItemDb
        .filter((item) => item.carrinhoId === cart.id)
        .map((cartItem) => ({
          id: cartItem.id,
          quantidade: cartItem.quantidade,
          precoAtual: cartItem.precoAtual,
          carrinhoId: cartItem.carrinhoId,
          itemId: cartItem.itemId,
          item: {
            id: cartItem.itemId,
            preco: cartItem.precoAtual,
            precoUnitario: null,
            tamanho: null,
            unidades: null,
            itemDescription: {
              id: randomUUID(),
              image: null,
              nome: "Item mock",
              descricao: "Descrição mock",
              tipo: null,
              disponivel: null,
            },
          },
        })),
    }));
  };

  changeStatusCart = async (_transactional: PrismaClientOrTx, idCart: string, status: StatusCart) => {
    const cart = this.cartDb.find((data) => data.id === idCart);

    if (cart) {
      cart.status = status;
    }
  };
}

export { InMemoryCartRepository };
