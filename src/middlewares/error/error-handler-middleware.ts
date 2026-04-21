/* eslint-disable @typescript-eslint/no-unused-vars */

import { HttpStatus } from "@/shared/constants";
import { formatZodErroMessage, isZodError } from "../../shared/error/zod";
import { ErrorRequestHandler } from "express";
import { formartErroPrisma, isPrismaError } from "@/shared/error/prisma";
import { ExternalServiceUnauthorizedException } from "@/shared/error/exceptions/unauthorizedInternal-exception";
import { createLogger } from "@/libs/logger";

export interface ZodResponseError {
  errors: {
    field: string;
    message: string;
  }[];
}

export interface PrismaResponseError {
  message: string;
  errors: {
    status: HttpStatus;
    message: string;
  };
}

class ErrorHandlerMiddleware {
  private logger = createLogger("error-handler");

  private parseError(error: Error) {
    const statusMap: Record<string, HttpStatus> = {
      BadRequestException: HttpStatus.BAD_REQUEST,
      InternalServerException: HttpStatus.INTERNAL_SERVER_ERROR,
      UnauthorizedException: HttpStatus.UNAUTHORIZED,
      UnprocessableException: HttpStatus.UnprocessableEntity,
      ConflitException: HttpStatus.CONFLICT,
      NotFoundException: HttpStatus.NOT_FOUND,
      ExternalServiceUnauthorizedException: HttpStatus.UNAUTHORIZED,
      ForbiddenException: HttpStatus.FORBIDDEN,
    };

    const defaultStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const status = statusMap[error?.name] || defaultStatus;

    return {
      status,
      message: error.message,
    };
  }

  handle: ErrorRequestHandler = (error, req, res, next) => {
    const requestData = {
      method: req.method,
      path: req.originalUrl,
      requestId: req.requestId,
    };

    if (isZodError(error)) {
      const formatted = formatZodErroMessage(error);
      this.logger.warn({ ...requestData, issues: formatted.errors.length }, "Request validation failed");
      res.status(HttpStatus.BAD_REQUEST).json({
        message: "Dados invalidos",
        errors: formatted.errors,
      });
      return;
    }

    if (isPrismaError(error)) {
      const prismaError = formartErroPrisma(error);
      this.logger.warn(
        { ...requestData, status: prismaError.errors.status, prismaCode: (error as { code?: string }).code },
        `${prismaError.message}`,
      );
      res.status(prismaError.errors.status).json({
        message: prismaError.message,
      });
      return;
    }

    const parsedError = this.parseError(error);

    if (error instanceof ExternalServiceUnauthorizedException) {
      this.logger.error({ ...requestData, err: error }, "External service authentication failure");
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Nao foi possivel seguir com a acao. Tente novamente mais tarde.",
      });
      return;
    }

    if (parsedError.status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({ ...requestData, err: error }, "Unhandled internal server error");
      res.status(parsedError.status).json({ message: "Erro inesperado no servidor. Entre contato com suporte" });
      return;
    }

    this.logger.warn(
      { ...requestData, status: parsedError.status, message: parsedError.message },
      "Handled business error",
    );
    res.status(parsedError.status).json({
      message: parsedError.message,
    });
  };
}

export { ErrorHandlerMiddleware };
