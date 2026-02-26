import { WithAdminAuth } from "@/app/hoc/with-admin-auth";
import { AdminShell } from "@/app/admin/admin-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WithAdminAuth>
      <AdminShell>{children}</AdminShell>
    </WithAdminAuth>
  );
}
