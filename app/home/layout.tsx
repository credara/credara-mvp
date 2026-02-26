"use client";

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
  const { profile } = useUserProfile();
  const role = profile?.role;

  if (!role) return <Loading />;

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
