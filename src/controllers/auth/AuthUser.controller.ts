import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../../service/auth/IAuthService.type";
import { loginSchema } from "@/domain/dto/auth/LoginDto";
import { HttpStatus } from "@/shared/constants/index";
import { CreateUserBodySchema } from "../../domain/dto/auth/CreateUserDto";
import { forgotPasswordSchema, resetPasswordSchema, validateTokenSchema } from "@/domain/dto/auth/ForgotPasswordDto";
import { UnauthorizedException } from "@/shared/error/exceptions/unauthorized-exception";

const isProduction = process.env.NODE_ENV === "production";
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
      res
        .cookie("access_token", accessToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          maxAge: 1000 * 60 * 7,
        })
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        })
        .status(200)
        .json({ message: "Usuário logado com sucesso" });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        throw new UnauthorizedException("Erro ao realizar essa operação");
      }

      const { accessToken, refreshToken: newRefreshToken } = this.authService.createNewAccessToken(refreshToken);

      res
        .cookie("access_token", accessToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          maxAge: 1000 * 60 * 7,
          path: "/",
        })
        .cookie("refresh_token", newRefreshToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          maxAge: 1000 * 60 * 60 * 24 * 7,
          path: "/",
        })
        .status(200)
        .json({ message: "Tokens renovados" });
    } catch (error) {
      res.clearCookie("access_token", { path: "/" }).clearCookie("refresh_token", { path: "/" });
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .clearCookie("access_token", {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          path: "/",
        })
        .clearCookie("refresh_token", {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          path: "/",
        })
        .status(200)
        .json({ message: "Logout realizado com sucesso" });
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
      const dto = validateTokenSchema.parse(req.body);
      await this.authService.validateToken(dto);
      res.status(HttpStatus.OK).json({ message: "Token válido" });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = resetPasswordSchema.parse(req.body);
      await this.authService.resetPassword(dto);
      res.status(HttpStatus.OK).json({ message: "Senha alterada com sucesso!" });
    } catch (error) {
      next(error);
    }
  };
}

export { AuthUserController };
