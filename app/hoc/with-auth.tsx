import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/auth-helpers";

export async function WithAuth({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/login");
  return <>{children}</>;
}
