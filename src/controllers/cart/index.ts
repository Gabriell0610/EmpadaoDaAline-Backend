import { CartRepository } from "@/repository/prisma/cart/cart.prisma";
import { ItemRepository } from "@/repository/prisma/itens/itens.prisma";
import { CartController } from "./Cart.controller";
import { CartService } from "@/service/cart/Cart.service";

const itemRepository = new ItemRepository();
const cartRepository = new CartRepository();
const cartService = new CartService(cartRepository, itemRepository);

const cartController = new CartController(cartService);

export { cartController };
