import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

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
      <p className="text-sm text-zinc-500">
        Aucun poste. Créez d&apos;abord des postes dans l&apos;onglet
        Classification des emplois.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {positions.map((p) => {
        const fiche = p.jobDescriptions[0];
        return (
          <li key={p.id}>
            <Link
              href={`/clients/${id}/postes/${p.id}`}
              className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
            >
              <span className="text-sm font-medium">{p.titre}</span>
              {fiche ? (
                <Badge variant={fiche.statut === "VALIDE" ? "default" : "secondary"}>
                  {fiche.statut === "VALIDE" ? "Validée" : "Brouillon"} · v{fiche.version}
                </Badge>
              ) : (
                <Badge variant="outline">Pas de fiche</Badge>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
