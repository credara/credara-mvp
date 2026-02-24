"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getAdminUserById } from "@/app/actions/admin";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export default function AdminFintechDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { data: profile, isLoading } = useQuery({
    queryKey: ["admin", "fintech", id],
    queryFn: () => getAdminUserById(id),
  });

  if (isLoading || !profile) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        {isLoading ? "Loading..." : "User not found"}
      </div>
    );
  }

  if (profile.role !== "FINTECH") {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Not a fintech
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/fintechs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Fintechs
      </Link>
      <h1 className="text-2xl font-semibold">
        {profile.businessName ?? profile.fullName ?? profile.email ?? profile.phone}
      </h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">Profile</CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Email:</span>{" "}
              {profile.email ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Phone:</span>{" "}
              {profile.phone}
            </p>
            <p>
              <span className="text-muted-foreground">Business:</span>{" "}
              {profile.businessName ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Subscription:</span>{" "}
              <Badge variant="outline">{profile.subscriptionStatus ?? "—"}</Badge>
            </p>
            <p>
              <span className="text-muted-foreground">Plan:</span>{" "}
              {profile.subscriptionPlan ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Reports Unlocked:</span>{" "}
              {profile.totalReportsUnlocked ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">Actions</CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            Subscription management and activation logs will go here.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
