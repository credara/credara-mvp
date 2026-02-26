"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
      <AdminHeader onOpenSidebar={() => setSidebarOpen(true)} />
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <AdminSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        <main className="flex-1 min-w-0 overflow-auto border border-border flex justify-center p-4 md:p-6">
          <div className="w-full max-w-4xl pb-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
