"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Building2, LayoutGrid, Plus } from "lucide-react";

type SidebarClient = {
  id: string;
  nom: string;
};

function initials(nom: string) {
  return nom
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function ClientsSidebar({ clients }: { clients: SidebarClient[] }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Building2 className="size-4.5" strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-heading text-base font-semibold leading-none">
            CRM RH
          </p>
          <p className="mt-1 text-[11px] text-sidebar-foreground/50">
            Gestion multi-clients
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <Link
          href="/clients"
          className={cn(
            "mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/clients"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
          )}
        >
          <LayoutGrid className="size-4" />
          Vue d&apos;ensemble
        </Link>

        <div className="mb-1.5 flex items-center justify-between px-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/40">
            Sociétés clientes
          </p>
          <Link
            href="/clients"
            className="flex size-5 items-center justify-center rounded-md text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            aria-label="Nouvelle société"
          >
            <Plus className="size-3.5" />
          </Link>
        </div>

        <ul className="space-y-0.5">
          {clients.map((client) => {
            const href = `/clients/${client.id}`;
            const active = pathname.startsWith(href);
            return (
              <li key={client.id}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "bg-sidebar-foreground/10 text-sidebar-foreground/60",
                    )}
                  >
                    {initials(client.nom)}
                  </span>
                  <span className="truncate">{client.nom}</span>
                </Link>
              </li>
            );
          })}
          {clients.length === 0 && (
            <li className="px-3 py-2 text-xs text-sidebar-foreground/40">
              Aucune société pour l&apos;instant
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}
