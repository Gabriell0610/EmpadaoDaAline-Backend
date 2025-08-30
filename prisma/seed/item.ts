import { prisma } from "../../src/libs/prisma";
import { ItemSize, statusItem, TypeItem } from "@prisma/client"; // ajuste o path se necessário

// const itensDto = {
//   itens: [
//     {
//       preco: 30.0,
//       tamanho: "P",
//     },
//     {
//       preco: 40.0,
//       tamanho: "M",
//     },
//     {
//       preco: 50.0,
//       tamanho: "G",
//     },
//     {
//       preco: 60.0,
//       tamanho: "GG",
//     },

//     //Calabresa
//     {
//       preco: 30.0,
//       tamanho: "P",
//     },
//     {
//       preco: 40.0,
//       tamanho: "M",
//     },
//     {
//       preco: 50.0,
//       tamanho: "G",
//     },
//     {
//       preco: 60.0,
//       tamanho: "GG",
//     },

//     // Palmito
//     {
//       preco: 35.0,
//       tamanho: "P",
//     },
//     {
//       preco: 45.0,
//       tamanho: "M",
//     },
//     {
//       preco: 65.0,
//       tamanho: "G",
//     },
//     {
//       preco: 85.0,
//       tamanho: "GG",
//     },

//     // // Sabores especiais
//     // {
//     //   nome: "Empadão de Camarão",
//     //   preco: 35.0,
//     //   tamanho: "P",
//     //   descricao: "Camarão bem temperado com toque cremoso e sabor do mar!",
//     // },
//     // {
//     //   nome: "Empadão de Camarão",
//     //   preco: 45.0,
//     //   tamanho: "M",
//     //   descricao: "Camarão bem temperado com toque cremoso e sabor do mar!",
//     // },
//     // {
//     //   nome: "Empadão de Camarão",
//     //   preco: 65.0,
//     //   tamanho: "G",
//     //   descricao: "Camarão bem temperado com toque cremoso e sabor do mar!",
//     // },
//     // {
//     //   nome: "Empadão de Camarão",
//     //   preco: 85.0,
//     //   tamanho: "GG",
//     //   descricao: "Camarão bem temperado com toque cremoso e sabor do mar!",
//     // },
//     // {
//     //   nome: "Empadão de Carne Seca",
//     //   preco: 35.0,
//     //   tamanho: "P",
//     //   descricao: "Carne seca desfiada com sabor caseiro e massa macia.",
//     // },
//     // {
//     //   nome: "Empadão de Carne Seca",
//     //   preco: 45.0,
//     //   tamanho: "M",
//     //   descricao: "Carne seca desfiada com sabor caseiro e massa macia.",
//     // },
//     // {
//     //   nome: "Empadão de Carne Seca",
//     //   preco: 65.0,
//     //   tamanho: "G",
//     //   descricao: "Carne seca desfiada com sabor caseiro e massa macia.",
//     // },
//     // {
//     //   nome: "Empadão de Carne Seca",
//     //   preco: 85.0,
//     //   tamanho: "GG",
//     //   descricao: "Carne seca desfiada com sabor caseiro e massa macia.",
//     // },
//     // {
//     //   nome: "Empadão de Frango Caipira",
//     //   preco: 35.0,
//     //   tamanho: "P",
//     //   descricao: "Frango caipira com tempero da roça e sabor irresistível!",
//     // },
//     // {
//     //   nome: "Empadão de Frango Caipira",
//     //   preco: 45.0,
//     //   tamanho: "M",
//     //   descricao: "Frango caipira com tempero da roça e sabor irresistível!",
//     // },
//     // {
//     //   nome: "Empadão de Frango Caipira",
//     //   preco: 65.0,
//     //   tamanho: "G",
//     //   descricao: "Frango caipira com tempero da roça e sabor irresistível!",
//     // },
//     // {
//     //   nome: "Empadão de Frango Caipira",
//     //   preco: 85.0,
//     //   tamanho: "GG",
//     //   descricao: "Frango caipira com tempero da roça e sabor irresistível!",
//     // },
//     // {
//     //   nome: "Empadão de Ricota com Espinafre",
//     //   preco: 35.0,
//     //   tamanho: "P",
//     //   descricao: "Recheio leve e saudável de ricota com espinafre temperado.",
//     // },
//     // {
//     //   nome: "Empadão de Ricota com Espinafre",
//     //   preco: 45.0,
//     //   tamanho: "M",
//     //   descricao: "Recheio leve e saudável de ricota com espinafre temperado.",
//     // },
//     // {
//     //   nome: "Empadão de Ricota com Espinafre",
//     //   preco: 65.0,
//     //   tamanho: "G",
//     //   descricao: "Recheio leve e saudável de ricota com espinafre temperado.",
//     // },
//     // {
//     //   nome: "Empadão de Ricota com Espinafre",
//     //   preco: 85.0,
//     //   tamanho: "GG",
//     //   descricao: "Recheio leve e saudável de ricota com espinafre temperado.",
//     // },
//   ],
// };

const itemDescriptionDto = [
  {
    nome: "Empadão de Frango",
    descricao: "Empadão de frango cremoso, massa crocante e muito recheio!",
    itens: [
      { preco: 30.0, unidades: null, tamanho: "P" },
      { preco: 40.0, unidades: null, tamanho: "M" },
      { preco: 50.0, unidades: null, tamanho: "G" },
      { preco: 60.0, unidades: null, tamanho: "GG" },
    ],
    tipoItem: TypeItem.EMPADAO
  },
  {
    nome: "Empadão de Calabresa",
    descricao: "Recheio suculento de calabresa com tempero caseiro e sabor marcante!",
    itens: [
      { preco: 30.0, unidades: null, tamanho: "P" },
      { preco: 40.0, unidades: null, tamanho: "M" },
      { preco: 50.0, unidades: null, tamanho: "G" },
      { preco: 60.0, unidades: null, tamanho: "GG" },
    ],
    tipoItem: TypeItem.EMPADAO
  },
  {
    nome: "Empadão de Palmito",
    descricao: "Palmito selecionado e cremoso em massa crocante e dourada.",
    itens: [
      { preco: 35.0, unidades: null, tamanho: "P" },
      { preco: 45.0, unidades: null, tamanho: "M" },
      { preco: 65.0, unidades: null, tamanho: "G" },
      { preco: 85.0, unidades: null, tamanho: "GG" },
    ],
    tipoItem: TypeItem.EMPADAO
  },
  {
    nome: "Panqueca de Carne Moída",
    descricao: "Carne moída temperada em massa crocante e dourada.",
    itens: [
      { preco: 40.0, unidades: 6, tamanho: null  },
    ],
    tipoItem: TypeItem.PANQUECA
  },
  {
    nome: "Panqueca de Frango",
    descricao: "Frango desfiado e suculento em massa crocante e dourada",
    itens: [
      { preco: 40.0, unidades: 6, tamanho: null },
    ],
     tipoItem: TypeItem.PANQUECA
  },
  {
    nome: "Panqueca de Camarão",
    descricao: "Camarão fresco e macio em massa crocante e dourada.",
    itens: [
      { preco: 50.0, unidades: 6, tamanho: null  },
    ],
     tipoItem: TypeItem.PANQUECA
  },
  {
    nome: "Panqueca de Queijo e Presunto",
    descricao: "Queijo derretido e presunto em massa crocante e dourada",
    itens: [
      { preco: 40.0, unidades: 6, tamanho: null },
    ],
     tipoItem: TypeItem.PANQUECA
  },
  {
    nome: "Almondêga De Carne",
    descricao: "Almondêga de carne suculenta peparado de forma caseira",
    itens: [
      { preco: 40.0, unidades: 12, tamanho: null },
    ],
     tipoItem: TypeItem.ALMONDEGA
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
          disponivel: statusItem.ATIVO,
          dataCriacao: new Date(),
          dataAtualizacao: new Date(),
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
            dataAtualizacao: new Date(),
            itemDescriptionId: id,
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
