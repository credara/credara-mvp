"use client";

import React, { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  getAdminUserById,
  addCreditsToLandlord,
  getAdminAuditLogs,
} from "@/app/actions/admin";
import { DataTable } from "@/components/admin/data-table";
import { creditHistoryColumns } from "../../audit/credit-history-columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Copy, Coins, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AUDIT_PAGE_SIZE = 10;

export default function AdminLandlordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const queryClient = useQueryClient();
  const [creditsPage, setCreditsPage] = React.useState(1);
  const amountRef = useRef<HTMLInputElement>(null);
  const paymentRefRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["admin", "landlord", id],
    queryFn: () => getAdminUserById(id),
  });

  const { data: creditHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["admin", "landlord", id, "credits", creditsPage],
    queryFn: () =>
      getAdminAuditLogs({
        page: creditsPage,
        pageSize: AUDIT_PAGE_SIZE,
        targetUserId: id,
        action: "CREDIT_ADD",
      }),
  });

  const addCreditsMutation = useMutation({
    mutationFn: (payload: { amount: number; paymentReference?: string }) =>
      addCreditsToLandlord(id, payload.amount, payload.paymentReference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "landlord", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "landlords"] });
      if (amountRef.current) amountRef.current.value = "";
      if (paymentRefRef.current) paymentRefRef.current.value = "";
      toast.success("Credits added");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const handleAddCredits = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(amountRef.current?.value ?? 0);
    if (amount < 1) {
      toast.error("Enter a valid amount");
      return;
    }
    addCreditsMutation.mutate({
      amount,
      paymentReference: paymentRefRef.current?.value?.trim() || undefined,
    });
  };

  if (isLoading || !profile) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        {isLoading ? <Loader2 className="size-4 animate-spin" /> : "User not found"}
      </div>
    );
  }

  if (profile.role !== "LANDLORD") {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Not a landlord
      </div>
    );
  }

  const displayName =
    profile.businessName ??
    profile.fullName ??
    profile.email ??
    profile.phone ??
    "Landlord";

  const copyCredaraId = () => {
    if (!profile.credaraId) return;
    void navigator.clipboard.writeText(profile.credaraId);
    toast.success("Copied to clipboard");
  };

  const creditHistoryPageCount = Math.ceil(
    (creditHistory?.totalCount ?? 0) / AUDIT_PAGE_SIZE
  );

  return (
    <div className="mx-auto max-w-4xl w-full space-y-6 px-4 py-6">
      <Link
        href="/admin/landlords"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Landlords
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
              <dt className="text-muted-foreground">Credit balance</dt>
              <dd className="font-medium">{profile.creditBalance ?? 0}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Total credits purchased</dt>
              <dd className="font-medium">
                {profile.totalCreditsPurchased ?? 0}
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary/20">
              <Coins className="size-4 text-primary" />
            </div>
            Add credits
          </h2>
          <form onSubmit={handleAddCredits} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="credits-amount">Amount</Label>
              <Input
                ref={amountRef}
                id="credits-amount"
                type="number"
                min={1}
                placeholder="e.g. 50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits-payment-ref">
                Payment reference (optional)
              </Label>
              <Input
                ref={paymentRefRef}
                id="credits-payment-ref"
                type="text"
                placeholder="Payment ref or note"
              />
            </div>
            <Button type="submit" disabled={addCreditsMutation.isPending}>
              Add credits
            </Button>
          </form>
        </section>
      </div>

      <section className="border-t pt-6">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Credit history
        </h2>
        {historyLoading ? (
          <div className="py-6 text-center text-muted-foreground text-sm">
            <Loader2 className="size-4 animate-spin" />
          </div>
        ) : (
          <DataTable
            columns={creditHistoryColumns}
            data={creditHistory?.data ?? []}
            page={creditsPage}
            pageCount={creditHistoryPageCount}
            totalCount={creditHistory?.totalCount}
            onPageChange={setCreditsPage}
          />
        )}
      </section>
    </div>
  );
}
