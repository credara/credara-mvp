"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

export function AdminHeader() {
  const { user, signOut } = useAuth();
  const email = user?.email ?? "";
  const initials = email ? email.slice(0, 2).toUpperCase() : "?";

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <Link href="/admin" className="text-lg font-semibold text-foreground">
        Credara Admin
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Avatar>
              <AvatarImage src={user?.user_metadata?.avatar_url} alt="" />
              <AvatarFallback className="bg-muted text-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {email && (
            <>
              <DropdownMenuLabel className="font-normal truncate">
                {email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
