import { CreateCartDto } from "@/domain/dto/cart/CreateCartDto";
import { CartItemsEntity, ListCartDto } from "@/domain/model";
import { StatusCart } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface ICartRepository {
  createCart: (dto: CreateCartDto, priceItem: Decimal) => Promise<CartItemsEntity>;
  findCartActiveByUser: (userId: string) => Promise<ListCartDto | null>;
  createCartItem: (dto: CreateCartDto, priceItem: Decimal, cartId: string) => Promise<CartItemsEntity>;
  updateCartItemQuantity: (cartId: string, quantity: number) => Promise<CartItemsEntity>;
  removeItemCart: (itemId: string, cartItemId: string) => Promise<void>;
  listAllCartByUser: (userId: string) => Promise<ListCartDto[]>;
  changeStatusCart: (idCart: string, status: StatusCart) => Promise<void>;
  updateTotalValueCart: (cartId: string, totalValue: Decimal | number) => Promise<ListCartDto>;
}
