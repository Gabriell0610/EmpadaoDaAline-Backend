/* eslint-disable @typescript-eslint/no-unused-vars */

import { HttpStatus } from "@/shared/constants";
import { formatZodErroMessage, isZodError } from "../../shared/error/zod";
import { Request, NextFunction, Response } from "express";
import { ZodError } from "zod";
import { timeStamp } from "console";
import { formartErroPrisma, isPrismaError } from "@/shared/error/prisma";

export interface ZodResponseError {
  errors: {
    field: string;
    message: string
  }[]
}

export interface PrismaResponseError {
   message: string,
   errors: {
    status: HttpStatus,
    message: string
   }
}
class ErrorHandlerMiddleware {
  private parseError(error: Error) {
    const statusMap: Record<string, HttpStatus> = {
      BadRequestException: HttpStatus.BAD_REQUEST,
      InternalServerException: HttpStatus.INTERNAL_SERVER_ERROR,
      UnauthorizedException: HttpStatus.UNAUTHORIZED,
      UnprocessableException: HttpStatus.UnprocessableEntity,
      ConflitException: HttpStatus.CONFLICT,
      NotFoundException: HttpStatus.NOT_FOUND
    };

    const defaultStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const status = statusMap[error?.name] || defaultStatus;

    return {
      status,
      message: error.message,
    };
  }
  handle = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Erro quando cai no middleware", error)
    
    if (isZodError(error)) {
      const formatted = formatZodErroMessage(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Dados inválidos",
        errors: formatted.errors
      });
    }

    if (isPrismaError(error)) {
      const prismaError = formartErroPrisma(error);
      return res.status(prismaError.errors.status).json({
        message: prismaError.message
      });
    }

    const parsedError = this.parseError(error);

    if(parsedError.status === HttpStatus.INTERNAL_SERVER_ERROR) {
      return res.status(parsedError.status).json({message:"Erro inesperado no servidor. Entre contato com suporte"})
    }

    return res.status(parsedError.status).json({
      message: parsedError.message,
    });

  };
}

export { ErrorHandlerMiddleware };
