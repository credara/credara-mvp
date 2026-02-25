import type { Profile } from "@/lib/db/schema";
import type { AnyUser } from "./users";
import { scoreToRiskLevel } from "@/lib/trust-score";

/**
 * Maps a Drizzle/Postgres Profile row to the app's AnyUser discriminated union.
 * Types are derived from the Postgres schema (lib/db/schema.ts) via InferSelectModel.
 */
export function mapProfileToUser(profile: Profile): AnyUser {
  const base = {
    id: profile.id,
    createdAt: profile.createdAt ?? new Date(),
    updatedAt: profile.updatedAt ?? new Date(),
    phone: profile.phone,
    credaraId: profile.credaraId ?? undefined,
    email: profile.email ?? null,
    fullName: profile.fullName ?? null,
  };

  switch (profile.role) {
    case "INDIVIDUAL":
      return {
        ...base,
        role: "INDIVIDUAL",
        trustScore: profile.trustScore ?? null,
        riskLevel: scoreToRiskLevel(profile.trustScore ?? null) ?? null,
        verificationStatus: profile.verificationStatus ?? "NOT_STARTED",
        lastVerificationDate: profile.lastVerificationDate ?? null,
      } as AnyUser;

    case "LANDLORD":
      return {
        ...base,
        role: "LANDLORD",
        institutionType: "LANDLORD",
        businessName: profile.businessName ?? null,
        isActive: profile.isActive ?? true,
        lastLogin: profile.lastLogin ?? null,
        creditBalance: profile.creditBalance ?? 0,
        totalCreditsPurchased: profile.totalCreditsPurchased ?? 0,
        lastCreditPurchaseDate: profile.lastCreditPurchaseDate ?? null,
      } as AnyUser;

    case "FINTECH":
      return {
        ...base,
        role: "FINTECH",
        institutionType: "FINTECH",
        businessName: profile.businessName ?? null,
        isActive: profile.isActive ?? true,
        lastLogin: profile.lastLogin ?? null,
        subscriptionStatus: profile.subscriptionStatus ?? "NONE",
        subscriptionPlan: profile.subscriptionPlan ?? null,
        subscriptionStartDate: profile.subscriptionStartDate ?? null,
        subscriptionEndDate: profile.subscriptionEndDate ?? null,
        totalReportsUnlocked: profile.totalReportsUnlocked ?? 0,
      } as AnyUser;

    case "ADMIN":
      return {
        ...base,
        role: "ADMIN",
        adminLevel: profile.adminLevel ?? undefined,
        lastActive: profile.lastActive ?? null,
      } as AnyUser;

    default:
      return {
        ...base,
        role: "INDIVIDUAL",
        verificationStatus: "NOT_STARTED",
      } as AnyUser;
  }
}
