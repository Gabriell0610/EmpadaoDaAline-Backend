import { passwordValidation } from "../../../utils/zod/validations/password";
import { z } from "zod";
import { extendZodWithOpenApi } from "zod-openapi";
import { emailPatternValidation } from "./CreateUserDto";

extendZodWithOpenApi(z)

const loginSchema = z.object({
  email: emailPatternValidation,
  password: passwordValidation,
});

type authDto = z.infer<typeof loginSchema>;

export { loginSchema, authDto };
