"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/contexts/user-profile-context";
import { Header } from "@/components/dashboard/header";
import { InstitutionShell } from "./institution-shell";
import Loading from "../loading";

export function HomeLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { profile, loading } = useUserProfile();
  const role = profile?.role;

  useEffect(() => {
    if (role === "ADMIN") router.replace("/admin");
  }, [role, router]);

  if (!role) return <Loading />;
  if (role === "ADMIN") return <Loading />;

  const isInstitution = role === "LANDLORD" || role === "FINTECH";

  if (isInstitution) {
    return <InstitutionShell>{children}</InstitutionShell>;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
