"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export default function LandingHeader() {
  const { user } = useAuth();

  return (
    <header className="w-full flex justify-center items-center px-4 sm:px-6 lg:px-8 py-4 z-20">
      <div className="w-full max-w-6xl flex justify-between items-center gap-4">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo-primary-horizontal-black.png"
            alt="Credara"
            width={120}
            height={32}
            className="h-8 w-auto invert"
          />
        </Link>
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-5 font-medium shrink-0"
        >
          <Link href={user ? "/home" : "/signup"}>
            {user ? "Dashboard" : "Get Started"}
          </Link>
        </Button>
      </div>
    </header>
  );
}
