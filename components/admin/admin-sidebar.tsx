"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  LayoutDashboard,
  Landmark,
  Building2,
  Users,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/agents", label: "POS Agents", icon: Users },
  { href: "/admin/landlords", label: "Landlords", icon: Building2 },
  { href: "/admin/fintechs", label: "Fintechs", icon: Landmark },
  { href: "/admin/audit", label: "Audit Logs", icon: FileText },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 p-4 flex flex-col gap-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted ${
              isActive
                ? "bg-primary/10 ring ring-primary/20 ring-inset text-foreground"
                : "text-muted-foreground"
            }`}
          >
            <Icon
              className={`size-4 shrink-0 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            />
            {label}
          </Link>
        );
      })}
    </aside>
  );
}
