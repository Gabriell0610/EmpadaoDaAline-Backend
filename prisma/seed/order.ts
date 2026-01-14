// import { AccessProfile } from "../../src/shared/constants/accessProfile";
// import { prisma } from "../../src/libs/prisma";
// import { StatusCart, StatusOrder } from "@prisma/client";

// const STATUS_PEDIDOS = [
//   StatusOrder.PENDENTE,
//   StatusOrder.ACEITO,
//   StatusOrder.PREPARANDO,
//   StatusOrder.ENTREGUE,
// ];

// const seedCarrinhoPedido = async () => {
//   try {
//     /* =========================
//        USUÁRIO CLIENTE
//     ========================= */
//     const usuario = await prisma.usuario.findFirst({
//       where: {
//         role: AccessProfile.CLIENT,
//       },
//       include: {
//         enderecos: {
//           include: {
//             endereco: true,
//           },
//         },
//       },
//     });

//     if (!usuario) {
//       console.log("Nenhum usuário CLIENT encontrado");
//       return;
//     }

//     const endereco = usuario.enderecos[0]?.endereco;
//     if (!endereco) {
//       console.log("Usuário não possui endereço");
//       return;
//     }

//     /* =========================
//        ITENS EXISTENTES
//     ========================= */
//     const itens = await prisma.item.findMany({
//       take: 2,
//     });

//     if (itens.length === 0) {
//       console.log("Nenhum item encontrado");
//       return;
//     }

//     /* =========================
//        MÉTODO DE PAGAMENTO
//     ========================= */
//     const metodoPagamento = await prisma.metodoPagamento.create({
//       data: {
//         nome: 'PIX'
//       }
//     });

//     /* =========================
//        CARRINHO
//     ========================= */
//     const carrinho = await prisma.carrinho.create({
//       data: {
//         status: StatusCart.ATIVO,
//         usuarioId: usuario.id,
//         valorTotal: 0,
//       },
//     });

//     let valorTotal = 0;

//     /* =========================
//        CARRINHO ITENS
//     ========================= */
//     for (const item of itens) {
//       const quantidade = 2;
//       const preco = item.preco;

//       valorTotal += Number(preco) * quantidade;

//       await prisma.carrinhoItens.create({
//         data: {
//           carrinhoId: carrinho.id,
//           itemId: item.id,
//           quantidade,
//           precoAtual: preco,
//         },
//       });
//     }

//     /* =========================
//        ATUALIZA TOTAL
//     ========================= */
//     await prisma.carrinho.update({
//       where: { id: carrinho.id },
//       data: {
//         valorTotal,
//         status: StatusCart.FINALIZADO,
//       },
//     });

//     /* =========================
//        PEDIDO
//     ========================= */
//     const ultimoPedido = await prisma.pedido.findFirst({
//       orderBy: { numeroPedido: "desc" },
//     });

//     let numeroPedidoAtual = ultimoPedido ? ultimoPedido.numeroPedido + 1 : 1;

//     for (const status of STATUS_PEDIDOS) {
//       const carrinho = await prisma.carrinho.create({
//         data: {
//           status: StatusCart.ATIVO,
//           usuarioId: usuario.id,
//           valorTotal: 0,
//         },
//       });

//       let valorTotal = 0;

//       for (const item of itens) {
//         const quantidade = 2;
//         valorTotal += Number(item.preco) * quantidade;

//         await prisma.carrinhoItens.create({
//           data: {
//             carrinhoId: carrinho.id,
//             itemId: item.id,
//             quantidade,
//             precoAtual: item.preco,
//           },
//         });
//       }

//       await prisma.carrinho.update({
//         where: { id: carrinho.id },
//         data: {
//           valorTotal,
//           status: StatusCart.FINALIZADO,
//         },
//       });

//       await prisma.pedido.create({
//         data: {
//           numeroPedido: numeroPedidoAtual,
//           status,
//           precoTotal: valorTotal,
//           frete: 10,
//           dataAgendamento: new Date(),
//           usuarioId: usuario.id,
//           enderecoId: endereco.id,
//           carrinhoId: carrinho.id,
//           metodoPagamentoId: metodoPagamento.id,
//           horarioInicio: "19:00",
//           horarioFim: "20:00",
//         },
//       });

//         numeroPedidoAtual++;
//     }


//     console.log("4 pedidos criados com status diferentes com sucesso!");

//     console.log("Carrinho e Pedido populados com sucesso!");
//   } catch (error) {
//     console.error("Erro ao popular carrinho/pedido:", error);
//   }
// };

// export { seedCarrinhoPedido };
