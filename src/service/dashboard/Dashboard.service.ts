import { IOrderRepository } from "@/repository/interfaces";
import { IDashboardService } from "./IDashboardSerivce";
import { DashboardQueryParams } from "@/utils/zod/schemas/params";


export class DashboardService implements IDashboardService {

   constructor(
    private readonly orderRepository: IOrderRepository,
  ) {}


    getDashboardSummary = async (query: DashboardQueryParams) => {
        const data = await this.orderRepository.getDashboardSummary(query)
        return data
    }

    getDashboardRevenue = async (query: DashboardQueryParams) => {
        const data = await this.orderRepository.getDashboardRevenue(query)
        console.log(data)
        return data
    }

    getDashboardQuickSats = async () =>  {
       const data = await this.orderRepository.getDashboardQuickSats()
       console.log(data)
       return data
    }
    
}