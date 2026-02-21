"use server";
import { Profile } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getUserProfile(userId: string) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error || !data) redirect("/onboarding");
    return data as Profile;
  } catch (error) {
    console.error(error);
    redirect("/onboarding");
  }
}
