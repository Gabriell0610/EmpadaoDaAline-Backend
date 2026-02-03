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
        .cookie("access_token", accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 1000 * 60 * 7, // 7min
        })
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
        })
        .status(200)
        .json({ message: "Usuário logado com sucesso" });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    console.log("refresh chamado");
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        throw new UnauthorizedException("Refresh token ausente");
      }

      const { accessToken, refreshToken: newRefreshToken } = this.authService.createNewAccessToken(refreshToken);

      res
        .cookie("access_token", accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 1000 * 60 * 7,
          path: "/",
        })
        .cookie("refresh_token", newRefreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
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
          secure: false,
          sameSite: "lax",
          path: "/", // ⚠️ MUITO IMPORTANTE
        })
        .clearCookie("refresh_token", {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
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
