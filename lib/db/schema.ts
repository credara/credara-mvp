import {
  pgTable,
  uuid,
  timestamp,
  text,
  varchar,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", [
  "INDIVIDUAL",
  "LANDLORD",
  "FINTECH",
  "ADMIN",
]);
export const verificationStatusEnum = pgEnum("verification_status", [
  "NOT_STARTED",
  "IN_PROGRESS",
  "PENDING_REVIEW",
  "VERIFIED",
  "REJECTED",
]);
export const riskLevelEnum = pgEnum("risk_level", ["LOW", "MEDIUM", "HIGH"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "ACTIVE",
  "EXPIRED",
  "PENDING",
  "NONE",
]);
export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "MONTHLY",
  "YEARLY",
]);
export const adminLevelEnum = pgEnum("admin_level", [
  "SUPER",
  "VERIFIER",
  "FINANCE",
  "SUPPORT",
]);

// Profiles table – extends Supabase auth.users
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // links to auth.users.id
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  credaraId: varchar("credara_id", { length: 64 }),
  email: varchar("email", { length: 255 }),
  fullName: varchar("full_name", { length: 255 }),

  role: userRoleEnum("role").notNull(),
  institutionType: varchar("institution_type", { length: 32 }), // LANDLORD | FINTECH
  businessName: varchar("business_name", { length: 255 }),

  // IndividualUser
  trustScore: integer("trust_score"),
  riskLevel: riskLevelEnum("risk_level"),
  verificationStatus: verificationStatusEnum("verification_status"),
  lastVerificationDate: timestamp("last_verification_date"),

  // InstitutionUser
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),

  // LandlordUser
  creditBalance: integer("credit_balance").default(0),
  totalCreditsPurchased: integer("total_credits_purchased").default(0),
  lastCreditPurchaseDate: timestamp("last_credit_purchase_date"),

  // FintechUser
  subscriptionStatus: subscriptionStatusEnum("subscription_status"),
  subscriptionPlan: subscriptionPlanEnum("subscription_plan"),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  totalReportsUnlocked: integer("total_reports_unlocked").default(0),

  // AdminUser
  adminLevel: adminLevelEnum("admin_level"),
  lastActive: timestamp("last_active"),
});

// Infer types from Postgres schema – use these as source of truth
export type Profile = InferSelectModel<typeof profiles>;
export type NewProfile = InferInsertModel<typeof profiles>;
