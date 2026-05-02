import { InternalServerException } from "@/shared/error/exceptions/internalServer-exception";
import { createLogger } from "../logger";

const telegramApi = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

const logger = createLogger("telegram");

const sendMessage = async (chatId: string, message: string) => {
  try {
    const response = await fetch(`${telegramApi}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    return response;
  } catch (error) {
    logger.error({ error }, "Error telegram");
    throw new InternalServerException("Erro ao enviar mensagem para o telegram");
  }
};

export const notifyAdminTelegram = async (message: string) => {
  const chatIds = process.env.TELEGRAM_ADMIN_CHAT_IDS?.split(",") ?? [];

  await Promise.allSettled(chatIds.map((id) => sendMessage(id.trim(), message)));
};
