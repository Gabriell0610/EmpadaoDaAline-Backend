import { Decimal } from "@prisma/client/runtime/library";
import { EmailTemplateDataMap, EmailTemplateName } from "./nodemailer.type";

type EmailTemplateDefinition<T extends EmailTemplateName> = {
  subject: string;
  renderHtml: (data: EmailTemplateDataMap[T]) => string;
};

type EmailTemplateRegistry = {
  [K in EmailTemplateName]: EmailTemplateDefinition<K>;
};

const appTemplate = (title: string, content: string) => `
  <div style="background-color: #F8F8F8; padding: 40px; font-family: Arial, sans-serif; color: #222;">
    <div style="max-width: 640px; margin: auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
      <div style="background-color: #247301; padding: 20px; text-align: center;">
        <h2 style="color: #fff; margin: 0;">Empadao Da Aline - Suporte</h2>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; margin-bottom: 20px;">${title}</p>
        ${content}
      </div>
      <div style="background-color: #F8F8F8; text-align: center; padding: 15px; font-size: 12px; color: #999;">
        &copy; 2026 Empadao Da Aline. Todos os direitos reservados.
      </div>
    </div>
  </div>
`;

const formatDateTime = (date: Date | null) => {
  if (!date) {
    return "Nao informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
};

const formatDate = (date: Date) => {
  const localDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
  }).format(localDate);
};

const formatCurrency = (quantity: number, unity: number | null, value: Decimal) => {
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

const formatTotalCurrency = (value: Decimal) => {
  return value.toNumber().toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const formatQuantity = (quantity: number, unity: number | null) => {
  if (quantity && !unity) {
    return quantity;
  }

  if (quantity && unity) {
    return quantity + unity - 1;
  }
};

const buildOrderItems = (items: EmailTemplateDataMap["ORDER_CREATED"]["items"]) => {
  if (items.length === 0) {
    return `<tr><td colspan="3" style="padding: 12px; border-bottom: 1px solid #eee; color: #777;">Sem itens no pedido.</td></tr>`;
  }

  return items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${formatQuantity(item.quantity, item.unity)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.quantity, item.unity, item.price)}</td>
        </tr>
      `,
    )
    .join("");
};

const renderOrderTemplate = (
  title: string,
  introText: string,
  footerText: string,
  data: EmailTemplateDataMap["ORDER_CREATED"],
) => {
  const { orderNumber, orderStatus, createdAt, deliveryDate, totalPrice, items, frete, observacao, metodoPagamento } =
    data;

  return appTemplate(
    title,
    `
      <p style="font-size: 16px; margin-bottom: 16px;">
        ${introText}
      </p>
      <ul style="font-size: 15px; line-height: 1.6; color: #333; padding-left: 20px; margin: 0 0 20px 0;">
        <li><strong>Pedido:</strong> #${orderNumber}</li>
        <li><strong>Status:</strong> ${orderStatus}</li>
        <li><strong>Data de criacao:</strong> ${formatDateTime(createdAt)}</li>
        <li><strong>Data de entrega:</strong> ${formatDate(deliveryDate)}</li>
        <li><strong>Observacao:</strong> ${observacao ? observacao : "Sem observacao..."}</li>
        <li><strong>Metodo de pagamento:</strong> ${metodoPagamento}</li>
      </ul>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 10px 12px; border-bottom: 2px solid #ddd; font-size: 13px; color: #555;">Item</th>
            <th style="text-align: center; padding: 10px 12px; border-bottom: 2px solid #ddd; font-size: 13px; color: #555;">Qtd</th>
            <th style="text-align: right; padding: 10px 12px; border-bottom: 2px solid #ddd; font-size: 13px; color: #555;">Preco</th>
          </tr>
        </thead>
        <tbody>
          ${buildOrderItems(items)}
        </tbody>
      </table>

      <div style="background: #247301; color: #fff; border-radius: 6px; padding: 14px 16px; font-size: 18px; font-weight: 700; margin-bottom: 16px; text-align: right;">
        <span style="display: block; margin-bottom: 3px;">
          Frete: ${frete}
        </span>
        <span style="display: block;">
          Total do pedido: ${formatTotalCurrency(totalPrice)}
        </span>
      </div>

      <p style="font-size: 14px; color: #555; margin: 0;">
        ${footerText}
      </p>
    `,
  );
};

const emailTemplates: EmailTemplateRegistry = {
  RESET_PASSWORD: {
    subject: "Redefinicao de senha",
    renderHtml: ({ token }) =>
      appTemplate(
        "Ola,",
        `
          <p style="font-size: 16px; margin-bottom: 20px;">
            Recebemos uma solicitacao para redefinir sua senha.
            Use o codigo abaixo para continuar:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #247301; color: #fff; font-size: 20px; padding: 12px 24px; border-radius: 6px; letter-spacing: 2px;">
              ${token}
            </span>
          </div>
          <p style="font-size: 14px; color: #555; margin: 0;">
            Se voce nao solicitou essa redefinicao, ignore este e-mail.
          </p>
        `,
      ),
  },
  ORDER_CREATED: {
    subject: "Pedido efetuado com sucesso",
    renderHtml: (data) =>
      renderOrderTemplate(
        "Seu pedido foi feito com sucesso!",
        "Obrigado pela preferência. Estes são os dados do seu pedido:",
        "Em breve voce receberá novas atualizações sobre o andamento do pedido.",
        data,
      ),
  },
  ORDER_CANCELED: {
    subject: "Pedido cancelado",
    renderHtml: (data) =>
      renderOrderTemplate(
        "Seu pedido foi cancelado.",
        "O cancelamento foi concluido e estes sao os dados do pedido:",
        "Se tiver duvidas, responda este e-mail para falar com nosso suporte.",
        data,
      ),
  },
  ORDER_CONFIRMED: {
    subject: "Pedido Confirmado!",
    renderHtml: (data) =>
      renderOrderTemplate(
        "Seu pedido foi confirmado e será entregue amanhã!.",
        "Obrigado pela preferência. Estes são os dados do seu pedido: ",
        "Se tiver dúvidas, responda este e-mail para falar com nosso suporte.",
        data,
      ),
  },
};

const getEmailTemplate = <T extends EmailTemplateName>(templateName: T): EmailTemplateDefinition<T> => {
  return emailTemplates[templateName];
};

export { getEmailTemplate };
