import { Decimal } from "@prisma/client/runtime/library";
import { randomInt } from "node:crypto";
import { DashboardQueryParams } from "./zod/schemas/params";

export const formatDateTime = (date: Date | null) => {
  if (!date) {
    return "Nao informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
};

export const formatDate = (date: Date) => {
  const localDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
  }).format(localDate);
};

export const formatCurrency = (quantity: number, unity: number | null, value: Decimal) => {
  let total = 0;
  if (quantity && !unity) {
    total += quantity * value.toNumber();
    return total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (quantity && unity) {
    const newQuantity = quantity + unity - 1;
    total += newQuantity * value.toNumber();
    return total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
};

export const formatTotalCurrency = (value: Decimal) => {
  return value.toNumber().toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const formatQuantity = (quantity: number, unity: number | null) => {
  if (quantity && !unity) {
    return quantity;
  }

  if (quantity && unity) {
    return quantity + unity - 1;
  }
};

export function generateTokenAuth(): string {
  return randomInt(100000, 1000000).toString();
}

export function resolvePeriod(query: DashboardQueryParams) {
  const now = new Date();

  switch (query.period) {
    case "today":
      return {
        start: new Date(now.setHours(0, 0, 0, 0)),
        end: new Date(),
      };

    case "7d":
      return {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(),
      };

    case "1m":
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      };

    default:
      throw new Error("Período inválido");
  }
}

export function toDateOnly(date: Date): string {
  return date.toISOString().split("T")[0];
}
