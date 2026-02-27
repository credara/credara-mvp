import { createClient } from "./server";
import { mapProfileToUser } from "@/lib/types/profile-mapper";
import type { AnyUser } from "@/lib/types/users";
import { supabaseRowToProfile } from "./supabase-profile";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(): Promise<AnyUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;
  return mapProfileToUser(
    supabaseRowToProfile(data as Record<string, unknown>)
  );
}
