import { z } from "zod";

import { PROPERTY_STATUSES, PROPERTY_TYPES, TRANSACTION_TYPES } from "@/types/property";

const optionalInt = z
  .union([z.coerce.number().int().min(0).max(999), z.literal("")])
  .optional()
  .transform((value) => (value === "" || value === undefined ? null : Number(value)));

const optionalArea = z
  .union([z.coerce.number().min(0).max(100000000), z.literal("")])
  .optional()
  .transform((value) => (value === "" || value === undefined ? null : Number(value)));

const optionalText = z
  .string()
  .trim()
  .max(200)
  .optional()
  .transform((value) => (value ? value : null));

export const propertyFormSchema = z.object({
  title: z.string().trim().min(5, "Informe um título com pelo menos 5 caracteres").max(140),
  description: z.string().trim().min(20, "Descreva o imóvel com pelo menos 20 caracteres").max(4000),
  propertyType: z.enum(PROPERTY_TYPES),
  transactionType: z.enum(TRANSACTION_TYPES),
  status: z.enum(PROPERTY_STATUSES),
  price: z.coerce.number({ invalid_type_error: "Informe um preço" }).min(1, "Informe um preço válido"),
  city: z.string().trim().min(2, "Informe a cidade").max(80),
  neighborhood: z.string().trim().max(80).default(""),
  address: optionalText,
  showAddress: z.boolean().default(false),
  zipCode: z
    .string()
    .trim()
    .max(9)
    .optional()
    .transform((value) => (value ? value : null)),
  landArea: optionalArea,
  builtArea: optionalArea,
  bedrooms: optionalInt,
  bathrooms: optionalInt,
  suites: optionalInt,
  parkingSpaces: optionalInt,
});

export type PropertyFormInput = z.input<typeof propertyFormSchema>;
export type PropertyFormValues = z.output<typeof propertyFormSchema>;

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  email: z.string().trim().email("Informe um e-mail válido").max(255),
  phone: z.string().trim().min(8, "Informe um telefone válido").max(20),
  message: z.string().trim().min(10, "Escreva uma mensagem").max(1000),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGES_PER_PROPERTY = 12;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return "Formato inválido. Use JPG, PNG ou WEBP.";
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "Imagem muito grande. O limite é 5 MB.";
  }
  return null;
}
