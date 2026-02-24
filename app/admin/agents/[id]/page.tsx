"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  getAdminUserById,
  updateAgentVerification,
  updateAgentScore,
  updateAgentProfile,
  updateAgentInternalNotes,
} from "@/app/actions/admin";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminAgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["admin", "agent", id],
    queryFn: () => getAdminUserById(id),
  });

  const verifyMutation = useMutation({
    mutationFn: (status: "VERIFIED" | "REJECTED") =>
      updateAgentVerification(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "agent", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Verification status updated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const scoreMutation = useMutation({
    mutationFn: ({
      trustScore,
      riskLevel,
    }: {
      trustScore: number;
      riskLevel?: "LOW" | "MEDIUM" | "HIGH";
    }) => updateAgentScore(id, trustScore, riskLevel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "agent", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Score updated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const profileMutation = useMutation({
    mutationFn: (data: {
      fullName?: string;
      email?: string | null;
      riskLevel?: "LOW" | "MEDIUM" | "HIGH";
      credaraId?: string;
    }) => updateAgentProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "agent", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Profile updated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const notesMutation = useMutation({
    mutationFn: (notes: string) => updateAgentInternalNotes(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "agent", id] });
      toast.success("Notes saved");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  if (isLoading || !profile) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        {isLoading ? "Loading..." : "User not found"}
      </div>
    );
  }

  if (profile.role !== "INDIVIDUAL") {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Not an individual user
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/agents"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to POS Agents
      </Link>
      <h1 className="text-2xl font-semibold">
        {profile.fullName ?? profile.email ?? profile.phone}
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
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
              <span className="text-muted-foreground">Credara ID:</span>{" "}
              {profile.credaraId ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Status:</span>{" "}
              <Badge variant="outline">
                {profile.verificationStatus ?? "—"}
              </Badge>
            </p>
            <p>
              <span className="text-muted-foreground">Trust Score:</span>{" "}
              {profile.trustScore ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Risk Level:</span>{" "}
              {profile.riskLevel ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">Verification</CardHeader>
          <CardContent className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => verifyMutation.mutate("VERIFIED")}
              disabled={
                verifyMutation.isPending ||
                profile.verificationStatus === "VERIFIED"
              }
            >
              <Check className="mr-2 size-4" />
              Approve
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => verifyMutation.mutate("REJECTED")}
              disabled={
                verifyMutation.isPending ||
                profile.verificationStatus === "REJECTED"
              }
            >
              <X className="mr-2 size-4" />
              Reject
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">Score Override</CardHeader>
          <CardContent>
            <AgentScoreForm
              currentScore={profile.trustScore}
              currentRisk={profile.riskLevel}
              onSubmit={(trustScore, riskLevel) =>
                scoreMutation.mutate({ trustScore, riskLevel })
              }
              isPending={scoreMutation.isPending}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">Manual Data</CardHeader>
          <CardContent>
            <AgentProfileForm
              fullName={profile.fullName}
              email={profile.email}
              riskLevel={profile.riskLevel}
              credaraId={profile.credaraId}
              onSubmit={(data) => profileMutation.mutate(data)}
              isPending={profileMutation.isPending}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">Internal Notes</CardHeader>
          <CardContent>
            <AgentNotesForm
              notes={profile.internalNotes ?? ""}
              onSubmit={(notes) => notesMutation.mutate(notes)}
              isPending={notesMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AgentScoreForm({
  currentScore,
  currentRisk,
  onSubmit,
  isPending,
}: {
  currentScore: number | null;
  currentRisk: "LOW" | "MEDIUM" | "HIGH" | null;
  onSubmit: (trustScore: number, riskLevel?: "LOW" | "MEDIUM" | "HIGH") => void;
  isPending: boolean;
}) {
  const scoreRef = React.useRef<HTMLInputElement>(null);
  const riskRef = React.useRef<HTMLSelectElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = Number(scoreRef.current?.value ?? 0);
    const risk = riskRef.current?.value as "LOW" | "MEDIUM" | "HIGH" | "";
    onSubmit(score, risk || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
      <div className="flex items-end gap-2">
        <div>
          <Label htmlFor="trustScore" className="text-xs">
            Trust Score (0–1000)
          </Label>
          <Input
            id="trustScore"
            ref={scoreRef}
            type="number"
            min={0}
            max={1000}
            defaultValue={currentScore ?? ""}
            className="w-24"
          />
        </div>
        <div>
          <Label htmlFor="riskLevel" className="text-xs">
            Risk
          </Label>
          <select
            id="riskLevel"
            ref={riskRef}
            className="flex h-9 w-[100px] rounded-md border border-input bg-background px-3 py-1 text-sm"
            defaultValue={currentRisk ?? ""}
          >
            <option value="">—</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <Button type="submit" size="sm" disabled={isPending}>
          Update Score
        </Button>
      </div>
    </form>
  );
}

function AgentProfileForm({
  fullName,
  email,
  riskLevel,
  credaraId,
  onSubmit,
  isPending,
}: {
  fullName: string | null;
  email: string | null;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | null;
  credaraId: string | null;
  onSubmit: (data: {
    fullName?: string;
    email?: string | null;
    riskLevel?: "LOW" | "MEDIUM" | "HIGH";
    credaraId?: string;
  }) => void;
  isPending: boolean;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    onSubmit({
      fullName: (data.get("fullName") as string) || undefined,
      email: (data.get("email") as string) || null,
      riskLevel:
        (data.get("riskLevel") as "LOW" | "MEDIUM" | "HIGH") || undefined,
      credaraId: (data.get("credaraId") as string) || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={fullName ?? ""}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={email ?? ""}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="credaraId">Credara ID</Label>
        <Input
          id="credaraId"
          name="credaraId"
          defaultValue={credaraId ?? ""}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="riskLevel">Risk Level</Label>
        <select
          id="riskLevel"
          name="riskLevel"
          className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
          defaultValue={riskLevel ?? ""}
        >
          <option value="">—</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={isPending}>
          Save Profile
        </Button>
      </div>
    </form>
  );
}

function AgentNotesForm({
  notes,
  onSubmit,
  isPending,
}: {
  notes: string;
  onSubmit: (notes: string) => void;
  isPending: boolean;
}) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(textareaRef.current?.value ?? "");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Textarea
        ref={textareaRef}
        name="notes"
        defaultValue={notes}
        placeholder="Internal notes (visible only to admins)"
        rows={4}
        className="mb-3"
      />
      <Button type="submit" size="sm" disabled={isPending}>
        Save Notes
      </Button>
    </form>
  );
}
