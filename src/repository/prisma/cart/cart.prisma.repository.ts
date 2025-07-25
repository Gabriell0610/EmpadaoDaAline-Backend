import { CreateCartDto } from "@/domain/dto/cart/CreateCartDto";
import { prisma } from "@/libs/prisma";
import { ICartRepository } from "@/repository/interfaces/index";
import { StatusCart } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

class CartRepository implements ICartRepository {
  createCart = async (dto: CreateCartDto, itemPrice: Decimal) => {
    const cart = await prisma.carrinho.create({
      data: {
        status: dto.status,
        dataCriacao: new Date(),
        usuarioId: dto.userId,
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
        precoAtual: true,
        quantidade: true,
        itemId: true,
        carrinhoId: true,
        id: true,
        item: {
          select: {
            id: true,
            preco: true,
            tamanho: true,
            itemDescription: true,
          },
        },
      },
    });
  };

  findCartActiveByUser = async (userId: string) => {
    return await prisma.carrinho.findFirst({
      where: {
        usuarioId: userId,
        status: StatusCart.ATIVO,
      },
      include: {
        carrinhoItens: {
          orderBy: {
            item: {
              itemDescription: {
                nome: "asc",
              },
            },
          },
          include: {
            item: {
              select: {
                preco: true,

                tamanho: true,
                itemDescription: true,
              },
            },
          },
        },
      },
    });
  };

  updateTotalValueCart = async (cartId: string, totalValue: number | Decimal) => {
    return await prisma.carrinho.update({
      where: { id: cartId },
      data: { valorTotal: totalValue },
      include: {
        carrinhoItens: {
          orderBy: {
            item: {
              itemDescription: {
                nome: "asc",
              },
            },
          },
          include: {
            item: {
              select: {
                preco: true,

                tamanho: true,
                itemDescription: {
                  select: {
                    image: true,
                    nome: true,
                    descricao: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  };

  listAllCartByUser = async (userId: string) => {
    return await prisma.carrinho.findFirst({
      where: { usuarioId: userId },
      include: {
        carrinhoItens: true,
      },
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
            itemDescription: {
              select: {
                descricao: true,
                image: true,
                nome: true,
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

  changeStatusCart = async (cartId: string) => {
    await prisma.carrinho.update({
      where: { id: cartId },
      data: { status: StatusCart.FINALIZADO },
    });
  };

  private buildSelectList = () => {
    return {
      id: true,
      status: true,
      dataCriacao: true,
      usuarioId: true,
      valorTotal: true,
      carrinhoItens: {
        select: {
          id: true,
          itemId: true,
          carrinhoId: true,
          quantidade: true,
          precoAtual: true,
          Item: {
            select: {
              nome: true,
              preco: true,
              image: true,
              descricao: true,
              disponivel: true,
              tamanho: true,
            },
          },
        },
      },
    };
  };
}

export { CartRepository };
