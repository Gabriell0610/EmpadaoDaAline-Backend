import { Decimal } from "@prisma/client/runtime/library";
import { StatusOrder } from "@prisma/client";

jest.mock("@/libs/resend", () => ({
  resendLib: {
    emails: {
      send: jest.fn(),
    },
  },
}));

import { EmailService } from "./emailService";
import { resendLib } from "@/libs/resend";

describe("Unit test - EmailService", () => {
  let emailService: EmailService;

  beforeEach(() => {
    jest.clearAllMocks();
    emailService = new EmailService();
  });

  it("should send email successfully", async () => {
    const sendSpy = jest.spyOn(resendLib.emails, "send").mockResolvedValue({} as never);

    await emailService.sendEmail({
      to: "cliente@teste.com",
      template: "ORDER_CREATED",
      data: {
        orderNumber: 1001,
        orderStatus: StatusOrder.PENDENTE,
        createdAt: new Date("2026-05-10T10:00:00.000Z"),
        deliveryDate: new Date("2026-05-12T00:00:00.000Z"),
        totalPrice: new Decimal(90),
        frete: new Decimal(10),
        observacao: "Sem cebola",
        metodoPagamento: "Pix",
        nomeCliente: "Gabriel",
        celularCliente: "21999990000",
        telefone: "21888880000",
        email: "cliente@teste.com",
        items: [{ name: "Empadao", quantity: 1, price: new Decimal(90), unity: null }],
      },
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "contato@empadaodaaline.com.br",
        to: "cliente@teste.com",
        subject: "Pedido efetuado com sucesso",
      }),
    );
  });

  it("should throw when resend provider fails", async () => {
    jest.spyOn(resendLib.emails, "send").mockRejectedValue(new Error("smtp error"));

    await expect(
      emailService.sendEmail({
        to: "cliente@teste.com",
        template: "RESET_PASSWORD",
        data: { token: "123456" },
      }),
    ).rejects.toThrow("Nao foi possivel enviar o e-mail");
  });
});
