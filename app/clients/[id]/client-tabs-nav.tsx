"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Network, Layers3, FileText, Users2 } from "lucide-react";

const TABS = [
  { segment: "organigramme", label: "Organigramme", icon: Network },
  { segment: "emplois", label: "Classification des emplois", icon: Layers3 },
  { segment: "postes", label: "Fiches de poste", icon: FileText },
  { segment: "employes", label: "Employés", icon: Users2 },
];

export function ClientTabsNav({ clientId }: { clientId: string }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1.5">
      {TABS.map((tab) => {
        const href = `/clients/${clientId}/${tab.segment}`;
        const active = pathname.startsWith(href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.segment}
            href={href}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="size-3.5" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
