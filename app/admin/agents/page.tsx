"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminUsers } from "@/app/actions/admin";
import { DataTable } from "@/components/admin/data-table";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { usersColumns } from "../users/columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export default function AdminAgentsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "agents", page, search],
    queryFn: () =>
      getAdminUsers({
        page,
        pageSize: PAGE_SIZE,
        role: "INDIVIDUAL",
        search: search || undefined,
      }),
  });

  const pageCount = Math.ceil((data?.totalCount ?? 0) / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">POS Agents</h1>
      <div className="flex gap-2">
        <Input
          placeholder="Search..."
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
      {isLoading ? (
        <TableSkeleton columnCount={6} rowCount={10} />
      ) : (
        <DataTable
          columns={usersColumns}
          data={data?.data ?? []}
          page={page}
          pageCount={pageCount}
          totalCount={data?.totalCount}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
