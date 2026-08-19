import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { adminPropertiesQuery } from "@/features/properties/queries";
import { formatPrice } from "@/lib/format";
import { PROPERTY_STATUS_LABELS, type PropertyStatus } from "@/types/property";

export const Route = createFileRoute("/admin/_auth/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Painel" }, { name: "robots", content: "noindex" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data: properties, isPending } = useQuery(adminPropertiesQuery());

  const counts = (properties ?? []).reduce<Record<string, number>>((acc, property) => {
    acc[property.status] = (acc[property.status] ?? 0) + 1;
    return acc;
  }, {});

  const total = properties?.length ?? 0;
  const totalValue = (properties ?? [])
    .filter((property) => property.status === "PUBLISHED")
    .reduce((sum, property) => sum + property.price, 0);

  return (
    <AdminLayout title="Dashboard">
      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Imóveis cadastrados" value={String(total)} />
            <StatCard
              label="Publicados"
              value={String(counts["PUBLISHED"] ?? 0)}
            />
            <StatCard label="Rascunhos" value={String(counts["DRAFT"] ?? 0)} />
            <StatCard label="Valor publicado" value={formatPrice(totalValue)} />
          </div>

          <section className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg">Por status</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {(Object.keys(PROPERTY_STATUS_LABELS) as PropertyStatus[]).map((status) => (
                <li key={status} className="flex justify-between border-b border-border py-2 text-sm">
                  <span>{PROPERTY_STATUS_LABELS[status]}</span>
                  <span className="font-medium">{counts[status] ?? 0}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/admin/imoveis/novo">Cadastrar imóvel</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/imoveis">Gerenciar imóveis</Link>
            </Button>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl">{value}</p>
    </div>
  );
}
