"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Individual } from "@/lib/db/schema";

const statusLabels: Record<string, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "Pending",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
};

const statusVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  NOT_STARTED: "secondary",
  IN_PROGRESS: "outline",
  VERIFIED: "default",
  REJECTED: "destructive",
};

export const agentsColumns: ColumnDef<Individual>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.fullName ?? row.original.email ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email ?? "—"}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone,
  },
  {
    accessorKey: "verificationStatus",
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => {
      const status = row.original.verificationStatus;
      if (!status) return <div className="text-right">—</div>;
      return (
        <div className="flex justify-end">
          <Badge variant={statusVariants[status] ?? "secondary"}>
            {statusLabels[status] ?? status}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "trustScore",
    header: "Score",
    cell: ({ row }) =>
      row.original.trustScore != null ? row.original.trustScore : "—",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Link href={`/admin/agents/${row.original.id}`}>
        <Button variant="ghost" size="sm">
          View
        </Button>
      </Link>
    ),
  },
];
