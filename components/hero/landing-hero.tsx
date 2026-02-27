"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import TrustScoreCards from "./trust-score-cards";

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0 text-primary"
    >
      <path
        d="M16 5L7 14L4 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const features = [
  "You Own Your Report",
  "Reference-Backed",
  "Results in 24-48hrs",
];

export default function LandingHero() {
  const { user } = useAuth();

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center pt-6 pb-12 lg:pt-8 lg:pb-16">
      <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-16">
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/60 text-white text-sm font-medium mb-4 lg:mb-6">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary shrink-0"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Building Nigeria&apos;s Trust Infrastructure
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold text-white leading-tight tracking-tight">
            Know Who You&apos;re
            <br />
            <span className="text-primary">Trusting</span>
          </h1>

          <p className="text-white/85 text-base sm:text-lg mt-4 lg:mt-6 leading-relaxed">
            Credara is a manual-first trust verification platform. We help
            landlords and fintech lenders make safer decisions through
            community-backed verification and structured Trust Scores. Not
            instant — thorough.
          </p>

          <div className="flex flex-wrap gap-3 mt-6 lg:mt-8">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-5 sm:px-6 py-2.5 font-medium inline-flex items-center gap-2"
            >
              <Link href={user ? "/home" : "/signup"}>
                Get Your Trust Score
                <span aria-hidden>→</span>
              </Link>
            </Button>
          </div>

          <ul className="flex flex-col gap-2 mt-6 lg:mt-8">
            {features.map((label) => (
              <li
                key={label}
                className="flex items-center gap-2 text-white/90 text-sm"
              >
                <CheckIcon />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 flex justify-center lg:justify-end min-h-[200px] sm:min-h-0">
          <TrustScoreCards />
        </div>
      </div>
    </section>
  );
}
