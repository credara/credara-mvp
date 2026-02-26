"use client";

import React, { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  getAdminUserById,
  updateFintechSubscription,
  getAdminAuditLogs,
} from "@/app/actions/admin";
import { DataTable } from "@/components/admin/data-table";
import { subscriptionHistoryColumns } from "../../audit/subscription-history-columns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Copy, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AUDIT_PAGE_SIZE = 10;

export default function AdminFintechDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const queryClient = useQueryClient();
  const [subPage, setSubPage] = React.useState(1);
  const [planValue, setPlanValue] = React.useState<string>("NONE");
  const statusRef = useRef<HTMLSelectElement>(null);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["admin", "fintech", id],
    queryFn: () => getAdminUserById(id),
  });

  const { data: subHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["admin", "fintech", id, "subscription", subPage],
    queryFn: () =>
      getAdminAuditLogs({
        page: subPage,
        pageSize: AUDIT_PAGE_SIZE,
        targetUserId: id,
        action: "SUBSCRIPTION_ACTIVATE",
      }),
  });

  React.useEffect(() => {
    if (profile) setPlanValue(profile.subscriptionPlan ?? "NONE");
  }, [profile?.id, profile?.subscriptionPlan]);

  const updateSubMutation = useMutation({
    mutationFn: (data: {
      subscriptionStatus: "ACTIVE" | "EXPIRED" | "NONE";
      subscriptionPlan?: "MONTHLY" | "YEARLY";
      subscriptionStartDate?: Date | null;
      subscriptionEndDate?: Date | null;
    }) => updateFintechSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "fintech", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "fintechs"] });
      toast.success("Subscription updated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const handleUpdateSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    const status = (statusRef.current?.value ?? "NONE") as
      | "ACTIVE"
      | "EXPIRED"
      | "NONE";
    const plan =
      planValue === "NONE" ? undefined : (planValue as "MONTHLY" | "YEARLY");
    const startRaw = startRef.current?.value;
    const endRaw = endRef.current?.value;
    updateSubMutation.mutate({
      subscriptionStatus: status,
      subscriptionPlan: plan,
      subscriptionStartDate: startRaw ? new Date(startRaw) : null,
      subscriptionEndDate: endRaw ? new Date(endRaw) : null,
    });
  };

  if (isLoading || !profile) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <span>User not found</span>
        )}
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

  const displayName =
    profile.businessName ??
    profile.fullName ??
    profile.email ??
    profile.phone ??
    "Fintech";

  const copyCredaraId = () => {
    if (!profile.credaraId) return;
    void navigator.clipboard.writeText(profile.credaraId);
    toast.success("Copied to clipboard");
  };

  const subHistoryPageCount = Math.ceil(
    (subHistory?.totalCount ?? 0) / AUDIT_PAGE_SIZE
  );

  return (
    <div className="mx-auto max-w-4xl w-full space-y-6 px-4 py-6">
      <Link
        href="/admin/fintechs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Fintechs
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
            {profile.subscriptionStatus && (
              <Badge
                variant={
                  profile.subscriptionStatus === "ACTIVE"
                    ? "default"
                    : "secondary"
                }
              >
                {profile.subscriptionStatus}
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Profile
          </h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Full Name</dt>
              <dd className="font-medium">{profile.fullName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{profile.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="font-medium">{profile.phone ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Business</dt>
              <dd className="font-medium">{profile.businessName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Subscription</dt>
              <dd className="font-medium">
                {profile.subscriptionStatus ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Plan</dt>
              <dd className="font-medium">{profile.subscriptionPlan ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Reports unlocked</dt>
              <dd className="font-medium">
                {profile.totalReportsUnlocked ?? 0}
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary/20">
              <CreditCard className="size-4 text-primary" />
            </div>
            Update subscription
          </h2>
          <form onSubmit={handleUpdateSubscription} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="sub-status">Status</Label>
              <select
                ref={statusRef}
                id="sub-status"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                defaultValue={profile.subscriptionStatus ?? "NONE"}
              >
                <option value="NONE">None</option>
                <option value="ACTIVE">Active</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sub-plan">Plan</Label>
              <Select
                name="sub-plan"
                value={planValue}
                onValueChange={setPlanValue}
              >
                <SelectTrigger
                  id="sub-plan"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">—</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sub-start">Start date</Label>
              <Input
                ref={startRef}
                id="sub-start"
                type="date"
                defaultValue={
                  profile.subscriptionStartDate
                    ? new Date(profile.subscriptionStartDate)
                        .toISOString()
                        .slice(0, 10)
                    : ""
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sub-end">End date</Label>
              <Input
                ref={endRef}
                id="sub-end"
                type="date"
                defaultValue={
                  profile.subscriptionEndDate
                    ? new Date(profile.subscriptionEndDate)
                        .toISOString()
                        .slice(0, 10)
                    : ""
                }
              />
            </div>
            <Button type="submit" disabled={updateSubMutation.isPending}>
              Update subscription
            </Button>
          </form>
        </section>
      </div>

      <section className="border-t pt-6">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Subscription history
        </h2>
        {historyLoading ? (
          <div className="py-6 text-center text-muted-foreground text-sm">
            <Loader2 className="size-4 animate-spin" />
          </div>
        ) : (
          <DataTable
            columns={subscriptionHistoryColumns}
            data={subHistory?.data ?? []}
            page={subPage}
            pageCount={subHistoryPageCount}
            totalCount={subHistory?.totalCount}
            onPageChange={setSubPage}
          />
        )}
      </section>
    </div>
  );
}
