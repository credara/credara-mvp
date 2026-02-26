"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CreditCard } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const navItems = [
  { href: "/home", label: "Overview", icon: LayoutDashboard },
  { href: "/home/billing", label: "Billing", icon: CreditCard },
] as const;

function NavLinks({
  pathname,
  onLinkClick,
}: {
  pathname: string;
  onLinkClick?: () => void;
}) {
  return (
    <>
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onLinkClick}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted ${
            pathname === href
              ? "bg-primary/10 ring ring-primary/20 ring-inset text-foreground"
              : "text-muted-foreground"
          }`}
        >
          <Icon
            className={`size-4 shrink-0 ${
              pathname === href ? "text-primary" : "text-muted-foreground"
            }`}
          />
          {label}
        </Link>
      ))}
    </>
  );
}

export function InstitutionLayout({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
      <aside className="hidden md:flex w-56 shrink-0 flex-col gap-1 p-4">
        <NavLinks pathname={pathname} />
      </aside>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-56 p-0 pt-12">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <nav className="flex flex-col gap-1 p-4">
            <NavLinks
              pathname={pathname}
              onLinkClick={() => onOpenChange(false)}
            />
          </nav>
        </SheetContent>
      </Sheet>
      <main className="flex min-w-0 flex-1 justify-center overflow-auto border border-border p-4 md:p-6">
        <div className="w-full max-w-4xl pb-10">{children}</div>
      </main>
    </div>
  );
}
