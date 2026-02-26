"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TrustScoreChart } from "@/components/dashboard/trust-score-chart";
import { IndividualUser } from "@/lib/types/users";
import { useAuth } from "@/contexts/auth-context";

export default function IndividualDashboard({
  individualProfile,
}: {
  individualProfile: IndividualUser;
}) {
  const { user } = useAuth();
  const getStatusColor = () => {
    switch (individualProfile?.verificationStatus) {
      case "VERIFIED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "NOT_STARTED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F5F3]">
      <main className="max-w-[1060px] mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-secondary mb-2">
            Your Dashboard
          </h1>
          <p className="text-muted-foreground text-base">
            Track your Trust Score and Verification Status
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Trust Score Chart Card */}
          <div className="md:col-span-2">
            <TrustScoreChart score={individualProfile?.trustScore ?? 0} />
          </div>

          {/* Quick Stats Card */}
          <div className="rounded-lg p-6 md:p-8 border border-border bg-white">
            <p className="text-sm font-medium text-muted-foreground mb-4">
              Verification
            </p>
            <div
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getStatusColor()}`}
            >
              {individualProfile?.verificationStatus
                .toUpperCase()
                .replace("_", " ")}
            </div>
            <p className="text-xs text-muted-foreground">
              Your application is being reviewed by our team
            </p>
          </div>

          {/* Profile Information Card */}
          <div className="md:col-span-3 rounded-lg p-6 md:p-8 border border-[#E3E2E1] bg-white">
            <h2 className="text-lg font-semibold text-secondary mb-6">
              Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Full Name
                </label>
                <p className="text-secondary font-medium">
                  {individualProfile?.fullName ??
                    user?.user_metadata?.full_name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Phone Number
                </label>
                <p className="text-secondary font-medium">
                  {individualProfile?.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps Card */}
          <div className="md:col-span-3 rounded-lg p-6 md:p-8 border border-[#E3E2E1] bg-[#F7F5F3]">
            <h2 className="text-lg font-semibold text-secondary mb-4">
              Next Steps
            </h2>
            <p className="text-muted-foreground mb-6">
              To complete your verification, please contact our team with your
              details. We'll guide you through the process.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="bg-secondary hover:bg-secondary/90 text-white px-6"
                onClick={() =>
                  window.open("https://wa.me/2348012345678", "_blank")
                }
              >
                Chat on WhatsApp
              </Button>
              <Button
                variant="outline"
                className="border-[#37322F] text-[#37322F] hover:bg-[#37322F]/5"
                onClick={() =>
                  (window.location.href = "mailto:verify@credara.com")
                }
              >
                Email Us
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
