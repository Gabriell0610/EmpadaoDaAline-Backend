import { passwordValidation } from "../../../utils/zod/validations/password";
import { z } from "zod";
import { emailPatternValidation } from "./CreateUserDto";

const loginSchema = z.object({
  email: emailPatternValidation,
  password: passwordValidation,
});

type authDto = z.infer<typeof loginSchema>;

export { loginSchema, authDto };
