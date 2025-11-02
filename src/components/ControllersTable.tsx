import { compareItems, type RankingInfo, rankItem } from '@tanstack/match-sorter-utils';
import {
  type ColumnDef,
  type FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type Row as TanstackRow,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { USD } from '@/lib/format';
import { type ControllerWithSlug, getButtonTypeBadge } from '../data/controllers';
import { isInComparison, toggleComparison } from '../lib/comparison';
import { getAllControllerDocs } from '../lib/controllers.content';
import { ControllerTableView } from './ControllerTableView';
import { SwitchTypeDropdown } from './SwitchTypeDropdown';

declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

type Row = ControllerWithSlug;

interface ControllersTableProps {
  globalFilter?: string;
  data?: Row[];
  nameColumnOverride?: ColumnDef<Row, unknown>;
  hidePagination?: boolean;
  enableComparison?: boolean;
}

export function ControllersTable({
  globalFilter = '',
  data,
  nameColumnOverride,
  hidePagination = false,
  enableComparison = false,
}: ControllersTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'releaseYear', desc: true }]);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const defaultRows: Row[] = React.useMemo(
    () =>
      getAllControllerDocs().map((d) => ({
        ...d.meta,
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
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [enableComparison]);

  const comparisonColumn: ColumnDef<Row, unknown> = React.useMemo(
    () => ({
      id: 'compare',
      header: 'Compare',
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

  const columns = React.useMemo<ColumnDef<Row, unknown>[]>(
    () => [
      ...(enableComparison ? [comparisonColumn] : []),
      nameColumnOverride || {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => {
          const r = info.row.original as Row;
          return (
            <a href={`/controllers/${r.company}/${r.controller}`} className="font-bold text-white hover:underline">
              {info.getValue<string>()}
            </a>
          );
        },
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
      },
      {
        accessorKey: 'maker',
        header: 'Maker',
        filterFn: 'includesString',
        cell: (info) => {
          const r = info.row.original as Row;
          return (
            <a href={`/makers/${r.company}`} className="font-medium text-primary hover:underline">
              {info.getValue<string>()}
            </a>
          );
        },
      },
      {
        accessorKey: 'buttonType',
        header: 'Buttons',
        cell: ({ getValue }) => {
          const buttonType = getValue<Row['buttonType'] | undefined>();
          const { label, variant } = getButtonTypeBadge(buttonType);
          return label ? (
            <Badge variant={variant} className="font-bold font-mono">
              {label}
            </Badge>
          ) : (
            ''
          );
        },
      },
      {
        accessorKey: 'switchType',
        header: 'Switches',
        cell: ({ row }) => {
          const val = row.original.switchType;
          const items = Array.isArray(val) ? val : val ? [val] : [];
          if (!items.length) return '';
          const summary = items.length === 1 ? items[0] : `${items.length} types`;
          return <SwitchTypeDropdown summary={summary} items={items} maxChars={maxSwitchChars} />;
        },
      },
      {
        accessorKey: 'weightGrams',
        header: 'Weight',
        cell: ({ row }) =>
          row.original.weightGrams ? (
            <div className="text-right font-mono tabular-nums">
              {row.original.weightGrams} <span className="text-muted-foreground text-xs">g</span>
            </div>
          ) : (
            ''
          ),
      },
      {
        id: 'dimensionsMm',
        accessorFn: (row) => {
          const d = row.dimensionsMm;
          return d ? d.width * d.depth * d.height : 0;
        },
        header: 'Dimensions (mm)',
        cell: ({ row }) => {
          const d = row.original.dimensionsMm;
          return d ? (
            <div className="text-right font-mono tabular-nums">
              {d.width} × {d.depth} × {d.height}
              <span className="ml-1 text-muted-foreground text-xs">mm</span>
            </div>
          ) : (
            ''
          );
        },
      },
      {
        accessorKey: 'currentlySold',
        header: 'On Sale',
        cell: ({ getValue }) => {
          const sold = !!getValue<boolean>();
          return <Badge variant={sold ? 'default' : 'secondary'}>{sold ? 'Available' : 'Unavailable'}</Badge>;
        },
      },
      {
        accessorKey: 'releaseYear',
        header: 'Release',
        cell: ({ getValue }) => <div className="text-right font-mono tabular-nums">{getValue<number>()}</div>,
      },
      {
        accessorKey: 'priceUSD',
        header: 'Price',
        cell: ({ getValue }) => {
          const v = getValue<number | undefined>();
          return v ? <div className="text-right font-mono tabular-nums">{USD.format(v)}</div> : '';
        },
      },
    ],
    [nameColumnOverride, enableComparison, comparisonColumn, maxSwitchChars],
  );

  const table = useReactTable<Row>({
    data: rows,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter, sorting },
    onSortingChange: setSorting,
    globalFilterFn: 'fuzzy',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return <ControllerTableView table={table} hidePagination={hidePagination} />;
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

function fuzzySort<TData>(rowA: TanstackRow<TData>, rowB: TanstackRow<TData>, columnId: string) {
  let dir = 0;
  const a = rowA.columnFiltersMeta[columnId]?.itemRank as RankingInfo | undefined;
  const b = rowB.columnFiltersMeta[columnId]?.itemRank as RankingInfo | undefined;
  if (a && b) {
    dir = compareItems(a, b);
  }
  return dir === 0 ? String(rowA.getValue(columnId)).localeCompare(String(rowB.getValue(columnId))) : dir;
}
