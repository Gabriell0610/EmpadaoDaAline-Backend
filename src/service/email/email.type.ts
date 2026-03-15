import { StatusOrder } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export type EmailTemplateName =
  | "RESET_PASSWORD"
  | "ORDER_CREATED"
  | "ORDER_CANCELED"
  | "ORDER_CONFIRMED"
  | "NEW_ORDER_ADMIN";

type OrderEmailTemplateData = {
  orderNumber: number;
  orderStatus: StatusOrder;
  createdAt: Date | null;
  deliveryDate: Date;
  totalPrice: Decimal;
  frete: Decimal;
  observacao: string | null;
  metodoPagamento: string;
  nomeCliente: string | null;
  celularCliente: string | null;
  telefone: string;
  email: string;
  items: Array<{
    name: string;
    quantity: number;
    price: Decimal;
    unity: number | null;
  }>;
};

export interface EmailTemplateDataMap {
  RESET_PASSWORD: {
    token: string;
  };
  ORDER_CREATED: OrderEmailTemplateData;
  ORDER_CANCELED: OrderEmailTemplateData;
  ORDER_CONFIRMED: OrderEmailTemplateData;
  NEW_ORDER_ADMIN: OrderEmailTemplateData;
}

export interface SendEmailInput<T extends EmailTemplateName = EmailTemplateName> {
  to: string;
  template: T;
  data: EmailTemplateDataMap[T];
}

export interface IEmailService {
  sendEmail: <T extends EmailTemplateName>(input: SendEmailInput<T>) => Promise<void>;
}
