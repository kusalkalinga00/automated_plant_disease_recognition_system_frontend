"use client";
import { getDiseases } from "@/services/admin.services";
import { IDiseaseInfo } from "@/types/admin.types";
import { ApiResponse } from "@/types/common.types";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DiseasesView = () => {
  const { data: session } = useSession();

  const { data, isLoading } = useQuery<ApiResponse<IDiseaseInfo[] | null>>({
    queryKey: ["diseases"],
    queryFn: () => getDiseases(session?.accessToken!, 1, 50),
    enabled: !!session?.accessToken,
    refetchOnWindowFocus: false,
    gcTime: 30 * 60 * 1000, // 10 minutes
  });

  const rows: IDiseaseInfo[] = data?.payload ?? [];

  const onEdit = (row: IDiseaseInfo) => {
    toast.info("Edit not implemented", { description: row.display_name });
  };
  const onDelete = (row: IDiseaseInfo) => {
    toast.info("Delete not implemented", { description: row.display_name });
  };

  const columns = React.useMemo<ColumnDef<IDiseaseInfo>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.getValue("id") as string}
          </span>
        ),
      },
      {
        accessorKey: "label",
        header: "Label",
      },
      {
        accessorKey: "display_name",
        header: "Display Name",
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="line-clamp-2 max-w-[520px] text-sm">
            {(row.getValue("description") as string) || "-"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-2 justify-end">
              <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(item)}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4 p-3">
      <h1 className="text-xl font-semibold tracking-tight">Diseases</h1>
      <div className="rounded-xl border">
        <Table>
          <TableCaption>
            {isLoading
              ? "Loading diseases..."
              : rows.length
              ? null
              : "No diseases found"}
          </TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : !isLoading && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DiseasesView;
