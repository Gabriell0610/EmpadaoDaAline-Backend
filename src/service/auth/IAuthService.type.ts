import { authDto } from "../../domain/dto/auth/LoginDto";
import { CreateUserDto } from "../../domain/dto/auth/CreateUserDto";
import { ForgotPasswordDto } from "@/domain/dto/auth/ForgotPasswordDto";
import { TokenResetsEntity } from "@/domain/model/TokenEntity";
import { UserEntity } from "@/domain/model";

interface IAuthService {
  login: (dto: authDto) => Promise<{ accessToken: string; refreshToken: string }>;
  register: (data: CreateUserDto) => Promise<Partial<UserEntity>>;
  createToken: (dto: ForgotPasswordDto) => Promise<TokenResetsEntity | void>;
  validateToken: (dto: ForgotPasswordDto) => Promise<TokenResetsEntity | void>;
  resetPassword: (dto: ForgotPasswordDto) => Promise<void>;
  createNewAccessToken: (refreshToken: string) => { accessToken: string; refreshToken: string };
}

export { IAuthService };
