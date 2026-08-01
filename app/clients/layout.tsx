import { db } from "@/lib/db";
import { ClientsSidebar } from "./sidebar";

export default async function ClientsShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clients = await db.clientCompany.findMany({
    select: { id: true, nom: true },
    orderBy: { nom: "asc" },
  });

  return (
    <div className="flex min-h-screen w-full">
      <ClientsSidebar clients={clients} />
      <main className="flex-1 overflow-y-auto bg-background">{children}</main>
    </div>
  );
}
