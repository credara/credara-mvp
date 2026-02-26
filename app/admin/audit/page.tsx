"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminAuditLogs } from "@/app/actions/admin";
import { DataTable } from "@/components/admin/data-table";
import { auditColumns } from "./columns";
import { Loader2 } from "lucide-react";

const PAGE_SIZE = 20;

export default function AdminAuditPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "audit", page],
    queryFn: () =>
      getAdminAuditLogs({
        page,
        pageSize: PAGE_SIZE,
      }),
  });

  const pageCount = Math.ceil((data?.totalCount ?? 0) / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Audit Logs</h1>
      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
        </div>
      ) : (
        <DataTable
          columns={auditColumns}
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
