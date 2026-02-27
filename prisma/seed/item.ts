import { prisma } from "../../src/libs/prisma";
import { ItemSize, StatusItem, TypeItem } from "@prisma/client"; // ajuste o path se necessário

const itemDescriptionDto = [
  {
    nome: "Empadão de Frango",
    descricao: "Delicioso empadão de frango cremoso, massa crocante e muito recheio!",
    itens: [
      { preco: 30.0, unidades: null, tamanho: "P", precoUnitario: null },
      { preco: 40.0, unidades: null, tamanho: "M", precoUnitario: null },
      { preco: 50.0, unidades: null, tamanho: "G", precoUnitario: null },
      { preco: 60.0, unidades: null, tamanho: "GG", precoUnitario: null },
    ],
    tipoItem: TypeItem.EMPADAO,
  },
  {
    nome: "Empadão de Calabresa",
    descricao: "Recheio suculento de calabresa com tempero caseiro e sabor marcante!",
    itens: [
      { preco: 30.0, unidades: null, tamanho: "P", precoUnitario: null },
      { preco: 40.0, unidades: null, tamanho: "M", precoUnitario: null },
      { preco: 50.0, unidades: null, tamanho: "G", precoUnitario: null },
      { preco: 60.0, unidades: null, tamanho: "GG", precoUnitario: null },
    ],
    tipoItem: TypeItem.EMPADAO,
  },
  {
    nome: "Empadão de Palmito",
    descricao: "Palmito selecionado e cremoso em massa crocante e dourada.",
    itens: [
      { preco: 35.0, unidades: null, tamanho: "P", precoUnitario: null },
      { preco: 45.0, unidades: null, tamanho: "M", precoUnitario: null },
      { preco: 65.0, unidades: null, tamanho: "G", precoUnitario: null },
      { preco: 85.0, unidades: null, tamanho: "GG", precoUnitario: null },
    ],
    tipoItem: TypeItem.EMPADAO,
  },
  {
    nome: "Panqueca de Carne Moída",
    descricao: "Carne moída temperada em massa crocante e dourada.",
    itens: [{ precoUnitario: 6.67, unidades: 6, tamanho: null, preco: 40.02 }],
    tipoItem: TypeItem.PANQUECA,
  },
  {
    nome: "Panqueca de Frango",
    descricao: "Frango desfiado e suculento em massa crocante e dourada",
    itens: [{ precoUnitario: 6.67, unidades: 6, tamanho: null, preco: 40.02 }],
    tipoItem: TypeItem.PANQUECA,
  },
  {
    nome: "Panqueca de Camarão",
    descricao: "Camarão fresco e macio em massa crocante e dourada.",
    itens: [{ precoUnitario: 8.4, unidades: 6, tamanho: null, preco: 50.0 }],
    tipoItem: TypeItem.PANQUECA,
  },
  {
    nome: "Panqueca de Queijo e Presunto",
    descricao: "Queijo derretido e presunto em massa crocante e dourada",
    itens: [{ precoUnitario: 6.67, unidades: 6, tamanho: null, preco: 40.0 }],
    tipoItem: TypeItem.PANQUECA,
  },
  {
    nome: "Almôndega De Carne",
    descricao: "Almôndega de carne suculenta preparado de forma caseira",
    itens: [{ precoUnitario: 3.4, unidades: 12, tamanho: null, preco: 40.0 }],
    tipoItem: TypeItem.ALMONDEGA,
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
          image: "",
          tipo: desc.tipoItem,
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
