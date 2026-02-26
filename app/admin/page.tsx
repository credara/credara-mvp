"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAdminStats, getAdminUsers } from "@/app/actions/admin";
import { DataTable } from "@/components/admin/data-table";
import { usersColumns } from "./users/columns";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2, Users, Info, Filter } from "lucide-react";
import { useUserProfile } from "@/contexts/user-profile-context";

const PAGE_SIZE = 10;

export default function AdminDashboardPage() {
  const { profile } = useUserProfile();
  const displayName = profile?.fullName?.trim() || profile?.email || "Admin";
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<
    "INDIVIDUAL" | "LANDLORD" | "FINTECH" | undefined
  >();
  const [statusFilter, setStatusFilter] = useState<
    "NOT_STARTED" | "IN_PROGRESS" | "VERIFIED" | "REJECTED" | undefined
  >();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const { data: stats } = useQuery({
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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, {displayName}
        </h1>
      </div>

      {stats && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <div className="rounded-xl border bg-card px-5 py-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total users
              </p>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                <Users className="size-5 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight tabular-nums">
              {stats.total}
            </p>
          </div>

          <div className="rounded-xl border bg-card px-5 py-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Verification status
              </p>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Info className="size-4 text-muted-foreground" />
              </div>
            </div>
            <div className="mt-4 flex flex-row gap-6 sm:gap-8">
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold tabular-nums">
                  {stats.verified}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Verified
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold tabular-nums">
                  {stats.pending}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full bg-amber-500" />
                  Pending
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold tabular-nums">
                  {stats.rejected}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full bg-red-500" />
                  Rejected
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card px-5 py-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                User roles
              </p>
              <Filter className="size-4 shrink-0 text-muted-foreground" />
            </div>
            <div className="mt-4 flex flex-row gap-6 sm:gap-8">
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold tabular-nums">
                  {stats.agents}
                </span>
                <span className="text-xs text-muted-foreground">
                  POS Agents
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold tabular-nums">
                  {stats.landlords}
                </span>
                <span className="text-xs text-muted-foreground">Landlords</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold tabular-nums">
                  {stats.fintechs}
                </span>
                <span className="text-xs text-muted-foreground">Fintechs</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Users
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by name, email, phone..."
              className="max-w-xs"
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

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
          </div>
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
