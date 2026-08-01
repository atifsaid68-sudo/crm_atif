import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { saveJobDescription } from "@/app/clients/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { ArrowLeft, Save } from "lucide-react";

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
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Fiches de poste
        </Link>
        <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight">
          {position.titre}
        </h2>
        <p className="text-sm text-muted-foreground">
          {[position.jobFamily?.nom, position.niveau].filter(Boolean).join(" · ")}
          {position.reportsTo ? ` · rattaché à ${position.reportsTo.titre}` : ""}
        </p>
      </div>

      <form
        action={saveJobDescription.bind(null, id, positionId)}
        className="space-y-5 rounded-2xl border border-border bg-card p-6"
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
        <div className="flex items-center justify-between border-t border-border pt-4">
          <Button type="submit">
            <Save className="size-3.5" />
            Enregistrer
          </Button>
          {fiche && (
            <p className="text-xs text-muted-foreground">
              Version {fiche.version} — mise à jour le{" "}
              {fiche.updatedAt.toLocaleDateString("fr-FR")}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
