import { ITokenResets } from "@/repository/interfaces/tokenResets.type";
import { prisma } from "@/libs/prisma";
import { StatusToken } from "@/shared/constants/statusToken";

class TokenResetsRepository implements ITokenResets {
  createToken = async (token: string, userId: string) => {
    const expiresIn = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos em milissegundos
    // Ao gerar um novo token, expire os anteriores:
    await prisma.tokenResets.updateMany({
      where: {
        usuarioId: userId,
        status: StatusToken.ATIVO,
      },
      data: {
        status: StatusToken.EXPIRADO,
      },
    });

    return await prisma.tokenResets.create({
      data: {
        expiraEm: expiresIn,
        status: StatusToken.ATIVO,
        token: token,
        usuarioId: userId,
      },
    });
  };

  findByToken = async (token: string) => {
    return await prisma.tokenResets.findUnique({
      where: { token },
      include: {
        usuario: {
          select: {
            email: true,
            nome: true,
            id: true,
          },
        },
      },
    });
  };

  findTokenByStatus = async (userId: string) => {
    return await prisma.tokenResets.findFirst({
      where: {
        usuarioId: userId,
        status: StatusToken.ATIVO,
      },
    });
  };

  updateStatus = async (statusToken: StatusToken, idToken: string) => {
    await prisma.tokenResets.update({
      where: { id: idToken },
      data: {
        status: statusToken,
      },
    });
  };

  listAllTokens = async () => {
    return await prisma.tokenResets.findMany();
  };
}

export { TokenResetsRepository };
