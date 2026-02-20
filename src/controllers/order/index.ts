import { OrderRepository } from "@/repository/prisma/order/order.prisma";
import { OrderService } from "@/service/order/Order.service";
import { OrderController } from "./order.controller";
import { CartRepository } from "@/repository/prisma/cart/cart.prisma";
import { NodemailerService } from "@/service/email/nodemailer";

const orderRepository = new OrderRepository();
const cartRepository = new CartRepository();
const nodemailerService = new NodemailerService();
const orderService = new OrderService(orderRepository, cartRepository, nodemailerService);
const orderController = new OrderController(orderService);

export { orderController };