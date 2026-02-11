import { AccessProfile } from "../../../shared/constants/accessProfile";
import { z } from "zod";
import { passwordValidation } from "@/utils/zod/validations/password";
import { cellphoneValidaton } from "@/utils/zod/validations/cellphone";

import { extendZodWithOpenApi } from "zod-openapi";

extendZodWithOpenApi(z)

export const emailPatternValidation = z.string({ required_error: "O email é obrigatório" }).email("Email escrito de forma errada")

//SCHEMAS
const CreateUserBodySchema = z.object({
  name: z.string({ required_error: "O Nome é obrigatório" }).min(4, "O nome deve ter no mínimo 4 caracteres"),
  email: emailPatternValidation,
  password: passwordValidation,
  cellphone: cellphoneValidaton,
  role: z.nativeEnum(AccessProfile).default(AccessProfile.CLIENT),
});

type CreateUserDto = z.infer<typeof CreateUserBodySchema>;

export { CreateUserDto, CreateUserBodySchema };
