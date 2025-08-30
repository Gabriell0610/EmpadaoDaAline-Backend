import { Prisma } from "@prisma/client"
import { HttpStatus } from "../constants";

export const isPrismaError = (error: Error) => {
    return error instanceof Prisma.PrismaClientKnownRequestError
}


export const formartErroPrisma = (error:Prisma.PrismaClientKnownRequestError ) => {
    let statusCode:number
    let message:string;
    switch (error.code) {
        case "P2002": // Unique constraint failed
          statusCode = HttpStatus.CONFLICT;
          message = "Violação de chave única, entre";
          break;

        case "P2025": // Record not found
          statusCode = HttpStatus.NOT_FOUND;
          message = "Registro não encontrado";
          break;

        default:
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          message = "Erro inesperado no servidor, entre em contato";
          break;
      }

      return {
        statusCode,
        message
      }
}