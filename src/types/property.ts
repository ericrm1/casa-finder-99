export const PROPERTY_TYPES = [
  "HOUSE",
  "APARTMENT",
  "LAND",
  "LOT",
  "FARM",
  "FARMHOUSE",
  "COMMERCIAL_ROOM",
  "WAREHOUSE",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const TRANSACTION_TYPES = ["SALE", "RENT"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const PROPERTY_STATUSES = ["DRAFT", "PUBLISHED", "SOLD", "RENTED", "UNAVAILABLE"] as const;
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  HOUSE: "Casa",
  APARTMENT: "Apartamento",
  LAND: "Terreno",
  LOT: "Lote",
  FARM: "Fazenda",
  FARMHOUSE: "Chácara",
  COMMERCIAL_ROOM: "Sala comercial",
  WAREHOUSE: "Galpão",
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  SALE: "Venda",
  RENT: "Aluguel",
};

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicado",
  SOLD: "Vendido",
  RENTED: "Alugado",
  UNAVAILABLE: "Indisponível",
};

/** Tipos sem cômodos: não exibimos quartos/banheiros/suítes para eles. */
const TYPES_WITHOUT_ROOMS: readonly PropertyType[] = ["LAND", "LOT"];

export function hasRooms(type: PropertyType): boolean {
  return !TYPES_WITHOUT_ROOMS.includes(type);
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  path: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Property {
  id: string;
  publicCode: string;
  slug: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
  status: PropertyStatus;
  price: number;
  city: string;
  neighborhood: string;
  address: string | null;
  showAddress: boolean;
  zipCode: string | null;
  landArea: number | null;
  builtArea: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  suites: number | null;
  parkingSpaces: number | null;
  createdAt: string;
  updatedAt: string;
  images: PropertyImage[];
}

export function primaryImage(property: Property): PropertyImage | null {
  return property.images.find((image) => image.isPrimary) ?? property.images[0] ?? null;
}
