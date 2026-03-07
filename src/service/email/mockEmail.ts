/* eslint-disable @typescript-eslint/no-unused-vars */
import { EmailTemplateName, IEmailService, SendEmailInput } from "./email.type";

class MockEmailService implements IEmailService {
  sendEmail = async <T extends EmailTemplateName>(_input: SendEmailInput<T>) => undefined;
}

export { MockEmailService };
