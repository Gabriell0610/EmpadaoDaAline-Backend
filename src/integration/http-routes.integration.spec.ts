import "dotenv/config";

import type { Express } from "express";
import request from "supertest";
import { Decimal } from "@prisma/client/runtime/library";
import { ItemSize, StatusCart, StatusItem, TypeItem } from "@prisma/client";

import { AccessProfile } from "@/shared/constants/accessProfile";
import { createApp } from "@/infra/server/app";
import { prisma } from "@/libs/prisma";

jest.mock("@/libs/redis/redis", () => ({
  connectRedis: jest.fn().mockResolvedValue(undefined),
  redisClient: {
    sendCommand: jest.fn(),
  },
}));

jest.mock("@/middlewares/loginRateLimit/loginRateLimit", () => ({
  initLoginRateLimiter: jest.fn(),
  loginRateLimiterMiddleware: jest.fn((_req, _res, next) => next()),
}));

jest.mock("@/service/email/emailService", () => {
  const __sendEmailMock = jest.fn().mockResolvedValue(undefined);

  return {
    EmailService: jest.fn().mockImplementation(() => ({
      sendEmail: __sendEmailMock,
    })),
    __sendEmailMock,
  };
});

function getSendEmailMock() {
  const mockedModule = jest.requireMock("@/service/email/emailService") as {
    __sendEmailMock: jest.Mock;
  };

  return mockedModule.__sendEmailMock;
}

describe("Integration Tests - Auth + Cart + Order (HTTP + Postgres)", () => {
  let app: Express;
  const originalJwtSecret = process.env.JWT_SECRET;
  const originalRefreshSecret = process.env.JWT_REFRESHTOKEN_SECRET;

  beforeAll(async () => {
    if (process.env.TEST_DATABASE_URL) {
      process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
    }

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL ou TEST_DATABASE_URL não está definido para os testes de integração.");
    }

    process.env.JWT_SECRET = process.env.JWT_SECRET || "integration-jwt-secret";
    process.env.JWT_REFRESHTOKEN_SECRET = process.env.JWT_REFRESHTOKEN_SECRET || "integration-refresh-secret";

    app = await createApp();
  });

  beforeEach(async () => {
    const sendEmailMock = getSendEmailMock();
    sendEmailMock.mockReset();
    sendEmailMock.mockResolvedValue(undefined);
    await cleanDatabase();
  });

  afterAll(async () => {
    await cleanDatabase();
    await prisma.$disconnect();
    process.env.JWT_SECRET = originalJwtSecret;
    process.env.JWT_REFRESHTOKEN_SECRET = originalRefreshSecret;
  });

  it("should block protected routes when user is not authenticated", async () => {
    const response = await request(app).get("/api/cart");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("should block access with invalid token", async () => {
    const response = await request(app).get("/api/cart").set("Cookie", ["access_token=invalid_token"]);

    expect(response.status).toBe(401);
    expect(String(response.body.message)).toMatch(/Token/i);
  });

  it("should fail order creation when user has no active cart", async () => {
    const { agent } = await registerAndLoginUser(app, {
      email: "sem.carrinho@example.com",
      role: AccessProfile.CLIENT,
    });

    const schedulingDate = toDateString(new Date(Date.now() + 1000 * 60 * 60 * 24 * 2));
    const response = await agent.post("/api/order").send({
      idAddress: "00000000-0000-0000-0000-000000000000",
      idPaymentMethod: "00000000-0000-0000-0000-000000000000",
      status: "PENDENTE",
      schedulingDate,
      startTime: "10:00",
      endTime: "11:00",
      shipping: "10",
    });

    expect(response.status).toBe(400);
    expect(String(response.body.message)).toMatch(/carrinho/i);
  });

  it("should run full client journey: auth -> cart -> order", async () => {
    const { agent, email, userId } = await registerAndLoginUser(app, {
      email: "cliente.jornada@example.com",
      role: AccessProfile.CLIENT,
    });

    await agent.post("/api/auth/refresh").expect(200);

    await agent
      .post("/api/users/address")
      .send({
        street: "Rua das Flores",
        zipCode: "01001000",
        number: 123,
        neighborhood: "Centro",
        city: "Sao Paulo",
        state: "SP",
        complement: "Apto 12",
      })
      .expect(201);

    const addressesResponse = await agent.get("/api/users/address/me").expect(200);
    const addressId: string = addressesResponse.body.data[0].endereco.id;
    expect(addressId).toBeTruthy();

    const { itemId, paymentMethodId } = await seedItemAndPaymentMethod();

    await agent
      .post("/api/cart")
      .send({
        status: StatusCart.ATIVO,
        itemId,
        quantity: 2,
      })
      .expect(201);

    const cartResponse = await agent.get("/api/cart").expect(200);
    expect(cartResponse.body.data).toBeTruthy();
    expect(cartResponse.body.data.carrinhoItens.length).toBe(1);

    const schedulingDate = toDateString(new Date(Date.now() + 1000 * 60 * 60 * 24 * 2));
    const orderResponse = await agent
      .post("/api/order")
      .send({
        idAddress: addressId,
        idPaymentMethod: paymentMethodId,
        status: "PENDENTE",
        schedulingDate,
        startTime: "10:00",
        endTime: "11:00",
        observation: "Sem cebola",
        shipping: "10",
        nameClient: "Cliente Jornada",
        cellphoneClient: "11999999999",
      })
      .expect(201);

    const orderId: string = orderResponse.body.data.id;
    expect(orderId).toBeTruthy();
    expect(orderResponse.body.data.status).toBe("PENDENTE");

    const listMyOrdersResponse = await agent.get("/api/order/me").expect(200);
    expect(listMyOrdersResponse.body.data.length).toBe(1);
    expect(listMyOrdersResponse.body.data[0].id).toBe(orderId);

    const orderFromDb = await prisma.pedido.findUnique({
      where: { id: orderId },
      select: { usuarioId: true, status: true, carrinho: { select: { status: true } } },
    });
    expect(orderFromDb?.usuarioId).toBe(userId);
    expect(orderFromDb?.status).toBe("PENDENTE");
    expect(orderFromDb?.carrinho.status).toBe(StatusCart.FINALIZADO);

    const userFromDb = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    expect(userFromDb?.email).toBe(email);
  });

  it("should forbid a client from reading another user's order and allow admin", async () => {
    const owner = await registerAndLoginUser(app, {
      email: "owner@example.com",
      role: AccessProfile.CLIENT,
    });
    const outsider = await registerAndLoginUser(app, {
      email: "outsider@example.com",
      role: AccessProfile.CLIENT,
    });
    const admin = await registerAndLoginUser(app, {
      email: "admin@example.com",
      role: AccessProfile.ADMIN,
    });

    await owner.agent.post("/api/users/address").send(buildAddressPayload()).expect(201);
    const addressRes = await owner.agent.get("/api/users/address/me").expect(200);
    const addressId: string = addressRes.body.data[0].endereco.id;

    const { itemId, paymentMethodId } = await seedItemAndPaymentMethod();
    await owner.agent
      .post("/api/cart")
      .send({
        status: StatusCart.ATIVO,
        itemId,
        quantity: 1,
      })
      .expect(201);
    await owner.agent.get("/api/cart").expect(200);

    const orderRes = await owner.agent
      .post("/api/order")
      .send({
        idAddress: addressId,
        idPaymentMethod: paymentMethodId,
        status: "PENDENTE",
        schedulingDate: toDateString(new Date(Date.now() + 1000 * 60 * 60 * 24 * 2)),
        startTime: "10:00",
        endTime: "11:00",
        observation: "Pedido do owner",
        shipping: "10",
        nameClient: "Owner",
        cellphoneClient: "11999999999",
      })
      .expect(201);
    const orderId: string = orderRes.body.data.id;

    await outsider.agent.get(`/api/order/${orderId}`).expect(403);
    await admin.agent.get(`/api/order/${orderId}`).expect(200);
  });

  it("should keep committed order when post-transaction email sending fails", async () => {
    const { agent, userId } = await registerAndLoginUser(app, {
      email: "rollback@example.com",
      role: AccessProfile.CLIENT,
    });

    await agent.post("/api/users/address").send(buildAddressPayload()).expect(201);
    const addressRes = await agent.get("/api/users/address/me").expect(200);
    const addressId: string = addressRes.body.data[0].endereco.id;
    const { itemId, paymentMethodId } = await seedItemAndPaymentMethod();

    await agent
      .post("/api/cart")
      .send({
        status: StatusCart.ATIVO,
        itemId,
        quantity: 1,
      })
      .expect(201);

    const sendEmailMock = getSendEmailMock();
    sendEmailMock.mockRejectedValueOnce(new Error("smtp error"));

    const orderResponse = await agent.post("/api/order").send({
      idAddress: addressId,
      idPaymentMethod: paymentMethodId,
      status: "PENDENTE",
      schedulingDate: toDateString(new Date(Date.now() + 1000 * 60 * 60 * 24 * 2)),
      startTime: "10:00",
      endTime: "11:00",
      observation: "deve dar rollback",
      shipping: "10",
      nameClient: "Rollback",
      cellphoneClient: "11999999999",
    });

    expect(orderResponse.status).toBe(201);

    const totalOrders = await prisma.pedido.count({
      where: { usuarioId: userId },
    });
    expect(totalOrders).toBe(1);

    const finalizedCart = await prisma.carrinho.findFirst({
      where: { usuarioId: userId, status: StatusCart.FINALIZADO },
    });
    expect(finalizedCart).toBeTruthy();
  });
});

async function registerAndLoginUser(
  app: Express,
  input: {
    email: string;
    role: AccessProfile;
  },
): Promise<{ agent: ReturnType<typeof request.agent>; userId: string; email: string }> {
  const password = "ValidPass123!";
  const agent = request.agent(app);

  const registerRes = await agent.post("/api/auth/register").send({
    name: input.role === AccessProfile.ADMIN ? "Admin Teste" : "Cliente Teste",
    email: input.email,
    password,
    cellphone: "11999999999",
    role: input.role,
  });

  expect(registerRes.status).toBe(200);
  const userId: string = registerRes.body.data.id;

  const loginRes = await agent.post("/api/auth/login").send({
    email: input.email,
    password,
  });
  expect(loginRes.status).toBe(200);

  return {
    agent,
    userId,
    email: input.email,
  };
}

function buildAddressPayload() {
  return {
    street: "Rua A",
    zipCode: "01001000",
    number: 10,
    neighborhood: "Centro",
    city: "Sao Paulo",
    state: "SP",
    complement: "Casa",
  };
}

async function seedItemAndPaymentMethod() {
  const paymentMethod = await prisma.metodoPagamento.create({
    data: {
      nome: `PIX-${Date.now()}`,
    },
  });

  const itemDescription = await prisma.itemDescription.create({
    data: {
      nome: `Empadao-${Date.now()}`,
      descricao: "Empadao de frango especial com massa artesanal",
      image: "https://example.com/empadao.png",
      tipo: TypeItem.EMPADAO,
      disponivel: StatusItem.ATIVO,
    },
  });

  const item = await prisma.item.create({
    data: {
      preco: new Decimal(42.5),
      tamanho: ItemSize.M,
      itemDescriptionId: itemDescription.id,
    },
  });

  return {
    itemId: item.id,
    paymentMethodId: paymentMethod.id,
  };
}

async function cleanDatabase() {
  const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = current_schema()
      AND tablename <> '_prisma_migrations'
  `;

  if (tables.length === 0) {
    throw new Error("Nenhuma tabela encontrada no schema atual. Execute as migrations antes de rodar os testes.");
  }

  const tableNames = tables.map((table) => `"${table.tablename}"`).join(", ");
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`);
}

function toDateString(date: Date) {
  return date.toISOString().slice(0, 10);
}
