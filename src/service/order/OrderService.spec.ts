import { InMemoryCartRepository } from "@/repository/in-memory/cart";
import { InMemoryOrderRepository } from "@/repository/in-memory/order";
import { OrderService } from "./Order.service";
import { OrderDto, UpdateOrderDto } from "@/domain/dto/order/OrderDto";
import { Decimal } from "@prisma/client/runtime/library";
import { StatusCart, StatusOrder } from "@prisma/client";
import { randomUUID } from "crypto";
import { AccessProfile } from "@/shared/constants/accessProfile";

export const userId = randomUUID();
export const otherUserId = randomUUID();
export const cartId = randomUUID();

describe("Unit test - OrderService", () => {
  let cartRepositoryInMemory: InMemoryCartRepository;
  let orderRepositoryInMemory: InMemoryOrderRepository;
  let orderService: OrderService;

  const requesterEmail = "admin@example.com";

  const createOrderDto = (overrides: Partial<OrderDto> = {}): OrderDto => ({
    idAddress: randomUUID(),
    idPaymentMethod: randomUUID(),
    status: StatusOrder.PENDENTE,
    schedulingDate: new Date(Date.now() + 1000 * 60 * 60 * 26),
    startTime: "10:00",
    endTime: "11:00",
    observation: "Sem cebola",
    shipping: "10",
    nameClient: "Gabriel",
    cellphoneClient: "11999999999",
    ...overrides,
  });

  beforeEach(() => {
    cartRepositoryInMemory = new InMemoryCartRepository();
    orderRepositoryInMemory = new InMemoryOrderRepository();
    orderService = new OrderService(orderRepositoryInMemory, cartRepositoryInMemory);
  });

  describe("createOrder", () => {
    it("should create order and finalize active cart", async () => {
      cartRepositoryInMemory.cartDb.push({
        id: cartId,
        status: StatusCart.ATIVO,
        createdAt: new Date(),
        usuarioId: userId,
        valorTotal: new Decimal(80),
      });

      const order = await orderService.createOrder(createOrderDto(), requesterEmail, userId);

      expect(order.id).toBeTruthy();
      expect(order.status).toBe(StatusOrder.PENDENTE);
      expect(orderRepositoryInMemory.ordersDb[0].createdBy).toBe(requesterEmail);
      expect(cartRepositoryInMemory.cartDb[0].status).toBe(StatusCart.FINALIZADO);
    });

    it("should throw error if cart does not exist", async () => {
      await expect(orderService.createOrder(createOrderDto(), requesterEmail, userId)).rejects.toThrow(
        "carrinho não encontrado",
      );
    });

    it("should throw error when scheduling date is invalid", async () => {
      cartRepositoryInMemory.cartDb.push({
        id: cartId,
        status: StatusCart.ATIVO,
        createdAt: new Date(),
        usuarioId: userId,
        valorTotal: new Decimal(80),
      });

      await expect(
        orderService.createOrder(createOrderDto({ schedulingDate: new Date("invalid") }), requesterEmail, userId),
      ).rejects.toThrow("Data de agendamento inválida");
    });
  });

  describe("updateOrder", () => {
    it("should update existing order", async () => {
      const dto = createOrderDto();
      const created = await orderRepositoryInMemory.createOrder(dto, new Decimal(90), requesterEmail, userId, cartId);

      const updated = await orderService.updateOrder(
        created.id,
        {
          observation: "Trocar recheio",
        } as UpdateOrderDto,
        userId,
        AccessProfile.CLIENT,
      );

      expect(updated.id).toBe(created.id);
      expect(updated.observacao).toBe("Trocar recheio");
    });

    it("should throw error when user is not owner", async () => {
      const dto = createOrderDto();
      const created = await orderRepositoryInMemory.createOrder(dto, new Decimal(90), requesterEmail, userId, cartId);

      await expect(
        orderService.updateOrder(created.id, {} as UpdateOrderDto, otherUserId, AccessProfile.CLIENT),
      ).rejects.toThrow("Voce nao tem permissao para executar esta acao.");
    });

    it("should throw error when order does not exist", async () => {
      await expect(
        orderService.updateOrder("invalid-id", {} as UpdateOrderDto, userId, AccessProfile.CLIENT),
      ).rejects.toThrow("Pedido não encontrado");
    });
  });

  describe("cancelOrder", () => {
    it("should cancel order if requested at least 24h before", async () => {
      const dto = createOrderDto();
      const created = await orderRepositoryInMemory.createOrder(dto, new Decimal(90), requesterEmail, userId, cartId);

      const result = await orderService.cancelOrder(created.id, userId, AccessProfile.CLIENT);

      expect(result.id).toBe(created.id);
    });

    it("should not cancel an already canceled order", async () => {
      const dto = createOrderDto({ status: StatusOrder.CANCELADO });
      const created = await orderRepositoryInMemory.createOrder(dto, new Decimal(90), requesterEmail, userId, cartId);

      await expect(orderService.cancelOrder(created.id, userId, AccessProfile.CLIENT)).rejects.toThrow(
        "Pedido já está cancelado",
      );
    });
  });

  describe("list and status methods", () => {
    it("should throw when user has no orders", async () => {
      await expect(orderService.listOrdersMe(userId)).rejects.toThrow("Você não possui nenhum pedido");
    });

    it("should list order by id and change status", async () => {
      const dto = createOrderDto();
      const created = await orderRepositoryInMemory.createOrder(dto, new Decimal(90), requesterEmail, userId, cartId);

      const orderById = await orderService.listOrderById(created.id, userId, AccessProfile.CLIENT);
      const statusChanged = await orderService.changeStatusOrder(created.id, StatusOrder.PREPARANDO);

      expect(orderById.id).toBe(created.id);
      expect(statusChanged.id).toBe(created.id);
      expect(orderRepositoryInMemory.ordersDb[0].status).toBe(StatusOrder.PREPARANDO);
    });

    it("should allow admin to read order without ownership", async () => {
      const dto = createOrderDto();
      const created = await orderRepositoryInMemory.createOrder(dto, new Decimal(90), requesterEmail, userId, cartId);

      const orderById = await orderService.listOrderById(created.id, otherUserId, AccessProfile.ADMIN);

      expect(orderById.id).toBe(created.id);
    });
  });
});
