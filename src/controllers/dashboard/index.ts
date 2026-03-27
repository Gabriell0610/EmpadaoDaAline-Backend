import { OrderRepository } from "@/repository/prisma/order/order.prisma";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "@/service/dashboard/Dashboard.service";


const orderRepository = new OrderRepository()
const dashboardService = new DashboardService(orderRepository)
const dashboardController = new DashboardController(dashboardService)

export {dashboardController}


