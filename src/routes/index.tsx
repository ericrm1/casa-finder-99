import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Building2, MessageCircle, ShieldCheck } from "lucide-react";

import heroImage from "@/assets/hero-home.jpg";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { EmptyState } from "@/components/common/EmptyState";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { Button } from "@/components/ui/button";
import { citiesQuery, featuredPropertiesQuery } from "@/features/properties/queries";
import { agency, whatsappLink } from "@/lib/agency";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${agency.name} — Imóveis à venda e para alugar` },
      {
        name: "description",
        content:
          "Encontre casas, apartamentos, lotes e chácaras à venda ou para alugar em Alto Paraíso e região. Fale direto com a imobiliária pelo WhatsApp.",
      },
      { property: "og:title", content: `${agency.name} — Encontre o imóvel ideal` },
      {
        property: "og:description",
        content: "Catálogo de imóveis com busca por finalidade, tipo, cidade e faixa de preço.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(featuredPropertiesQuery()),
      context.queryClient.ensureQueryData(citiesQuery()),
    ]);
  },
  component: HomePage,
});

function HomePage() {
  const { data: featured } = useSuspenseQuery(featuredPropertiesQuery());
  const { data: cities } = useSuspenseQuery(citiesQuery());

  return (
    <SiteLayout>
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="Casa moderna em meio à paisagem do cerrado ao entardecer"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/90 via-primary/70 to-primary/40" />

        <div className="container-page py-20 sm:py-28">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground/80">
            {agency.tagline}
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight text-primary-foreground sm:text-5xl">
            Encontre o imóvel ideal para você
          </h1>
          <p className="mt-4 max-w-xl text-base text-primary-foreground/85">
            Casas, apartamentos, lotes, chácaras e imóveis comerciais selecionados por quem conhece
            a região.
          </p>

          <div className="mt-10">
            <PropertyFilters filters={{}} cities={cities} variant="compact" />
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl">Imóveis em destaque</h2>
            <p className="mt-2 text-muted-foreground">
              Uma seleção dos imóveis publicados recentemente.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/imoveis">Ver todos os imóveis</Link>
          </Button>
        </div>

        <div className="mt-8">
          {featured.length === 0 ? (
            <EmptyState
              title="Ainda não há imóveis publicados"
              description="Assim que a imobiliária publicar novos imóveis, eles aparecerão aqui."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container-page">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: Building2,
              title: "Portfólio local",
              text: "Imóveis urbanos e rurais em Alto Paraíso, Goiânia e região.",
            },
            {
              icon: ShieldCheck,
              title: "Atendimento direto",
              text: "Você fala com quem cuida do imóvel, sem intermediários.",
            },
            {
              icon: MessageCircle,
              title: "Resposta rápida",
              text: "Tire dúvidas pelo WhatsApp e agende sua visita.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-6">
              <item.icon className="h-6 w-6 text-primary" aria-hidden />
              <h3 className="mt-4 text-lg">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page mt-16">
        <div className="rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
          <h2 className="font-display text-2xl sm:text-3xl">
            Quer vender, alugar ou encontrar um imóvel?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            Fale com nossa equipe e receba uma recomendação personalizada para o seu perfil.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary">
              <a
                href={whatsappLink("Olá! Gostaria de falar com um corretor.")}
                target="_blank"
                rel="noreferrer"
              >
                Falar no WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contato">Enviar mensagem</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
