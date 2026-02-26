"use client";

import { useAuth } from "@/contexts/auth-context";
import { useInstitutionSidebar } from "@/app/home/institution-sidebar-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";

export function InstitutionHeader() {
  const { user, signOut } = useAuth();
  const { setOpen } = useInstitutionSidebar();
  const email = user?.email ?? "";
  const initials = email ? email.slice(0, 2).toUpperCase() : "?";

  return (
    <header className="flex h-14 shrink-0 w-full items-center bg-background px-4 md:px-6">
      <div className="flex w-full items-center justify-between gap-2 md:gap-6 min-w-0">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden block"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
          <img
            src="/logo-primary-horizontal-black.png"
            alt="Credara"
            className="w-auto h-8 shrink-0"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 border border-input rounded-full px-1 py-0.5 outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
            >
              <Avatar>
                <AvatarImage src={user?.user_metadata?.avatar_url} alt="" />
                <AvatarFallback className="bg-muted text-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
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
