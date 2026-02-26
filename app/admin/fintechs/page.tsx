"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminUsers } from "@/app/actions/admin";
import { DataTable } from "@/components/admin/data-table";
import { usersColumns } from "../users/columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const PAGE_SIZE = 10;

export default function AdminFintechsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "fintechs", page, search],
    queryFn: () =>
      getAdminUsers({
        page,
        pageSize: PAGE_SIZE,
        role: "FINTECH",
        search: search || undefined,
      }),
  });

  const pageCount = Math.ceil((data?.totalCount ?? 0) / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Fintechs</h1>
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
        <div className="py-8 text-center text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
        </div>
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
