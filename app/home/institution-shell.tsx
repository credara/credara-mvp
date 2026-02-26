"use client";

import { useState } from "react";
import { InstitutionHeader } from "@/components/dashboard/institution-header";
import { InstitutionLayout } from "./institution-layout";

export function InstitutionShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
      <InstitutionHeader onOpenSidebar={() => setSidebarOpen(true)} />
      <InstitutionLayout
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      >
        {children}
      </InstitutionLayout>
    </div>
  );
}
