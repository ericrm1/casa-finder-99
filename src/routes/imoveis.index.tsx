import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";

import { EmptyState } from "@/components/common/EmptyState";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PAGE_SIZE,
  SORT_LABELS,
  SORT_OPTIONS,
  propertyFiltersSchema,
  type SortOption,
} from "@/features/properties/filters";
import { citiesQuery, publicPropertiesQuery } from "@/features/properties/queries";
import { agency } from "@/lib/agency";

export const Route = createFileRoute("/imoveis")({
  validateSearch: propertyFiltersSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(publicPropertiesQuery(deps.search)),
      context.queryClient.ensureQueryData(citiesQuery()),
    ]);
  },
  head: () => ({
    meta: [
      { title: `Imóveis à venda e para alugar — ${agency.name}` },
      {
        name: "description",
        content:
          "Busque imóveis por finalidade, tipo, cidade, bairro, faixa de preço e características. Resultados atualizados diariamente.",
      },
      { property: "og:title", content: `Imóveis disponíveis — ${agency.name}` },
      {
        property: "og:description",
        content: "Catálogo completo de imóveis com filtros por finalidade, tipo, cidade e preço.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PropertiesPage,
});

function PropertiesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { data } = useSuspenseQuery(publicPropertiesQuery(search));
  const { data: cities } = useSuspenseQuery(citiesQuery());

  const page = search.pagina ?? 1;
  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));

  const goToPage = (nextPage: number) =>
    void navigate({ to: "/imoveis", search: { ...search, pagina: nextPage } });

  return (
    <SiteLayout>
      <div className="container-page py-10">
        <header>
          <h1 className="font-display text-3xl">Imóveis disponíveis</h1>
          <p className="mt-2 text-muted-foreground">
            {data.total} {data.total === 1 ? "imóvel encontrado" : "imóveis encontrados"}
          </p>
        </header>

        <div className="mt-6">
          <PropertyFilters filters={search} cities={cities} />
        </div>

        <div className="mt-8 flex items-center justify-end">
          <div className="w-56">
            <Select
              value={search.ordenar ?? "recent"}
              onValueChange={(value) =>
                void navigate({
                  to: "/imoveis",
                  search: { ...search, ordenar: value as SortOption, pagina: undefined },
                })
              }
            >
              <SelectTrigger aria-label="Ordenar resultados">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {SORT_LABELS[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6">
          {data.properties.length === 0 ? (
            <EmptyState
              title="Não encontramos imóveis com esses critérios."
              description="Tente ampliar a faixa de preço ou remover alguns filtros."
              action={
                <Button asChild variant="outline">
                  <Link to="/imoveis" search={{}}>
                    Limpar filtros
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 ? (
          <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Paginação">
            <Button variant="outline" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {page} de {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
            >
              Próxima
            </Button>
          </nav>
        ) : null}
      </div>
    </SiteLayout>
  );
}
