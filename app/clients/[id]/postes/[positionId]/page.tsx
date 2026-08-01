import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { saveJobDescription } from "@/app/clients/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";

export default async function FicheDePostePage({
  params,
}: {
  params: Promise<{ id: string; positionId: string }>;
}) {
  const { id, positionId } = await params;

  const position = await db.position.findUnique({
    where: { id: positionId },
    include: { jobFamily: true, reportsTo: true, jobDescriptions: { take: 1 } },
  });

  if (!position || position.clientCompanyId !== id) notFound();

  const fiche = position.jobDescriptions[0];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href={`/clients/${id}/postes`}
          className="text-sm text-zinc-500 hover:underline"
        >
          ← Fiches de poste
        </Link>
        <h2 className="mt-2 text-xl font-semibold">{position.titre}</h2>
        <p className="text-sm text-zinc-500">
          {position.jobFamily?.nom}
          {position.niveau ? ` · ${position.niveau}` : ""}
          {position.reportsTo ? ` · rattaché à ${position.reportsTo.titre}` : ""}
        </p>
      </div>

      <form
        action={saveJobDescription.bind(null, id, positionId)}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="missions">Missions</Label>
          <Textarea
            id="missions"
            name="missions"
            rows={6}
            defaultValue={fiche?.missions ?? ""}
            placeholder="Décrire les missions principales du poste..."
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="competences">Compétences requises</Label>
          <Textarea
            id="competences"
            name="competences"
            rows={6}
            defaultValue={fiche?.competences ?? ""}
            placeholder="Lister les compétences techniques et comportementales requises..."
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="statut">Statut</Label>
          <NativeSelect
            id="statut"
            name="statut"
            defaultValue={fiche?.statut ?? "BROUILLON"}
          >
            <option value="BROUILLON">Brouillon</option>
            <option value="VALIDE">Validée</option>
          </NativeSelect>
        </div>
        <Button type="submit">Enregistrer</Button>
        {fiche && (
          <p className="text-xs text-zinc-500">
            Version actuelle : {fiche.version} — dernière mise à jour le{" "}
            {fiche.updatedAt.toLocaleDateString("fr-FR")}
          </p>
        )}
      </form>
    </div>
  );
}
