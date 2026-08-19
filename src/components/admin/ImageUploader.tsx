import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  deletePropertyImage,
  setPrimaryImage,
  uploadPropertyImage,
} from "@/features/properties/mutations";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGES_PER_PROPERTY,
  validateImageFile,
} from "@/features/properties/schema";
import type { PropertyImage } from "@/types/property";

interface Props {
  propertyId: string;
  images: PropertyImage[];
}

export function ImageUploader({ propertyId, images }: Props) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["properties"] });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = MAX_IMAGES_PER_PROPERTY - images.length;
    if (remaining <= 0) {
      toast.error(`Limite de ${MAX_IMAGES_PER_PROPERTY} imagens por imóvel.`);
      return;
    }

    setUploading(true);
    try {
      let index = images.length;
      for (const file of Array.from(files).slice(0, remaining)) {
        const error = validateImageFile(file);
        if (error) {
          toast.error(`${file.name}: ${error}`);
          continue;
        }
        await uploadPropertyImage(propertyId, file, index, index === 0 && images.length === 0);
        index += 1;
      }
      await refresh();
      toast.success("Imagens enviadas.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha no upload das imagens.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeMutation = useMutation({
    mutationFn: ({ id, path }: { id: string; path: string }) => deletePropertyImage(id, path),
    onSuccess: async () => {
      await refresh();
      toast.success("Imagem removida.");
    },
    onError: () => toast.error("Não foi possível remover a imagem."),
  });

  const primaryMutation = useMutation({
    mutationFn: (imageId: string) => setPrimaryImage(propertyId, imageId),
    onSuccess: async () => {
      await refresh();
      toast.success("Imagem principal atualizada.");
    },
    onError: () => toast.error("Não foi possível definir a imagem principal."),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="hidden"
          onChange={(event) => void handleFiles(event.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" aria-hidden />
          {uploading ? "Enviando..." : "Adicionar imagens"}
        </Button>
        <p className="text-xs text-muted-foreground">
          JPG, PNG ou WEBP até 5 MB. Máximo de {MAX_IMAGES_PER_PROPERTY} imagens.
        </p>
      </div>

      {images.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          Nenhuma imagem cadastrada ainda.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <li
              key={image.id}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <img
                src={image.path}
                alt=""
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="flex items-center justify-between gap-1 p-2">
                <Button
                  type="button"
                  size="sm"
                  variant={image.isPrimary ? "default" : "ghost"}
                  onClick={() => primaryMutation.mutate(image.id)}
                  disabled={image.isPrimary}
                >
                  <Star className="mr-1 h-3.5 w-3.5" aria-hidden />
                  {image.isPrimary ? "Principal" : "Definir"}
                </Button>
                <ConfirmDialog
                  title="Remover imagem?"
                  description="Esta imagem será excluída permanentemente do imóvel."
                  confirmLabel="Remover"
                  onConfirm={() => removeMutation.mutate({ id: image.id, path: image.path })}
                  trigger={
                    <Button type="button" size="icon" variant="ghost" aria-label="Remover imagem">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
