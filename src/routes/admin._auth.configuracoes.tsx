import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminSession } from "@/features/auth/useAdminSession";
import { supabase } from "@/integrations/supabase/client";
import { agency } from "@/lib/agency";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/admin/_auth/configuracoes")({
  head: () => ({
    meta: [{ title: "Configurações — Painel" }, { name: "robots", content: "noindex" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { data: session, isPending } = useAdminSession();

  const { data: leads } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, name, email, phone, message, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  return (
    <AdminLayout title="Configurações">
      <div className="grid max-w-4xl gap-6">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg">Conta</h2>
          {isPending ? (
            <Skeleton className="mt-4 h-6 w-48" />
          ) : (
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="text-muted-foreground">E-mail:</dt>
                <dd>{session?.session?.user.email}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Perfil:</dt>
                <dd>{session?.isAdmin ? "Administrador" : "Sem permissão"}</dd>
              </div>
            </dl>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg">Dados da imobiliária</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Nome:</dt>
              <dd>{agency.name}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted-foreground">WhatsApp:</dt>
              <dd>{agency.phone}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted-foreground">E-mail:</dt>
              <dd>{agency.email}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg">Contatos recebidos</h2>
          {!leads || leads.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Nenhum contato recebido ainda.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {leads.map((lead) => (
                <li key={lead.id} className="py-4">
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(lead.created_at)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {lead.email}
                    {lead.phone ? ` · ${lead.phone}` : ""}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm">{lead.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
