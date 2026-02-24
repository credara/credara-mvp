import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/auth-helpers";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, credara_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.credara_id) redirect("/home");

  return <>{children}</>;
}
