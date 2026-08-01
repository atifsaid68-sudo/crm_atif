"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { segment: "organigramme", label: "Organigramme" },
  { segment: "emplois", label: "Classification des emplois" },
  { segment: "postes", label: "Fiches de poste" },
  { segment: "employes", label: "Employés" },
];

export function ClientTabsNav({ clientId }: { clientId: string }) {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
      {TABS.map((tab) => {
        const href = `/clients/${clientId}/${tab.segment}`;
        const active = pathname.startsWith(href);
        return (
          <Link
            key={tab.segment}
            href={href}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              active
                ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
