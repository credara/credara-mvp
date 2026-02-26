"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  searchLookup,
  getUnlockedReports,
  unlockReport,
} from "@/app/actions/institution";
import { DataTable } from "@/components/admin/data-table";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { unlockedReportsColumns } from "./unlocked-reports-columns";
import { TrustScoreChart } from "@/components/dashboard/trust-score-chart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, Shield } from "lucide-react";
import Link from "next/link";

const REPORTS_PAGE_SIZE = 10;

type InstitutionProfile = {
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

export function InstitutionDashboard({
  profile,
}: {
  profile: InstitutionProfile;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [reportsPage, setReportsPage] = useState(1);

  const unlockMutation = useMutation({
    mutationFn: (targetProfileId: string) => unlockReport(targetProfileId),
    onSuccess: (result, targetProfileId) => {
      if (result.ok) {
        queryClient.invalidateQueries({
          queryKey: ["institution", "unlocked-reports"],
        });
        queryClient.invalidateQueries({
          queryKey: ["institution", "lookup", search],
        });
        toast.success("Report unlocked");
        router.push(`/home/reports/${targetProfileId}`);
      } else {
        toast.error(result.error);
      }
    },
    onError: () => toast.error("Failed to unlock report"),
  });

  const { data: lookupResults, isLoading: lookupLoading } = useQuery({
    queryKey: ["institution", "lookup", search],
    queryFn: () => searchLookup(search),
    enabled: search.length >= 2,
  });

  const { data: reportsData, isLoading: reportsLoading } = useQuery({
    queryKey: ["institution", "unlocked-reports", reportsPage],
    queryFn: () =>
      getUnlockedReports({ page: reportsPage, pageSize: REPORTS_PAGE_SIZE }),
  });

  const reportsPageCount = Math.ceil(
    (reportsData?.totalCount ?? 0) / REPORTS_PAGE_SIZE
  );

  const isLandlord = profile.role === "LANDLORD";
  const displayName =
    profile.businessName ??
    profile.fullName ??
    (isLandlord ? "Landlord" : "Fintech");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, {displayName}
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary/20">
              <FileText className="size-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Reports unlocked
            </span>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {profile.totalReportsUnlocked ?? 0}
            </span>
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Search & lookup
        </h2>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Search by phone number or Credara ID"
            className="max-w-sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              (e.preventDefault(), setSearch(searchInput.trim()))
            }
          />
          <Button
            variant="secondary"
            onClick={() => setSearch(searchInput.trim())}
          >
            Search
          </Button>
        </div>
        {search.length >= 2 && (
          <div className="rounded-md border bg-card p-3 text-sm">
            {lookupLoading ? (
              <p className="text-muted-foreground">Searching...</p>
            ) : lookupResults?.length ? (
              <ul className="space-y-4">
                {lookupResults.map((r) => (
                  <li
                    key={r.id}
                    className="flex flex-wrap items-center gap-4 rounded-md border p-3 last:border-b"
                  >
                    <div className="min-w-[100px]">
                      <TrustScoreChart score={r.trustScore ?? 0} compact />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{r.fullName ?? "—"}</p>
                      <p className="text-muted-foreground text-xs font-mono">
                        {r.credaraId ?? "—"}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => unlockMutation.mutate(r.id)}
                      disabled={unlockMutation.isPending}
                    >
                      {isLandlord ? "Unlock (1 credit)" : "Unlock report"}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No results.</p>
            )}
          </div>
        )}
      </section>

      <section id="unlocked-reports">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Unlocked reports
        </h2>
        {reportsLoading ? (
          <TableSkeleton
            columnCount={6}
            rowCount={REPORTS_PAGE_SIZE}
            showPagination
          />
        ) : (
          <DataTable
            columns={unlockedReportsColumns}
            data={reportsData?.data ?? []}
            page={reportsPage}
            pageCount={reportsPageCount}
            totalCount={reportsData?.totalCount}
            onPageChange={setReportsPage}
          />
        )}
      </section>
    </div>
  );
}
