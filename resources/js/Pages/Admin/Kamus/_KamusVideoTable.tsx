import React, { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/Components/ui/dropdown-menu";
import { ArrowUpDown, PlayCircle, Clock, MoreHorizontal } from "lucide-react";
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
import { AdminVideo } from "./types";

interface KamusVideoTableProps {
  data: AdminVideo[];
  globalFilter: string;
  sorting: SortingState;
  onSortingChange: React.Dispatch<React.SetStateAction<SortingState>>;
  onEdit: (video: AdminVideo) => void;
  onDelete: (target: { id: number; title: string; type: "article" | "video" }) => void;
}

export function KamusVideoTable({
  data,
  globalFilter,
  sorting,
  onSortingChange,
  onEdit,
  onDelete,
}: KamusVideoTableProps) {
  const columns = useMemo<ColumnDef<AdminVideo>[]>(
    () => [
      {
        accessorKey: "youtube_id",
        header: () => <span>Preview</span>,
        cell: ({ row }) => {
          const vid = row.original;
          return (
            <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-slate-900 shadow-soft-xs shrink-0">
              <img
                src={`https://img.youtube.com/vi/${vid.youtube_id}/hqdefault.jpg`}
                alt={vid.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                <PlayCircle className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 text-slate-900 font-semibold text-xs sm:text-sm hover:text-slate-700 focus:outline-none transition-colors group"
          >
            <span>Judul &amp; Topik Video</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        ),
        cell: ({ row }) => {
          const vid = row.original;
          return (
            <div className="min-w-0 pr-2 space-y-0.5">
              <div
                className="font-semibold text-slate-900 text-xs sm:text-sm whitespace-nowrap overflow-hidden [mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent_100%)]"
                title={vid.title}
              >
                {vid.title}
              </div>
              <div
                className="text-[11px] text-slate-500 whitespace-nowrap overflow-hidden [mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent_100%)]"
                title={vid.description}
              >
                {vid.description}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 text-slate-900 font-semibold text-xs sm:text-sm hover:text-slate-700 focus:outline-none transition-colors group"
          >
            <span>Kategori</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        ),
        cell: ({ row }) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {row.original.category}
          </span>
        ),
      },
      {
        accessorKey: "duration",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 text-slate-900 font-semibold text-xs sm:text-sm hover:text-slate-700 focus:outline-none transition-colors group"
          >
            <span>Durasi</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        ),
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{row.original.duration}</span>
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => {
          const vid = row.original;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none">
                  <span className="sr-only">Buka menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-[140px] p-1.5 rounded-2xl shadow-soft-md border-slate-100 bg-white"
                >
                  <DropdownMenuItem
                    onClick={() => onEdit(vid)}
                    className="text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer rounded-xl px-3 py-2"
                  >
                    Edit Video
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      onDelete({
                        id: vid.id,
                        title: vid.title,
                        type: "video",
                      })
                    }
                    className="text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer rounded-xl px-3 py-2"
                  >
                    Hapus Video
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onSortingChange,
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

  const getVideoColumnWidthClass = (id: string) => {
    switch (id) {
      case "youtube_id":
        return "w-[12%]";
      case "title":
        return "w-[44%]";
      case "category":
        return "w-[20%]";
      case "duration":
        return "w-[14%]";
      case "actions":
        return "w-[10%] text-right";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
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
                        getVideoColumnWidthClass(header.column.id)
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
                          getVideoColumnWidthClass(cell.column.id)
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
                      ? `Tidak ditemukan video yang cocok dengan "${globalFilter}".`
                      : "Belum ada video Terapi Komplementer."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-2 text-xs sm:text-sm text-slate-500">
        <div>
          Total {table.getFilteredRowModel().rows.length} video terdaftar.
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
