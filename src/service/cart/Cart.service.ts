import { CreateCartDto } from "@/domain/dto/cart/CreateCartDto";
import { ICartService } from "./ICartService.type";
import { cartAndCartItens, ICartRepository } from "@/repository/interfaces/index";
import { IItemsRepository } from "@/repository/interfaces";
import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";
import { statusItem } from "@prisma/client";

class CartService implements ICartService {
  constructor(
    private cartRepository: ICartRepository,
    private itensRepository: IItemsRepository,
  ) {}

  createCart = async (dto: CreateCartDto) => {
    const findItem = await this.itensRepository.listItemById(dto.itemId);
    if (!findItem || findItem.disponivel === statusItem.INATIVO || !findItem.preco) {
      throw new BadRequestException("Item não encontrado ou Inativo!");
    }

    const cartAlredyExist = await this.cartRepository.findCartActiveByUser(dto.userId);

    if (cartAlredyExist) {
      const cartWithItem = cartAlredyExist.carrinhoItens.find((item) => item.itemId === dto.itemId);
      if (cartWithItem) {
        const newQuantity = cartWithItem.quantidade + dto.quantity;
        const updatedCart = await this.cartRepository.updateCartItemQuantity(cartWithItem.id, newQuantity);
        return updatedCart;
      }

      const cart = await this.cartRepository.createCartItem(dto, findItem.preco, cartAlredyExist.id);
      return cart;
    }

    const cart = await this.cartRepository.createCart(dto, findItem.preco);
    return cart;
  };

  listCartWithTotalPrice = async (userId: string) => {
    const cartUser = await this.cartRepository.findCartActiveByUser(userId);

    if (!cartUser) {
      throw new BadRequestException("Usuário não possui um carrinho ativo");
    }

    const cartWithTotalPrice = await this.calculatingTotalValue(cartUser);

    return cartWithTotalPrice;
  };

  changeItemQuantity = async (itemId: string, userId: string, act: string) => {
    const cartWithItem = await this.findItemAlredyExistInCart(userId, itemId);

    let newQuantity = act === "increment" ? cartWithItem?.quantidade + 1 : cartWithItem?.quantidade - 1;

    if (newQuantity <= 0) {
      newQuantity = 1; // bem provável que depois eu tenha que remover o item chamando o removeItemCart
    }

    return await this.cartRepository.updateCartItemQuantity(cartWithItem?.id, newQuantity);
  };

  removeItemCart = async (itemId: string, userId: string) => {
    const itemExistInCartItens = await this.findItemAlredyExistInCart(userId, itemId);
    await this.cartRepository.removeItemCart(itemExistInCartItens.itemId, itemExistInCartItens.id);
  };

  listAllCartByUser = async (userId: string) => {
    const cartUser = await this.cartRepository.listAllCartByUser(userId);
    if (!cartUser) {
      throw new BadRequestException("Usuário nao possui carrinho ativo no momento");
    }

    return cartUser;
  };

  private async findItemAlredyExistInCart(userId: string, itemId: string) {
    const cartAlredyActive = await this.cartRepository.findCartActiveByUser(userId);
    if (!cartAlredyActive) {
      throw new BadRequestException("Usuário nao possui carrinho ativo no momento");
    }

    const cartWithItem = cartAlredyActive?.carrinhoItens.find((item) => item.itemId === itemId);
    if (!cartWithItem) {
      throw new BadRequestException("Item nao encontrado no carrinho ativo");
    }
    return cartWithItem;
  }

  private async calculatingTotalValue(cartUser: cartAndCartItens) {
    const totalPrice = cartUser?.carrinhoItens
      .map((c) => {
        return c.quantidade * c.precoAtual.toNumber();
      })
      .reduce((a, b) => a + b, 0);

    return await this.cartRepository.updateTotalValueCart(cartUser.id, totalPrice);
  }
}

export { CartService };
