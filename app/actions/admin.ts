"use server";

import { eq, and, or, ne, desc, ilike } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db, profiles, auditLogs } from "@/lib/db";

const ROLE_MAP = {
  agents: "INDIVIDUAL" as const,
  landlords: "LANDLORD" as const,
  fintechs: "FINTECH" as const,
};

const STATUS_MAP = {
  verified: "VERIFIED" as const,
  rejected: "REJECTED" as const,
  pending: "IN_PROGRESS" as const,
  "not-started": "NOT_STARTED" as const,
};

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "ADMIN") throw new Error("Forbidden");
  return { user, profile };
}

export async function getAdminStats() {
  await requireAdmin();

  const nonAdmin = ne(profiles.role, "ADMIN");

  const [total, verified, rejected, pending, agents, landlords, fintechs] =
    await Promise.all([
      db.$count(profiles, nonAdmin),
      db.$count(
        profiles,
        and(nonAdmin, eq(profiles.verificationStatus, "VERIFIED"))
      ),
      db.$count(
        profiles,
        and(nonAdmin, eq(profiles.verificationStatus, "REJECTED"))
      ),
      db.$count(
        profiles,
        and(nonAdmin, eq(profiles.verificationStatus, "IN_PROGRESS"))
      ),
      db.$count(profiles, eq(profiles.role, "INDIVIDUAL")),
      db.$count(profiles, eq(profiles.role, "LANDLORD")),
      db.$count(profiles, eq(profiles.role, "FINTECH")),
    ]);

  return {
    total,
    verified,
    rejected,
    pending,
    agents,
    landlords,
    fintechs,
  };
}

export type AdminUsersParams = {
  page?: number;
  pageSize?: number;
  role?: "INDIVIDUAL" | "LANDLORD" | "FINTECH";
  verificationStatus?: "NOT_STARTED" | "IN_PROGRESS" | "VERIFIED" | "REJECTED";
  search?: string;
};

export async function getAdminUsers(params: AdminUsersParams = {}) {
  await requireAdmin();

  const page = params.page ?? 1;
  const pageSize = Math.min(params.pageSize ?? 10, 100);
  const offset = (page - 1) * pageSize;

  const conditions = [ne(profiles.role, "ADMIN")];
  if (params.role) conditions.push(eq(profiles.role, params.role));
  if (params.verificationStatus)
    conditions.push(eq(profiles.verificationStatus, params.verificationStatus));
  if (params.search?.trim()) {
    const term = `%${params.search.trim()}%`;
    conditions.push(
      or(
        ilike(profiles.fullName, term),
        ilike(profiles.email, term),
        ilike(profiles.phone, term),
        ilike(profiles.credaraId, term)
      )!
    );
  }

  const where = conditions.length > 1 ? and(...conditions) : conditions[0];

  const [data, totalCount] = await Promise.all([
    db
      .select()
      .from(profiles)
      .where(where)
      .orderBy(desc(profiles.createdAt))
      .limit(pageSize)
      .offset(offset),
    db.$count(profiles, where),
  ]);

  return { data, totalCount };
}

export async function getAdminUserById(id: string) {
  await requireAdmin();

  const [row] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
    .limit(1);

  return row ?? null;
}

export async function updateAgentVerification(
  userId: string,
  status: "VERIFIED" | "REJECTED"
) {
  const { user } = await requireAdmin();

  const [target] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (!target || target.role !== "INDIVIDUAL")
    throw new Error("User not found or not an individual");

  await db
    .update(profiles)
    .set({
      verificationStatus: status,
      lastVerificationDate: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, userId));

  await db.insert(auditLogs).values({
    adminId: user.id,
    targetUserId: userId,
    action:
      status === "VERIFIED" ? "VERIFICATION_APPROVE" : "VERIFICATION_REJECT",
    details: `Status set to ${status}`,
  });
}

export async function updateAgentScore(
  userId: string,
  trustScore: number,
  riskLevel?: "LOW" | "MEDIUM" | "HIGH"
) {
  const { user } = await requireAdmin();

  const [target] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (!target || target.role !== "INDIVIDUAL")
    throw new Error("User not found or not an individual");

  const updates: Record<string, unknown> = {
    trustScore: Math.min(1000, Math.max(0, trustScore)),
    updatedAt: new Date(),
  };
  if (riskLevel) updates.riskLevel = riskLevel;

  await db.update(profiles).set(updates).where(eq(profiles.id, userId));

  await db.insert(auditLogs).values({
    adminId: user.id,
    targetUserId: userId,
    action: "SCORE_OVERRIDE",
    details: `Trust score set to ${trustScore}${
      riskLevel ? `, risk: ${riskLevel}` : ""
    }`,
  });
}

export async function updateAgentProfile(
  userId: string,
  data: {
    fullName?: string;
    email?: string | null;
    riskLevel?: "LOW" | "MEDIUM" | "HIGH";
    credaraId?: string;
  }
) {
  await requireAdmin();

  const [target] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (!target || target.role !== "INDIVIDUAL")
    throw new Error("User not found or not an individual");

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (data.fullName !== undefined) updates.fullName = data.fullName;
  if (data.email !== undefined) updates.email = data.email;
  if (data.riskLevel !== undefined) updates.riskLevel = data.riskLevel;
  if (data.credaraId !== undefined) updates.credaraId = data.credaraId;

  await db.update(profiles).set(updates).where(eq(profiles.id, userId));
}

export async function updateAgentInternalNotes(userId: string, notes: string) {
  await requireAdmin();

  const [target] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (!target || target.role !== "INDIVIDUAL")
    throw new Error("User not found or not an individual");

  await db
    .update(profiles)
    .set({ internalNotes: notes || null, updatedAt: new Date() })
    .where(eq(profiles.id, userId));
}

export async function getAdminAuditLogs(params: {
  page?: number;
  pageSize?: number;
}) {
  await requireAdmin();

  const page = params.page ?? 1;
  const pageSize = Math.min(params.pageSize ?? 20, 100);
  const offset = (page - 1) * pageSize;

  const [data, totalCount] = await Promise.all([
    db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(pageSize)
      .offset(offset),
    db.$count(auditLogs),
  ]);

  return { data, totalCount };
}
