import { TokenResetsEntity } from "@/domain/model/TokenEntity";
import { StatusToken } from "@/shared/constants/statusToken";

export interface ITokenResets {
  createToken: (token: string, userId: string) => Promise<TokenResetsEntity>;
  findByToken: (token: string) => Promise<TokenResetsEntity | null>;
  findTokenByStatus: (userId: string) => Promise<TokenResetsEntity | null>;
  listAllTokens: () => Promise<TokenResetsEntity[]>;
  updateStatus: (statusToken: StatusToken, idToken: string) => Promise<void>;
}
