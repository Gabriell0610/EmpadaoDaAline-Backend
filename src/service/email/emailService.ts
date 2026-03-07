import { EmailTemplateName, IEmailService, SendEmailInput } from "./email.type";
import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";
import { getEmailTemplate } from "./templates";
import { resendLib } from "@/libs/resend";
import { createLogger } from "@/libs/logger";

const logger = createLogger("email-service");

class EmailService implements IEmailService {
  private readonly resend = resendLib;

  sendEmail = async <T extends EmailTemplateName>(input: SendEmailInput<T>) => {
    const template = getEmailTemplate(input.template);

    try {
      await this.resend.emails.send({
        from: '"Empadão Da Aline - Suporte" <onboarding@resend.dev>',
        to: input.to,
        subject: template.subject,
        html: template.renderHtml(input.data),
      });
    } catch (error) {
      logger.info(
        {
          to: input.to,
          template: input.template,
          error,
        },
        "Email send error",
      );
      throw new BadRequestException("Nao foi possivel enviar o e-mail");
    }
  };
}

export { EmailService };
