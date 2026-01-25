import { CreateCartDto } from "@/domain/dto/cart/CreateCartDto";
import { ICartService } from "./ICartService.type";
import { ICartRepository } from "@/repository/interfaces/index";
import { IItemsRepository } from "@/repository/interfaces";
import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";
import { StatusItem, TypeItem } from "@prisma/client";
import { ListCartDto } from "@/domain/model";

class CartService implements ICartService {
  constructor(
    private cartRepository: ICartRepository,
    private itensRepository: IItemsRepository,
  ) {}

  createCart = async (dto: CreateCartDto) => {
    console.log("DTO", dto);
    const foundItem = await this.itensRepository.listItemById(dto.itemId);
    if (!foundItem || foundItem.itemDescription?.disponivel === StatusItem.INATIVO || !foundItem.preco) {
      throw new BadRequestException("Item não encontrado ou Inativo!");
    }

    const notIsPie = foundItem.itemDescription!.tipo !== TypeItem.EMPADAO ? true : false;
    const priceItemByType = !notIsPie ? foundItem.preco : foundItem.precoUnitario!;

    const cartAlredyExist = await this.cartRepository.findCartActiveByUser(dto.userId);

    if (cartAlredyExist) {
      const cartWithItem = cartAlredyExist.carrinhoItens.find((item) => item.itemId === dto.itemId);
      if (cartWithItem) {
        const newQuantity = cartWithItem.quantidade + dto.quantity;
        const updatedCart = await this.cartRepository.updateCartItemQuantity(cartWithItem.id, newQuantity);
        return updatedCart;
      }
      console.log("id do carrinho ja existente", cartAlredyExist.id);
      const cart = await this.cartRepository.createCartItem(dto, priceItemByType, cartAlredyExist.id);
      return cart;
    }

    const cart = await this.cartRepository.createCart(dto, priceItemByType);
    return cart;
  };

  listCartWithTotalPrice = async (userId: string) => {
    const cartUser = await this.cartRepository.findCartActiveByUser(userId);

    if (!cartUser) {
      return;
    }

    const cartWithTotalPrice = await this.calculatingTotalValue(cartUser);

    return cartWithTotalPrice;
  };

  changeItemQuantity = async (itemId: string, userId: string, act: string) => {
    const cartWithItem = await this.findItemAlredyExistInCart(userId, itemId);

    const newQuantity = act === "increment" ? cartWithItem?.quantidade + 1 : cartWithItem?.quantidade - 1;

    if (newQuantity < 1) {
      await this.removeItemCart(itemId, userId);
      return;
    }

    return await this.cartRepository.updateCartItemQuantity(cartWithItem?.id, newQuantity);
  };

  removeItemCart = async (itemId: string, userId: string) => {
    const itemExistInCartItens = await this.findItemAlredyExistInCart(userId, itemId);
    await this.cartRepository.removeItemCart(itemExistInCartItens.itemId, itemExistInCartItens.id);
  };

  listAllCartByUser = async (userId: string) => {
    const cartUser = await this.cartRepository.listAllCartByUser(userId);
    if (!cartUser || cartUser.length === 0) {
      throw new BadRequestException("Usuário nao possui carrinho");
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

  private async calculatingTotalValue(cartUser: ListCartDto) {
    console.log(cartUser);
    const totalPrice = cartUser?.carrinhoItens
      .map((c) => {
        const newQuantity = c.item.unidades! ? c.item.unidades + c.quantidade - 1 : c.quantidade;
        return c.item.unidades! ? c.precoAtual.toNumber() * newQuantity : newQuantity * c.precoAtual.toNumber();
      })
      .reduce((a, b) => a + b, 0);

    return await this.cartRepository.updateTotalValueCart(cartUser.id, totalPrice);
  }
}

export { CartService };
