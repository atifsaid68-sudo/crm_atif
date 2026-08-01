import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { deleteClientCompany } from "@/app/clients/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ClientTabsNav } from "./client-tabs-nav";

function initials(nom: string) {
  const clean = nom.replace(/\[[^\]]*\]|\([^)]*\)/g, " ");
  return (clean.match(/\p{L}+/gu) ?? [])
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await db.clientCompany.findUnique({ where: { id } });
  if (!client) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl px-8 py-10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
            {initials(client.nom)}
          </span>
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {client.nom}
            </h1>
            <p className="text-sm text-muted-foreground">
              {[client.secteur, client.effectif ? `${client.effectif} salariés` : null]
                .filter(Boolean)
                .join(" · ") || "Société cliente"}
            </p>
          </div>
        </div>
        <form action={deleteClientCompany.bind(null, id)}>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            aria-label="Supprimer la société"
          >
            <Trash2 className="size-4" />
          </Button>
        </form>
      </div>

      <div className="mt-8">
        <ClientTabsNav clientId={id} />
      </div>

      <div className="mt-8">{children}</div>
    </div>
  );
}
