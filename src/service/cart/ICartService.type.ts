import { CreateCartDto } from "@/domain/dto/cart/CreateCartDto";
import { CartItemsEntity, ListCartDto } from "@/domain/model";

interface ICartService {
  createCart: (dto: CreateCartDto) => Promise<CartItemsEntity>;
  changeItemQuantity: (itemId: string, userId: string, act: string) => Promise<CartItemsEntity | void>;
  removeItemCart: (itemId: string, userId: string) => Promise<void>;
  listCartWithTotalPrice: (userId: string) => Promise<ListCartDto>;
}

export { ICartService };
