"use server";

import { eq } from "drizzle-orm";
import { db, individuals } from "@/lib/db";
import { normalizePhone } from "@/lib/phone";
import { nanoid } from "nanoid";

export type PublicIndividualResult = {
  id: string;
  phone: string;
  fullName: string | null;
  credaraId: string | null;
  trustScore: number | null;
  verificationStatus: string | null;
};

export async function lookupByPhone(
  rawPhone: string
): Promise<PublicIndividualResult | null> {
  const normalized = normalizePhone(rawPhone.trim());
  const [row] = await db
    .select({
      id: individuals.id,
      phone: individuals.phone,
      fullName: individuals.fullName,
      credaraId: individuals.credaraId,
      trustScore: individuals.trustScore,
      verificationStatus: individuals.verificationStatus,
    })
    .from(individuals)
    .where(eq(individuals.normalizedPhone, normalized))
    .limit(1);

  if (!row) return null;
  return {
    id: row.id,
    phone: row.phone,
    fullName: row.fullName ?? null,
    credaraId: row.credaraId ?? null,
    trustScore: row.trustScore ?? null,
    verificationStatus: row.verificationStatus ?? null,
  };
}

export type ApplyForTrustReportState = {
  error?: string;
  errors?: { phone?: string; fullName?: string; email?: string };
  submitted?: boolean;
};

export async function applyForTrustReport(
  _prev: ApplyForTrustReportState | FormData,
  formData?: FormData | null
): Promise<ApplyForTrustReportState> {
  const phoneRaw = (formData?.get("phone") as string)?.trim();
  const fullName = (formData?.get("fullName") as string)?.trim() || undefined;
  const email = (formData?.get("email") as string)?.trim() || undefined;

  if (!phoneRaw) return { errors: { phone: "Phone number is required" } };

  let normalized: string;
  try {
    normalized = normalizePhone(phoneRaw);
  } catch {
    return { errors: { phone: "Invalid phone number" } };
  }

  const [existing] = await db
    .select({ id: individuals.id })
    .from(individuals)
    .where(eq(individuals.normalizedPhone, normalized))
    .limit(1);

  if (existing)
    return { error: "A record with this phone number already exists." };

  const credaraId = `crd-${nanoid(10)}`;
  await db.insert(individuals).values({
    phone: phoneRaw,
    normalizedPhone: normalized,
    fullName: fullName ?? null,
    email: email ?? null,
    credaraId,
    verificationStatus: "NOT_STARTED",
    updatedAt: new Date(),
  });

  return { submitted: true };
}
