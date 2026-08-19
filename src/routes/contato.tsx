import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { ContactForm } from "@/components/property/ContactForm";
import { Button } from "@/components/ui/button";
import { agency, whatsappLink } from "@/lib/agency";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: `Contato — ${agency.name}` },
      {
        name: "description",
        content: `Fale com a ${agency.name} por WhatsApp, telefone ou e-mail e receba ajuda para encontrar seu imóvel.`,
      },
      { property: "og:title", content: `Contato — ${agency.name}` },
      {
        property: "og:description",
        content: "Envie sua mensagem e nossa equipe responde rapidamente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <div className="container-page grid gap-12 py-12 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-3xl">Fale com a {agency.name}</h1>
          <p className="mt-3 text-muted-foreground">
            Conte o que você procura: finalidade, região e faixa de preço. Nossa equipe retorna com
            as melhores opções disponíveis.
          </p>

          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" aria-hidden />
              <a href={`tel:${agency.phone.replace(/\D/g, "")}`}>{agency.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" aria-hidden />
              <a href={`mailto:${agency.email}`}>{agency.email}</a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
              <span>{agency.address}</span>
            </li>
          </ul>

          <Button asChild size="lg" className="mt-8">
            <a
              href={whatsappLink("Olá! Gostaria de falar com um corretor.")}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="mr-2 h-5 w-5" aria-hidden />
              Falar no WhatsApp
            </a>
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-xl">Envie uma mensagem</h2>
          <div className="mt-5">
            <ContactForm />
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
