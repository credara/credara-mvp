interface BaseUser {
  id: string; // UUID or string ID
  createdAt: Date;
  updatedAt: Date;
  phone: string;
  credaraId?: string; // Unique Credara ID (generated for individuals, tags that user's might later be able to send to the team for easy filtering)
  email?: string | null;
  fullName?: string | null;
}

// Individual User (POS agents)
export interface IndividualUser extends BaseUser {
  role: "INDIVIDUAL";
  trustScore?: number | null; // 0-1000 or null if not yet scored
  riskLevel?: "LOW" | "MEDIUM" | "HIGH" | null;
  verificationStatus:
    | "NOT_STARTED"
    | "IN_PROGRESS"
    | "PENDING_REVIEW"
    | "VERIFIED"
    | "REJECTED";
  lastVerificationDate?: Date | null;
}

// Institution User – shared base for Landlord & Fintech
export interface InstitutionUser extends BaseUser {
  role: "LANDLORD" | "FINTECH";
  businessName?: string | null;
  institutionType: "LANDLORD" | "FINTECH"; // redundant with role but useful for filtering
  isActive: boolean; // e.g., subscription active or credits > 0
  lastLogin?: Date | null;
}

// Specific extensions
export interface LandlordUser extends InstitutionUser {
  role: "LANDLORD";
  creditBalance: number; // Current credits available (default 0)
  totalCreditsPurchased: number; // Lifetime purchased (for auditing)
  lastCreditPurchaseDate?: Date | null;
}

export interface FintechUser extends InstitutionUser {
  role: "FINTECH";
  subscriptionStatus: "ACTIVE" | "EXPIRED" | "PENDING" | "NONE";
  subscriptionPlan?: "MONTHLY" | "YEARLY" | null;
  subscriptionStartDate?: Date | null;
  subscriptionEndDate?: Date | null;
  totalReportsUnlocked: number; // Lifetime count (analytics)
}


// Admin (Credara Team Member)
export interface AdminUser extends BaseUser {
  role: "ADMIN";
  adminLevel?: "SUPER" | "VERIFIER" | "FINANCE" | "SUPPORT"; // permissions (later)
  lastActive?: Date | null;
}

export type AnyUser = IndividualUser | LandlordUser | FintechUser | AdminUser;

// Discriminated union helper (role-based narrowing)
export type UserByRole<R extends AnyUser["role"]> = Extract<
  AnyUser,
  { role: R }
>;
