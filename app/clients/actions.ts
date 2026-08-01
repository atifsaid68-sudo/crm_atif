"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

// --- Sociétés clientes ---

export async function createClientCompany(formData: FormData) {
  const nom = String(formData.get("nom") ?? "").trim();
  if (!nom) throw new Error("Le nom de la société est requis");

  const company = await db.clientCompany.create({
    data: {
      nom,
      secteur: emptyToNull(formData.get("secteur")),
      adresse: emptyToNull(formData.get("adresse")),
      contactNom: emptyToNull(formData.get("contactNom")),
      contactEmail: emptyToNull(formData.get("contactEmail")),
      effectif: toIntOrNull(formData.get("effectif")),
    },
  });

  revalidatePath("/clients");
  redirect(`/clients/${company.id}`);
}

export async function deleteClientCompany(id: string) {
  await db.clientCompany.delete({ where: { id } });
  revalidatePath("/clients");
  redirect("/clients");
}

// --- Classification des emplois : familles de métiers ---

export async function createJobFamily(clientCompanyId: string, formData: FormData) {
  const nom = String(formData.get("nom") ?? "").trim();
  if (!nom) throw new Error("Le nom de la famille de métiers est requis");

  await db.jobFamily.create({
    data: {
      clientCompanyId,
      nom,
      description: emptyToNull(formData.get("description")),
    },
  });

  revalidatePath(`/clients/${clientCompanyId}/emplois`);
}

export async function deleteJobFamily(clientCompanyId: string, id: string) {
  await db.jobFamily.delete({ where: { id } });
  revalidatePath(`/clients/${clientCompanyId}/emplois`);
}

// --- Classification des emplois : postes ---

export async function createPosition(clientCompanyId: string, formData: FormData) {
  const titre = String(formData.get("titre") ?? "").trim();
  if (!titre) throw new Error("Le titre du poste est requis");

  await db.position.create({
    data: {
      clientCompanyId,
      titre,
      niveau: emptyToNull(formData.get("niveau")),
      jobFamilyId: emptyToNull(formData.get("jobFamilyId")),
      reportingPositionId: emptyToNull(formData.get("reportingPositionId")),
    },
  });

  revalidatePath(`/clients/${clientCompanyId}/emplois`);
  revalidatePath(`/clients/${clientCompanyId}/organigramme`);
  revalidatePath(`/clients/${clientCompanyId}/postes`);
}

export async function deletePosition(clientCompanyId: string, id: string) {
  await db.position.delete({ where: { id } });
  revalidatePath(`/clients/${clientCompanyId}/emplois`);
  revalidatePath(`/clients/${clientCompanyId}/organigramme`);
  revalidatePath(`/clients/${clientCompanyId}/postes`);
}

// --- Employés ---

export async function createEmployee(clientCompanyId: string, formData: FormData) {
  const nom = String(formData.get("nom") ?? "").trim();
  const prenom = String(formData.get("prenom") ?? "").trim();
  if (!nom || !prenom) throw new Error("Le nom et le prénom sont requis");

  const dateEmbaucheRaw = formData.get("dateEmbauche");

  await db.employee.create({
    data: {
      clientCompanyId,
      nom,
      prenom,
      email: emptyToNull(formData.get("email")),
      positionId: emptyToNull(formData.get("positionId")),
      managerId: emptyToNull(formData.get("managerId")),
      dateEmbauche: dateEmbaucheRaw ? new Date(String(dateEmbaucheRaw)) : null,
    },
  });

  revalidatePath(`/clients/${clientCompanyId}/employes`);
  revalidatePath(`/clients/${clientCompanyId}/organigramme`);
}

export async function deleteEmployee(clientCompanyId: string, id: string) {
  await db.employee.delete({ where: { id } });
  revalidatePath(`/clients/${clientCompanyId}/employes`);
  revalidatePath(`/clients/${clientCompanyId}/organigramme`);
}

// --- Fiches de poste ---

export async function saveJobDescription(
  clientCompanyId: string,
  positionId: string,
  formData: FormData,
) {
  const missions = String(formData.get("missions") ?? "").trim();
  const competences = String(formData.get("competences") ?? "").trim();
  const statut = String(formData.get("statut") ?? "BROUILLON");

  const existing = await db.jobDescription.findFirst({ where: { positionId } });

  if (existing) {
    await db.jobDescription.update({
      where: { id: existing.id },
      data: { missions, competences, statut, version: { increment: 1 } },
    });
  } else {
    await db.jobDescription.create({
      data: { positionId, missions, competences, statut },
    });
  }

  revalidatePath(`/clients/${clientCompanyId}/postes`);
  revalidatePath(`/clients/${clientCompanyId}/postes/${positionId}`);
}

// --- helpers ---

function emptyToNull(value: FormDataEntryValue | null): string | null {
  const s = value ? String(value).trim() : "";
  return s.length ? s : null;
}

function toIntOrNull(value: FormDataEntryValue | null): number | null {
  const s = value ? String(value).trim() : "";
  if (!s) return null;
  const n = parseInt(s, 10);
  return Number.isNaN(n) ? null : n;
}
