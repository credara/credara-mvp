"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type { UnlockedReportRow } from "@/app/actions/institution";
import { Button } from "@/components/ui/button";

export const unlockedReportsColumns: ColumnDef<UnlockedReportRow>[] = [
  {
    accessorKey: "userName",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.userName ?? "—"}</span>
    ),
  },
  {
    accessorKey: "credaraId",
    header: "Credara ID",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        {row.original.credaraId ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "scoreAtUnlock",
    header: "Score",
    cell: ({ row }) =>
      row.original.scoreAtUnlock != null ? row.original.scoreAtUnlock : "—",
  },
  {
    accessorKey: "unlockedAt",
    header: "Unlock date",
    cell: ({ row }) => new Date(row.original.unlockedAt).toLocaleDateString(),
  },
  {
    accessorKey: "riskLevel",
    header: "Risk",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.riskLevel ?? "—"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Link href={`/home/reports/${row.original.targetProfileId}`}>
        <Button variant="ghost" size="sm">
          View report
        </Button>
      </Link>
    ),
  },
];
