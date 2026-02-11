import { Transporter } from "nodemailer";
import { IEmailService } from "./nodemailer.type";
import { nodemailerTransporter } from "@/libs/nodemailer";
import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";

class NodemailerService implements IEmailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailerTransporter;
  }

  sendEmail = async (to: string, token: string) => {
    try {
      await this.transporter.sendMail({
        from: '"Empadão Da Aline - Suporte" <gabrielbarbosaa432@gmail.com>',
        to,
        subject: "Redefinção de senha",
        html: `
        <div style="background-color: #F8F8F8; padding: 40px; font-family: Arial, sans-serif; color: #222;">
          <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <div style="background-color: #247301; padding: 20px; text-align: center;">
              <h2 style="color: #fff; margin: 0;">Empadão Da Aline - Suporte</h2>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Olá,</p>
              <p style="font-size: 16px; margin-bottom: 20px;">
                Recebemos uma solicitação para redefinir sua senha. Utilize o código abaixo para continuar com o processo:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; background-color: #247301; color: #fff; font-size: 20px; padding: 12px 24px; border-radius: 6px; letter-spacing: 2px;">
                  ${token}
                </span>
              </div>
              <p style="font-size: 14px; color: #555;">
                Se você não solicitou essa redefinição, por favor ignore este e-mail.
              </p>
            </div>
            <div style="background-color: #F8F8F8; text-align: center; padding: 15px; font-size: 12px; color: #999;">
              © 2025 Projeto Z. Todos os direitos reservados.
            </div>
          </div>
        </div>
      `,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException("Não foi possível enviar o e-mail");
    }
  };
}

export { NodemailerService };
