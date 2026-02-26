"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface TableSkeletonProps {
  columnCount?: number;
  rowCount?: number;
  showPagination?: boolean;
}

export function TableSkeleton({
  columnCount = 6,
  rowCount = 10,
  showPagination = true,
}: TableSkeletonProps) {
  return (
    <div className="w-full space-y-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, i) => (
                <TableHead key={i}>
                  <div
                    className="h-4 rounded bg-muted animate-pulse"
                    style={{
                      width: i === 0 ? 120 : i === columnCount - 1 ? 80 : 100,
                    }}
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columnCount }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <div
                      className="h-4 rounded bg-muted animate-pulse"
                      style={{
                        width:
                          colIndex === 0
                            ? 140
                            : colIndex === columnCount - 1
                            ? 64
                            : 100 + (colIndex % 2) * 20,
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="flex items-center justify-between">
          <div className="h-4 w-40 rounded bg-muted animate-pulse" />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
