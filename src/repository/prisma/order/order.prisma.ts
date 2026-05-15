import { OrderDto, UpdateOrderDto } from "@/domain/dto/order/OrderDto";
import {
  DashboardQuickStats,
  DashboardRevenueDto,
  DashboardSummaryDto,
  orderCancelSelect,
  orderCreateSelect,
  OrderEntity,
} from "@/domain/model";
import { prisma } from "@/libs/prisma";
import { IOrderRepository, PrismaClientOrTx } from "@/repository/interfaces/order.type";
import { resolvePeriod, toDateOnly } from "@/utils/auxiliares";
import { DashboardQueryParams, ListQueryOrdersDto } from "@/utils/zod/schemas/params";
import { Prisma, StatusOrder } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

class OrderRepository implements IOrderRepository {
  updateShippingOrder!: (idOrder: string, price: Decimal) => Promise<Partial<OrderEntity>>;
  createOrder = async (
    transactional: PrismaClientOrTx,
    orderDto: OrderDto,
    currentPrice: Decimal,
    createdBy: string,
    idUser: string,
    idCart: string,
  ) => {
    return await transactional.pedido.create({
      data: {
        carrinhoId: idCart,
        usuarioId: idUser,
        metodoPagamentoId: orderDto.idPaymentMethod,
        status: orderDto.status,
        dataAgendamento: orderDto.schedulingDate,
        horarioInicio: orderDto.startTime,
        horarioFim: orderDto.endTime,
        enderecoId: orderDto.idAddress,
        precoTotal: currentPrice,
        observacao: orderDto?.observation,
        frete: orderDto.shipping,
        nomeCliente: orderDto.nameClient,
        celularCliente: orderDto.cellphoneClient,
        createdBy: createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: orderCreateSelect,
    });
  };

  changeStatusOrder = async (id: string, status: StatusOrder) => {
    return await prisma.pedido.update({
      where: { id: id },
      data: {
        status: status,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        usuarioId: true,
      },
    });
  };

  deleteOrder = async (id: string) => {
    await prisma.pedido.delete({
      where: { id },
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
        updatedAt: new Date(),
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
        updatedAt: true,
        frete: true,
        metodoPagamento: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });
  };

  adminUpdateOrder = async (id: string, order: UpdateOrderDto, totalPrice: Decimal) => {
    return await prisma.pedido.update({
      where: { id: id },
      data: {
        dataAgendamento: order?.schedulingDate,
        enderecoId: order?.idAddress,
        horarioInicio: order?.startTime,
        horarioFim: order?.endTime,
        metodoPagamentoId: order?.idPaymentMethod,
        observacao: order?.observation,
        frete: order?.shipping,
        updatedAt: new Date(),
        precoTotal: totalPrice,
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
        updatedAt: true,
        frete: true,
        metodoPagamento: {
          select: {
            id: true,
            nome: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
          },
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
          },
        },
      },
    });
  };

  cancelOrder = async (id: string) => {
    return await prisma.pedido.update({
      where: { id: id },
      data: {
        status: StatusOrder.CANCELADO,
        updatedAt: new Date(),
      },
      select: orderCancelSelect,
    });
  };

  clientConfirmOrder = async (id: string) => {
    return await prisma.pedido.update({
      where: { id: id },
      data: {
        status: StatusOrder.CONFIRMADO_CLIENTE,
        updatedAt: new Date(),
      },
      select: orderCancelSelect,
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
      orderBy: { dataAgendamento: "desc" },
      where: { usuarioId: id },
      select: {
        id: true,
        horarioInicio: true,
        horarioFim: true,
        dataAgendamento: true,
        metodoPagamento: {
          select: {
            id: true,
            nome: true,
          },
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
                      },
                    },
                  },
                },
              },
            },
          },
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
            complemento: true,
          },
        },
      },
    });
  };

  listAllOrders = async ({
    page,
    size,
    status,
    search,
    orderBy,
    direction,
    endDate,
    startDate,
  }: ListQueryOrdersDto) => {
    const skip = (page - 1) * size;

    const where: Prisma.PedidoWhereInput = {
      ...(endDate && startDate && { dataAgendamento: { gte: startDate, lte: endDate } }),
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
          frete: true,
          celularCliente: true,
          nomeCliente: true,
          metodoPagamento: {
            select: {
              id: true,
              nome: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nome: true,
              telefone: true,
              email: true,
              role: true,
            },
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
                          descricao: true,
                        },
                      },
                    },
                  },
                  precoAtual: true,
                  quantidade: true,
                },
              },
            },
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
            },
          },
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
    return await prisma.pedido.findUnique({
      where: { id: orderId },
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
        nomeCliente: true,
        celularCliente: true,
        metodoPagamento: {
          select: {
            id: true,
            nome: true,
          },
        },
        usuario: {
          select: {
            id: false,
            nome: true,
            telefone: true,
            email: true,
          },
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
                      },
                    },
                  },
                },
                precoAtual: true,
                quantidade: true,
              },
            },
          },
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
          },
        },
      },
    });
  };

  findOrderOwnerById = async (orderId: string) => {
    return await prisma.pedido.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        usuarioId: true,
      },
    });
  };
  async getDashboardSummary(query: DashboardQueryParams) {
    const { start, end } = resolvePeriod(query);

    const [result] = await prisma.$queryRaw<DashboardSummaryDto[]>`
      SELECT
        COALESCE(
          SUM("precoTotal") FILTER (WHERE status = ${StatusOrder.ENTREGUE}::"StatusOrder"), 
          0 
          ) AS "totalRevenue",
        COUNT(*)::int  AS "totalOrders",
        COUNT(*) FILTER (WHERE status = ${StatusOrder.PREPARANDO}::"StatusOrder")::int  AS "orderInProgress",
        COUNT(*) FILTER (WHERE status = ${StatusOrder.CANCELADO}::"StatusOrder")::int  AS "cancelOrders",
        COUNT(*) FILTER (WHERE status = ${StatusOrder.ENTREGUE}::"StatusOrder")::int AS "orderDelivered"
      FROM "pedidos"
      WHERE "dataAgendamento" BETWEEN ${toDateOnly(start)}::date AND ${toDateOnly(end)}::date;
    `;

    return result;
  }

  async getDashboardRevenue(query: DashboardQueryParams) {
    if (query.period === "7d") {
      return await prisma.$queryRaw<DashboardRevenueDto[]>`
          WITH days AS (
            SELECT
              generate_series( 
                current_date - interval '6 days',
                current_date,
                interval '1 day'
              )::date AS day
          )
          SELECT
              CASE EXTRACT(DOW FROM d.day)
                WHEN 0 THEN 'Dom'
                WHEN 1 THEN 'Seg'
                WHEN 2 THEN 'Ter'
                WHEN 3 THEN 'Qua'
                WHEN 4 THEN 'Qui'
                WHEN 5 THEN 'Sex'
                WHEN 6 THEN 'Sáb'
              END AS label,
              COALESCE(
              SUM(p."precoTotal")
              FILTER (WHERE p.status = ${StatusOrder.ENTREGUE}::"StatusOrder"),
             0
            )::float8 AS value
          FROM days d
          LEFT JOIN "pedidos" p
            ON p."dataAgendamento" = d.day
          GROUP BY d.day
          ORDER BY d.day;
        `;
    }

    if (query.period === "1m") {
      return await prisma.$queryRaw<DashboardRevenueDto[]>`
         WITH months AS (
          SELECT
            generate_series(
              date_trunc('year', current_date),
              date_trunc('year', current_date) + interval '11 months',
              interval '1 month'
            )::date AS month
        )
        SELECT
            CASE EXTRACT(MONTH FROM m.month)
              WHEN 1 THEN 'Jan'
              WHEN 2 THEN 'Fev'
              WHEN 3 THEN 'Mar'
              WHEN 4 THEN 'Abr'
              WHEN 5 THEN 'Mai'
              WHEN 6 THEN 'Jun'
              WHEN 7 THEN 'Jul'
              WHEN 8 THEN 'Ago'
              WHEN 9 THEN 'Set'
              WHEN 10 THEN 'Out'
              WHEN 11 THEN 'Nov'
              WHEN 12 THEN 'Dez'
            END AS label,
          COALESCE(
            SUM(p."precoTotal")
            FILTER (WHERE p.status = ${StatusOrder.ENTREGUE}::"StatusOrder"),
            0
          )::float8 AS value
        FROM months m
        LEFT JOIN "pedidos" p
          ON date_trunc('month', p."dataAgendamento") = m.month
        GROUP BY m.month
        ORDER BY m.month;
    `;
    }

    return null;
  }

  async getDashboardQuickSats() {
    const { start, end } = resolvePeriod({ period: "today" });

    const startDate = toDateOnly(start);
    const endDate = toDateOnly(end);

    const result = await prisma.$queryRaw<DashboardQuickStats>`
      SELECT
        COUNT(*) FILTER (
          WHERE "dataAgendamento" BETWEEN ${startDate}::date AND ${endDate}::date
        )::int AS "ordersScheduledToday",

        COUNT(*) FILTER (
          WHERE status = ${StatusOrder.PREPARANDO}::"StatusOrder"
            AND "dataAgendamento" BETWEEN ${startDate}::date AND ${endDate}::date
        )::int AS "inProgressOrdersToday",

        COUNT(*) FILTER (
          WHERE status = ${StatusOrder.CANCELADO}::"StatusOrder"
            AND DATE("updatedAt") BETWEEN ${startDate}::date AND ${endDate}::date
        )::int AS "canceledToday",

        COUNT(*) FILTER (
          WHERE status = ${StatusOrder.ENTREGUE}::"StatusOrder"
        )::int AS "totalDelivered",

        COUNT(*) FILTER (
          WHERE status = ${StatusOrder.ENTREGUE}::"StatusOrder"
            AND "dataAgendamento" BETWEEN ${startDate}::date AND ${endDate}::date
        )::int AS "deliveriesDueToday"

      FROM "pedidos";
    `;

    return result;
  }

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
      updatedAt: false,
      frete: true,
      metodoPagamento: {
        select: {
          id: true,
          nome: true,
        },
      },
      usuario: {
        select: {
          id: false,
          nome: true,
          telefone: true,
          email: true,
          updatedAt: false,
        },
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
            },
          },
        },
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
        },
      },
    };
  };
}

export { OrderRepository };
