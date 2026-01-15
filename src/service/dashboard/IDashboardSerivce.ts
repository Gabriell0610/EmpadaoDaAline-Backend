import { DashboardQuickStats, DashboardRevenueDto, DashboardSummaryDto } from "@/domain/model"
import { DashboardQueryParams } from "@/utils/zod/schemas/params"


export interface IDashboardService {
    
    getDashboardSummary(query: DashboardQueryParams): Promise<DashboardSummaryDto> 
    getDashboardRevenue(query: DashboardQueryParams): Promise<DashboardRevenueDto[] | null> 
    getDashboardQuickSats(): Promise<DashboardQuickStats> 
}