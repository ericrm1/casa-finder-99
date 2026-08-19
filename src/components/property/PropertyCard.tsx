import { Link } from "@tanstack/react-router";
import { Bath, BedDouble, ImageOff, MapPin, Maximize } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatArea, formatPrice } from "@/lib/format";
import {
  PROPERTY_TYPE_LABELS,
  TRANSACTION_TYPE_LABELS,
  hasRooms,
  primaryImage,
  type Property,
} from "@/types/property";

export function PropertyCard({ property }: { property: Property }) {
  const image = primaryImage(property);
  const rooms = hasRooms(property.propertyType);
  const area = property.builtArea ?? property.landArea;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-lifted)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {image ? (
          <img
            src={image.path}
            alt={property.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-8 w-8" aria-hidden />
          </div>
        )}
        <Badge className="absolute left-3 top-3">
          {TRANSACTION_TYPE_LABELS[property.transactionType]}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {PROPERTY_TYPE_LABELS[property.propertyType]}
          </span>
          <span className="text-xs text-muted-foreground">{property.publicCode}</span>
        </div>

        <h3 className="line-clamp-2 font-display text-lg leading-snug">{property.title}</h3>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" aria-hidden />
          {[property.neighborhood, property.city].filter(Boolean).join(", ")}
        </p>

        <ul className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {area ? (
            <li className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4" aria-hidden />
              {formatArea(area)}
            </li>
          ) : null}
          {rooms && property.bedrooms ? (
            <li className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4" aria-hidden />
              {property.bedrooms} quartos
            </li>
          ) : null}
          {rooms && property.bathrooms ? (
            <li className="flex items-center gap-1.5">
              <Bath className="h-4 w-4" aria-hidden />
              {property.bathrooms} banheiros
            </li>
          ) : null}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <p className="font-display text-xl font-semibold">
            {formatPrice(property.price)}
            {property.transactionType === "RENT" ? (
              <span className="text-sm font-normal text-muted-foreground">/mês</span>
            ) : null}
          </p>
          <Button asChild size="sm" variant="secondary">
            <Link to="/imoveis/$slug" params={{ slug: property.slug }}>
              Ver imóvel
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
