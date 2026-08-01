import Link from "next/link";
import { db } from "@/lib/db";
import { createClientCompany } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function ClientsPage() {
  const clients = await db.clientCompany.findMany({
    orderBy: { nom: "asc" },
    include: { _count: { select: { employees: true, positions: true } } },
  });

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sociétés clientes</h1>
          <p className="text-sm text-zinc-500">
            {clients.length} société{clients.length > 1 ? "s" : ""} gérée
            {clients.length > 1 ? "s" : ""}
          </p>
        </div>
        <Dialog>
          <DialogTrigger render={<Button>Nouvelle société</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle société cliente</DialogTitle>
            </DialogHeader>
            <form action={createClientCompany} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="nom">Nom *</Label>
                <Input id="nom" name="nom" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="secteur">Secteur</Label>
                <Input id="secteur" name="secteur" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="adresse">Adresse</Label>
                <Input id="adresse" name="adresse" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contactNom">Contact</Label>
                  <Input id="contactNom" name="contactNom" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contactEmail">Email du contact</Label>
                  <Input id="contactEmail" name="contactEmail" type="email" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="effectif">Effectif</Label>
                <Input id="effectif" name="effectif" type="number" min={0} />
              </div>
              <Button type="submit" className="w-full">
                Créer la société
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {clients.length === 0 ? (
        <p className="mt-10 text-sm text-zinc-500">
          Aucune société cliente pour l&apos;instant. Créez-en une pour commencer.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {clients.map((client) => (
            <Link key={client.id} href={`/clients/${client.id}`}>
              <Card className="h-full transition-colors hover:border-zinc-400 dark:hover:border-zinc-600">
                <CardHeader>
                  <CardTitle>{client.nom}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-zinc-500 space-y-1">
                  {client.secteur && <p>{client.secteur}</p>}
                  <p>
                    {client._count.employees} employé
                    {client._count.employees > 1 ? "s" : ""} ·{" "}
                    {client._count.positions} poste
                    {client._count.positions > 1 ? "s" : ""}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
