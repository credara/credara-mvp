"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  getAdminUserById,
  updateAgentVerification,
  updateAgentScore,
  updateAgentInternalNotes,
} from "@/app/actions/admin";
import { TrustScoreChart } from "@/components/dashboard/trust-score-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, Copy, Pencil, Shield, X } from "lucide-react";
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
    mutationFn: (trustScore: number) => updateAgentScore(id, trustScore),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "agent", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Score updated");
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

  const displayName =
    profile.fullName ?? profile.email ?? profile.phone ?? "Agent";

  const copyCredaraId = () => {
    if (!profile.credaraId) return;
    void navigator.clipboard.writeText(profile.credaraId);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="mx-auto max-w-4xl w-full space-y-6 px-4 py-6">
      <Link
        href="/admin/agents"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to POS Agents
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {displayName}
          </h1>
          <div className="mt-1 flex items-center gap-2">
            {profile.credaraId && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                {profile.credaraId}
                <button
                  type="button"
                  onClick={copyCredaraId}
                  className="rounded p-0.5 hover:bg-muted"
                  aria-label="Copy Credara ID"
                >
                  <Copy className="size-4" />
                </button>
              </span>
            )}
            <Badge
              variant={
                profile.verificationStatus === "VERIFIED"
                  ? "default"
                  : profile.verificationStatus === "REJECTED"
                  ? "destructive"
                  : "secondary"
              }
            >
              {profile.verificationStatus ?? "—"}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
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
            variant="outline"
            onClick={() => verifyMutation.mutate("REJECTED")}
            disabled={
              verifyMutation.isPending ||
              profile.verificationStatus === "REJECTED"
            }
          >
            <X className="mr-2 size-4" />
            Reject
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Personal information
          </h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Full Name</dt>
              <dd className="font-medium">{profile.fullName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email Address</dt>
              <dd className="font-medium">{profile.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Phone Number</dt>
              <dd className="font-medium">{profile.phone ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Credara ID</dt>
              <dd className="font-medium">{profile.credaraId ?? "—"}</dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Shield className="size-4" />
            Risk assessment
          </h2>
          <AgentScoreForm
            key={`score-${profile.trustScore ?? 0}`}
            currentScore={profile.trustScore}
            onSubmit={(trustScore) => scoreMutation.mutate(trustScore)}
            isPending={scoreMutation.isPending}
          />
        </section>
      </div>

      <section className="border-t pt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Additional notes
        </h2>
        <AgentNotesForm
          notes={profile.internalNotes ?? ""}
          onSubmit={(notes) => notesMutation.mutate(notes)}
          isPending={notesMutation.isPending}
        />
      </section>
    </div>
  );
}

function AgentScoreForm({
  currentScore,
  onSubmit,
  isPending,
}: {
  currentScore: number | null;
  onSubmit: (trustScore: number) => void;
  isPending: boolean;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(
    currentScore != null ? String(currentScore) : ""
  );
  const parsedScore =
    inputValue === "" ? 0 : Math.min(100, Math.max(0, Number(inputValue) || 0));
  const displayScore = isEditing ? parsedScore : currentScore ?? 0;
  const originalScore = currentScore ?? 0;
  const scoreHasChanged = parsedScore !== originalScore;

  const startEditing = () => {
    setInputValue(currentScore != null ? String(currentScore) : "");
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(parsedScore);
    setIsEditing(false);
  };

  return (
    <div className="relative">
      <TrustScoreChart score={displayScore}>
        {isEditing && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap items-end gap-3"
          >
            <div className="space-y-2">
              <Label htmlFor="trustScore">Trust Score</Label>
              <Input
                id="trustScore"
                type="number"
                min={0}
                max={100}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-24"
              />
            </div>
            <Button type="submit" disabled={isPending || !scoreHasChanged}>
              Update Score
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </form>
        )}
      </TrustScoreChart>
      {!isEditing && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={startEditing}
          className="absolute bottom-4 right-4"
        >
          <Pencil className="mr-2 size-4" />
          Edit
        </Button>
      )}
    </div>
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
        rows={6}
        className="mb-3 min-h-48 resize-none"
      />
      <Button type="submit" size="sm" disabled={isPending}>
        Save Notes
      </Button>
    </form>
  );
}
