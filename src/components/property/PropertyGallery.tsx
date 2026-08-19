import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PropertyImage } from "@/types/property";

export function PropertyGallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <ImageOff className="h-10 w-10" aria-hidden />
      </div>
    );
  }

  const current = images[Math.min(index, images.length - 1)]!;
  const go = (step: number) => setIndex((value) => (value + step + images.length) % images.length);

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <img
          src={current.path}
          alt={`${title} — foto ${index + 1} de ${images.length}`}
          className="aspect-[16/10] w-full object-cover"
        />
        {images.length > 1 ? (
          <>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full"
              onClick={() => go(-1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full"
              onClick={() => go(1)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, position) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setIndex(position)}
              aria-label={`Ver foto ${position + 1}`}
              className={cn(
                "h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-opacity",
                position === index ? "border-primary" : "border-transparent opacity-70",
              )}
            >
              <img src={image.path} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
