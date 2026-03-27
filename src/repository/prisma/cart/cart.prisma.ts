import { CreateCartDto } from "@/domain/dto/cart/CreateCartDto";
import { prisma } from "@/libs/prisma";
import { ICartRepository, PrismaClientOrTx } from "@/repository/interfaces/index";
import { Prisma, StatusCart } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

class CartRepository implements ICartRepository {
  createCart = async (dto: CreateCartDto, itemPrice: Decimal, userId: string) => {
    const cart = await prisma.carrinho.create({
      data: {
        status: dto.status,
        createdAt: new Date(),
        usuarioId: userId,
        valorTotal: itemPrice,
      },
    });

    const itemsInCart = this.createCartItem(dto, itemPrice, cart.id);
    return itemsInCart;
  };

  createCartItem = async (dto: CreateCartDto, itemPrice: Decimal, cartId: string) => {
    return await prisma.carrinhoItens.create({
      data: {
        quantidade: dto.quantity,
        itemId: dto.itemId,
        carrinhoId: cartId,
        precoAtual: itemPrice,
      },
      select: {
        id: true,
        precoAtual: true,
        quantidade: true,
        itemId: true,
        carrinhoId: true,
        item: {
          select: {
            id: true,
            preco: true,
            precoUnitario: true,
            tamanho: true,
            itemDescription: true,
          },
        },
      },
    });
  };

  findCartActiveByUser = async (userId: string) => {
    return await prisma.carrinho.findFirst({
      where: { usuarioId: userId, status: StatusCart.ATIVO },
      select: this.cartSelect,
    });
  };

  updateTotalValueCart = async (cartId: string, totalValue: number | Decimal) => {
    return await prisma.carrinho.update({
      where: { id: cartId },
      data: { valorTotal: totalValue },
      select: this.cartSelect,
    });
  };

  updateCurrentPriceWhenEmpadaoOrPanqueca = async (idCarrinhoItens: string, currentPrice: number) => {
    const data = await prisma.carrinhoItens.update({
      where: { id: idCarrinhoItens },
      data: { precoAtual: currentPrice },
      select: {
        id: true,
        precoAtual: true,
        quantidade: true,
        item: true,
      },
    });
    return data;
  };

  listAllCartByUser = async (userId: string) => {
    return await prisma.carrinho.findMany({
      where: { usuarioId: userId },
      select: this.cartSelect,
    });
  };

  updateCartItemQuantity = async (cartId: string, quantity: number) => {
    return await prisma.carrinhoItens.update({
      where: { id: cartId },
      data: { quantidade: quantity },
      select: {
        id: true,
        quantidade: true,
        itemId: true,
        carrinhoId: true,
        precoAtual: true,
        item: {
          select: {
            id: true,
            preco: true,
            tamanho: true,
            unidades: true,
            itemDescription: {
              select: {
                descricao: true,
                image: true,
                nome: true,
                tipo: true,
              },
            },
          },
        },
      },
    });
  };

  removeItemCart = async (itemId: string, cartId: string) => {
    await prisma.carrinhoItens.delete({
      where: { id: cartId, itemId: itemId },
    });
  };

  changeStatusCart = async (transactional: PrismaClientOrTx, cartId: string, status: StatusCart) => {
    await transactional.carrinho.update({
      where: { id: cartId },
      data: { status },
    });
  };

  private cartSelect = {
    id: true,
    status: true,
    createdAt: true,
    valorTotal: true,
    usuarioId: true,
    carrinhoItens: {
      select: {
        id: true,
        quantidade: true,
        precoAtual: true,
        carrinhoId: true,
        itemId: true,
        item: {
          select: {
            preco: true,
            id: true,
            tamanho: true,
            precoUnitario: true,
            unidades: true,
            itemDescription: {
              select: {
                image: true,
                nome: true,
                tipo: true,
                descricao: true,
                id: true,
                disponivel: true,
              },
            },
          },
        },
      },
      orderBy: {
        item: {
          itemDescription: {
            nome: "desc",
          },
        },
      },
    },
  } satisfies Prisma.CarrinhoSelect;
}

export { CartRepository };
