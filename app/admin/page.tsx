"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAdminStats, getAdminUsers } from "@/app/actions/admin";
import { DataTable } from "@/components/admin/data-table";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { usersColumns } from "./users/columns";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Loader2,
  Users,
  Building2,
  Landmark,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useUserProfile } from "@/contexts/user-profile-context";

const PAGE_SIZE = 10;

function OverviewCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="flex min-w-0 flex-1 basis-0 items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-xl font-bold tabular-nums tracking-tight">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function OverviewCardSkeleton() {
  return (
    <div className="flex min-w-0 flex-1 basis-0 items-center gap-3">
      <div className="size-10 shrink-0 rounded-full bg-muted animate-pulse" />
      <div className="flex min-w-0 flex-col gap-2">
        <div className="h-3 w-12 rounded bg-muted animate-pulse" />
        <div className="h-6 w-14 rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}

function GreetingOverviewSkeleton() {
  return (
    <>
      <div className="h-8 w-64 rounded bg-muted animate-pulse" />
      <div className="mt-4 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-stretch justify-between gap-4">
          <OverviewCardSkeleton />
          <div className="w-px shrink-0 bg-border" />
          <OverviewCardSkeleton />
          <div className="w-px shrink-0 bg-border" />
          <OverviewCardSkeleton />
          <div className="w-px shrink-0 bg-border" />
          <OverviewCardSkeleton />
          <div className="w-px shrink-0 bg-border" />
          <OverviewCardSkeleton />
          <div className="w-px shrink-0 bg-border" />
          <OverviewCardSkeleton />
          <div className="w-px shrink-0 bg-border" />
          <OverviewCardSkeleton />
        </div>
      </div>
    </>
  );
}

export default function AdminDashboardPage() {
  const { profile } = useUserProfile();
  const displayName = profile?.fullName?.trim() || profile?.email || " ";
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<
    "INDIVIDUAL" | "LANDLORD" | "FINTECH" | undefined
  >();
  const [statusFilter, setStatusFilter] = useState<
    "NOT_STARTED" | "IN_PROGRESS" | "VERIFIED" | "REJECTED" | undefined
  >();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAdminStats,
  });

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["admin", "users", page, roleFilter, statusFilter, search],
    queryFn: () =>
      getAdminUsers({
        page,
        pageSize: PAGE_SIZE,
        role: roleFilter,
        verificationStatus: statusFilter,
        search: search || undefined,
      }),
  });

  const pageCount = Math.ceil((usersData?.totalCount ?? 0) / PAGE_SIZE);

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-border bg-card p-6 relative">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="w-full h-full relative">
            {Array.from({ length: 300 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-4 w-full -rotate-45 origin-top-left outline outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                style={{
                  top: `${i * 16 - 120}px`,
                  left: "-100%",
                  width: "300%",
                }}
              ></div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          {statsLoading ? (
            <GreetingOverviewSkeleton />
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome, {displayName}
              </h1>
              {stats && (
                <div className="mt-4 rounded-xl border border-border bg-card p-6">
                  <div className="flex flex-wrap items-stretch justify-between gap-4">
                    <OverviewCard
                      icon={Users}
                      label="Total users"
                      value={stats.total}
                    />
                    <div className="w-px shrink-0 bg-border" />
                    <OverviewCard
                      icon={CheckCircle}
                      label="Verified"
                      value={stats.verified}
                    />
                    <div className="w-px shrink-0 bg-border" />
                    <OverviewCard
                      icon={Clock}
                      label="Pending"
                      value={stats.pending}
                    />
                    <div className="w-px shrink-0 bg-border" />
                    <OverviewCard
                      icon={XCircle}
                      label="Rejected"
                      value={stats.rejected}
                    />
                    <div className="w-px shrink-0 bg-border" />
                    <OverviewCard
                      icon={Users}
                      label="POS Agents"
                      value={stats.agents}
                    />
                    <div className="w-px shrink-0 bg-border" />
                    <OverviewCard
                      icon={Building2}
                      label="Landlords"
                      value={stats.landlords}
                    />
                    <div className="w-px shrink-0 bg-border" />
                    <OverviewCard
                      icon={Landmark}
                      label="Fintechs"
                      value={stats.fintechs}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Users
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by name, email, phone..."
              className="w-96 max-w-full"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (setSearch(searchInput), setPage(1))
              }
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => (setSearch(searchInput), setPage(1))}
            >
              Search
            </Button>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Role <ChevronDown className="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuCheckboxItem
                  checked={!roleFilter}
                  onCheckedChange={() => {
                    setRoleFilter(undefined);
                    setPage(1);
                  }}
                >
                  All
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={roleFilter === "INDIVIDUAL"}
                  onCheckedChange={() => {
                    setRoleFilter("INDIVIDUAL");
                    setPage(1);
                  }}
                >
                  POS Agents
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={roleFilter === "LANDLORD"}
                  onCheckedChange={() => {
                    setRoleFilter("LANDLORD");
                    setPage(1);
                  }}
                >
                  Landlords
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={roleFilter === "FINTECH"}
                  onCheckedChange={() => {
                    setRoleFilter("FINTECH");
                    setPage(1);
                  }}
                >
                  Fintechs
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Status <ChevronDown className="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuCheckboxItem
                  checked={!statusFilter}
                  onCheckedChange={() => {
                    setStatusFilter(undefined);
                    setPage(1);
                  }}
                >
                  All
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "VERIFIED"}
                  onCheckedChange={() => {
                    setStatusFilter("VERIFIED");
                    setPage(1);
                  }}
                >
                  Verified
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "REJECTED"}
                  onCheckedChange={() => {
                    setStatusFilter("REJECTED");
                    setPage(1);
                  }}
                >
                  Rejected
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "IN_PROGRESS"}
                  onCheckedChange={() => {
                    setStatusFilter("IN_PROGRESS");
                    setPage(1);
                  }}
                >
                  Pending
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "NOT_STARTED"}
                  onCheckedChange={() => {
                    setStatusFilter("NOT_STARTED");
                    setPage(1);
                  }}
                >
                  Not Started
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton columnCount={6} rowCount={10} />
        ) : (
          <DataTable
            columns={usersColumns}
            data={usersData?.data ?? []}
            page={page}
            pageCount={pageCount}
            totalCount={usersData?.totalCount}
            onPageChange={setPage}
          />
        )}
      </section>
    </div>
  );
}
