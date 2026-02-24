import type { Profile } from "@/lib/db/schema";

const PROFILE_SNAKE_TO_CAMEL: [string, string][] = [
  ["credara_id", "credaraId"],
  ["created_at", "createdAt"],
  ["updated_at", "updatedAt"],
  ["full_name", "fullName"],
  ["institution_type", "institutionType"],
  ["business_name", "businessName"],
  ["trust_score", "trustScore"],
  ["risk_level", "riskLevel"],
  ["verification_status", "verificationStatus"],
  ["last_verification_date", "lastVerificationDate"],
  ["internal_notes", "internalNotes"],
  ["is_active", "isActive"],
  ["last_login", "lastLogin"],
  ["credit_balance", "creditBalance"],
  ["total_credits_purchased", "totalCreditsPurchased"],
  ["last_credit_purchase_date", "lastCreditPurchaseDate"],
  ["subscription_status", "subscriptionStatus"],
  ["subscription_plan", "subscriptionPlan"],
  ["subscription_start_date", "subscriptionStartDate"],
  ["subscription_end_date", "subscriptionEndDate"],
  ["total_reports_unlocked", "totalReportsUnlocked"],
  ["admin_level", "adminLevel"],
  ["last_active", "lastActive"],
];

export function supabaseRowToProfile(row: Record<string, unknown>): Profile {
  const out = { ...row };
  for (const [snake, camel] of PROFILE_SNAKE_TO_CAMEL) {
    if (row[snake] !== undefined)
      (out as Record<string, unknown>)[camel] = row[snake];
  }
  return out as Profile;
}
