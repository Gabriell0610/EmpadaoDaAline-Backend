import { InvalidErrorsMessages } from "../../../shared/error/invalid_errors";
import { z } from "zod";
import { isValidCEP } from "@brazilian-utils/brazilian-utils";

const cepRegex = /^[0-9]{8}$/;

export const cepValidation = z
  .string()
  .min(1, " O CEP é obrigatório")
  .refine(
    (value) => {
      return cepRegex.test(value) && isValidCEP(value);
    },
    () => ({ message: InvalidErrorsMessages.INVALID_CEP }),
  );
