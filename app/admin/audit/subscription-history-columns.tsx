"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { AuditLog } from "@/lib/db/schema";

export const subscriptionHistoryColumns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.details ?? "—"}
      </span>
    ),
  },
];
