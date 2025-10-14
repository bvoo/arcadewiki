import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type Table as TanstackTable,
  flexRender,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface ControllerTableViewProps<TData> {
  table: TanstackTable<TData>;
  hidePagination?: boolean;
}

export function ControllerTableView<TData>({
  table,
  hidePagination = false,
}: ControllerTableViewProps<TData>) {
  return (
    <>
      <Card className="overflow-hidden border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="text-secondary-foreground">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isRightAligned =
                      header.column.id === "weightGrams" ||
                      header.column.id === "dimensionsMm" ||
                      header.column.id === "releaseYear" ||
                      header.column.id === "priceUSD";
                    return (
                      <TableHead
                        key={header.id}
                        className={`px-4 py-3 ${isRightAligned ? "text-right" : "text-left"}`}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? "cursor-pointer select-none hover:text-primary"
                                : ""
                            }
                            onClick={header.column.getToggleSortingHandler()}
                            onKeyDown={(event) => {
                              if (
                                header.column.getCanSort() &&
                                (event.key === "Enter" || event.key === " ")
                              ) {
                                event.preventDefault();
                                header.column.getToggleSortingHandler()?.(event);
                              }
                            }}
                            role={
                              header.column.getCanSort() ? "button" : undefined
                            }
                            tabIndex={
                              header.column.getCanSort() ? 0 : undefined
                            }
                          >
                            <span className="inline-flex items-center gap-1">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {header.column.getCanSort() ? (
                                header.column.getIsSorted() === "asc" ? (
                                  <ChevronUp className="size-4" aria-hidden />
                                ) : header.column.getIsSorted() === "desc" ? (
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
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </strong>
            </span>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger size="sm" className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    Show {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </>
  );
}
