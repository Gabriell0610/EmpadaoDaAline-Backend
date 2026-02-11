import { prisma } from "../../src/libs/prisma"

const payments = [
    {nome: "PIX"},
    {nome: "CARTAO DEBITO"},
    {nome: "CARTAO CREDITO"},
    {nome: "DINHEIRO"},
]


export const seedPayments = async () => {

    try {
        const methodPayment = await prisma.metodoPagamento.count();
    
        if(methodPayment > 0) {
            return
        }
        
        for(const method of payments) {
            await prisma.metodoPagamento.create({
                data: {
                    nome: method.nome
                }
            })
        }
        console.log("Metodo de pagamento populado")
    } catch (error) {
        console.log("Erro ao popular metodo de pagamento", error)
    }
}