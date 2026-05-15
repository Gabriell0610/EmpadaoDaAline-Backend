import { getEmailTemplate } from "./templates";
import { Decimal } from "@prisma/client/runtime/library";
import { StatusOrder } from "@prisma/client";

describe("Unit test - email templates", () => {
  const createOrderData = (overrides: Record<string, unknown> = {}) => ({
    orderNumber: 2002,
    orderStatus: StatusOrder.PENDENTE,
    createdAt: new Date("2026-05-11T10:00:00.000Z"),
    deliveryDate: new Date("2026-05-12T00:00:00.000Z"),
    totalPrice: new Decimal(95),
    frete: new Decimal(10),
    observacao: "Sem alho",
    metodoPagamento: "Cartao",
    nomeCliente: "Aline",
    celularCliente: "21988887777",
    telefone: "21777776666",
    email: "cliente@teste.com",
    items: [{ name: "Empadao de Frango", quantity: 1, price: new Decimal(95), unity: null }],
    ...overrides,
  });

  it("should render reset password template", () => {
    const template = getEmailTemplate("RESET_PASSWORD");
    const html = template.renderHtml({ token: "654321" });

    expect(template.subject).toBe("Redefinicao de senha");
    expect(html).toContain("654321");
  });

  it("should render order created template with empty items and fallback values", () => {
    const template = getEmailTemplate("ORDER_CREATED");
    const html = template.renderHtml(
      createOrderData({
        createdAt: null,
        observacao: null,
        celularCliente: null,
        items: [],
      }),
    );

    expect(template.subject).toBe("Pedido efetuado com sucesso");
    expect(html).toContain("Sem itens no pedido.");
    expect(html).toContain("Nao informado");
    expect(html).toContain("Sem observacao...");
  });

  it("should render new order admin template with customer info and unitary quantity", () => {
    const template = getEmailTemplate("NEW_ORDER_ADMIN");
    const html = template.renderHtml(
      createOrderData({
        celularCliente: null,
        items: [{ name: "Empadao de Camarao", quantity: 1, price: new Decimal(30), unity: 2 }],
      }),
    );

    expect(template.subject).toBe("Novo pedido feito!");
    expect(html).toContain("Dados do cliente");
    expect(html).toContain("Nome Cliente:");
    expect(html).toContain("21777776666");
    expect(html).toContain("Empadao de Camarao");
  });

  it("should render canceled and confirmed templates", () => {
    const canceledTemplate = getEmailTemplate("ORDER_CANCELED");
    const confirmedTemplate = getEmailTemplate("ORDER_CONFIRMED");

    const canceledHtml = canceledTemplate.renderHtml(createOrderData());
    const confirmedHtml = confirmedTemplate.renderHtml(createOrderData());

    expect(canceledTemplate.subject).toBe("Pedido cancelado");
    expect(confirmedTemplate.subject).toBe("Pedido Confirmado!");
    expect(canceledHtml).toContain("#2002");
    expect(confirmedHtml).toContain("#2002");
  });
});
