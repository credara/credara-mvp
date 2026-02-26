"use client";

import { useUserProfile } from "@/contexts/user-profile-context";
import { InstitutionDashboard } from "./institution-dashboard";
import Loading from "../loading";
import IndividualDashboard from "./individual-dashboard";

export default function HomePage() {
  const { profile } = useUserProfile();
  const userType = profile?.role;

  if (!userType) return <Loading />;

  if (userType === "INDIVIDUAL") {
    return <IndividualDashboard individualProfile={profile} />;
  }

  if (userType === "FINTECH" || userType === "LANDLORD") {
    const p = profile as {
      role: string;
      creditBalance?: number | null;
      totalReportsUnlocked?: number | null;
      subscriptionStatus?: string | null;
      subscriptionPlan?: string | null;
      subscriptionEndDate?: Date | null;
      totalCreditsPurchased?: number | null;
      businessName?: string | null;
      fullName?: string | null;
    };
    return <InstitutionDashboard profile={p} />;
  }

  return <div>Unknown</div>;
}
