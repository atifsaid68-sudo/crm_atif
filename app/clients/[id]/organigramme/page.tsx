import { db } from "@/lib/db";
import { createEmployee, deleteEmployee } from "@/app/clients/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Network, UserPlus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type EmployeeWithPosition = {
  id: string;
  nom: string;
  prenom: string;
  managerId: string | null;
  position: { titre: string } | null;
};

function initials(prenom: string, nom: string) {
  return `${prenom[0] ?? ""}${nom[0] ?? ""}`.toUpperCase();
}

function buildTree(employees: EmployeeWithPosition[]) {
  const byManager = new Map<string | null, EmployeeWithPosition[]>();
  for (const e of employees) {
    const key = e.managerId;
    if (!byManager.has(key)) byManager.set(key, []);
    byManager.get(key)!.push(e);
  }
  return byManager;
}

function OrgNode({
  employee,
  byManager,
}: {
  employee: EmployeeWithPosition;
  byManager: Map<string | null, EmployeeWithPosition[]>;
}) {
  const children = byManager.get(employee.id) ?? [];
  return (
    <li className="relative">
      <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-sm transition-shadow hover:shadow-md">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {initials(employee.prenom, employee.nom)}
        </span>
        <div>
          <p className="text-sm font-medium leading-tight">
            {employee.prenom} {employee.nom}
          </p>
          {employee.position && (
            <p className="text-xs text-muted-foreground">
              {employee.position.titre}
            </p>
          )}
        </div>
      </div>
      {children.length > 0 && (
        <ul className="ml-[18px] mt-2 space-y-2 border-l-2 border-dashed border-border pl-8">
          {children.map((child) => (
            <OrgNode key={child.id} employee={child} byManager={byManager} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default async function OrganigrammePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [employees, positions] = await Promise.all([
    db.employee.findMany({
      where: { clientCompanyId: id },
      include: { position: { select: { titre: true } } },
      orderBy: [{ nom: "asc" }],
    }),
    db.position.findMany({
      where: { clientCompanyId: id },
      orderBy: { titre: "asc" },
    }),
  ]);

  const byManager = buildTree(employees);
  const roots = byManager.get(null) ?? [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Network className="size-4" />
          Vue nominative — les employés sont rattachés à leur manager direct.
        </p>
        <Dialog>
          <DialogTrigger
            render={
              <Button>
                <UserPlus className="size-4" />
                Ajouter un employé
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvel employé</DialogTitle>
            </DialogHeader>
            <form
              action={createEmployee.bind(null, id)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input id="prenom" name="prenom" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input id="nom" name="nom" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dateEmbauche">Date d&apos;embauche</Label>
                <Input id="dateEmbauche" name="dateEmbauche" type="date" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="positionId">Poste</Label>
                <NativeSelect id="positionId" name="positionId" defaultValue="">
                  <option value="">Aucun poste</option>
                  {positions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.titre}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="managerId">Manager direct</Label>
                <NativeSelect id="managerId" name="managerId" defaultValue="">
                  <option value="">Aucun (sommet de l&apos;organigramme)</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.prenom} {e.nom}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <Button type="submit" className="w-full">
                Ajouter
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {employees.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <Network className="mx-auto size-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">
            Aucun employé pour l&apos;instant. Ajoutez-en un pour démarrer
            l&apos;organigramme.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-muted/30 p-6">
          <ul className="space-y-3">
            {roots.map((root) => (
              <OrgNode key={root.id} employee={root} byManager={byManager} />
            ))}
          </ul>
        </div>
      )}

      {employees.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Tous les employés
          </p>
          <ul className="divide-y divide-border rounded-xl border border-border">
            {employees.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between px-4 py-2.5 text-sm"
              >
                <span className="flex items-center gap-2.5">
                  <span className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                    {initials(e.prenom, e.nom)}
                  </span>
                  {e.prenom} {e.nom}
                  {e.position && (
                    <span className="text-muted-foreground">
                      — {e.position.titre}
                    </span>
                  )}
                </span>
                <form action={deleteEmployee.bind(null, id, e.id)}>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-destructive"
                    aria-label="Supprimer"
                  >
                    <X className="size-3.5" />
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
