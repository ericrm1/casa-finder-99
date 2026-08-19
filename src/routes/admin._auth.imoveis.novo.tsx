import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { createProperty } from "@/features/properties/mutations";
import type { PropertyFormValues } from "@/features/properties/schema";

export const Route = createFileRoute("/admin/_auth/imoveis/novo")({
  head: () => ({
    meta: [{ title: "Novo imóvel — Painel" }, { name: "robots", content: "noindex" }],
  }),
  component: NewPropertyPage,
});

function NewPropertyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: PropertyFormValues) => createProperty(values),
    onSuccess: async (id) => {
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Imóvel criado. Agora adicione as imagens.");
      void navigate({ to: "/admin/imoveis/$id/editar", params: { id } });
    },
    onError: () => toast.error("Não foi possível criar o imóvel."),
  });

  return (
    <AdminLayout title="Novo imóvel">
      <div className="max-w-3xl">
        <PropertyForm
          submitLabel="Criar imóvel"
          isSubmitting={mutation.isPending}
          onSubmit={(values) => mutation.mutate(values)}
        />
      </div>
    </AdminLayout>
  );
}
