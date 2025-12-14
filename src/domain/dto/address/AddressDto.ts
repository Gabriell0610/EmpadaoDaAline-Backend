import { cepValidation } from "../../../utils/zod/validations/cep";
import { z } from "zod";

const addressBodySchema = z.object({
  street: z.string({ required_error: "A rua é obrigatória" }).min(4, "Rua deve ter no mínimpo 4 caracteres"),
  zipCode: cepValidation,
  number: z.coerce
    .number({ required_error: "O número é obrigatório" })
    .transform((value) => String(value)),
  neighborhood: z.string({ required_error: "O bairro é obrigatório" }),
  city: z.string({ required_error: "A cidade é obrigatória" }),
  state: z.string({ required_error: "O Estado é obrigatório" }).min(2, "O estado deve ter no mínimo dois caracteres"),
  complement: z.string().optional().nullable(),
});

const updateAddressBodySchema = z.object({
  street: z.string().optional(),
  zipCode: cepValidation.optional(),
  number: z.coerce
    .number()
    .transform((value) => String(value))
    .optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  complement: z.string().optional().nullable(),
})

type AddressDto = z.infer<typeof addressBodySchema>;
type AddressUpdateDto = z.infer<typeof updateAddressBodySchema>;

export { addressBodySchema, updateAddressBodySchema, AddressDto, AddressUpdateDto };
