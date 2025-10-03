import {
  type RankingInfo,
  compareItems,
  rankItem,
} from "@tanstack/match-sorter-utils";
import {
  type ColumnDef,
  type FilterFn,
  type SortingState,
  type Row as TanstackRow,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Controller } from "../data/controllers";
import { isInComparison, toggleComparison } from "../lib/comparison";
import { getAllControllerDocs } from "../lib/controllers.content";

declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

type Row = Controller & { company: string; controller: string; slug: string };

interface ControllersTableProps {
  globalFilter?: string;
  data?: Row[];
  nameColumnOverride?: ColumnDef<Controller, unknown>;
  hidePagination?: boolean;
  enableComparison?: boolean;
}

export function ControllersTable({
  globalFilter = "",
  data,
  nameColumnOverride,
  hidePagination = false,
  enableComparison = false,
}: ControllersTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "releaseYear", desc: true },
  ]);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const usd = React.useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    [],
  );
  const defaultRows: Row[] = React.useMemo(
    () =>
      getAllControllerDocs().map((d) => ({
        ...d.meta,
        company: d.meta.company,
        controller: d.meta.controller,
        slug: d.slug,
      })),
    [],
  );

  const rows = data || defaultRows;

  const maxSwitchChars = React.useMemo(() => {
    let max = 0;
    for (const r of rows) {
      const items = r.switchType ?? [];
      for (const s of items) {
        if (s && s.length > max) max = s.length;
      }
    }
    return Math.max(14, max + 6);
  }, [rows]);

  React.useEffect(() => {
    if (!enableComparison) return;
    const handleStorage = () => forceUpdate();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [enableComparison]);

  const comparisonColumn: ColumnDef<Controller, unknown> = React.useMemo(
    () => ({
      id: "compare",
      header: "Compare",
      cell: (info) => {
        const r = info.row.original as Row;
        const checked = isInComparison(r.company, r.controller);
        return (
          <Checkbox
            checked={checked}
            onCheckedChange={() => {
              toggleComparison(r.company, r.controller);
              forceUpdate();
            }}
          />
        );
      },
    }),
    [],
  );

  const columns = React.useMemo<ColumnDef<Controller, unknown>[]>(
    () => [
      ...(enableComparison ? [comparisonColumn] : []),
      nameColumnOverride || {
        accessorKey: "name",
        header: "Name",
        cell: (info) => {
          const r = info.row.original as Row;
          return (
            <a
              href={`/controllers/${r.company}/${r.controller}`}
              className="text-white hover:underline font-bold"
            >
              {info.getValue<string>()}
            </a>
          );
        },
        filterFn: "fuzzy",
        sortingFn: fuzzySort,
      },
      { accessorKey: "maker", header: "Maker", filterFn: "includesString" },
      {
        accessorKey: "buttonType",
        header: "Buttons",
        cell: ({ getValue }) => {
          const v = String(getValue<string>()).toLowerCase();
          const label = v.charAt(0).toUpperCase() + v.slice(1);
          const variant: "default" | "secondary" =
            v === "digital" ? "default" : "secondary";
          return (
            <Badge variant={variant} className="font-mono font-bold">
              {label}
            </Badge>
          );
        },
      },
      {
        accessorKey: "switchType",
        header: "Switches",
        cell: ({ row }) => {
          const val = row.original.switchType;
          const items = Array.isArray(val) ? val : val ? [val] : [];
          if (!items.length) return "";
          const summary =
            items.length === 1 ? items[0] : `${items.length} types`;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-between max-w-full"
                  style={{ width: `clamp(1ch, ${maxSwitchChars}ch, 100%)` }}
                >
                  <span className="truncate" title={summary}>
                    {summary}
                  </span>
                  <ChevronDown
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[var(--radix-dropdown-menu-trigger-width)]"
              >
                {items.map((it) => (
                  <DropdownMenuItem key={it}>{it}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
      {
        accessorKey: "weightGrams",
        header: "Weight",
        cell: ({ row }) =>
          row.original.weightGrams ? (
            <div className="tabular-nums text-right font-mono">
              {row.original.weightGrams}{" "}
              <span className="text-muted-foreground text-xs">g</span>
            </div>
          ) : (
            ""
          ),
      },
      {
        id: "dimensionsMm",
        accessorFn: (row) => {
          const d = row.dimensionsMm;
          return d ? d.width * d.depth * d.height : 0;
        },
        header: "Dimensions (mm)",
        cell: ({ row }) => {
          const d = row.original.dimensionsMm;
          return d ? (
            <div className="tabular-nums text-right font-mono">
              {d.width} × {d.depth} × {d.height}
              <span className="text-muted-foreground text-xs ml-1">mm</span>
            </div>
          ) : (
            ""
          );
        },
      },
      {
        accessorKey: "currentlySold",
        header: "On Sale",
        cell: ({ getValue }) => {
          const sold = !!getValue<boolean>();
          return (
            <Badge variant={sold ? "default" : "secondary"}>
              {sold ? "Available" : "Unavailable"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "releaseYear",
        header: "Release",
        cell: ({ getValue }) => (
          <div className="tabular-nums text-right font-mono">
            {getValue<number>()}
          </div>
        ),
      },
      {
        accessorKey: "priceUSD",
        header: "Price",
        cell: ({ getValue }) => {
          const v = getValue<number | undefined>();
          return v ? (
            <div className="tabular-nums text-right font-mono">
              {usd.format(v)}
            </div>
          ) : (
            ""
          );
        },
      },
    ],
    [
      nameColumnOverride,
      enableComparison,
      comparisonColumn,
      maxSwitchChars,
      usd,
    ],
  );

  const table = useReactTable({
    data: rows,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter, sorting },
    onSortingChange: setSorting,
    globalFilterFn: "fuzzy",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <Card className="overflow-hidden border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="text-secondary-foreground">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => {
                    const isRightAligned =
                      h.column.id === "weightGrams" ||
                      h.column.id === "dimensionsMm";
                    return (
                      <TableHead
                        key={h.id}
                        className={`px-4 py-3 ${isRightAligned ? "text-right" : "text-left"}`}
                      >
                        {h.isPlaceholder ? null : (
                          <div
                            className={
                              h.column.getCanSort()
                                ? "cursor-pointer select-none hover:text-primary"
                                : ""
                            }
                            onClick={h.column.getToggleSortingHandler()}
                            onKeyDown={(e) => {
                              if (
                                h.column.getCanSort() &&
                                (e.key === "Enter" || e.key === " ")
                              ) {
                                e.preventDefault();
                                h.column.getToggleSortingHandler()?.(e);
                              }
                            }}
                            role={h.column.getCanSort() ? "button" : undefined}
                            tabIndex={h.column.getCanSort() ? 0 : undefined}
                          >
                            <span className="inline-flex items-center gap-1">
                              {flexRender(
                                h.column.columnDef.header,
                                h.getContext(),
                              )}
                              {h.column.getCanSort() ? (
                                h.column.getIsSorted() === "asc" ? (
                                  <ChevronUp className="size-4" aria-hidden />
                                ) : h.column.getIsSorted() === "desc" ? (
                                  <ChevronDown className="size-4" aria-hidden />
                                ) : null
                              ) : null}
                            </span>
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-secondary/20">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {!hidePagination && (
        <>
          <div className="h-4" />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </Button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="px-2 py-1 rounded-md border border-border bg-background focus:ring-2 focus:ring-ring"
            >
              {[10, 20, 30, 40, 50].map((s) => (
                <option key={s} value={s}>
                  Show {s}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </>
  );
}

function fuzzyFilter<TData>(
  row: TanstackRow<TData>,
  columnId: string,
  value: string,
  addMeta?: (meta: { itemRank: RankingInfo }) => void,
) {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta?.({ itemRank });
  return itemRank.passed;
}

function fuzzySort<TData>(
  rowA: TanstackRow<TData>,
  rowB: TanstackRow<TData>,
  columnId: string,
) {
  let dir = 0;
  const a = rowA.columnFiltersMeta[columnId]?.itemRank as
    | RankingInfo
    | undefined;
  const b = rowB.columnFiltersMeta[columnId]?.itemRank as
    | RankingInfo
    | undefined;
  if (a && b) {
    dir = compareItems(a, b);
  }
  return dir === 0
    ? String(rowA.getValue(columnId)).localeCompare(
        String(rowB.getValue(columnId)),
      )
    : dir;
}
