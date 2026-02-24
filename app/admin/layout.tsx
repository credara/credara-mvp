import { WithAdminAuth } from "@/app/hoc/with-admin-auth";
import { AdminHeader } from "@/components/admin/admin-header";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WithAdminAuth>
      <div className="min-h-screen flex flex-col bg-background">
        <AdminHeader />
        <div className="flex flex-1">
          <aside className="w-56 border-r border-border p-4 flex flex-col gap-2">
            <Link
              href="/admin"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
            >
              Overview
            </Link>
            <Link
              href="/admin/agents"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
            >
              POS Agents
            </Link>
            <Link
              href="/admin/landlords"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
            >
              Landlords
            </Link>
            <Link
              href="/admin/fintechs"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
            >
              Fintechs
            </Link>
            <Link
              href="/admin/audit"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
            >
              Audit Logs
            </Link>
          </aside>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </WithAdminAuth>
  );
}
