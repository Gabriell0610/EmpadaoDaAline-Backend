import bcrypt from "bcryptjs";
import { AccessProfile } from "../../src/shared/constants/accessProfile";
import { prisma } from "../../src/libs/prisma";

// Função para criptografar as senhas
async function hashPassword() {
  for (const user of userDto.users) {
    user.senha = await bcrypt.hash("Teste123!", 8);
  }
}

// Dados do usuário para seeding
const userDto = {
  users: [
    {
      id: "1",
      nome: "Colaborador1",
      email: "colab@gmail.com",
      role: AccessProfile.ADMIN,
      senha: "",
      telefone: "21979736993",
      endereco: [
        {
          id: "1",
          bairro: "Bairro 1",
          cep: "01234567",
          cidade: "Cidade 1",
          estado: "SP",
          numero: "100",
          complemento: "Apto 1",
          rua: "Rua 1",
        },
      ],
    },
    {
      id: "2",
      nome: "Colaborador2",
      email: "colab2@gmail.com",
      role: AccessProfile.CLIENT,
      senha: "",
      telefone: "21979736993",
      endereco: [
        {
          id: "2",
          bairro: "Bairro 2",
          cep: "01234567",
          cidade: "Cidade 2",
          estado: "SP",
          numero: "100",
          complemento: "Apto 2",
          rua: "Rua 2",
        },
      ],
    },
    {
      id: "3",
      nome: "Gabriel",
      email: "gabriell.vieira432@gmail.com",
      role: AccessProfile.CLIENT,
      senha: "",
      telefone: "21979736993",
      endereco: [
        {
          id: "3",
          bairro: "Bairro 3",
          cep: "01334567",
          cidade: "Cidade 3",
          estado: "SP",
          numero: "100",
          complemento: "Apto 3",
          rua: "Rua 3",
        },
      ],
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
          enderecos: {
            create: user.endereco.map((address) => ({
              endereco: {
                create: {
                  bairro: address.bairro,
                  cep: address.cep,
                  cidade: address.cidade,
                  estado: address.estado,
                  numero: address.numero,
                  complemento: address.complemento,
                  rua: address.rua,
                },
              },
            })),
          },
        },
      });
    }

    console.log("Usuários populados com sucesso!");
  } catch (error) {
    console.error("Erro ao popular usuários:", error);
  }
};

export { seedUser };
