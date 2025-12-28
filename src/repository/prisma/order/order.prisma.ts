import { OrderDto, UpdateOrderDto } from "@/domain/dto/order/OrderDto";
import { OrderEntity } from "@/domain/model";
import { prisma } from "@/libs/prisma";
import { IOrderRepository } from "@/repository/interfaces/order.type";
import { ListQueryOrdersDto } from "@/utils/zod/schemas/params";
import { Prisma, StatusOrder } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

class OrderRepository implements IOrderRepository {
  updateShippingOrder!: (idOrder: string, price: Decimal) => Promise<Partial<OrderEntity>>;

  createOrder = async (orderDto: OrderDto, currentPrice: Decimal) => {
    return await prisma.pedido.create({
      data: {
        carrinhoId: orderDto.idCart,
        usuarioId: orderDto.idUser,
        metodoPagamentoId: orderDto.idPaymentMethod,
        status: orderDto.status,
        dataAgendamento: orderDto.schedulingDate,
        horarioInicio: orderDto.startTime,
        horarioFim: orderDto.endTime,
        enderecoId: orderDto.idAddress,
        precoTotal: currentPrice,
        observacao: orderDto?.observation,
        frete: orderDto.shipping,
        numeroPedido: await this.controllNumberOrder(),
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
      },
      select: {
        id: true,
        numeroPedido: true,
        status: true,
        dataCriacao: true
      },
    });
  };

  changeStatusOrder = async (id: string, status: StatusOrder) => {
    return await prisma.pedido.update({
      where: { id: id },
      data: {
        status: status,
        dataAtualizacao: new Date(),
      },
      select: {
        id: true,
        usuarioId: true,
      },
    });
  };

  updateOrder = async (id: string, order: UpdateOrderDto) => {
    return await prisma.pedido.update({
      where: { id: id },
      data: {
        dataAgendamento: order?.schedulingDate,
        enderecoId: order?.idAddress,
        horarioInicio: order?.startTime,
        horarioFim: order?.endTime,
        metodoPagamentoId: order?.idPaymentMethod,
        observacao: order?.observation,
        dataAtualizacao: new Date(),
      },
      select: {
        id: true,
        dataAgendamento: true,
        horarioInicio: true,
        horarioFim: true,
        numeroPedido: true,
        status: true,
        observacao: true,
        precoTotal: true,
        dataAtualizacao: true,
        frete: true,
        metodoPagamento: {
          select: {
            id: true,
            nome: true,
          }
        }
      },
    });
  };

  adminUpdateOrder = async (id: string, order: UpdateOrderDto, totalPrice: Decimal) => {
    return await prisma.pedido.update({
      where: {id: id},
       data: {
        dataAgendamento: order?.schedulingDate,
        enderecoId: order?.idAddress,
        horarioInicio: order?.startTime,
        horarioFim: order?.endTime,
        metodoPagamentoId: order?.idPaymentMethod,
        observacao: order?.observation,
        frete: order?.shipping,
        dataAtualizacao: new Date(),
        precoTotal: totalPrice
      },
      select: {
          id: true,
        dataAgendamento: true,
        horarioInicio: true,
        horarioFim: true,
        numeroPedido: true,
        status: true,
        observacao: true,
        precoTotal: true,
        dataAtualizacao: true,
        frete: true,
        metodoPagamento: {
          select: {
            id: true,
            nome: true,
          }
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
          }
        },
         endereco: {
          select: {
            bairro: true,
            cidade: true,
            cep: true,
            complemento: true,
            estado: true,
            numero: true,
            rua: true,
          }
        }
      }
    })
  }

  cancelOrder = async (id: string) => {
    return await prisma.pedido.update({
      where: { id: id },
      data: {
        status: StatusOrder.CANCELADO,
        dataAtualizacao: new Date(),
      },
      select: {
        id: true,
      },
    });
  };

  listOrdersByClientId = async (id: string) => {
    return await prisma.pedido.findMany({
      where: { usuarioId: id },
      select: this.buildSelectList(),
    });
  };

  listOrdersMe = async (id: string) => {
     return await prisma.pedido.findMany({
      orderBy: {dataAgendamento: "desc"},
      where: { usuarioId: id },
      select: {
        id:true,
        horarioInicio: true,
        horarioFim: true,
        dataAgendamento: true,
        metodoPagamento: {
          select: {
            id: true,
            nome: true
          }
        },
        frete: true,
        observacao: true,
        precoTotal: true,
        numeroPedido: true,
        status: true,
        carrinho: {
          select: {
            carrinhoItens: {
              select: {
                quantidade: true,
                item: {
                  select: {
                    unidades: true,
                    tamanho: true,
                    itemDescription: {
                      select: {
                        nome: true,
                        tipo: true,
                        descricao: true,
                      }
                    },
                    dataAtualizacao: false,
                  }
                }
              }
            }
          }
        },
        endereco: {
          select: {
            id: true,
            bairro: true,
            cep: true,
            cidade: true,
            estado: true,
            rua: true,
            numero: true,
            complemento: true
          }
        },
      },
    }); 
  }

  listAllOrders = async ({
    page,
    size,
    status,
    search,
    orderBy,
    direction,
  }: ListQueryOrdersDto) => {
    const skip = (page - 1) * size;

    const where: Prisma.PedidoWhereInput = {
      ...(status && { status }),
      ...(search && {
        OR: [
          {
            usuario: {
              is: {
                nome: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            usuario: {
              is: {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      }),
    };


    const [orders, total] = await prisma.$transaction([
      prisma.pedido.findMany({
        where,
        skip,
        take: size,
        orderBy: { [orderBy]: direction },
        select: {
          id: true,
          dataAgendamento: true,
          horarioInicio: true,
          horarioFim: true,
          numeroPedido: true,
          status: true,
          observacao: true,
          precoTotal: true,
          dataAtualizacao: false,
          frete: true,
          metodoPagamento: {
            select: {
              id: true,
              nome: true,
            }
          },
          usuario: {
            select: {
              id: true,
              nome: true,
              telefone: true,
              email: true,
            }
          },
          carrinho: {
            select: {
              id: true,
              status: true,
              valorTotal: true,
              carrinhoItens: {
                select: {
                  id: true,
                  item: {
                    select: {
                      id: true,
                      preco: true,
                      tamanho: true,
                      unidades: true,
                      precoUnitario: true,
                      itemDescription: {
                        select: {
                          id: true,
                          image: true,
                          nome: true,
                          tipo: true,
                          disponivel: true,
                          descricao : true,
                        }
                      }
                    }
                  },
                  precoAtual: true,
                  quantidade: true,
                }
              }
            }
          },
          endereco: {
            select: {
              bairro: true,
              cidade: true,
              cep: true,
              complemento: true,
              estado: true,
              numero: true,
              rua: true,
              dataAtualizacao: false
            }
          }
        },
      }),
      prisma.pedido.count({ where }),
    ]);

    return {
      data: orders,
      page,
      size,
      totalItems: total,
      totalPages: Math.ceil(total / size),
    };
  };


  listOrderById = async (orderId: string) => {
    return await prisma.pedido.findUnique({ where: { id: orderId }, 
       select: {
        id: true,
        dataAgendamento: true,
        horarioInicio: true,
        horarioFim: true,
        numeroPedido: true,
        status: true,
        observacao: true,
        precoTotal: true,
        frete: true,
        metodoPagamento: {
          select: {
            id: true,
            nome: true,
          }
        },
        usuario: {
          select: {
            id: false,
            nome: true,
            telefone: true,
            email: true,
          }
        },
        carrinho: {
          select: {
            status: true,
            valorTotal: true,
            carrinhoItens: {
              select: {
                id: false,
                item: {
                  select: {
                    id: true,
                    preco: true,
                    tamanho: true,
                    unidades: true,
                    precoUnitario: true,
                    itemDescription: {
                      select: {
                        id: true,
                        image: true,
                        nome: true,
                        tipo: true,
                        disponivel: true,
                        descricao: true,
                      }
                    }
                  }
                },
                precoAtual: true,
                quantidade: true,
              }
            }
          }
        },
        endereco: {
          select: {
            bairro: true,
            cidade: true,
            cep: true,
            complemento: true,
            estado: true,
            numero: true,
            rua: true,
            dataAtualizacao: false
          }
        }
      },
    }); 
  };

  private buildSelectList = (): Prisma.PedidoSelect => {
   return {
        id: true,
        dataAgendamento: true,
        horarioInicio: true,
        horarioFim: true,
        numeroPedido: true,
        status: true,
        observacao: true,
        precoTotal: true,
        dataAtualizacao: false,
        frete: true,
        metodoPagamento: {
          select: {
            id: true,
            nome: true,
          }
        },
        usuario: {
          select: {
            id: false,
            nome: true,
            telefone: true,
            email: true,
            dataAtualizacao: false,
          }
        },
        carrinho: {
          select: {
            status: true,
            valorTotal: true,
            carrinhoItens: {
              select: {
                id: false,
                item: true,
                precoAtual: true,
                quantidade: true,
              }
            }
          }
        },
        endereco: {
          select: {
            bairro: true,
            cidade: true,
            cep: true,
            complemento: true,
            estado: true,
            numero: true,
            rua: true,
            dataAtualizacao: false
          }
        }
      }
  };

  private async controllNumberOrder() {
    let numberOrder = await prisma.pedido.count();
    if (numberOrder <= 0) {
      numberOrder = 1;
    } else {
      numberOrder++;
    }
    return numberOrder;
  }
}

export { OrderRepository };
