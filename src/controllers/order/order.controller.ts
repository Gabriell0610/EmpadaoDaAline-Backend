import { HttpStatus } from "@/shared/constants/index";
import { orderSchema, updateOrderSchema } from "@/domain/dto/order/OrderDto";
import { IOrderService } from "@/service/order/IOrderService.type";
import { uuidSchema } from "@/utils/zod/schemas/id";
import { NextFunction, Request, Response } from "express";
import { changeStatusSchema } from "@/domain/dto/manualOrder/ManualOrder";
import {io} from "@/infra/server/index"
import { authorizationBodySchema } from "@/utils/zod/schemas/token";
class OrderController {
  constructor(private orderService: IOrderService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = orderSchema.parse(req.body);
      const payload = await this.orderService.createOrder(dto);
      res.status(HttpStatus.CREATED).json({ message: "Pedido criado com sucesso!", data: payload });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = uuidSchema.parse(req.params);
      const dto = updateOrderSchema.parse(req.body);
      const payload = await this.orderService.updateOrder(id, dto);
      res.status(HttpStatus.OK).json({ message: "Pedido atualizado com sucesso!", data: payload });
    } catch (error) {
      next(error);
    }
  };

  cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = uuidSchema.parse(req.params);
      const payload = await this.orderService.cancelOrder(id);
      res.status(HttpStatus.OK).json({ message: "Pedido cancelado com suceso", data: payload });
    } catch (error) {
      next(error);
    }
  };

  listOrdersMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requesterId: idClient } = authorizationBodySchema.parse(req.body);
      const payload = await this.orderService.listOrdersMe(idClient);
      res.status(HttpStatus.OK).json({ message: "Pedidos do cliente listado com sucesso", data: payload });
      } catch (error) {
        next(error)
    }
  }

  listAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = await this.orderService.listAllOrders();
      res.status(HttpStatus.OK).json({ message: "Todos os pedidos listados com sucesso", data: payload });
    } catch (error) {
      next(error);
    }
  };

  listOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = uuidSchema.parse(req.params);
      const payload = await this.orderService.listOrderById(id);
      res.status(HttpStatus.OK).json({ message: "Pedido listado com sucesso", data: payload });
    } catch (error) {
      next(error);
    }
  };
  
  changeStatusOrder = async (req: Request, res: Response, next: NextFunction) => {
    try { 
      const {id} = req.params
      const {status} = changeStatusSchema.parse(req.body)
      const payload = await this.orderService.changeStatusOrder(id, status)

      io.to(`user:${payload.usuarioId}`).emit('orderStatusUpdate', {
        orderId: id,
        newStatus: status,
      });

      res.status(HttpStatus.OK).json({ message: "Status do pedido alterado com sucesso!", data: payload })
    } catch (error) {
      next(error)
    }
  }
}

export { OrderController };
