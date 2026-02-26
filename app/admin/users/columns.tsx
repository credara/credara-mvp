"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Building2, Landmark } from "lucide-react";
import type { Profile } from "@/lib/db/schema";

const roleLabels: Record<string, string> = {
  INDIVIDUAL: "POS Agent",
  LANDLORD: "Landlord",
  FINTECH: "Fintech",
};

const roleIcons: Record<string, typeof Users> = {
  INDIVIDUAL: Users,
  LANDLORD: Building2,
  FINTECH: Landmark,
};

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
      <span className="text-muted-foreground">{row.original.email ?? "—"}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone,
  },
  {
    accessorKey: "role",
    header: () => <div className="text-right">Role</div>,
    cell: ({ row }) => {
      const role = row.original.role;
      const Icon = roleIcons[role];
      return (
        <div className="flex items-center justify-end gap-2">
          <Badge variant="outline" className="gap-1.5 font-normal">
            {Icon && <Icon className="size-3.5 shrink-0" />}
            {roleLabels[role] ?? role}
          </Badge>
        </div>
      );
    },
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
      <Link href={getDetailHref(row.original)}>
        <Button variant="ghost" size="sm">
          View
        </Button>
      </Link>
    ),
  },
];
