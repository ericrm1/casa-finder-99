import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Property, PropertyImage, PropertyStatus } from "@/types/property";

import { PAGE_SIZE, type PropertyFilters } from "./filters";

const PROPERTY_SELECT =
  "id, public_code, slug, title, description, property_type, transaction_type, status, price, city, neighborhood, address, show_address, zip_code, land_area, built_area, bedrooms, bathrooms, suites, parking_spaces, created_at, updated_at, property_images (id, property_id, path, is_primary, sort_order)";

interface PropertyImageRow {
  id: string;
  property_id: string;
  path: string;
  is_primary: boolean;
  sort_order: number;
}

interface PropertyRow {
  id: string;
  public_code: string;
  slug: string;
  title: string;
  description: string;
  property_type: Property["propertyType"];
  transaction_type: Property["transactionType"];
  status: PropertyStatus;
  price: number | string;
  city: string;
  neighborhood: string;
  address: string | null;
  show_address: boolean;
  zip_code: string | null;
  land_area: number | string | null;
  built_area: number | string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  suites: number | null;
  parking_spaces: number | null;
  created_at: string;
  updated_at: string;
  property_images: PropertyImageRow[] | null;
}

function toNumber(value: number | string | null): number | null {
  if (value === null) return null;
  return typeof value === "number" ? value : Number(value);
}

function mapImage(row: PropertyImageRow): PropertyImage {
  return {
    id: row.id,
    propertyId: row.property_id,
    path: row.path,
    isPrimary: row.is_primary,
    sortOrder: row.sort_order,
  };
}

export function mapProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    publicCode: row.public_code,
    slug: row.slug,
    title: row.title,
    description: row.description,
    propertyType: row.property_type,
    transactionType: row.transaction_type,
    status: row.status,
    price: toNumber(row.price) ?? 0,
    city: row.city,
    neighborhood: row.neighborhood,
    address: row.address,
    showAddress: row.show_address,
    zipCode: row.zip_code,
    landArea: toNumber(row.land_area),
    builtArea: toNumber(row.built_area),
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    suites: row.suites,
    parkingSpaces: row.parking_spaces,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    images: (row.property_images ?? [])
      .map(mapImage)
      .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder),
  };
}

export interface PropertySearchResult {
  properties: Property[];
  total: number;
}

async function fetchPublicProperties(filters: PropertyFilters): Promise<PropertySearchResult> {
  let query = supabase
    .from("properties")
    .select(PROPERTY_SELECT, { count: "exact" })
    .eq("status", "PUBLISHED");

  if (filters.finalidade) query = query.eq("transaction_type", filters.finalidade);
  if (filters.tipo) query = query.eq("property_type", filters.tipo);
  if (filters.cidade) query = query.ilike("city", `%${filters.cidade}%`);
  if (filters.bairro) query = query.ilike("neighborhood", `%${filters.bairro}%`);
  if (filters.precoMin !== undefined) query = query.gte("price", filters.precoMin);
  if (filters.precoMax !== undefined) query = query.lte("price", filters.precoMax);
  if (filters.quartos !== undefined) query = query.gte("bedrooms", filters.quartos);
  if (filters.banheiros !== undefined) query = query.gte("bathrooms", filters.banheiros);
  if (filters.suites !== undefined) query = query.gte("suites", filters.suites);
  if (filters.vagas !== undefined) query = query.gte("parking_spaces", filters.vagas);
  if (filters.areaMin !== undefined) query = query.gte("land_area", filters.areaMin);
  if (filters.areaMax !== undefined) query = query.lte("land_area", filters.areaMax);
  if (filters.busca) {
    const term = filters.busca.replace(/[%,]/g, " ");
    query = query.or(
      `title.ilike.%${term}%,description.ilike.%${term}%,city.ilike.%${term}%,neighborhood.ilike.%${term}%,public_code.ilike.%${term}%`,
    );
  }

  switch (filters.ordenar) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const page = filters.pagina ?? 1;
  const from = (page - 1) * PAGE_SIZE;
  query = query.range(from, from + PAGE_SIZE - 1);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    properties: ((data ?? []) as unknown as PropertyRow[]).map(mapProperty),
    total: count ?? 0,
  };
}

export function publicPropertiesQuery(filters: PropertyFilters) {
  return queryOptions({
    queryKey: ["properties", "public", filters],
    queryFn: () => fetchPublicProperties(filters),
  });
}

export function featuredPropertiesQuery() {
  return queryOptions({
    queryKey: ["properties", "featured"],
    queryFn: async (): Promise<Property[]> => {
      const { data, error } = await supabase
        .from("properties")
        .select(PROPERTY_SELECT)
        .eq("status", "PUBLISHED")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw new Error(error.message);
      return ((data ?? []) as unknown as PropertyRow[]).map(mapProperty);
    },
  });
}

export function propertyBySlugQuery(slug: string) {
  return queryOptions({
    queryKey: ["properties", "slug", slug],
    queryFn: async (): Promise<Property | null> => {
      const { data, error } = await supabase
        .from("properties")
        .select(PROPERTY_SELECT)
        .eq("slug", slug)
        .eq("status", "PUBLISHED")
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? mapProperty(data as unknown as PropertyRow) : null;
    },
  });
}

/** Cidades distintas dos imóveis publicados, usadas nos filtros. */
export function citiesQuery() {
  return queryOptions({
    queryKey: ["properties", "cities"],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from("properties")
        .select("city")
        .eq("status", "PUBLISHED");
      if (error) throw new Error(error.message);
      const cities = new Set((data ?? []).map((row) => (row as { city: string }).city));
      return [...cities].sort((a, b) => a.localeCompare(b, "pt-BR"));
    },
  });
}

/* ---------- Área administrativa (RLS exige papel de administrador) ---------- */

export function adminPropertiesQuery() {
  return queryOptions({
    queryKey: ["properties", "admin", "list"],
    queryFn: async (): Promise<Property[]> => {
      const { data, error } = await supabase
        .from("properties")
        .select(PROPERTY_SELECT)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return ((data ?? []) as unknown as PropertyRow[]).map(mapProperty);
    },
  });
}

export function adminPropertyQuery(id: string) {
  return queryOptions({
    queryKey: ["properties", "admin", id],
    queryFn: async (): Promise<Property | null> => {
      const { data, error } = await supabase
        .from("properties")
        .select(PROPERTY_SELECT)
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? mapProperty(data as unknown as PropertyRow) : null;
    },
  });
}
