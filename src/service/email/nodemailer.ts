import { Transporter } from "nodemailer";
import { EmailTemplateName, IEmailService, SendEmailInput } from "./nodemailer.type";
import { nodemailerTransporter } from "@/libs/nodemailer";
import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";
import { getEmailTemplate } from "./templates";

class NodemailerService implements IEmailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailerTransporter;
  }

  sendEmail = async <T extends EmailTemplateName>(input: SendEmailInput<T>) => {
    const template = getEmailTemplate(input.template);

    try {
      await this.transporter.sendMail({
        from: '"Empadão Da Aline - Suporte" <gabrielbarbosaa432@gmail.com>',
        to: input.to,
        subject: template.subject,
        html: template.renderHtml(input.data),
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException("Nao foi possivel enviar o e-mail");
    }
  };
}

export { NodemailerService };
