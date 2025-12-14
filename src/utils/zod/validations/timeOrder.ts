import { z } from "zod";

export const startAndEndTimeValidation = z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Formato deve ser HH:mm");
