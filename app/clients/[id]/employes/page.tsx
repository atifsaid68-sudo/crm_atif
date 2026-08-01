import { db } from "@/lib/db";
import { createEmployee, deleteEmployee } from "@/app/clients/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NativeSelect } from "@/components/ui/native-select";
import { UserPlus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function EmployesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [employees, positions] = await Promise.all([
    db.employee.findMany({
      where: { clientCompanyId: id },
      include: { position: true, manager: true },
      orderBy: { nom: "asc" },
    }),
    db.position.findMany({
      where: { clientCompanyId: id },
      orderBy: { titre: "asc" },
    }),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {employees.length} employé{employees.length > 1 ? "s" : ""}
        </p>
        <Dialog>
          <DialogTrigger
            render={
              <Button size="sm">
                <UserPlus className="size-3.5" />
                Ajouter un employé
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvel employé</DialogTitle>
            </DialogHeader>
            <form action={createEmployee.bind(null, id)} className="space-y-4">
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
                  <option value="">Aucun</option>
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
        <p className="text-sm text-muted-foreground">Aucun employé.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Nom</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Embauche</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">
                    {e.prenom} {e.nom}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {e.position?.titre ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {e.manager ? `${e.manager.prenom} ${e.manager.nom}` : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {e.email ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {e.dateEmbauche
                      ? e.dateEmbauche.toLocaleDateString("fr-FR")
                      : "—"}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
