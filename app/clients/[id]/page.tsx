import { redirect } from "next/navigation";

export default async function ClientOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/clients/${id}/organigramme`);
}
