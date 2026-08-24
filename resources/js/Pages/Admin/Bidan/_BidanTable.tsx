import React, { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/Components/ui/dropdown-menu";
import {
  User,
  ArrowUpDown,
  MoreHorizontal,
} from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { BidanItem } from "./types";

interface BidanTableProps {
  data: BidanItem[];
  onView: (bidan: BidanItem) => void;
  onEdit: (bidan: BidanItem) => void;
  onToggleStatus: (bidan: BidanItem) => void;
}

export function BidanTable({
  data,
  onView,
  onEdit,
  onToggleStatus,
}: BidanTableProps) {
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<BidanItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 text-slate-900 font-semibold text-xs sm:text-sm hover:text-slate-700 focus:outline-none transition-colors group"
          >
            <span>Nama Bidan</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        ),
        cell: ({ row }) => {
          const bidan = row.original;
          return (
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200 shadow-soft-xs">
                <User className="h-4 w-4 text-slate-500" />
              </div>
              <div
                className="font-semibold text-slate-900 text-xs sm:text-sm whitespace-nowrap overflow-hidden [mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent_100%)] min-w-0 flex-1"
                title={bidan.name}
              >
                {bidan.name}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "puskesmas_wilayah",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 text-slate-900 font-semibold text-xs sm:text-sm hover:text-slate-700 focus:outline-none transition-colors group"
          >
            <span>Lokasi Puskesmas</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        ),
        cell: ({ row }) => (
          <span className="text-xs text-slate-700 font-medium">
            {row.original.puskesmas_wilayah || "-"}
          </span>
        ),
      },
      {
        accessorKey: "no_str",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 text-slate-900 font-semibold text-xs sm:text-sm hover:text-slate-700 focus:outline-none transition-colors group"
          >
            <span>No. STR</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-700 font-medium">
            {row.original.no_str || "-"}
          </span>
        ),
      },
      {
        accessorKey: "no_telepon",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 text-slate-900 font-semibold text-xs sm:text-sm hover:text-slate-700 focus:outline-none transition-colors group"
          >
            <span>No. WhatsApp</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        ),
        cell: ({ row }) => (
          <span className="text-xs text-slate-700 font-medium">
            {row.original.no_telepon || "-"}
          </span>
        ),
      },
      {
        accessorKey: "is_active",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 text-slate-900 font-semibold text-xs sm:text-sm hover:text-slate-700 focus:outline-none transition-colors group"
          >
            <span>Status</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        ),
        cell: ({ row }) => {
          const isActive = row.original.is_active !== false;
          return (
            <span
              className={`inline-flex items-center justify-center gap-1.5 w-[76px] py-0.5 rounded-full text-[11px] font-semibold ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                  isActive ? "bg-emerald-600" : "bg-slate-400"
                }`}
              />
              <span>{isActive ? "Aktif" : "Nonaktif"}</span>
            </span>
          );
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => {
          const bidan = row.original;
          const isActive = bidan.is_active !== false;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none">
                  <span className="sr-only">Buka menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-[150px] p-1.5 rounded-2xl shadow-soft-md border-slate-100 bg-white"
                >
                  <DropdownMenuItem
                    onClick={() => onView(bidan)}
                    className="text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer rounded-xl px-3 py-2"
                  >
                    Lihat Detail
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => onEdit(bidan)}
                    className="text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer rounded-xl px-3 py-2"
                  >
                    Edit Bidan
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => onToggleStatus(bidan)}
                    className={`text-xs font-medium cursor-pointer rounded-xl px-3 py-2 ${
                      isActive
                        ? "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                        : "text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    {isActive ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [onView, onEdit, onToggleStatus]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const getColumnWidthClass = (id: string) => {
    switch (id) {
      case "name":
        return "w-[24%]";
      case "puskesmas_wilayah":
        return "w-[22%]";
      case "no_str":
        return "w-[18%]";
      case "no_telepon":
        return "w-[18%]";
      case "is_active":
        return "w-[12%]";
      case "actions":
        return "w-[6%] text-right";
      default:
        return "";
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Toolbar: Minimal Search Filter */}
      <div className="flex items-center py-1">
        <Input
          placeholder="Filter data bidan..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm h-9 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="relative w-full overflow-x-auto">
          <Table className="table-fixed w-full caption-bottom text-sm">
            <TableHeader className="bg-white [&_tr]:border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-white border-b border-slate-200 hover:bg-white"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "h-10 px-4 text-left align-middle font-semibold text-slate-900 text-xs sm:text-sm whitespace-nowrap bg-white",
                        getColumnWidthClass(header.column.id)
                      )}
                    >
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
            <TableBody className="[&_tr:last-child]:border-0 divide-y divide-slate-100">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b border-slate-100 transition-colors hover:bg-slate-50/60"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "p-4 align-middle whitespace-nowrap text-slate-700",
                          getColumnWidthClass(cell.column.id)
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-xs text-slate-500 font-medium"
                  >
                    {globalFilter
                      ? `Tidak ditemukan akun bidan yang cocok dengan pencarian "${globalFilter}".`
                      : "Belum ada akun Bidan yang didaftarkan."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination / Count Footer */}
      <div className="flex items-center justify-between py-2 text-xs sm:text-sm text-slate-500">
        <div>
          Total {table.getFilteredRowModel().rows.length} akun bidan terdaftar.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-full font-bold text-xs h-8 px-3.5 border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Sebelumnya
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-full font-bold text-xs h-8 px-3.5 border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  );
}
