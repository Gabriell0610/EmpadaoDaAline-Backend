import { z } from "zod";

export const cellphoneValidaton = z
  .string({ required_error: "O celular é obrigatório" })
  .max(11, "O celular possui menos de 11 caracteres")
