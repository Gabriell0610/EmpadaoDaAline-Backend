import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../../service/auth/IAuthService.type";
import { loginSchema } from "@/domain/dto/auth/LoginDto";
import { HttpStatus } from "@/shared/constants/index";
import { CreateUserBodySchema } from "../../domain/dto/auth/CreateUserDto";
import { forgotPasswordSchema } from "@/domain/dto/auth/ForgotPasswordDto";
import { UnauthorizedException } from "@/shared/error/exceptions/unauthorized-exception";

class AuthUserController {
  constructor(private authService: IAuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = CreateUserBodySchema.parse(req.body);
      const data = await this.authService.register(dto);
      res.status(HttpStatus.OK).json({ message: "Usuário cadastrado com sucesso!", data: data });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = loginSchema.parse(req.body);
      const { accessToken, refreshToken } = await this.authService.login(dto);
      console.log("criando refreshToken:", refreshToken + "\n");
      console.log("criando accessToken:", accessToken);
      res
        .status(HttpStatus.OK)
        .json({ message: "Usuário logado com sucesso", access_token: accessToken, refresh_token: refreshToken });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        console.log("[DEBUG] Nenhum refresh_token encontrado");
        throw new UnauthorizedException("Usuário não autorizado");
      }

      console.log("REFRESH_TOKEN", refreshToken);

      const newAccessToken = this.authService.createNewAccessToken(refreshToken);

      console.log("novo access_token", newAccessToken);

      res.status(200).json({ access_token: newAccessToken });
    } catch (error) {
      next(error);
    }
  };

  forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = forgotPasswordSchema.parse(req.body);
      await this.authService.createToken(dto);
      res.status(HttpStatus.OK).json({ message: "Um token foi enviado para seu email!" });
    } catch (error) {
      next(error);
    }
  };

  validateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = forgotPasswordSchema.parse(req.body);
      await this.authService.validateToken(dto);
      res.status(HttpStatus.OK).json({ message: "Token válido" });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = forgotPasswordSchema.parse(req.body);
      await this.authService.resetPassword(dto);
      res.status(HttpStatus.OK).json({ message: "Senha alterada com sucesso!" });
    } catch (error) {
      next(error);
    }
  };
}

export { AuthUserController };
