import { z } from "zod";

import { PROPERTY_TYPES, TRANSACTION_TYPES } from "@/types/property";

export const SORT_OPTIONS = ["recent", "price_asc", "price_desc"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export const SORT_LABELS: Record<SortOption, string> = {
  recent: "Mais recentes",
  price_asc: "Menor preço",
  price_desc: "Maior preço",
};

const optionalNumber = z.coerce.number().nonnegative().optional().catch(undefined);

export const propertyFiltersSchema = z.object({
  finalidade: z.enum(TRANSACTION_TYPES).optional().catch(undefined),
  tipo: z.enum(PROPERTY_TYPES).optional().catch(undefined),
  cidade: z.string().trim().max(80).optional().catch(undefined),
  bairro: z.string().trim().max(80).optional().catch(undefined),
  precoMin: optionalNumber,
  precoMax: optionalNumber,
  quartos: optionalNumber,
  banheiros: optionalNumber,
  suites: optionalNumber,
  vagas: optionalNumber,
  areaMin: optionalNumber,
  areaMax: optionalNumber,
  busca: z.string().trim().max(120).optional().catch(undefined),
  ordenar: z.enum(SORT_OPTIONS).optional().catch(undefined),
  pagina: z.coerce.number().int().min(1).optional().catch(undefined),
});

export type PropertyFilters = z.infer<typeof propertyFiltersSchema>;

export const PAGE_SIZE = 9;

export function hasActiveFilters(filters: PropertyFilters): boolean {
  return Object.entries(filters).some(
    ([key, value]) =>
      key !== "pagina" && key !== "ordenar" && value !== undefined && value !== "",
  );
}

/** Remove chaves vazias para manter a URL limpa e compartilhável. */
export function cleanFilters(filters: PropertyFilters): PropertyFilters {
  const entries = Object.entries(filters).filter(
    ([, value]) => value !== undefined && value !== "" && !Number.isNaN(value as number),
  );
  return Object.fromEntries(entries) as PropertyFilters;
}
