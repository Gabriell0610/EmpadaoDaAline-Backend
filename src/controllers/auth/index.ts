import { UserRepository } from "@/repository/prisma/user/user.prisma";
import { AuthService } from "@/service/auth/auth.service";
import { AuthUserController } from "./AuthUser.controller";
import { TokenResetsRepository } from "@/repository/prisma/tokenResets/tokenRests.prisma";
import { EmailService } from "@/service/email/emailService";

const userRepository = new UserRepository();
const tokenResetsRepository = new TokenResetsRepository();
const emailService = new EmailService();

const authService = new AuthService(userRepository, tokenResetsRepository, emailService);

const authUserController = new AuthUserController(authService);

export { authUserController };
