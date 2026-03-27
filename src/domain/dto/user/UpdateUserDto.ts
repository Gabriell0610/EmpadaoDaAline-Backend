import { cellphoneValidaton } from "@/utils/zod/validations/cellphone";
import { z } from "zod";

const updateUserBodySchema = z.object({
  name: z.string().optional(),
  cellphone: cellphoneValidaton.optional(),
  email: z.string().email("Email escrito de forma errada").optional(),
});

type UpdateUserDto = z.infer<typeof updateUserBodySchema>;

export { updateUserBodySchema, UpdateUserDto };
