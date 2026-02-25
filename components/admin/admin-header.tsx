"use client";

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
    <header className="flex h-14 shrink-0 w-full items-center bg-background px-6">
      <div className="flex w-full items-center justify-between">
        <img src="/logo-primary-horizontal-black.png" className="w-auto h-8" />
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
      </div>
    </header>
  );
}
