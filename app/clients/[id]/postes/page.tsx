import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { FileText, ChevronRight } from "lucide-react";

export default async function FichesDePostePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const positions = await db.position.findMany({
    where: { clientCompanyId: id },
    include: { jobDescriptions: { take: 1 } },
    orderBy: { titre: "asc" },
  });

  if (positions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-16 text-center">
        <FileText className="mx-auto size-8 text-muted-foreground/40" />
        <p className="mt-3 text-sm text-muted-foreground">
          Aucun poste. Créez d&apos;abord des postes dans l&apos;onglet
          Classification des emplois.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {positions.map((p) => {
        const fiche = p.jobDescriptions[0];
        return (
          <Link
            key={p.id}
            href={`/clients/${id}/postes/${p.id}`}
            className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium">{p.titre}</p>
                {fiche ? (
                  <Badge
                    variant={fiche.statut === "VALIDE" ? "default" : "secondary"}
                    className="mt-1"
                  >
                    {fiche.statut === "VALIDE" ? "Validée" : "Brouillon"} · v
                    {fiche.version}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="mt-1">
                    Pas de fiche
                  </Badge>
                )}
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
          </Link>
        );
      })}
    </div>
  );
}
