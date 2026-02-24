"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/db/schema";

const roleLabels: Record<string, string> = {
  INDIVIDUAL: "POS Agent",
  LANDLORD: "Landlord",
  FINTECH: "Fintech",
};

const statusLabels: Record<string, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "Pending",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
};

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  NOT_STARTED: "secondary",
  IN_PROGRESS: "outline",
  VERIFIED: "default",
  REJECTED: "destructive",
};

function getDetailHref(row: Profile) {
  switch (row.role) {
    case "INDIVIDUAL":
      return `/admin/agents/${row.id}`;
    case "LANDLORD":
      return `/admin/landlords/${row.id}`;
    case "FINTECH":
      return `/admin/fintechs/${row.id}`;
    default:
      return "#";
  }
}

export const usersColumns: ColumnDef<Profile>[] = [
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
      <span className="text-muted-foreground">
        {row.original.email ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant="outline">
        {roleLabels[row.original.role] ?? row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "verificationStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.verificationStatus;
      if (!status) return "—";
      return (
        <Badge variant={statusVariants[status] ?? "secondary"}>
          {statusLabels[status] ?? status}
        </Badge>
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
      <Link href={getDetailHref(row.original)}>
        <Button variant="ghost" size="sm">
          View
        </Button>
      </Link>
    ),
  },
];
