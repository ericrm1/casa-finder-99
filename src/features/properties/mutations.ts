import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/format";
import type { PropertyStatus } from "@/types/property";

import type { PropertyFormValues } from "./schema";

const BUCKET = "property-images";
/** URLs assinadas de longa duração: o bucket é privado, mas as fotos são públicas no site. */
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 365 * 5;

function toRow(values: PropertyFormValues) {
  return {
    title: values.title,
    description: values.description,
    property_type: values.propertyType,
    transaction_type: values.transactionType,
    status: values.status,
    price: values.price,
    city: values.city,
    neighborhood: values.neighborhood,
    address: values.address,
    show_address: values.showAddress,
    zip_code: values.zipCode,
    land_area: values.landArea,
    built_area: values.builtArea,
    bedrooms: values.bedrooms,
    bathrooms: values.bathrooms,
    suites: values.suites,
    parking_spaces: values.parkingSpaces,
  };
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "imovel";
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const candidate = attempt === 0 ? root : `${root}-${attempt + 1}`;
    let query = supabase.from("properties").select("id").eq("slug", candidate);
    if (ignoreId) query = query.neq("id", ignoreId);
    const { data, error } = await query.maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return candidate;
  }
  return `${root}-${Date.now()}`;
}

export async function createProperty(values: PropertyFormValues): Promise<string> {
  const slug = await uniqueSlug(`${values.title}-${values.city}`);
  const { data, error } = await supabase
    .from("properties")
    .insert({ ...toRow(values), slug })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return (data as { id: string }).id;
}

export async function updateProperty(id: string, values: PropertyFormValues): Promise<void> {
  const slug = await uniqueSlug(`${values.title}-${values.city}`, id);
  const { error } = await supabase
    .from("properties")
    .update({ ...toRow(values), slug })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updatePropertyStatus(id: string, status: PropertyStatus): Promise<void> {
  const { error } = await supabase.from("properties").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteProperty(id: string): Promise<void> {
  const { data: images } = await supabase
    .from("properties")
    .select("property_images (path)")
    .eq("id", id)
    .maybeSingle();

  const paths = (
    ((images as { property_images?: { path: string }[] } | null)?.property_images ?? []) as {
      path: string;
    }[]
  )
    .map((image) => storageKeyFromUrl(image.path))
    .filter((key): key is string => key !== null);

  if (paths.length > 0) {
    await supabase.storage.from(BUCKET).remove(paths);
  }

  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Extrai a chave do objeto no storage a partir da URL assinada armazenada. */
export function storageKeyFromUrl(url: string): string | null {
  const marker = `/object/sign/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length).split("?")[0]!);
}

export async function uploadPropertyImage(
  propertyId: string,
  file: File,
  sortOrder: number,
  isPrimary: boolean,
): Promise<void> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const key = `${propertyId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(key, file, { contentType: file.type, upsert: false });
  if (uploadError) throw new Error(uploadError.message);

  const { data, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(key, SIGNED_URL_TTL_SECONDS);
  if (signError || !data) throw new Error(signError?.message ?? "Falha ao gerar URL da imagem");

  const { error } = await supabase.from("property_images").insert({
    property_id: propertyId,
    path: data.signedUrl,
    is_primary: isPrimary,
    sort_order: sortOrder,
  });
  if (error) throw new Error(error.message);
}

export async function deletePropertyImage(imageId: string, path: string): Promise<void> {
  const key = storageKeyFromUrl(path);
  if (key) await supabase.storage.from(BUCKET).remove([key]);
  const { error } = await supabase.from("property_images").delete().eq("id", imageId);
  if (error) throw new Error(error.message);
}

export async function setPrimaryImage(propertyId: string, imageId: string): Promise<void> {
  const { error: resetError } = await supabase
    .from("property_images")
    .update({ is_primary: false })
    .eq("property_id", propertyId);
  if (resetError) throw new Error(resetError.message);

  const { error } = await supabase
    .from("property_images")
    .update({ is_primary: true })
    .eq("id", imageId);
  if (error) throw new Error(error.message);
}

export interface LeadInput {
  propertyId: string | null;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function createLead(input: LeadInput): Promise<void> {
  const { error } = await supabase.from("leads").insert({
    property_id: input.propertyId,
    name: input.name,
    email: input.email,
    phone: input.phone,
    message: input.message,
  });
  if (error) throw new Error(error.message);
}
