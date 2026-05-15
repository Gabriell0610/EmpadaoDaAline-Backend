import { prisma } from "../../src/libs/prisma";

const itemTypes = ["EMPADAO", "PANQUECA", "ALMONDEGA", "LASANHA", "ESCONDIDINHO"];

export const seedItemTypes = async () => {
  try {
    for (const nome of itemTypes) {
      await prisma.itemType.upsert({
        where: { nome },
        update: {},
        create: { nome },
      });
    }

    console.log("Tipos de item populados com sucesso!");
  } catch (error) {
    console.error("Erro ao popular tipos de item:", error);
  }
};
