"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/contexts/user-profile-context";
import { Header } from "@/components/dashboard/header";
import { InstitutionHeader } from "@/components/dashboard/institution-header";
import { InstitutionLayout } from "./institution-layout";
import { InstitutionSidebarProvider } from "./institution-sidebar-context";
import Loading from "../loading";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { profile } = useUserProfile();
  const role = profile?.role;

  useEffect(() => {
    if (role === "ADMIN") router.replace("/admin");
  }, [role, router]);

  if (!role) return <Loading />;
  if (role === "ADMIN") return <Loading />;

  const isInstitution = role === "LANDLORD" || role === "FINTECH";

  if (isInstitution) {
    return (
      <InstitutionSidebarProvider>
        <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
          <InstitutionHeader />
          <InstitutionLayout>{children}</InstitutionLayout>
        </div>
      </InstitutionSidebarProvider>
    );
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
