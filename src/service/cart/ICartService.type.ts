import { CreateCartDto } from "@/domain/dto/cart/CreateCartDto";
import { CartItemsEntity, ListCartDto } from "@/domain/model";
import { AccessProfile } from "@/shared/constants";

interface ICartService {
  createCart: (dto: CreateCartDto) => Promise<CartItemsEntity>;
  changeItemQuantity: (itemId: string, userId: string, act: string) => Promise<CartItemsEntity | void>;
  removeItemCart: (itemId: string, userId: string) => Promise<void>;
  listCartWithTotalPrice: (userId: string, role: AccessProfile) => Promise<ListCartDto | void>;
}

export { ICartService };
