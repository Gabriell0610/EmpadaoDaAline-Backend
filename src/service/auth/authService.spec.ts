/* eslint-disable @typescript-eslint/no-explicit-any */
import { InMemoryUserRepository } from "@/repository/in-memory/user";
import { CreateUserDto } from "@/domain/dto/auth/CreateUserDto";
import { AuthService } from "@/service/auth/auth.service";
import { AccessProfile } from "@/shared/constants/accessProfile";
import bcrypt from "bcryptjs";
import { InMemoryTokenResets } from "@/repository/in-memory/tokenResets";
import { authDto } from "@/domain/dto/auth/LoginDto";
import { ResetPasswordDto } from "@/domain/dto/auth/ForgotPasswordDto";
import { UserEntity } from "@/domain/model/UserEntity";
import { MockEmailService } from "../email/mockNodemailer";
import "dotenv/config";
import { TokenResetsEntity } from "@/domain/model/TokenEntity";
import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";

describe("Unit Tests - authService", () => {
  let authService: AuthService;
  let userRepositoryInMemory: InMemoryUserRepository;
  let tokenResetsInMemory: InMemoryTokenResets;
  let mockNodemailer: MockEmailService;
  const testUserPassword = "ValidPass123!";

  const createUserDto = (overrides: Partial<CreateUserDto> = {}) => ({
    name: "Gabriel",
    email: "user@example.com",
    password: testUserPassword,
    cellphone: "00000000000",
    role: AccessProfile.CLIENT,
    ...overrides,
  });

  beforeEach(async () => {
    userRepositoryInMemory = new InMemoryUserRepository();
    tokenResetsInMemory = new InMemoryTokenResets();
    mockNodemailer = new MockEmailService();
    authService = new AuthService(userRepositoryInMemory, tokenResetsInMemory, mockNodemailer);
  });

  describe("Testing method register", () => {
    it("Should create a user", async () => {
      //Arrange
      const userDto = createUserDto();

      //Act
      const response = await authService.register(userDto);

      //Assert
      expect(response).toMatchObject({
        nome: userDto.name,
        email: userDto.email,
        telefone: userDto.cellphone,
        role: userDto.role,
      });
    });

    it("Should throw a BadRequestException when user already exists", async () => {
      const userDto = createUserDto();

      await authService.register(userDto);

      await expect(authService.register(userDto)).rejects.toThrow("Já existe conta cadastrada com esse email!");
    });

    it("should hash the user password before register", async () => {
      const userDto = createUserDto();

      const response = await authService.register(userDto);

      const isPasswordHashed = await bcrypt.compare(testUserPassword, response.senha!);
      expect(isPasswordHashed).toBe(true);
    });
  });

  describe("Testing method login", () => {
    it("should make login with success", async () => {
      const userDto = createUserDto();

      const loginDto: authDto = {
        email: "user@example.com",
        password: testUserPassword,
      };

      //Act
      await authService.register(userDto);
      const token = await authService.login(loginDto);

      //Assert
      expect(token).toHaveProperty("accessToken");
      expect(token).toHaveProperty("refreshToken");
    });
    it("should throw error when user does not exist", async () => {
      const loginDto: authDto = {
        email: "naoexiste@email.com",
        password: "qualquerSenha",
      };

      await expect(authService.login(loginDto)).rejects.toThrow("Não foi possível processar essa solicitação!");
    });
    it("should throw error when password is incorrect", async () => {
      const userDto = createUserDto();

      await authService.register(userDto);

      const loginDto: authDto = {
        email: "user@example.com",
        password: "ValidPass12!",
      };

      await expect(authService.login(loginDto)).rejects.toThrow("credenciais inválidas");
    });

    it("should throw error if JWT secrets are not defined", async () => {
      // remove temporariamente a variável de ambiente
      const originalEnv = process.env.JWT_SECRET;
      const refreshEnv = process.env.JWT_REFRESHTOKEN_SECRET;
      delete process.env.JWT_SECRET;
      delete process.env.JWT_REFRESHTOKEN_SECRET;
      const userDto = createUserDto();
      await authService.register(userDto);

      const loginDto: authDto = {
        email: "user@example.com",
        password: testUserPassword,
      };

      await expect(authService.login(loginDto)).rejects.toThrow("Erro inesperado no servidor");

      // restaura o valor original
      process.env.JWT_SECRET = originalEnv;
      process.env.JWT_REFRESHTOKEN_SECRET = refreshEnv;
    });
  });

  describe("testing forgot password", () => {
    let userToken: string;
    let userExist: Partial<UserEntity>;
    let tokenResets: TokenResetsEntity | undefined;

    beforeEach(async () => {
      const userDto = createUserDto();
      userExist = await authService.register(userDto);
      tokenResets = await authService.createToken({ email: userExist.email! });
      userToken = tokenResets?.token ?? "";
    });

    describe("method createToken", () => {
      it("should send an email to user", async () => {
        mockNodemailer.sendEmail.mockClear(); // limpa chamadas anteriores
        await authService.createToken({ email: userExist.email! });

        expect(mockNodemailer.sendEmail).toHaveBeenCalledTimes(1);
        expect(mockNodemailer.sendEmail).toHaveBeenCalledWith(userExist.email, expect.any(String));
      });

      it("should throw BadRequestError if token is not saved", async () => {
        jest.spyOn(tokenResetsInMemory, "createToken").mockResolvedValue(null as any);

        await expect(authService.createToken({ email: userExist.email as string })).rejects.toThrow(
          "Falha ao criar token!",
        );
      });

      it("should NOT be able send email by user with invalid email", async () => {
        jest
          .spyOn(mockNodemailer, "sendEmail")
          .mockRejectedValue(new BadRequestException("Não foi possível enviar o e-mail"));

        await expect(authService.createToken({ email: userExist.email! })).rejects.toThrow(
          "Não foi possível enviar o e-mail",
        );
      });
    });

    describe("method validateToken", () => {
      it("should validate token with success", async () => {
        const tokenValid = await authService.validateToken({ email: userExist.email!, token: userToken });

        expect(tokenValid?.token).toEqual(userToken);
      });

      it("should throw BadRequestError if token is invalid", async () => {
        jest.spyOn(tokenResetsInMemory, "findByToken").mockResolvedValue(null);

        const userDto = createUserDto({ email: "teste@gmail.com" });
        const otherUser = await authService.register(userDto);

        await expect(authService.validateToken({ email: otherUser.email!, token: userToken })).rejects.toThrow(
          "Token inválido. Gere outro token!",
        );
      });

      it("should throw BadRequestError if token is expired", async () => {
        tokenResets!.expiraEm = new Date(Date.now() - 1000);
        userToken = tokenResets?.token ?? "";

        await expect(authService.validateToken({ email: userExist.email!, token: userToken })).rejects.toThrow(
          "Token expirado. Gere outro token!",
        );
      });
    });

    describe("method resetPasswords", () => {
      it("should reset password with success", async () => {
        const forgotPasswordDto: ResetPasswordDto = {
          email: userExist.email!,
          token: userToken,
          newPassword: "ValidPass12333!",
        };

        await authService.resetPassword(forgotPasswordDto);
        const updatedUser = await userRepositoryInMemory.userExistsByEmail(userExist.email!);
        const isPasswordHashed = await bcrypt.compare(forgotPasswordDto.newPassword!, updatedUser!.senha!);

        expect(isPasswordHashed).toBe(true);
      });

      it("should throw BadRequestError if token not exist", async () => {
        jest.spyOn(tokenResetsInMemory, "findByToken").mockResolvedValue(null);

        const forgotPasswordDto: ResetPasswordDto = {
          email: userExist.email!,
          token: userToken,
          newPassword: "ValidPass1233!",
        };

        await expect(authService.resetPassword(forgotPasswordDto)).rejects.toThrow("Token inválido");
      });
    });
  });
});
