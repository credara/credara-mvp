"use client";

import { useUserProfile } from "@/contexts/user-profile-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Coins, CreditCard } from "lucide-react";
import Loading from "../../loading";

export default function BillingPage() {
  const { profile } = useUserProfile();
  const role = profile?.role;

  if (!role) return <Loading />;

  if (role !== "LANDLORD" && role !== "FINTECH") {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Billing is only available for landlord and fintech accounts.
      </div>
    );
  }

  const isLandlord = role === "LANDLORD";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Billing {isLandlord ? "& credits" : "& subscription"}
        </h1>
      </div>

      {isLandlord ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-none">
            <CardHeader className="pb-2 flex flex-row items-center gap-2">
              <Coins className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Current balance
              </span>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">
                {profile.creditBalance ?? 0}
              </span>
              <p className="text-sm text-muted-foreground mt-1">credits</p>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Total credits purchased
              </span>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">
                {profile.totalCreditsPurchased ?? 0}
              </span>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-none">
            <CardHeader className="pb-2 flex flex-row items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/20">
                <CreditCard className="size-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Subscription
              </span>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Status:</span>{" "}
                {profile.subscriptionStatus ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Plan:</span>{" "}
                {profile.subscriptionPlan ?? "—"}
              </p>
              {profile.subscriptionStartDate && (
                <p>
                  <span className="text-muted-foreground">Start date:</span>{" "}
                  {new Date(profile.subscriptionStartDate).toLocaleDateString()}
                </p>
              )}
              {profile.subscriptionEndDate && (
                <p>
                  <span className="text-muted-foreground">End date:</span>{" "}
                  {new Date(profile.subscriptionEndDate).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="shadow-none">
        <CardHeader className="pb-2">
          <span className="text-sm font-medium text-muted-foreground">
            {isLandlord ? "How to buy credits" : "Renew / upgrade"}
          </span>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {isLandlord ? (
            <p>
              Contact the Credara team via WhatsApp, email, or phone to purchase
              credits. Suggested packs (e.g. 50 credits) can be arranged with
              the team.
            </p>
          ) : (
            <p>
              Contact the Credara team to renew your subscription or upgrade
              your plan. If your subscription is nearing its end date, we
              recommend reaching out before the grace period.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
