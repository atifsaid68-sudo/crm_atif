import Link from "next/link";
import { db } from "@/lib/db";
import { createClientCompany } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Users, Briefcase, ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function initials(nom: string) {
  return nom
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

const PALETTE = [
  "bg-[oklch(0.62_0.17_42_/_0.15)] text-[oklch(0.5_0.17_42)]",
  "bg-[oklch(0.55_0.14_200_/_0.15)] text-[oklch(0.45_0.14_200)]",
  "bg-[oklch(0.65_0.15_140_/_0.15)] text-[oklch(0.4_0.13_140)]",
  "bg-[oklch(0.5_0.12_300_/_0.15)] text-[oklch(0.42_0.12_300)]",
];

export default async function ClientsPage() {
  const clients = await db.clientCompany.findMany({
    orderBy: { nom: "asc" },
    include: { _count: { select: { employees: true, positions: true } } },
  });

  const totalEmployees = clients.reduce((sum, c) => sum + c._count.employees, 0);
  const totalPositions = clients.reduce((sum, c) => sum + c._count.positions, 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-8 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Vue d&apos;ensemble
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Toutes vos sociétés clientes, en un coup d&apos;œil.
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

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Building2 className="size-4.5" />}
          label="Sociétés clientes"
          value={clients.length}
        />
        <StatCard
          icon={<Users className="size-4.5" />}
          label="Employés suivis"
          value={totalEmployees}
        />
        <StatCard
          icon={<Briefcase className="size-4.5" />}
          label="Postes recensés"
          value={totalPositions}
        />
      </div>

      <h2 className="mt-10 mb-4 text-sm font-medium text-muted-foreground">
        Sociétés
      </h2>

      {clients.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <Building2 className="mx-auto size-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">
            Aucune société cliente pour l&apos;instant. Créez-en une pour
            commencer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client, i) => (
            <Link key={client.id} href={`/clients/${client.id}`} className="group">
              <div className="h-full rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <div className="flex items-start justify-between">
                  <span
                    className={`flex size-10 items-center justify-center rounded-xl text-sm font-semibold ${PALETTE[i % PALETTE.length]}`}
                  >
                    {initials(client.nom)}
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground/0 transition-all group-hover:text-muted-foreground/60" />
                </div>
                <p className="mt-3 font-heading text-lg font-medium leading-tight">
                  {client.nom}
                </p>
                {client.secteur && (
                  <p className="text-sm text-muted-foreground">{client.secteur}</p>
                )}
                <div className="mt-4 flex gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>
                    {client._count.employees} employé
                    {client._count.employees > 1 ? "s" : ""}
                  </span>
                  <span>
                    {client._count.positions} poste
                    {client._count.positions > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="font-heading text-2xl font-semibold leading-none">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
