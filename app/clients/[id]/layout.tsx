import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { deleteClientCompany } from "@/app/clients/actions";
import { Button } from "@/components/ui/button";
import { ClientTabsNav } from "./client-tabs-nav";

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await db.clientCompany.findUnique({ where: { id } });
  if (!client) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="flex items-center justify-between">
        <Link href="/clients" className="text-sm text-zinc-500 hover:underline">
          ← Sociétés clientes
        </Link>
        <form action={deleteClientCompany.bind(null, id)}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            Supprimer la société
          </Button>
        </form>
      </div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">{client.nom}</h1>
      {client.secteur && <p className="text-sm text-zinc-500">{client.secteur}</p>}

      <ClientTabsNav clientId={id} />

      <div className="mt-6">{children}</div>
    </div>
  );
}
