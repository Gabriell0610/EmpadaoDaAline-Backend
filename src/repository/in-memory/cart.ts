import { CreateCartDto } from "@/domain/dto/cart/CreateCartDto";
import { CartItemsEntity, CartEntity } from "@/domain/model";
import { Decimal } from "@prisma/client/runtime/library";
import { cartAndCartItens, ICartRepository } from "../interfaces";
import { randomUUID } from "crypto";
import { StatusCart } from "@prisma/client";

class InMemoryCartRepository implements ICartRepository {
  cartDb: CartEntity[] = [];
  cartItemDb: CartItemsEntity[] = [];

  createCart = async (dto: CreateCartDto, priceItem: Decimal) => {
    const cart: CartEntity = {
      id: randomUUID(),
      status: dto.status,
      dataCriacao: new Date(),
      usuarioId: dto.userId,
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

  findCartActiveByUser = async (userId: string) => {

    const activeCartByUser = this.cartDb.find((data) => data.usuarioId === userId);

    if (activeCartByUser) {
      const cartAndItemObject: cartAndCartItens = {
        id: activeCartByUser?.id || "",
        dataCriacao: activeCartByUser?.dataCriacao || null,
        status: activeCartByUser?.status as StatusCart,
        usuarioId: activeCartByUser?.usuarioId || "",
        valorTotal: activeCartByUser?.valorTotal || null,
        carrinhoItens: this.cartItemDb.filter((item) => item.carrinhoId === activeCartByUser?.id),
      };
      return cartAndItemObject;
    }

    return null;
  };

  updateCartItemQuantity = async (cartId: string, quantity: number) => {
    const cartWithItem = this.cartItemDb.find((data) => data.id === cartId);

    cartWithItem!.quantidade = quantity;

    return cartWithItem!;
  };

  updateTotalValueCart = async (cartId: string, totalValue: Decimal | number) => {
    const cartByUser = this.cartDb.find((data) => data.id === cartId);
    if (!cartByUser) {
      return null;
    }

    cartByUser.valorTotal = totalValue as Decimal;
    return cartByUser;
  };

  removeItemCart = async (itemId: string, cartItemId: string) => {
    const indexItem = this.cartItemDb.findIndex((cart) => cart.itemId === itemId && cart.id === cartItemId);
    if (indexItem !== -1) {
      this.cartItemDb.splice(indexItem, 1);
    }
  };

  listAllCartByUser = async (userId: string) => {
    const cartUser = this.cartDb.find((data) => data.usuarioId === userId);
    if (cartUser) {
      return cartUser;
    }
    return null;
  };
  changeStatusCart!: (idCart: string) => Promise<void>;
}

export { InMemoryCartRepository };
