"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrustScoreChart } from "@/components/dashboard/trust-score-chart";
import { lookupByPhone, applyForTrustReport } from "@/app/actions/individuals";
import type { PublicIndividualResult } from "@/app/actions/individuals";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import LandingHeader from "@/components/hero/landing-header";

function getStatusColor(status: string | null) {
  switch (status) {
    case "VERIFIED":
      return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    case "IN_PROGRESS":
      return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
    case "NOT_STARTED":
      return "bg-neutral-500/20 text-neutral-400 border border-neutral-500/30";
    default:
      return "bg-neutral-500/20 text-neutral-400 border border-neutral-500/30";
  }
}

function TrustScoreResult({ result }: { result: PublicIndividualResult }) {
  return (
    <div className="w-full min-h-screen">
      <main className="max-w-[1060px] mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">
            Your Trust Score
          </h1>
          <p className="text-neutral-400 text-base">
            Track your Trust Score and Verification Status
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="md:col-span-2 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8 flex flex-col">
            <TrustScoreChart score={result.trustScore ?? 0} variant="landing" />
          </div>

          <div className="rounded-lg p-6 md:p-8 border border-white/10 bg-white/5 backdrop-blur-sm">
            <p className="text-sm font-medium text-neutral-400 mb-4">
              Verification
            </p>
            <div
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getStatusColor(result.verificationStatus)}`}
            >
              {(result.verificationStatus ?? "NOT_STARTED")
                .toUpperCase()
                .replace("_", " ")}
            </div>
            <p className="text-xs text-neutral-500">
              Your application is being reviewed by our team
            </p>
          </div>

          <div className="md:col-span-3 rounded-lg p-6 md:p-8 border border-white/10 bg-white/5 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-6">
              Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  Full Name
                </label>
                <p className="text-white font-medium">
                  {result.fullName ?? "—"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  Phone Number
                </label>
                <p className="text-white font-medium">{result.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SearchForm({
  onResult,
  onNotFound,
  isSearching,
  onSearchStart,
  onSearchEnd,
}: {
  onResult: (r: PublicIndividualResult) => void;
  onNotFound: () => void;
  isSearching: boolean;
  onSearchStart: () => void;
  onSearchEnd: () => void;
}) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const phone = (
      form.elements.namedItem("phone") as HTMLInputElement
    )?.value?.trim();
    if (!phone) return;
    onSearchStart();
    try {
      const res = await lookupByPhone(phone);
      if (res) onResult(res);
      else onNotFound();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid phone number");
      onSearchEnd();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Label htmlFor="phone" className="text-white font-medium">
        Phone number
      </Label>
      <Input
        id="phone"
        name="phone"
        type="tel"
        placeholder="+234 800 000 0000"
        required
        disabled={isSearching}
        className="border-[rgba(55,50,47,0.12)] bg-white text-[#37322F]"
      />
      <Button
        type="submit"
        disabled={isSearching}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {isSearching ? "Looking up…" : "Look up my trust score"}
      </Button>
    </form>
  );
}

function ApplySubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-white font-medium py-2 rounded-lg disabled:opacity-50"
    >
      {pending ? "Submitting…" : "Apply for trust report"}
    </Button>
  );
}

export default function MyTrustScorePage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const [result, setResult] = useState<PublicIndividualResult | null>(null);
  const [viewState, setViewState] = useState<
    "idle" | "searching" | "found" | "not_found"
  >("idle");
  const [searching, setSearching] = useState(false);
  const [applyState, formAction] = useActionState(applyForTrustReport, {});

  useEffect(() => {
    if (message === "login-disabled") {
      toast.info(
        "Individual login is no longer available. Use this page to view your trust score.",
      );
    }
  }, [message]);

  useEffect(() => {
    if (applyState?.error) toast.error(applyState.error);
    if (
      "submitted" in (applyState ?? {}) &&
      (applyState as { submitted?: boolean }).submitted
    ) {
      toast.success("Application received. We'll be in touch.");
    }
  }, [applyState]);

  const handleResult = (r: PublicIndividualResult) => {
    setResult(r);
    setViewState("found");
    setSearching(false);
  };
  const handleNotFound = () => {
    setViewState("not_found");
    setSearching(false);
  };

  const handleSearchStart = () => setSearching(true);
  const handleSearchEnd = () => setSearching(false);

  const showResult = viewState === "found" && result;
  const showNotFound = viewState === "not_found";

  return (
    <div className="min-h-screen bg-[#0a0e17] flex flex-col">
      <div
        className="relative flex flex-col min-h-dvh"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,.09) 2px, transparent 0)
          `,
          backgroundSize: "24px 24px", // Reduced from 48px for closer dots
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-primary/10 pointer-events-none" />
        <div className="">
          <LandingHeader />
        </div>

        {showResult ? (
          <TrustScoreResult result={result!} />
        ) : (
          <main className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <h1 className="text-white text-3xl font-semibold leading-tight mb-2">
                  My trust score
                </h1>
                <p className="text-neutral-400 text-base">
                  Enter your phone number to view your trust score
                </p>
              </div>

              {!showNotFound ? (
                <div>
                  <SearchForm
                    onResult={handleResult}
                    onNotFound={handleNotFound}
                    isSearching={searching}
                    onSearchStart={handleSearchStart}
                    onSearchEnd={handleSearchEnd}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border border-red-500/50 bg-red-500/10 p-4 rounded-lg">
                    <p className="text-red-500">
                      No trust score found for this number.
                    </p>
                  </div>
                  <p className=" text-neutral-400">
                    Apply for a trust report and we&apos;ll process your
                    application.
                  </p>
                  <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="apply-phone"
                        className="text-white font-medium"
                      >
                        Phone number
                      </Label>
                      <Input
                        id="apply-phone"
                        name="phone"
                        type="tel"
                        placeholder="+234 800 000 0000"
                        required
                        className="border-[rgba(55,50,47,0.12)] bg-white text-[#37322F]"
                      />
                      {applyState?.errors?.phone && (
                        <p className="text-red-600 text-sm">
                          {applyState.errors.phone}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="apply-name"
                        className="text-white font-medium"
                      >
                        Full name{" "}
                        <span className="text-neutral-400">(optional)</span>
                      </Label>
                      <Input
                        id="apply-name"
                        name="fullName"
                        type="text"
                        placeholder="Your name"
                        className="border-[rgba(55,50,47,0.12)] bg-white text-[#37322F]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="apply-email"
                        className="text-white font-medium"
                      >
                        Email{" "}
                        <span className="text-neutral-400">(optional)</span>
                      </Label>
                      <Input
                        id="apply-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="border-[rgba(55,50,47,0.12)] bg-white text-[#37322F]"
                      />
                    </div>
                    <ApplySubmitButton />
                  </form>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setViewState("idle")}
                  >
                    Search again
                  </Button>
                </div>
              )}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
