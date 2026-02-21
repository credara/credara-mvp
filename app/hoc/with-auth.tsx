import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/auth-helpers";
import { getProfile } from "@/lib/supabase/auth-helpers";

export async function WithAuth({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/login");

  const profile = await getProfile();
  if (!profile) redirect("/onboarding");

  return <>{children}</>;
}
