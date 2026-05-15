import { DashboardService } from "./Dashboard.service";
import { IOrderRepository } from "@/repository/interfaces";

describe("Unit test - dashboardService", () => {
  const query = { period: "today" };

  const summaryMock = {
    totalRevenue: 1200,
    totalOrders: 20,
    orderInProgress: 3,
    cancelOrders: 1,
    orderDelivered: 16,
  };

  const revenueMock = [
    { label: "2026-05-12", value: 100 },
    { label: "2026-05-13", value: 200 },
  ];

  const quickStatsMock = {
    ordersScheduledToday: 4,
    deliveriesDueToday: 3,
    canceledToday: 1,
    totalDelivered: 20,
    inProgressOrdersToday: 2,
  };

  let dashboardService: DashboardService;
  let orderRepository: IOrderRepository;

  beforeEach(() => {
    orderRepository = {
      getDashboardSummary: jest.fn().mockResolvedValue(summaryMock),
      getDashboardRevenue: jest.fn().mockResolvedValue(revenueMock),
      getDashboardQuickSats: jest.fn().mockResolvedValue(quickStatsMock),
    } as unknown as IOrderRepository;

    dashboardService = new DashboardService(orderRepository);
  });

  it("should return dashboard summary", async () => {
    const result = await dashboardService.getDashboardSummary(query);

    expect(orderRepository.getDashboardSummary).toHaveBeenCalledWith(query);
    expect(result).toEqual(summaryMock);
  });

  it("should return dashboard revenue", async () => {
    const result = await dashboardService.getDashboardRevenue(query);

    expect(orderRepository.getDashboardRevenue).toHaveBeenCalledWith(query);
    expect(result).toEqual(revenueMock);
  });

  it("should return dashboard quick stats", async () => {
    const result = await dashboardService.getDashboardQuickSats();

    expect(orderRepository.getDashboardQuickSats).toHaveBeenCalledTimes(1);
    expect(result).toEqual(quickStatsMock);
  });
});
