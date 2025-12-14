/* eslint-disable @typescript-eslint/no-unused-vars */

import { HttpStatus } from "@/shared/constants";
import { formatZodErroMessage, isZodError } from "../../shared/error/zod";
import { Request, NextFunction, Response } from "express";
import { ZodError } from "zod";
import { timeStamp } from "console";
import { formartErroPrisma, isPrismaError } from "@/shared/error/prisma";

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
    let statusCode: number;
    let message: string;

    if (isZodError(error)) {
      console.error("Erro quando cai no middleware", error)
      statusCode = HttpStatus.UnprocessableEntity;
      message = formatZodErroMessage(error as ZodError);
    }else if(isPrismaError(error)) {
      console.error("Erro quando cai no middleware", error)
      statusCode = formartErroPrisma(error).statusCode
      message = formartErroPrisma(error).message
    } else {
      console.error("Erro quando cai no middleware", error)
      const parsedError = this.parseError(error);
      statusCode = parsedError.status;
      message = parsedError.message;
    }

    res.status(statusCode).json({ message });
  };
}

export { ErrorHandlerMiddleware };
