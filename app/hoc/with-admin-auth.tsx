import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/auth-helpers";
import { getProfile } from "@/lib/supabase/auth-helpers";

export async function WithAdminAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/login");

  const profile = await getProfile();
  if (!profile || profile.role !== "ADMIN") redirect("/");

  return <>{children}</>;
}
