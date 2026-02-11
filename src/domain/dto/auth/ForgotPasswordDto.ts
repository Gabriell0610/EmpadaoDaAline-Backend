import { passwordValidation } from "@/utils/zod/validations/password";
import { z } from "zod";

import { extendZodWithOpenApi } from "zod-openapi";
import { emailPatternValidation } from "./CreateUserDto";

extendZodWithOpenApi(z)

const forgotPasswordSchema = z.object({
  email: emailPatternValidation,
  newPassword: passwordValidation.optional(),
  token: z.string().optional(),
});

type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

export { forgotPasswordSchema, ForgotPasswordDto };
