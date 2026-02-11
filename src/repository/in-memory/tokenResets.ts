import { StatusToken } from "@/shared/constants/statusToken";
import { tokenResets } from "@prisma/client";
import { randomUUID } from "crypto";
import { ITokenResets } from "../interfaces/index";

class InMemoryTokenResets implements ITokenResets {
  tokenDb: tokenResets[] = [];

  createToken = async (token: string, userId: string) => {
    const expiresIn = new Date(Date.now() + 5 * 60 * 1000);
    const tokenResets = {
      id: randomUUID(),
      token: token,
      expiraEm: expiresIn,
      status: StatusToken.ATIVO,
      createdAt: new Date(),
      usuarioId: userId,
    };
    this.tokenDb.push(tokenResets);

    return tokenResets;
  };

  findByToken = async (token: string) => {
    const findToken = this.tokenDb.find((t) => t.token === token);
    return findToken || null;
  };

  updateStatus = async (statusToken: StatusToken, idToken: string) => {
    const findToken = this.tokenDb.find((t) => t.id === idToken);
    if (!findToken) {
      return;
    }

    findToken.status = statusToken;
  };

  listAllTokens!: () => Promise<tokenResets[]>;
  findTokenByStatus!: (status: string) => Promise<tokenResets>;
}

export { InMemoryTokenResets };
