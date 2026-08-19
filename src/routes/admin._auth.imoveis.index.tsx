import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteProperty } from "@/features/properties/mutations";
import { adminPropertiesQuery } from "@/features/properties/queries";
import { formatPrice } from "@/lib/format";
import {
  PROPERTY_STATUS_LABELS,
  PROPERTY_TYPE_LABELS,
  TRANSACTION_TYPE_LABELS,
} from "@/types/property";

export const Route = createFileRoute("/admin/_auth/imoveis/")({
  head: () => ({ meta: [{ title: "Imóveis — Painel" }, { name: "robots", content: "noindex" }] }),
  component: AdminPropertiesPage,
});

function AdminPropertiesPage() {
  const queryClient = useQueryClient();
  const { data: properties, isPending } = useQuery(adminPropertiesQuery());
  const [term, setTerm] = useState("");

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Imóvel excluído.");
    },
    onError: () => toast.error("Não foi possível excluir o imóvel."),
  });

  const filtered = (properties ?? []).filter((property) => {
    const query = term.trim().toLowerCase();
    if (!query) return true;
    return (
      property.title.toLowerCase().includes(query) ||
      property.city.toLowerCase().includes(query) ||
      property.publicCode.toLowerCase().includes(query)
    );
  });

  return (
    <AdminLayout title="Imóveis">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Buscar por título, cidade ou código"
          className="max-w-sm"
          aria-label="Buscar imóveis"
        />
        <Button asChild>
          <Link to="/admin/imoveis/novo">Novo imóvel</Link>
        </Button>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card">
        {isPending ? (
          <div className="space-y-3 p-6">
            {[0, 1, 2, 3].map((key) => (
              <Skeleton key={key} className="h-10" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="Nenhum imóvel encontrado"
              description="Cadastre um novo imóvel ou ajuste sua busca."
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Título</TableHead>
                <TableHead className="hidden md:table-cell">Tipo</TableHead>
                <TableHead className="hidden md:table-cell">Cidade</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-mono text-xs">{property.publicCode}</TableCell>
                  <TableCell className="max-w-[240px] truncate">{property.title}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {PROPERTY_TYPE_LABELS[property.propertyType]} ·{" "}
                    {TRANSACTION_TYPE_LABELS[property.transactionType]}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{property.city}</TableCell>
                  <TableCell>{formatPrice(property.price)}</TableCell>
                  <TableCell>
                    <Badge variant={property.status === "PUBLISHED" ? "default" : "secondary"}>
                      {PROPERTY_STATUS_LABELS[property.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild size="icon" variant="ghost" aria-label="Editar imóvel">
                        <Link to="/admin/imoveis/$id/editar" params={{ id: property.id }}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <ConfirmDialog
                        title="Excluir imóvel?"
                        description="O imóvel e suas imagens serão removidos permanentemente."
                        confirmLabel="Excluir"
                        onConfirm={() => removeMutation.mutate(property.id)}
                        trigger={
                          <Button size="icon" variant="ghost" aria-label="Excluir imóvel">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </AdminLayout>
  );
}
