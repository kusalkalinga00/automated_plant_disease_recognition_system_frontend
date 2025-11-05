"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTreatment, getTreatments } from "@/services/admin.services";
import { ApiResponse } from "@/types/common.types";
import { ITreatmentInfo } from "@/types/admin.types";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const TreatmentsView: React.FC = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const { data, isLoading, isFetching } = useQuery<
    ApiResponse<ITreatmentInfo[] | null>
  >({
    queryKey: ["treatments", page, pageSize],
    queryFn: () => getTreatments(session?.accessToken!, page, pageSize),
    enabled: !!session?.accessToken,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
    gcTime: 30 * 60 * 1000,
  });

  const rows: ITreatmentInfo[] = data?.payload ?? [];
  const meta = data?.meta;
  const totalItems = meta?.total ?? meta?.total_items ?? undefined;
  const totalPages =
    meta?.total_pages ??
    (totalItems != null && (meta?.page_size ?? pageSize) > 0
      ? Math.ceil(totalItems / (meta?.page_size ?? pageSize))
      : undefined);
  const hasPrev = page > 1;
  const hasNext =
    totalPages != null ? page < totalPages : rows.length === pageSize;

  const onEdit = (row: ITreatmentInfo) => {
    router.push(`/treatments/${row.id}`);
  };

  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationKey: ["treatment", "delete"],
    mutationFn: async ({ id }: { id: string }) => {
      if (!session?.accessToken) throw new Error("Not authenticated");
      return await deleteTreatment(session.accessToken, id);
    },
    onMutate: async (variables) => {
      setDeletingId(variables.id);
    },
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: ["treatments"] });
      toast.success(res?.message || "Deleted successfully");
      if (rows.length === 1 && page > 1) {
        setPage((p) => Math.max(1, p - 1));
      }
    },
    onError: (err: any) => {
      toast.error("Delete failed", {
        description: err?.message ?? "Please try again",
      });
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const onDelete = async (row: ITreatmentInfo) => {
    await toast.promise(deleteMutation.mutateAsync({ id: row.id }), {
      loading: "Deleting...",
      success: "Deleted",
      error: (err) => err?.message ?? "Delete failed",
    });
  };

  const columns = React.useMemo<ColumnDef<ITreatmentInfo>[]>(
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
      { accessorKey: "disease_label", header: "Disease" },
      { accessorKey: "title", header: "Title" },
      { accessorKey: "type", header: "Type" },
      { accessorKey: "dosage", header: "Dosage" },
      { accessorKey: "locale", header: "Locale" },
      {
        accessorKey: "instructions",
        header: "Instructions",
        cell: ({ row }) => (
          <span className="line-clamp-2 max-w-[520px] text-sm">
            {(row.getValue("instructions") as string) || "-"}
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
                disabled={deletingId === item.id || deleteMutation.isPending}
                onClick={() => onDelete(item)}
              >
                {deletingId === item.id && deleteMutation.isPending
                  ? "Deleting..."
                  : "Delete"}
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
    <div className="space-y-4 p-3 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold tracking-tight">Treatments</h1>
        <Button onClick={() => router.push("/treatments/create")}>
          Add New Treatment
        </Button>
      </div>
      <div className="rounded-xl border w-full">
        <Table className="w-full">
          <TableCaption>
            {isLoading
              ? "Loading treatments..."
              : rows.length
              ? null
              : "No treatments found"}
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
      {/* Pagination controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {totalItems != null && rows.length > 0 ? (
            <span>
              Showing {(page - 1) * pageSize + 1}–
              {(page - 1) * pageSize + rows.length} of {totalItems}
            </span>
          ) : rows.length > 0 ? (
            <span>
              Showing {(page - 1) * pageSize + 1}–
              {(page - 1) * pageSize + rows.length}
            </span>
          ) : (
            <span>—</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select
              defaultValue={String(pageSize)}
              onValueChange={(v) => {
                const next = parseInt(v, 10);
                setPage(1);
                setPageSize(next);
              }}
            >
              <SelectTrigger className="h-8 w-[88px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Rows</SelectLabel>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrev || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <div className="px-2 text-sm tabular-nums">
              Page {page}
              {totalPages != null ? ` of ${totalPages}` : ""}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNext || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentsView;
