import { db } from "@/lib/db";
import {
  createJobFamily,
  deleteJobFamily,
  createPosition,
  deletePosition,
} from "@/app/clients/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { NativeSelect } from "@/components/ui/native-select";
import { Layers3, Briefcase, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function EmploisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [jobFamilies, positions] = await Promise.all([
    db.jobFamily.findMany({
      where: { clientCompanyId: id },
      orderBy: { nom: "asc" },
    }),
    db.position.findMany({
      where: { clientCompanyId: id },
      include: { jobFamily: true, reportsTo: true },
      orderBy: { titre: "asc" },
    }),
  ]);

  return (
    <div className="space-y-10">
      <section>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-heading text-lg font-medium">
            <Layers3 className="size-4.5 text-primary" />
            Familles de métiers
          </h2>
          <Dialog>
            <DialogTrigger
              render={
                <Button variant="outline" size="sm">
                  <Plus className="size-3.5" />
                  Nouvelle famille
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle famille de métiers</DialogTitle>
              </DialogHeader>
              <form action={createJobFamily.bind(null, id)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input id="nom" name="nom" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" />
                </div>
                <Button type="submit" className="w-full">
                  Créer
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {jobFamilies.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Aucune famille de métiers.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {jobFamilies.map((f) => (
              <div
                key={f.id}
                className="flex items-start justify-between rounded-xl border border-border bg-card px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{f.nom}</p>
                  {f.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {f.description}
                    </p>
                  )}
                </div>
                <form action={deleteJobFamily.bind(null, id, f.id)}>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                    aria-label="Supprimer"
                  >
                    <X className="size-3.5" />
                  </Button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-heading text-lg font-medium">
            <Briefcase className="size-4.5 text-primary" />
            Postes
          </h2>
          <Dialog>
            <DialogTrigger
              render={
                <Button size="sm">
                  <Plus className="size-3.5" />
                  Nouveau poste
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouveau poste</DialogTitle>
              </DialogHeader>
              <form action={createPosition.bind(null, id)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="titre">Titre *</Label>
                  <Input id="titre" name="titre" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="niveau">Niveau / échelon</Label>
                  <Input id="niveau" name="niveau" placeholder="ex: Cadre, Agent de maîtrise..." />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="jobFamilyId">Famille de métiers</Label>
                  <NativeSelect id="jobFamilyId" name="jobFamilyId" defaultValue="">
                    <option value="">Aucune</option>
                    {jobFamilies.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nom}
                      </option>
                    ))}
                  </NativeSelect>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reportingPositionId">Rattaché hiérarchiquement à</Label>
                  <NativeSelect
                    id="reportingPositionId"
                    name="reportingPositionId"
                    defaultValue=""
                  >
                    <option value="">Aucun (sommet)</option>
                    {positions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.titre}
                      </option>
                    ))}
                  </NativeSelect>
                </div>
                <Button type="submit" className="w-full">
                  Créer
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {positions.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Aucun poste.</p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {positions.map((p) => (
              <div
                key={p.id}
                className="flex items-start justify-between rounded-xl border border-border bg-card px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{p.titre}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    {p.niveau && <Badge variant="secondary">{p.niveau}</Badge>}
                    {p.jobFamily && (
                      <Badge variant="secondary">{p.jobFamily.nom}</Badge>
                    )}
                    {p.reportsTo && <span>rattaché à {p.reportsTo.titre}</span>}
                  </div>
                </div>
                <form action={deletePosition.bind(null, id, p.id)}>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                    aria-label="Supprimer"
                  >
                    <X className="size-3.5" />
                  </Button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
