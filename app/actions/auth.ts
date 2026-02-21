"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  loginSchema,
  signUpSchema,
  forgotPasswordSchema,
  onboardingSchema,
} from "@/app/(auth)/schema";
import { db, profiles } from "@/lib/db";

export type LoginFormState = {
  error?: string;
  errors?: Record<string, string>;
};
export type SignUpFormState = {
  error?: string;
  errors?: Record<string, string>;
};
export type ForgotPasswordFormState = {
  error?: string;
  errors?: Record<string, string>;
};
export type OnboardingFormState = {
  error?: string;
  errors?: Record<string, string>;
};

function getFormData(prev: unknown, formData: FormData | null): FormData {
  if (formData && formData instanceof FormData) return formData;
  if (prev && prev instanceof FormData) return prev;
  return new FormData();
}

export async function signIn(
  prev: LoginFormState | FormData,
  formData?: FormData | null
): Promise<LoginFormState> {
  const data = getFormData(prev, formData ?? null);
  const raw = {
    email: data.get("email") as string,
    password: data.get("password") as string,
  };
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    parsed.error.flatten().fieldErrors &&
      Object.entries(parsed.error.flatten().fieldErrors).forEach(([k, v]) => {
        if (v?.[0]) errors[k] = v[0];
      });
    return { errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: error.message };
  redirect("/");
}

export async function signUp(
  prev: SignUpFormState | FormData,
  formData?: FormData | null
): Promise<SignUpFormState> {
  const data = getFormData(prev, formData ?? null);
  const raw = {
    fullName: data.get("fullName") as string,
    email: data.get("email") as string,
    password: data.get("password") as string,
    confirmPassword: data.get("confirmPassword") as string,
    userType: data.get("userType") as string,
    agreed: data.get("agreed") === "on",
  };
  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    parsed.error.flatten().fieldErrors &&
      Object.entries(parsed.error.flatten().fieldErrors).forEach(([k, v]) => {
        if (v?.[0]) errors[k] = v[0];
      });
    return { errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
    },
  });
  if (error) return { error: error.message };
  redirect("/confirm-email");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const redirectTo = `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/api/auth/callback`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) return { error: error.message };
  if (data?.url) redirect(data.url);
  return { error: "Failed to get Google sign-in URL" };
}

export async function signInWithGoogleForm(_formData: FormData) {
  await signInWithGoogle();
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function resetPassword(
  _prev: ForgotPasswordFormState,
  formData: FormData
): Promise<ForgotPasswordFormState & { message?: string }> {
  const raw = { email: formData.get("email") as string };
  const parsed = forgotPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    parsed.error.flatten().fieldErrors &&
      Object.entries(parsed.error.flatten().fieldErrors).forEach(([k, v]) => {
        if (v?.[0]) errors[k] = v[0];
      });
    return { errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${
        process.env.NEXT_PUBLIC_SITE_URL || ""
      }/auth/reset-password`,
    }
  );
  if (error) return { error: error.message };
  return { message: "Check your email for the reset link" };
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
    const data = getFormData(prev, formData ?? null);
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
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (existing) {
      redirect("/home");
    }

    await db.insert(profiles).values({
      id: user.id,
      phone: parsed.data.phone,
      email: user.email ?? undefined,
      fullName: user.user_metadata?.full_name ?? undefined,
      role,
      institutionType:
        role === "LANDLORD" || role === "FINTECH" ? role : undefined,
      businessName: parsed.data.businessName || undefined,
    });
  } catch (error) {
    console.log(error);
    return { error: "Failed to complete onboarding" };
  }
  redirect("/home");
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/login?updated=password");
}
