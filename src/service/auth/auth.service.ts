import { authDto } from "../../domain/dto/auth/LoginDto";
import { IAuthService } from "./IAuthService.type";
import { BadRequestException } from "../../shared/error/exceptions/badRequest-exception";
import bcrypt from "bcryptjs";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import "dotenv/config";
import { CreateUserDto } from "../../domain/dto/auth/CreateUserDto";
import { ITokenResets, IUserRepository } from "../../repository/interfaces";
import { ForgotPasswordDto, ResetPasswordDto, ValidateTokenDto } from "@/domain/dto/auth/ForgotPasswordDto";
import { generateTokenAuth } from "@/utils/generateToken";
import { IEmailService } from "../email/email.type";
import { StatusToken } from "@/shared/constants/statusToken";
import { InternalServerException } from "@/shared/error/exceptions/internalServer-exception";
import { UnauthorizedException } from "@/shared/error/exceptions/unauthorized-exception";
import { createLogger } from "@/libs/logger";

const authServiceLogger = createLogger("auth-service");

class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenResetsRepository: ITokenResets,
    private readonly emailService: IEmailService,
  ) {}

  register = async (dto: CreateUserDto) => {
    const userExist = await this.userRepository.userExistsByEmail(dto.email);

    if (userExist) {
      authServiceLogger.warn("Registration blocked because email already exists");
      throw new BadRequestException("Já existe conta cadastrada com esse email!");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 8);

    dto.password = hashedPassword;

    const userCreated = await this.userRepository.create(dto);
    authServiceLogger.info({ userId: userCreated.id }, "User registered successfully");

    return userCreated;
  };

  login = async (dto: authDto) => {
    const userExist = await this.verifyUserExistsByEmail(dto.email);

    const passwordCorrect = await bcrypt.compare(dto.password, userExist.senha as string);

    if (!passwordCorrect) {
      authServiceLogger.warn({ userId: userExist.id }, "Login rejected due to invalid credentials");
      throw new BadRequestException("credenciais inválidas");
    }

    const payload = {
      id: userExist.id,
      email: userExist.email,
      role: userExist.role,
    };

    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESHTOKEN_SECRET) {
      authServiceLogger.error("JWT secrets are not configured");
      throw new InternalServerException("Erro inesperado no servidor");
    }

    const accessToken = sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7m",
    });

    const refreshToken = sign(payload, process.env.JWT_REFRESHTOKEN_SECRET, {
      expiresIn: "7d",
    });

    authServiceLogger.info({ userId: userExist.id }, "User logged in");
    return {
      accessToken,
      refreshToken,
    };
  };

  createNewAccessToken(refreshToken: string) {
    if (!process.env.JWT_REFRESHTOKEN_SECRET || !process.env.JWT_SECRET) {
      authServiceLogger.error("JWT secrets are not configured for refresh flow");
      throw new InternalServerException("Erro inesperado no servidor");
    }

    let payload: JwtPayload;

    try {
      payload = verify(refreshToken, process.env.JWT_REFRESHTOKEN_SECRET) as JwtPayload;
    } catch {
      authServiceLogger.warn("Refresh token rejected");
      throw new UnauthorizedException("Refresh token inválido ou expirado");
    }

    const newPayload = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };

    const newAccessToken = sign(newPayload, process.env.JWT_SECRET, {
      expiresIn: "7m",
    });

    const newRefreshToken = sign(newPayload, process.env.JWT_REFRESHTOKEN_SECRET, { expiresIn: "7d" });

    authServiceLogger.info({ userId: newPayload.id }, "Access token refreshed");
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  createToken = async (dto: ForgotPasswordDto) => {
    const userExists = await this.verifyUserExistsByEmail(dto.email);

    const token = generateTokenAuth();
    const createdToken = await this.tokenResetsRepository.createToken(token, userExists.id!);

    if (!createdToken) {
      authServiceLogger.error({ userId: userExists.id }, "Password reset token could not be created");
      throw new BadRequestException("Falha ao criar token!");
    }

    try {
      await this.emailService.sendEmail({
        to: dto.email,
        template: "RESET_PASSWORD",
        data: {
          token: createdToken.token!,
        },
      });
    } catch (error) {
      authServiceLogger.error({ err: error, userId: userExists.id }, "Failed to send reset password email");
      throw error;
    }

    authServiceLogger.info({ userId: userExists.id }, "Password reset token generated and email sent");
    if (process.env.NODE_ENV === "test") {
      return createdToken;
    }
  };

  validateToken = async (dto: ValidateTokenDto) => {
    const userExists = await this.verifyUserExistsByEmail(dto.email);

    const tokenRecord = await this.tokenResetsRepository.findByToken(dto.token!);

    if (!tokenRecord || tokenRecord.usuarioId !== userExists.id) {
      authServiceLogger.warn({ userId: userExists.id }, "Password reset token validation failed");
      throw new BadRequestException("Token inválido. Gere outro token!");
    }

    const isExpired = tokenRecord.expiraEm! < new Date();
    if (isExpired) {
      await this.tokenResetsRepository.updateStatus(StatusToken.EXPIRADO, tokenRecord.id!);
      authServiceLogger.warn({ userId: userExists.id }, "Password reset token expired");
      throw new BadRequestException("Token expirado. Gere outro token!");
    }

    if (process.env.NODE_ENV === "test") {
      return tokenRecord;
    }
  };

  resetPassword = async (dto: ResetPasswordDto) => {
    const userExists = await this.verifyUserExistsByEmail(dto.email);

    const tokenRecord = await this.tokenResetsRepository.findByToken(dto.token!);

    if (!tokenRecord) {
      authServiceLogger.warn({ userId: userExists.id }, "Password reset token not found");
      throw new BadRequestException("Token inválido");
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword!, 8);
    userExists.senha = hashedPassword;

    const mapUser = {
      ...userExists,
      password: userExists.senha,
      cellphone: userExists.telefone!,
    };

    await this.userRepository.updateUser(mapUser, userExists.id!);
    await this.tokenResetsRepository.updateStatus(StatusToken.EXPIRADO, tokenRecord.id!);

    authServiceLogger.info({ userId: userExists.id }, "Password reset completed");
  };

  private async verifyUserExistsByEmail(email: string) {
    const userExists = await this.userRepository.userExistsByEmail(email);
    if (!userExists) {
      authServiceLogger.warn("Auth flow blocked because account was not found");
      throw new BadRequestException("Não foi possível processar essa solicitação!");
    }

    return userExists;
  }
}

export { AuthService };
