import { passwordValidation } from "@/utils/zod/validations/password";
import { z } from "zod";
import { emailPatternValidation } from "./CreateUserDto";

const forgotPasswordSchema = z.object({
  email: emailPatternValidation,
});

const validateTokenSchema = z.object({
  email: emailPatternValidation,
  token: z.string(),
});

const resetPasswordSchema = z.object({
  email: emailPatternValidation,
  token: z.string(),
  newPassword: passwordValidation,
});

type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
type ValidateTokenDto = z.infer<typeof validateTokenSchema>;
type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;

export {
  forgotPasswordSchema,
  validateTokenSchema,
  resetPasswordSchema,
  ForgotPasswordDto,
  ValidateTokenDto,
  ResetPasswordDto,
};
