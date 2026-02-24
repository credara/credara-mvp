"use server";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db, profiles } from "@/lib/db";
import { supabaseRowToProfile } from "@/lib/supabase/supabase-profile";
import { getFormData, OnboardingFormState } from "./auth";
import { onboardingSchema } from "@/app/(auth)/schema";
import { nanoid } from "nanoid";

export async function getUserProfile(userId: string) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error || !data) redirect("/onboarding");
    return supabaseRowToProfile(data as Record<string, unknown>);
  } catch (error) {
    console.error(error);
    redirect("/onboarding");
  }
}

const USER_TYPE_TO_ROLE = {
  individual: "INDIVIDUAL",
  landlord: "LANDLORD",
  fintech: "FINTECH",
} as const;

export async function completeOnboarding(
  prev: OnboardingFormState | FormData,
  formData?: FormData | null
): Promise<OnboardingFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  try {
    const data = await getFormData(prev, formData ?? null);
    const raw = {
      userType: data.get("userType") as string,
      phone: data.get("phone") as string,
      businessName: (data.get("businessName") as string | null) || undefined,
    };
    const parsed = onboardingSchema.safeParse(raw);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.flatten().fieldErrors &&
        Object.entries(parsed.error.flatten().fieldErrors).forEach(([k, v]) => {
          if (v?.[0]) errors[k] = v[0];
        });
      return { errors };
    }

    const role = USER_TYPE_TO_ROLE[parsed.data.userType];
    const { data: existing } = await supabase
      .from("profiles")
      .select("id, credara_id")
      .eq("id", user.id)
      .maybeSingle();

    const credaraId = `crd-${nanoid(10)}`;
    const profileData = {
      phone: parsed.data.phone,
      email: user.email ?? undefined,
      fullName: user.user_metadata?.full_name ?? undefined,
      credaraId,
      role,
      institutionType:
        role === "LANDLORD" || role === "FINTECH" ? role : undefined,
      businessName: parsed.data.businessName || undefined,
      updatedAt: new Date(),
    };

    if (existing?.credara_id) {
      redirect("/home");
    }
    if (existing) {
      await db
        .update(profiles)
        .set(profileData)
        .where(eq(profiles.id, user.id));
    } else {
      await db.insert(profiles).values({
        id: user.id,
        ...profileData,
      });
    }
  } catch (error) {
    console.log(error);
    return { error: "Failed to complete onboarding" };
  }
  redirect("/home");
}
