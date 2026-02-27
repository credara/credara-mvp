"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/auth-context";

export default function CTASection() {
  const { user } = useAuth();

  return (
    <section className="w-full border-b border-white/10 bg-[#0a0e17]">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-12 flex justify-center items-center gap-6">
        <div className="w-full max-w-[586px] px-6 py-5 md:py-8 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-6">
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <h2 className="self-stretch text-center flex justify-center flex-col text-white text-3xl md:text-5xl font-semibold leading-tight md:leading-[56px] font-sans tracking-tight">
              Ready to verify trustworthiness?
            </h2>
            <p className="self-stretch text-center text-white/70 text-base leading-7 font-sans font-medium">
              Get comprehensive Credara Trust Scores to support your rental
              <br />
              and lending decisions with confidence.
            </p>
          </div>
          <div className="w-full max-w-[497px] flex flex-col justify-center items-center gap-12">
            <Button
              asChild
              className="h-10 px-12 py-[6px] bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium"
            >
              <Link href={user ? "/home" : "/signup"}>
                {user ? "Go to dashboard" : "Start for free"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
