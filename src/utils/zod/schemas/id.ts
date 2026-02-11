import { z } from "zod";

const uuidSchema = z.object({
  id: z.string(),
});

type uuidDto = z.infer<typeof uuidSchema>

export { uuidSchema,uuidDto };
