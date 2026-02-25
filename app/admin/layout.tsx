import { WithAdminAuth } from "@/app/hoc/with-admin-auth";
import { AdminHeader } from "@/components/admin/admin-header";
import {
  FileText,
  LayoutDashboard,
  Landmark,
  Building2,
  Users,
} from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/agents", label: "POS Agents", icon: Users },
  { href: "/admin/landlords", label: "Landlords", icon: Building2 },
  { href: "/admin/fintechs", label: "Fintechs", icon: Landmark },
  { href: "/admin/audit", label: "Audit Logs", icon: FileText },
] as const;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WithAdminAuth>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        <AdminHeader />
        <div className="flex flex-1 min-h-0">
          <aside className="w-56 shrink-0 p-4 flex flex-col gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
              >
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                {label}
              </Link>
            ))}
          </aside>
          <main className="flex-1 min-w-0 overflow-auto border border-border flex justify-center p-6">
            <div className="w-full max-w-4xl">{children}</div>
          </main>
        </div>
      </div>
    </WithAdminAuth>
  );
}
