import { prisma } from "../../src/libs/prisma";
import { ItemSize, StatusItem } from "@prisma/client";

const itemDescriptionDto = [
  {
    nome: "Empadão de Frango",
    descricao: "Frango cremoso e bem temperado envolto em massa dourada e crocante!",
    image: "",
    itens: [
      { preco: 30.0, unidades: null, tamanho: "P", precoUnitario: null },
      { preco: 40.0, unidades: null, tamanho: "M", precoUnitario: null },
      { preco: 50.0, unidades: null, tamanho: "G", precoUnitario: null },
      { preco: 60.0, unidades: null, tamanho: "GG", precoUnitario: null },
    ],
    tipoItem: "EMPADAO",
  },
  {
    nome: "Empadão de Calabresa",
    descricao: "Calabresa suculenta com tempero caseiro e toque defumado irresistível!",
    image: "",
    itens: [
      { preco: 30.0, unidades: null, tamanho: "P", precoUnitario: null },
      { preco: 40.0, unidades: null, tamanho: "M", precoUnitario: null },
      { preco: 50.0, unidades: null, tamanho: "G", precoUnitario: null },
      { preco: 60.0, unidades: null, tamanho: "GG", precoUnitario: null },
    ],
    tipoItem: "EMPADAO",
  },
  {
    nome: "Empadão de Palmito",
    descricao: "Palmito selecionado com molho cremoso em massa artesanal dourada!",
    image: "",
    itens: [
      { preco: 35.0, unidades: null, tamanho: "P", precoUnitario: null },
      { preco: 45.0, unidades: null, tamanho: "M", precoUnitario: null },
      { preco: 65.0, unidades: null, tamanho: "G", precoUnitario: null },
      { preco: 85.0, unidades: null, tamanho: "GG", precoUnitario: null },
    ],
    tipoItem: "EMPADAO",
  },
  {
    nome: "Empadão de Camarão",
    descricao: "Camarão ao molho suave com toque especial, leve e saboroso!",
    image: "",
    itens: [
      { preco: 40.0, unidades: null, tamanho: "P", precoUnitario: null },
      { preco: 51.0, unidades: null, tamanho: "M", precoUnitario: null },
      { preco: 73.0, unidades: null, tamanho: "G", precoUnitario: null },
      { preco: 90.0, unidades: null, tamanho: "GG", precoUnitario: null },
    ],
    tipoItem: "EMPADAO",
  },
  {
    nome: "Panqueca de Carne Moída",
    descricao: "Carne moída ao molho caseiro recheando panquecas macias e saborosas!",
    image: "",
    itens: [{ precoUnitario: 6.67, unidades: 6, tamanho: null, preco: 40.02 }],
    tipoItem: "PANQUECA",
  },
  {
    nome: "Panqueca de Frango",
    descricao: "Frango desfiado e temperado em panquecas leves feitas na hora!",
    image: "",
    itens: [{ precoUnitario: 6.67, unidades: 6, tamanho: null, preco: 40.02 }],
    tipoItem: "PANQUECA",
  },
  {
    nome: "Panqueca de Queijo e Presunto",
    descricao: "Queijo derretido e presunto fatiado em panqueca macia e gratinada",
    image: "",
    itens: [{ precoUnitario: 6.67, unidades: 6, tamanho: null, preco: 40.0 }],
    tipoItem: "PANQUECA",
  },
  {
    nome: "Almôndega De Carne",
    descricao: "Almôndegas artesanais de carne moída ao molho encorpado e aromático!",
    image: "",
    itens: [{ precoUnitario: 3.4, unidades: 12, tamanho: null, preco: 40.0 }],
    tipoItem: "ALMONDEGA",
  },
];

const seedItens = async () => {
  try {
    const itemCount = await prisma.item.count();
    if (itemCount > 0) return;

    for (const desc of itemDescriptionDto) {
      const { id } = await prisma.itemDescription.create({
        data: {
          descricao: desc.descricao,
          nome: desc.nome,
          image: desc.image,
          itemType: {
            connectOrCreate: {
              where: { nome: desc.tipoItem },
              create: { nome: desc.tipoItem },
            },
          },
          disponivel: StatusItem.ATIVO,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        select: {
          id: true,
        },
      });
      for (const item of desc.itens) {
        await prisma.item.create({
          data: {
            preco: item.preco,
            unidades: item.unidades,
            tamanho: item.tamanho as ItemSize,
            updatedAt: new Date(),
            itemDescriptionId: id,
            precoUnitario: item.precoUnitario,
          },
        });
      }
    }

    console.log("Itens populados com sucesso!");
  } catch (error) {
    console.error("Erro ao popular itens:", error);
  }
};

export { seedItens };
