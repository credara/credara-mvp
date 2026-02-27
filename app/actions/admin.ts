"use server";

import { eq, and, or, ne, desc, ilike } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db, profiles, auditLogs } from "@/lib/db";
import type { TrustReportContent } from "@/lib/types/trust-report";

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

const TRUST_SCORE_MIN = 1;
const TRUST_SCORE_MAX = 100;

export async function updateAgentScore(userId: string, trustScore: number) {
  const { user } = await requireAdmin();

  const [target] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (!target || target.role !== "INDIVIDUAL")
    throw new Error("User not found or not an individual");

  const clamped = Math.min(
    TRUST_SCORE_MAX,
    Math.max(TRUST_SCORE_MIN, trustScore)
  );

  await db
    .update(profiles)
    .set({ trustScore: clamped, updatedAt: new Date() })
    .where(eq(profiles.id, userId));

  await db.insert(auditLogs).values({
    adminId: user.id,
    targetUserId: userId,
    action: "SCORE_OVERRIDE",
    details: `Trust score set to ${clamped}`,
  });
}

export async function updateAgentProfile(
  userId: string,
  data: {
    fullName?: string;
    email?: string | null;
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

export async function updateAgentTrustReport(
  userId: string,
  content: TrustReportContent
) {
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
    .set({
      trustReportContent: content as unknown as Record<string, unknown>,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, userId));
}

export async function getAdminAuditLogs(params: {
  page?: number;
  pageSize?: number;
  targetUserId?: string;
  action?:
    | "CREDIT_ADD"
    | "SUBSCRIPTION_ACTIVATE"
    | "VERIFICATION_APPROVE"
    | "VERIFICATION_REJECT"
    | "SCORE_OVERRIDE"
    | "PROFILE_UPDATE"
    | "OTHER";
}) {
  await requireAdmin();

  const page = params.page ?? 1;
  const pageSize = Math.min(params.pageSize ?? 20, 100);
  const offset = (page - 1) * pageSize;

  const conditions = [];
  if (params.targetUserId)
    conditions.push(eq(auditLogs.targetUserId, params.targetUserId));
  if (params.action) conditions.push(eq(auditLogs.action, params.action));
  const where = conditions.length ? and(...conditions) : undefined;

  const dataPromise = where
    ? db
        .select()
        .from(auditLogs)
        .where(where)
        .orderBy(desc(auditLogs.createdAt))
        .limit(pageSize)
        .offset(offset)
    : db
        .select()
        .from(auditLogs)
        .orderBy(desc(auditLogs.createdAt))
        .limit(pageSize)
        .offset(offset);

  const countPromise = where
    ? db.$count(auditLogs, where)
    : db.$count(auditLogs);
  const [data, totalCount] = await Promise.all([dataPromise, countPromise]);

  return { data, totalCount };
}

export async function addCreditsToLandlord(
  userId: string,
  amount: number,
  paymentReference?: string
) {
  const { user } = await requireAdmin();

  const [target] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (!target || target.role !== "LANDLORD")
    throw new Error("User not found or not a landlord");
  if (amount <= 0) throw new Error("Amount must be greater than zero");

  const newBalance = (target.creditBalance ?? 0) + amount;
  const newTotal = (target.totalCreditsPurchased ?? 0) + amount;

  await db
    .update(profiles)
    .set({
      creditBalance: newBalance,
      totalCreditsPurchased: newTotal,
      lastCreditPurchaseDate: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, userId));

  const details = paymentReference
    ? `Added ${amount} credits. Payment ref: ${paymentReference}`
    : `Added ${amount} credits`;

  await db.insert(auditLogs).values({
    adminId: user.id,
    targetUserId: userId,
    action: "CREDIT_ADD",
    details,
  });
}

export async function updateFintechSubscription(
  userId: string,
  data: {
    subscriptionStatus: "ACTIVE" | "EXPIRED" | "NONE";
    subscriptionPlan?: "MONTHLY" | "YEARLY";
    subscriptionStartDate?: Date | null;
    subscriptionEndDate?: Date | null;
  }
) {
  const { user } = await requireAdmin();

  const [target] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (!target || target.role !== "FINTECH")
    throw new Error("User not found or not a fintech");

  const updates: Record<string, unknown> = {
    subscriptionStatus: data.subscriptionStatus,
    updatedAt: new Date(),
  };
  if (data.subscriptionPlan !== undefined)
    updates.subscriptionPlan = data.subscriptionPlan;
  if (data.subscriptionStartDate !== undefined)
    updates.subscriptionStartDate = data.subscriptionStartDate;
  if (data.subscriptionEndDate !== undefined)
    updates.subscriptionEndDate = data.subscriptionEndDate;

  await db.update(profiles).set(updates).where(eq(profiles.id, userId));

  await db.insert(auditLogs).values({
    adminId: user.id,
    targetUserId: userId,
    action: "SUBSCRIPTION_ACTIVATE",
    details: `Subscription set to ${data.subscriptionStatus}${
      data.subscriptionPlan ? ` – ${data.subscriptionPlan}` : ""
    }`,
  });
}
