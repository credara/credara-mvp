"use server";

import { eq, and, ilike, or, desc, inArray } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db, profiles, reportUnlocks } from "@/lib/db";
import type { TrustReportContent } from "@/lib/types/trust-report";

async function requireInstitution() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  if (!profile || (profile.role !== "LANDLORD" && profile.role !== "FINTECH"))
    throw new Error("Forbidden");
  return { user, profile };
}

export type LookupResult = {
  id: string;
  fullName: string | null;
  credaraId: string | null;
  trustScore: number | null;
  riskLevel: string | null;
  hasUnlocked: boolean;
};

export async function searchLookup(term: string): Promise<LookupResult[]> {
  const { user } = await requireInstitution();

  if (!term?.trim() || term.trim().length < 2) return [];

  const t = `%${term.trim()}%`;
  const rows = await db
    .select({
      id: profiles.id,
      fullName: profiles.fullName,
      credaraId: profiles.credaraId,
      trustScore: profiles.trustScore,
      riskLevel: profiles.riskLevel,
    })
    .from(profiles)
    .where(
      and(
        eq(profiles.role, "INDIVIDUAL"),
        or(
          ilike(profiles.phone, t),
          ilike(profiles.credaraId, t),
          ilike(profiles.fullName, t),
          ilike(profiles.email, t)
        )!
      )
    )
    .limit(20);

  if (!rows.length) return [];

  const ids = rows.map((r) => r.id);

  const unlockedRows = await db
    .select({
      targetProfileId: reportUnlocks.targetProfileId,
    })
    .from(reportUnlocks)
    .where(
      and(
        eq(reportUnlocks.institutionUserId, user.id),
        inArray(reportUnlocks.targetProfileId, ids)
      )
    );

  const unlockedSet = new Set(unlockedRows.map((u) => u.targetProfileId));

  return rows.map((r) => ({
    ...r,
    hasUnlocked: unlockedSet.has(r.id),
  }));
}

export type UnlockedReportRow = {
  id: string;
  targetProfileId: string;
  userName: string | null;
  credaraId: string | null;
  scoreAtUnlock: number | null;
  riskLevel: string | null;
  unlockedAt: string;
};

export async function getUnlockedReports(params: {
  page?: number;
  pageSize?: number;
}): Promise<{ data: UnlockedReportRow[]; totalCount: number }> {
  const { user, profile } = await requireInstitution();

  const page = params.page ?? 1;
  const pageSize = Math.min(params.pageSize ?? 10, 100);
  const offset = (page - 1) * pageSize;

  const where = eq(reportUnlocks.institutionUserId, user.id);

  const [rows, totalCount] = await Promise.all([
    db
      .select()
      .from(reportUnlocks)
      .where(where)
      .orderBy(desc(reportUnlocks.createdAt))
      .limit(pageSize)
      .offset(offset),
    db.$count(reportUnlocks, where),
  ]);

  const data: UnlockedReportRow[] = rows.map((r) => ({
    id: r.id,
    targetProfileId: r.targetProfileId,
    userName: r.targetUserName ?? null,
    credaraId: r.targetCredaraId ?? null,
    scoreAtUnlock: r.scoreAtUnlock ?? null,
    riskLevel: r.riskLevel ?? null,
    unlockedAt: r.createdAt.toISOString(),
  }));

  return { data, totalCount };
}

const CREDITS_PER_UNLOCK = 1;

export async function unlockReport(
  targetProfileId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { user, profile } = await requireInstitution();

  const [target] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, targetProfileId))
    .limit(1);

  if (!target || target.role !== "INDIVIDUAL")
    return { ok: false, error: "User not found or not an individual" };

  if (profile.role === "LANDLORD") {
    const balance = profile.creditBalance ?? 0;
    if (balance < CREDITS_PER_UNLOCK)
      return { ok: false, error: "Insufficient credits" };
    await db
      .update(profiles)
      .set({
        creditBalance: balance - CREDITS_PER_UNLOCK,
        totalReportsUnlocked: (profile.totalReportsUnlocked ?? 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, user.id));
  } else {
    if (profile.subscriptionStatus !== "ACTIVE")
      return { ok: false, error: "Subscription is not active" };
    await db
      .update(profiles)
      .set({
        totalReportsUnlocked: (profile.totalReportsUnlocked ?? 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, user.id));
  }

  await db.insert(reportUnlocks).values({
    institutionUserId: user.id,
    targetProfileId: target.id,
    targetUserName: target.fullName ?? null,
    targetCredaraId: target.credaraId ?? null,
    scoreAtUnlock: target.trustScore ?? null,
    riskLevel: target.riskLevel ?? null,
  });

  return { ok: true };
}

export type ReportProfile = {
  id: string;
  fullName: string | null;
  email: string | null;
  phone: string;
  credaraId: string | null;
  trustScore: number | null;
  riskLevel: string | null;
  verificationStatus: string | null;
  trustReportContent: TrustReportContent | null;
};

export async function getReportByTargetId(
  targetProfileId: string
): Promise<ReportProfile | null> {
  const { user } = await requireInstitution();

  const [unlock] = await db
    .select()
    .from(reportUnlocks)
    .where(
      and(
        eq(reportUnlocks.institutionUserId, user.id),
        eq(reportUnlocks.targetProfileId, targetProfileId)
      )
    )
    .limit(1);

  if (!unlock) return null;

  const [target] = await db
    .select({
      id: profiles.id,
      fullName: profiles.fullName,
      email: profiles.email,
      phone: profiles.phone,
      credaraId: profiles.credaraId,
      trustScore: profiles.trustScore,
      riskLevel: profiles.riskLevel,
      verificationStatus: profiles.verificationStatus,
      trustReportContent: profiles.trustReportContent,
    })
    .from(profiles)
    .where(eq(profiles.id, targetProfileId))
    .limit(1);

  if (!target || target.id !== unlock.targetProfileId) return null;

  const content = target.trustReportContent as TrustReportContent | null;
  return {
    id: target.id,
    fullName: target.fullName ?? null,
    email: target.email ?? null,
    phone: target.phone,
    credaraId: target.credaraId ?? null,
    trustScore: target.trustScore ?? null,
    riskLevel: target.riskLevel ?? null,
    verificationStatus: target.verificationStatus ?? null,
    trustReportContent: content ?? null,
  };
}
