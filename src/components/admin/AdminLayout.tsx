import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, LayoutDashboard, LogOut, Menu, PlusCircle, Settings } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { agency } from "@/lib/agency";

const LINKS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/imoveis", label: "Imóveis", icon: Building2 },
  { to: "/admin/imoveis/novo", label: "Novo imóvel", icon: PlusCircle },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Navegação administrativa">
      {LINKS.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
        >
          <link.icon className="h-4 w-4" aria-hidden />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/admin/login", replace: true });
  };

  const sidebarContent = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col bg-sidebar p-4 text-sidebar-foreground">
      <Link to="/admin/dashboard" onClick={onNavigate} className="px-3 py-2 font-display text-lg">
        {agency.name}
      </Link>
      <p className="mb-6 px-3 text-xs uppercase tracking-wide text-sidebar-foreground/60">
        Painel administrativo
      </p>
      <NavLinks onNavigate={onNavigate} />
      <div className="mt-auto space-y-2 pt-6">
        <Link
          to="/"
          onClick={onNavigate}
          className="block rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground"
        >
          Ver site público
        </Link>
        <Button variant="secondary" className="w-full justify-start" onClick={() => void signOut()}>
          <LogOut className="mr-2 h-4 w-4" aria-hidden />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 lg:block">{sidebarContent()}</aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-border px-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" aria-label="Abrir menu administrativo">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              {sidebarContent(() => setOpen(false))}
            </SheetContent>
          </Sheet>
          <h1 className="font-display text-xl">{title}</h1>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
