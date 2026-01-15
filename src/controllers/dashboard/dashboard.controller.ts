import { IDashboardService } from "@/service/dashboard/IDashboardSerivce"
import { HttpStatus } from "@/shared/constants"
import { dashboardQueryParams } from "@/utils/zod/schemas/params"
import { Response, Request, NextFunction } from "express"


export class DashboardController {

    constructor(private dashboardService: IDashboardService) {}

    getDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = dashboardQueryParams.parse(req.query)
            const dashboardSummaryPayload = await this.dashboardService.getDashboardSummary(query)
            res.status(HttpStatus.OK).json({data: dashboardSummaryPayload})
        } catch (error) {
            next(error)
        }
    }

    getDashboardRevenue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = dashboardQueryParams.parse(req.query)
            console.log("controller", query)
            const dashboardRevenuePayload = await this.dashboardService.getDashboardRevenue(query)
            res.status(HttpStatus.OK).json({data: dashboardRevenuePayload})
        } catch (error) {
            next(error)
        }
    }

    getDashboardQuickSats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dashboardRecentOrdersPayload = await this.dashboardService.getDashboardQuickSats()
            res.status(HttpStatus.OK).json({data: dashboardRecentOrdersPayload})
        } catch (error) {
            next(error)
        }
    }
}