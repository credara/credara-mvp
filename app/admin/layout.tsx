import { WithAdminAuth } from "@/app/hoc/with-admin-auth";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WithAdminAuth>
      <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
        <AdminHeader />
        <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 min-w-0 overflow-auto border border-border flex justify-center p-6">
            <div className="w-full max-w-4xl pb-10">{children}</div>
          </main>
        </div>
      </div>
    </WithAdminAuth>
  );
}
