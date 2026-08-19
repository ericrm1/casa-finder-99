import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ContactButton } from "@/components/property/ContactButton";
import { ContactForm } from "@/components/property/ContactForm";
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { propertyBySlugQuery } from "@/features/properties/queries";
import { agency } from "@/lib/agency";
import { formatPrice } from "@/lib/format";
import {
  PROPERTY_TYPE_LABELS,
  TRANSACTION_TYPE_LABELS,
  primaryImage,
} from "@/types/property";

export const Route = createFileRoute("/imoveis/$slug")({
  loader: async ({ context, params }) => {
    const property = await context.queryClient.ensureQueryData(propertyBySlugQuery(params.slug));
    return { property };
  },
  head: ({ loaderData }) => {
    const property = loaderData?.property;
    if (!property) {
      return {
        meta: [
          { title: `Imóvel não encontrado — ${agency.name}` },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const description = property.description.slice(0, 155);
    const image = primaryImage(property);
    const meta = [
      { title: `${property.title} — ${agency.name}` },
      { name: "description", content: description },
      { property: "og:title", content: property.title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (image?.path.startsWith("https://")) {
      meta.push(
        { property: "og:image", content: image.path },
        { name: "twitter:image", content: image.path },
      );
    }
    return { meta };
  },
  component: PropertyDetailPage,
});

function PropertyDetailPage() {
  const { slug } = Route.useParams();
  const { data: property } = useSuspenseQuery(propertyBySlugQuery(slug));

  if (!property) {
    return (
      <SiteLayout>
        <div className="container-page py-20">
          <EmptyState
            title="Imóvel não encontrado"
            description="Este imóvel pode ter sido vendido, alugado ou despublicado."
            action={
              <Button asChild>
                <Link to="/imoveis">Ver imóveis disponíveis</Link>
              </Button>
            }
          />
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container-page py-8">
        <nav className="text-sm text-muted-foreground" aria-label="Trilha de navegação">
          <Link to="/imoveis">Imóveis</Link> <span aria-hidden>/</span> {property.title}
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-8">
            <PropertyGallery images={property.images} title={property.title} />

            <header className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{TRANSACTION_TYPE_LABELS[property.transactionType]}</Badge>
                <Badge variant="secondary">
                  {PROPERTY_TYPE_LABELS[property.propertyType]}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Código do imóvel: {property.publicCode}
                </span>
              </div>
              <h1 className="font-display text-3xl leading-tight">{property.title}</h1>
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" aria-hidden />
                {[property.showAddress ? property.address : null, property.neighborhood, property.city]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p className="font-display text-3xl font-semibold text-primary">
                {formatPrice(property.price)}
                {property.transactionType === "RENT" ? (
                  <span className="text-base font-normal text-muted-foreground">/mês</span>
                ) : null}
              </p>
            </header>

            <section aria-labelledby="caracteristicas">
              <h2 id="caracteristicas" className="mb-4 font-display text-xl">
                Características
              </h2>
              <PropertyFeatures property={property} />
            </section>

            <section aria-labelledby="descricao">
              <h2 id="descricao" className="mb-3 font-display text-xl">
                Descrição
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                {property.description}
              </p>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h2 className="font-display text-lg">Fale com a imobiliária</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Atendimento de {agency.name} para o imóvel {property.publicCode}.
              </p>
              <ContactButton publicCode={property.publicCode} className="mt-4 w-full" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h2 className="font-display text-lg">Prefere e-mail?</h2>
              <div className="mt-4">
                <ContactForm propertyId={property.id} publicCode={property.publicCode} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
