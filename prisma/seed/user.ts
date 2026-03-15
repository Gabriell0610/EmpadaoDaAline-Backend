import bcrypt from "bcryptjs";
import { AccessProfile } from "../../src/shared/constants/accessProfile";
import { prisma } from "../../src/libs/prisma";
import { randomUUID } from "crypto";

async function hashPassword() {
  for (const user of userDto.users) {
    user.senha = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 8);
  }
}

const userDto = {
  users: [
    {
      id: randomUUID(),
      nome: "Aline Valéria",
      email: process.env.ADMIN_EMAIL!,
      role: AccessProfile.ADMIN,
      senha: "",
      telefone: process.env.ADMIN_CELLPHONE!,
    },
    {
      id: randomUUID(),
      nome: "Gabriel Vieira",
      email: process.env.SECOND_ADMIN_EMAIL!,
      role: AccessProfile.ADMIN,
      senha: "",
      telefone: process.env.SECOND_ADMIN_CELLPHONE!,
    },
  ],
};

// Função de seeding dos usuários
const seedUser = async () => {
  try {
    const userAlreadyExist = (await prisma.usuario.count()) > 0;

    if (userAlreadyExist) return [];

    await hashPassword();

    for (const user of userDto.users) {
      await prisma.usuario.create({
        data: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          senha: user.senha,
          telefone: user.telefone,
          role: user.role,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    console.log("Usuários populados com sucesso!");
  } catch (error) {
    console.error("Erro ao popular usuários:", error);
  }
};

export { seedUser };
