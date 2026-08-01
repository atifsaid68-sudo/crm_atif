import { db } from "@/lib/db";
import { createEmployee, deleteEmployee } from "@/app/clients/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
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
    <li>
      <div className="inline-block rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm font-medium">
          {employee.prenom} {employee.nom}
        </p>
        {employee.position && (
          <p className="text-xs text-zinc-500">{employee.position.titre}</p>
        )}
      </div>
      {children.length > 0 && (
        <ul className="ml-6 mt-2 space-y-2 border-l border-zinc-200 pl-6 dark:border-zinc-800">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          Vue nominative — les employés sont rattachés à leur manager direct.
        </p>
        <Dialog>
          <DialogTrigger render={<Button>Ajouter un employé</Button>} />
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
        <p className="text-sm text-zinc-500">
          Aucun employé pour l&apos;instant. Ajoutez-en un pour démarrer
          l&apos;organigramme.
        </p>
      ) : (
        <ul className="space-y-2">
          {roots.map((root) => (
            <OrgNode key={root.id} employee={root} byManager={byManager} />
          ))}
        </ul>
      )}

      {employees.length > 0 && (
        <details className="mt-8">
          <summary className="cursor-pointer text-sm text-zinc-500">
            Gérer / supprimer des employés
          </summary>
          <ul className="mt-3 space-y-1">
            {employees.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between text-sm"
              >
                <span>
                  {e.prenom} {e.nom}
                  {e.position && (
                    <span className="text-zinc-500"> — {e.position.titre}</span>
                  )}
                </span>
                <form action={deleteEmployee.bind(null, id, e.id)}>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Supprimer
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
