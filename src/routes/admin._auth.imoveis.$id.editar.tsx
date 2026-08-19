import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { updateProperty } from "@/features/properties/mutations";
import { adminPropertyQuery } from "@/features/properties/queries";
import type { PropertyFormValues } from "@/features/properties/schema";

export const Route = createFileRoute("/admin/_auth/imoveis/$id/editar")({
  head: () => ({
    meta: [{ title: "Editar imóvel — Painel" }, { name: "robots", content: "noindex" }],
  }),
  component: EditPropertyPage,
});

function EditPropertyPage() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const { data: property, isPending } = useQuery(adminPropertyQuery(id));

  const mutation = useMutation({
    mutationFn: (values: PropertyFormValues) => updateProperty(id, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Imóvel atualizado.");
    },
    onError: () => toast.error("Não foi possível salvar as alterações."),
  });

  return (
    <AdminLayout title="Editar imóvel">
      {isPending ? (
        <div className="max-w-3xl space-y-4">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : !property ? (
        <EmptyState
          title="Imóvel não encontrado"
          description="Ele pode ter sido excluído por outro administrador."
          action={
            <Button asChild>
              <Link to="/admin/imoveis">Voltar para a lista</Link>
            </Button>
          }
        />
      ) : (
        <div className="max-w-3xl space-y-8">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg">Imagens</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Código do imóvel: {property.publicCode}
            </p>
            <div className="mt-4">
              <ImageUploader propertyId={property.id} images={property.images} />
            </div>
          </section>

          <PropertyForm
            property={property}
            submitLabel="Salvar alterações"
            isSubmitting={mutation.isPending}
            onSubmit={(values) => mutation.mutate(values)}
          />
        </div>
      )}
    </AdminLayout>
  );
}
