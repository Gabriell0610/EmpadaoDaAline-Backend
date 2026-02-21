import { HttpStatus } from "@/shared/constants/index";
import { orderSchema, updateOrderSchema } from "@/domain/dto/order/OrderDto";
import { IOrderService } from "@/service/order/IOrderService.type";
import { uuidSchema } from "@/utils/zod/schemas/id";
import { NextFunction, Request, Response } from "express";
import { changeStatusSchema } from "@/domain/dto/manualOrder/ManualOrder";
import { listOrdersQuerySchema } from "@/utils/zod/schemas/params";
import { getIO } from "@/infra/socket/socket";
import { AccessProfile } from "@/shared/constants/accessProfile";
import { StatusOrder } from "@prisma/client";

class OrderController {
  constructor(private orderService: IOrderService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = orderSchema.parse(req.body);
      const email = req.user?.email || "";
      const idUser = req.user?.id || "";
      const payload = await this.orderService.createOrder(dto, email, idUser);
      res.status(HttpStatus.CREATED).json({ message: "Pedido criado com sucesso!", data: payload });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = uuidSchema.parse(req.params);
      const dto = updateOrderSchema.parse(req.body);
      const requesterId = req.user?.id || "";
      const requesterRole = (req.user?.role || AccessProfile.CLIENT) as AccessProfile;
      const payload = await this.orderService.updateOrder(id, dto, requesterId, requesterRole);
      res.status(HttpStatus.OK).json({ message: "Pedido atualizado com sucesso!", data: payload });
    } catch (error) {
      next(error);
    }
  };

  adminUpdateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = uuidSchema.parse(req.params);
      const dto = updateOrderSchema.parse(req.body);
      const payload = await this.orderService.adminUpdateOrder(id, dto);
      res.status(HttpStatus.OK).json({ message: "Pedido atualizado com sucesso!", data: payload });
    } catch (error) {
      next(error);
    }
  };

  cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = uuidSchema.parse(req.params);
      const requesterId = req.user?.id || "";
      const requesterRole = (req.user?.role || AccessProfile.CLIENT) as AccessProfile;
      const email = req.user?.email || "";
      const payload = await this.orderService.cancelOrder(id, requesterId, requesterRole, email);
      const io = getIO();
      io.to(`user:${requesterId}`).emit("orderStatusUpdate", {
        orderId: id,
        newStatus: StatusOrder.CANCELADO,
      });
      res.status(HttpStatus.OK).json({ message: "Pedido cancelado com sucesso", data: payload });
    } catch (error) {
      next(error);
    }
  };

  clientConfirmOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = uuidSchema.parse(req.params);
      const requesterId = req.user?.id || "";
      const requesterRole = (req.user?.role || AccessProfile.CLIENT) as AccessProfile;
      const email = req.user?.email || "";
      const payload = await this.orderService.clientConfirmOrder(id, requesterId, requesterRole, email);
      const io = getIO();
      io.to(`user:${requesterId}`).emit("orderStatusUpdate", {
        orderId: id,
        newStatus: StatusOrder.CONFIRMADO_CLIENTE,
      });
      res.status(HttpStatus.OK).json({ message: "Pedido confirmado com sucesso", data: payload });
    } catch (error) {
      next(error);
    }
  };

  listOrdersMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.user?.id || "";
      const payload = await this.orderService.listOrdersMe(id);
      res.status(HttpStatus.OK).json({ message: "Pedidos do cliente listado com sucesso", data: payload });
    } catch (error) {
      next(error);
    }
  };

  listAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = listOrdersQuerySchema.parse(req.query);

      const payload = await this.orderService.listAllOrders(query);

      res.status(HttpStatus.OK).json({ message: "Todos os pedidos listados com sucesso", data: payload });
    } catch (error) {
      next(error);
    }
  };

  listOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = uuidSchema.parse(req.params);
      const requesterId = req.user?.id || "";
      const requesterRole = (req.user?.role || AccessProfile.CLIENT) as AccessProfile;
      const payload = await this.orderService.listOrderById(id, requesterId, requesterRole);
      res.status(HttpStatus.OK).json({ message: "Pedido listado com sucesso", data: payload });
    } catch (error) {
      next(error);
    }
  };

  changeStatusOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = changeStatusSchema.parse(req.body);
      const payload = await this.orderService.changeStatusOrder(id, status);
      const io = getIO();
      io.to(`user:${payload.usuarioId}`).emit("orderStatusUpdate", {
        orderId: id,
        newStatus: status,
      });

      res.status(HttpStatus.OK).json({ message: "Status do pedido alterado com sucesso!", data: payload });
    } catch (error) {
      next(error);
    }
  };
}

export { OrderController };
