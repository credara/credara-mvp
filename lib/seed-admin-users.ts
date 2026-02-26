import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import { db, profiles } from "@/lib/db";
import { eq } from "drizzle-orm";

const TEST_PASSWORD = "test-password-1";

type SeedUser =
  | {
      email: string;
      fullName: string;
      role: "INDIVIDUAL";
      phone: string;
      verificationStatus?:
        | "NOT_STARTED"
        | "IN_PROGRESS"
        | "VERIFIED"
        | "REJECTED";
      trustScore?: number | null;
      credaraId: string;
    }
  | {
      email: string;
      fullName: string;
      role: "LANDLORD";
      phone: string;
      businessName?: string | null;
      credaraId: string;
      isActive?: boolean;
      creditBalance?: number;
      totalCreditsPurchased?: number;
    }
  | {
      email: string;
      fullName: string;
      role: "FINTECH";
      phone: string;
      businessName?: string | null;
      credaraId: string;
      isActive?: boolean;
      subscriptionStatus?: "ACTIVE" | "EXPIRED" | "NONE";
      subscriptionPlan?: "MONTHLY" | "YEARLY" | null;
      totalReportsUnlocked?: number;
    };

const seedUsers: SeedUser[] = [
  {
    email: "individual@test.credara.local",
    fullName: "Test POS Agent",
    role: "INDIVIDUAL",
    phone: "+15550000001",
    verificationStatus: "VERIFIED",
    trustScore: 75,
    credaraId: `crd-${nanoid(10)}`,
  },
  {
    email: "individual-pending@test.credara.local",
    fullName: "Pending Agent",
    role: "INDIVIDUAL",
    phone: "+15550000002",
    verificationStatus: "IN_PROGRESS",
    trustScore: null,
    credaraId: `crd-${nanoid(10)}`,
  },
  {
    email: "landlord@test.credara.local",
    fullName: "Test Landlord",
    role: "LANDLORD",
    phone: "+15550000003",
    businessName: "Test Property Co",
    credaraId: `crd-${nanoid(10)}`,
    isActive: true,
    creditBalance: 10,
    totalCreditsPurchased: 10,
  },
  {
    email: "fintech@test.credara.local",
    fullName: "Test Fintech",
    role: "FINTECH",
    phone: "+15550000004",
    businessName: "Test Fintech Inc",
    credaraId: `crd-${nanoid(10)}`,
    isActive: true,
    subscriptionStatus: "ACTIVE",
    subscriptionPlan: "MONTHLY",
    totalReportsUnlocked: 5,
  },
];

async function insertProfile(userId: string, u: SeedUser) {
  const base = {
    id: userId,
    phone: u.phone,
    email: u.email,
    fullName: u.fullName,
    credaraId: u.credaraId,
    role: u.role,
  };

  if (u.role === "INDIVIDUAL") {
    await db.insert(profiles).values({
      ...base,
      verificationStatus: u.verificationStatus ?? "NOT_STARTED",
      trustScore: u.trustScore ?? null,
    });
    return;
  }

  if (u.role === "LANDLORD") {
    await db.insert(profiles).values({
      ...base,
      institutionType: "LANDLORD",
      businessName: u.businessName ?? null,
      isActive: u.isActive ?? true,
      creditBalance: u.creditBalance ?? 0,
      totalCreditsPurchased: u.totalCreditsPurchased ?? 0,
    });
    return;
  }

  if (u.role === "FINTECH") {
    await db.insert(profiles).values({
      ...base,
      institutionType: "FINTECH",
      businessName: u.businessName ?? null,
      isActive: u.isActive ?? true,
      subscriptionStatus: u.subscriptionStatus ?? "NONE",
      subscriptionPlan: u.subscriptionPlan ?? null,
      totalReportsUnlocked: u.totalReportsUnlocked ?? 0,
    });
  }
}

export type SeedResult = {
  ok: boolean;
  message: string;
  created?: string[];
  skipped?: string[];
  errors?: string[];
  password: string;
};

export async function seedAdminTestUsers(): Promise<SeedResult> {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return {
      ok: false,
      message: "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
      password: TEST_PASSWORD,
    };
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const created: string[] = [];
  const skipped: string[] = [];
  const errors: string[] = [];

  for (const u of seedUsers) {
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email: u.email,
        password: TEST_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: u.fullName },
      });

    if (authError) {
      if (authError.message.includes("already been registered")) {
        const { data: existing } = await supabase.auth.admin.listUsers();
        const existingUser = existing?.users?.find((x) => x.email === u.email);
        if (!existingUser) {
          errors.push(`${u.email}: ${authError.message}`);
          continue;
        }
        const userId = existingUser.id;
        const [existingProfile] = await db
          .select({ id: profiles.id })
          .from(profiles)
          .where(eq(profiles.id, userId))
          .limit(1);
        if (existingProfile) {
          skipped.push(u.email);
          continue;
        }
        await insertProfile(userId, u);
        created.push(`${u.email} (existing auth)`);
        continue;
      }
      errors.push(`${u.email}: ${authError.message}`);
      continue;
    }

    if (!authUser?.user?.id) {
      errors.push(`${u.email}: no user id returned`);
      continue;
    }

    await insertProfile(authUser.user.id, u);
    created.push(`${u.email} (${u.role})`);
  }

  return {
    ok: true,
    message: "Seed complete",
    created,
    skipped,
    ...(errors.length > 0 && { errors }),
    password: TEST_PASSWORD,
  };
}
