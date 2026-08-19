import { Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { agency, propertyInterestMessage, whatsappLink } from "@/lib/agency";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h2 className="font-display text-xl">{agency.name}</h2>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">{agency.tagline}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Contato
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" aria-hidden />
              <a href={`tel:${agency.phone.replace(/\D/g, "")}`}>{agency.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" aria-hidden />
              <a
                href={whatsappLink(propertyInterestMessage("").trim() || "Olá! Gostaria de informações.")}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" aria-hidden />
              <a href={`mailto:${agency.email}`}>{agency.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
              <span>{agency.address}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Links
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/">Início</Link>
            </li>
            <li>
              <Link to="/imoveis">Imóveis</Link>
            </li>
            <li>
              <Link to="/contato">Contato</Link>
            </li>
            <li>
              <Link to="/admin/login" className="text-muted-foreground">
                Área do corretor
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <p className="container-page text-xs text-muted-foreground">
          © {new Date().getFullYear()} {agency.name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
