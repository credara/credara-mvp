"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAdminStats, getAdminUsers } from "@/app/actions/admin";
import { DataTable } from "@/components/admin/data-table";
import { usersColumns } from "./users/columns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";

const PAGE_SIZE = 10;

export default function AdminDashboardPage() {
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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          <Card>
            <CardHeader className="pb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Total Users
              </span>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats.total}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Verified
              </span>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats.verified}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Rejected
              </span>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats.rejected}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Pending
              </span>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats.pending}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <span className="text-sm font-medium text-muted-foreground">
                POS Agents
              </span>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats.agents}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Landlords
              </span>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats.landlords}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Fintechs
              </span>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats.fintechs}</span>
            </CardContent>
          </Card>
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
              className="max-w-sm"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (setSearch(searchInput), setPage(1))
              }
            />
            <Button
              variant="secondary"
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
