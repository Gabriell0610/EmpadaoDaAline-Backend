import { PedidoManual, PedidoManualItem } from "@prisma/client";

type ManualOrderEntity = PedidoManual
type ManualOrderItemEntity = PedidoManualItem
type ManualOrderAndItemEntity = ManualOrderEntity & ManualOrderItemEntity

import { Prisma } from '@prisma/client'

type ManualOrderWithItems = Prisma.PedidoManualGetPayload<{
  select: {
    id: true
    dataAgendamento: true
    horarioDeEntrega: true
    numeroPedido: true
    status: true
    dataCriacao: true
    dataAtualizacao: true
    meioPagamento: true
    precoTotal: true
    observacao: true
    telefoneCliente: true
    nomeCliente: true,
    frete: true
    pedidoManualItem: {
      select: {
        itemId: true
        quantidade: true
        id: true
      }
    }
  }
}>

export { ManualOrderEntity, ManualOrderAndItemEntity, ManualOrderItemEntity, ManualOrderWithItems }