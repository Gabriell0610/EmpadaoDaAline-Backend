import { cepValidation } from "../../../utils/zod/validations/cep";
import { z } from "zod";

const addressBodySchema = z.object({
  street: z.string().min(1, "Rua é obrigatório"),
  zipCode: cepValidation,
  number: z.coerce
    .number()
    .min(1, "O número é obrigatório")
    .transform((value) => String(value)),
  neighborhood: z.string().min(1, "O Bairro é obrigatório"),
  city: z.string().min(1, "A Cidade é obrigatória"),
  state: z.string().min(2, "O Estado é obrigatório"),
  complement: z.string().optional().nullable(),
});

const updateAddressBodySchema = z.object({
  street: z.string().optional(),
  zipCode: cepValidation.optional(),
  numero: z.coerce
    .number()
    .transform((value) => String(value))
    .optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  complement: z.string().optional().nullable(),
});

type AddressDto = z.infer<typeof addressBodySchema>;
type AddressUpdateDto = z.infer<typeof updateAddressBodySchema>;

export { addressBodySchema, updateAddressBodySchema, AddressDto, AddressUpdateDto };
