import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type FilterFn,
  type SortingState,
} from '@tanstack/react-table'
import { compareItems, rankItem, type RankingInfo } from '@tanstack/match-sorter-utils'

import type { Controller } from '../data/controllers'
import { getAllControllerDocs } from '../lib/controllers.content'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { EditOnGitHub } from '@/components/EditOnGitHub'
import { SiteHeader } from '@/components/SiteHeader'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/')({
  component: ControllersHome,
})

declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type Row = Controller & { company: string; controller: string; slug: string }

function ControllersHome() {
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'releaseYear', desc: true },
  ])
  const usd = React.useMemo(
    () => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    [],
  )
  const rows: Row[] = React.useMemo(
    () =>
      getAllControllerDocs().map((d) => ({
        ...d.meta,
        company: d.meta.company,
        controller: d.meta.controller,
        slug: d.slug,
      })),
    [],
  )

  const maxSwitchChars = React.useMemo(() => {
    let max = 0
    for (const r of rows) {
      const val = (r as any).switchType as string | string[] | undefined
      const items = Array.isArray(val) ? val : val ? [val] : []
      for (const s of items) {
        if (s && s.length > max) max = s.length
      }
    }
    return Math.max(14, max + 6)
  }, [rows])

  const columns = React.useMemo<ColumnDef<Controller, any>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => {
          const r = info.row.original as Row
          return (
            <a
              href={`/controllers/${r.company}/${r.controller}`}
              className="text-white hover:underline font-bold"
            >
              {info.getValue<string>()}
            </a>
          )
        },
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
      },
      { accessorKey: 'maker', header: 'Maker', filterFn: 'includesString' },
      {
        accessorKey: 'buttonType',
        header: 'Buttons',
        cell: ({ getValue }) => {
          const v = String(getValue<string>()).toLowerCase()
          const label = v.charAt(0).toUpperCase() + v.slice(1)
          const variant = v === 'digital' ? 'default' : 'secondary'
          return <Badge variant={variant as any} className="font-mono font-bold">{label}</Badge>
        },
      },
      {
        accessorKey: 'switchType',
        header: 'Switches',
        cell: ({ row }) => {
          const val = row.original.switchType
          const items = Array.isArray(val) ? val : val ? [val] : []
          if (!items.length) return ''
          const summary = items.length === 1 ? items[0] : `${items.length} types`
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-between max-w-full"
                  style={{ width: `clamp(1ch, ${maxSwitchChars}ch, 100%)` }}
                >
                  <span className="truncate" title={summary}>{summary}</span>
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
                {items.map((it, i) => (
                  <DropdownMenuItem key={i}>{it}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
      {
        id: 'weightGrams',
        header: 'Weight',
        cell: ({ row }) => (
          row.original.weightGrams ? (
            <div className="tabular-nums text-right font-mono">
              {row.original.weightGrams} <span className="text-muted-foreground text-xs">g</span>
            </div>
          ) : (
            ''
          )
        ),
      },
      {
        id: 'dimensionsMm',
        header: 'Dimensions (mm)',
        cell: ({ row }) => {
          const d = row.original.dimensionsMm
          return d ? (
            <div className="tabular-nums text-right font-mono">
              {d.width} × {d.depth} × {d.height}
              <span className="text-muted-foreground text-xs ml-1">mm</span>
            </div>
          ) : (
            ''
          )
        },
      },
      {
        accessorKey: 'currentlySold',
        header: 'On Sale',
        cell: ({ getValue }) => {
          const sold = !!getValue<boolean>()
          return (
            <Badge variant={sold ? 'default' : 'secondary'}>
              {sold ? 'Available' : 'Unavailable'}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'releaseYear',
        header: 'Release',
        cell: ({ getValue }) => (
          <div className="tabular-nums text-right font-mono">{getValue<number>()}</div>
        ),
      },
      {
        accessorKey: 'priceUSD',
        header: 'Price',
        cell: ({ getValue }) => {
          const v = getValue<number | undefined>()
          return v ? (
            <div className="tabular-nums text-right font-mono">{usd.format(v)}</div>
          ) : (
            ''
          )
        },
      },
    ],
    [],
  )

  const table = useReactTable({
    data: rows,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: 'fuzzy',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="p-6">
      <DebouncedInput
        value={globalFilter}
        onChange={(v) => setGlobalFilter(String(v))}
        placeholder="Search controllers..."
        className="w-full"
        debounce={50}
      />
      <div className="h-4" />
      <Card className="overflow-hidden border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="text-secondary-foreground">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableHead key={h.id} className="px-4 py-3 text-left">
                      {h.isPlaceholder ? null : (
                        <div
                          className={
                            h.column.getCanSort()
                              ? 'cursor-pointer select-none hover:text-primary'
                              : ''
                          }
                          onClick={h.column.getToggleSortingHandler()}
                        >
                          <span className="inline-flex items-center gap-1">
                            {flexRender(h.column.columnDef.header, h.getContext())}
                            {h.column.getCanSort() ? (
                              h.column.getIsSorted() === 'asc' ? (
                                <ChevronUp className="size-4" aria-hidden />
                              ) : h.column.getIsSorted() === 'desc' ? (
                                <ChevronDown className="size-4" aria-hidden />
                              ) : null
                            ) : null}
                          </span>
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-secondary/20">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="h-4" />
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
          {'<<'}
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {'<'}
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {'>'}
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
          {'>>'}
        </Button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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
      <EditOnGitHub filePath="src/routes/index.tsx" />
      </div>
    </div>
  )
}

function fuzzyFilter(row: any, columnId: string, value: string, addMeta?: any) {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta?.({ itemRank })
  return itemRank.passed
}

function fuzzySort(rowA: any, rowB: any, columnId: string) {
  let dir = 0
  const a = rowA.columnFiltersMeta[columnId]?.itemRank
  const b = rowB.columnFiltersMeta[columnId]?.itemRank
  if (a && b) {
    dir = compareItems(a, b)
  }
  return dir === 0 ? String(rowA.getValue(columnId)).localeCompare(String(rowB.getValue(columnId))) : dir
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 400,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)
  React.useEffect(() => setValue(initialValue), [initialValue])
  React.useEffect(() => {
    const t = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(t)
  }, [value, debounce, onChange])
  return <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
}
