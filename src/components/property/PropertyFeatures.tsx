import { Bath, BedDouble, Car, Maximize, Ruler, ShowerHead } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { formatArea } from "@/lib/format";
import { hasRooms, type Property } from "@/types/property";

interface Feature {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function buildFeatures(property: Property): Feature[] {
  const features: Feature[] = [];
  const rooms = hasRooms(property.propertyType);

  if (property.landArea)
    features.push({ icon: Maximize, label: "Terreno", value: formatArea(property.landArea) });
  if (property.builtArea)
    features.push({ icon: Ruler, label: "Área construída", value: formatArea(property.builtArea) });
  if (rooms && property.bedrooms)
    features.push({ icon: BedDouble, label: "Quartos", value: String(property.bedrooms) });
  if (rooms && property.bathrooms)
    features.push({ icon: Bath, label: "Banheiros", value: String(property.bathrooms) });
  if (rooms && property.suites)
    features.push({ icon: ShowerHead, label: "Suítes", value: String(property.suites) });
  if (property.parkingSpaces)
    features.push({ icon: Car, label: "Vagas", value: String(property.parkingSpaces) });

  return features;
}

export function PropertyFeatures({ property }: { property: Property }) {
  const features = buildFeatures(property);
  if (features.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {features.map((feature) => (
        <div
          key={feature.label}
          className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
        >
          <dt className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <feature.icon className="h-4 w-4 text-primary" aria-hidden />
            {feature.label}
          </dt>
          <dd className="mt-2 text-lg font-semibold">{feature.value}</dd>
        </div>
      ))}
    </dl>
  );
}
