import { InMemoryOrderRepository } from "@/repository/in-memory/order";
import { DashboardService } from "./Dashboard.service";

describe.skip("Unit test - DashboardService", () => {
  let orderRepositoryInMemory: InMemoryOrderRepository;
  let dashboardService: DashboardService;

  beforeEach(() => {
    orderRepositoryInMemory = new InMemoryOrderRepository();
    dashboardService = new DashboardService(orderRepositoryInMemory);
  });

  it("should return dashboard summary", async () => {
    const result = await dashboardService.getDashboardSummary({ period: "month" });

    expect(result).toHaveProperty("totalRevenue");
    expect(result).toHaveProperty("totalOrders");
    expect(result).toHaveProperty("cancelOrders");
  });

  it("should return dashboard revenue", async () => {
    const result = await dashboardService.getDashboardRevenue({ period: "week" });

    expect(result).toEqual([]);
  });

  it("should return quick stats", async () => {
    const result = await dashboardService.getDashboardQuickSats();

    expect(result).toHaveProperty("ordersScheduledToday");
    expect(result).toHaveProperty("inProgressOrdersToday");
  });
});
