import { OrderRepository } from "@/repository/prisma/order/order.prisma";
import { OrderService } from "@/service/order/Order.service";
import { OrderController } from "./order.controller";
import { CartRepository } from "@/repository/prisma/cart/cart.prisma";
import { EmailService } from "@/service/email/emailService";

const orderRepository = new OrderRepository();
const cartRepository = new CartRepository();
const emailService = new EmailService();
const orderService = new OrderService(orderRepository, cartRepository, emailService);
const orderController = new OrderController(orderService);

export { orderController };
