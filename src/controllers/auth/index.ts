import { UserRepository } from "@/repository/prisma/user/user.prisma";
import { AuthService } from "@/service/auth/auth.service";
import { AuthUserController } from "./AuthUser.controller";
import { TokenResetsRepository } from "@/repository/prisma/tokenResets/tokenRests.prisma";
import { NodemailerService } from "@/service/email/nodemailer";

const userRepository = new UserRepository();
const tokenResetsRepository = new TokenResetsRepository();
const nodemailerService = new NodemailerService();

const authService = new AuthService(userRepository, tokenResetsRepository, nodemailerService);

const authUserController = new AuthUserController(authService);

export { authUserController };
