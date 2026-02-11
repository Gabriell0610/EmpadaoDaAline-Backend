import { cellphoneValidaton } from "@/utils/zod/validations/cellphone";
import { passwordValidation } from "@/utils/zod/validations/password";
import { z } from "zod";


const updateUserBodySchema = z.object({
  name: z.string().optional(),
  cellphone: cellphoneValidaton.optional(),
  password: passwordValidation.optional(),
});

type UpdateUserDto = z.infer<typeof updateUserBodySchema>;

export { updateUserBodySchema, UpdateUserDto };
