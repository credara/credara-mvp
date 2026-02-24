"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { AuditLog } from "@/lib/db/schema";

const actionLabels: Record<string, string> = {
  VERIFICATION_APPROVE: "Verification Approved",
  VERIFICATION_REJECT: "Verification Rejected",
  SCORE_OVERRIDE: "Score Override",
  CREDIT_ADD: "Credit Added",
  SUBSCRIPTION_ACTIVATE: "Subscription Activated",
  PROFILE_UPDATE: "Profile Updated",
  OTHER: "Other",
};

export const auditColumns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleString(),
  },
  {
    accessorKey: "adminId",
    header: "Admin ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.adminId.slice(0, 8)}…</span>
    ),
  },
  {
    accessorKey: "targetUserId",
    header: "Target User ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.targetUserId.slice(0, 8)}…</span>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) =>
      actionLabels[row.original.action] ?? row.original.action,
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => (
      <span className="text-muted-foreground max-w-[200px] truncate block">
        {row.original.details ?? "—"}
      </span>
    ),
  },
];
