import type { ColumnDef } from '@tanstack/react-table';
import { BookmarkIcon } from 'lucide-react';
import { useMemo } from 'react';
import type { ControllerData } from '@/content.config';
import { useLazyStore } from '@/stores';
import { bookmarkStore, removeBookmark } from '@/stores/bookmarkStore';
import { ControllersTable } from './ControllersTable';

function BookmarkedControllersImpl({ controllers }: { controllers: ControllerData[] }) {
  const nameColumnWithBookmark = {
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => {
      const r = info.row.original;

      return (
        <div className='flex items-center gap-2'>
          <a
            href={`/controllers/${r.companySlug}/${r.controllerSlug}`}
            className='font-bold text-white hover:underline'
          >
            {info.getValue<string>()}
          </a>
          <button
            type='button'
            onClick={(e) => {
              e.preventDefault();
              removeBookmark(r.companySlug, r.controllerSlug);
            }}
            className='shrink-0 text-white transition-all hover:scale-105'
            title='Remove bookmark'
          >
            <BookmarkIcon className='size-4 fill-white' />
          </button>
        </div>
      );
    },
  } satisfies ColumnDef<ControllerData>;

  return (
    <>
      <div className='mb-2 flex items-center gap-2'>
        <h2 className='font-bold text-white text-xl'>Bookmarked Controllers</h2>
        <span className='font-mono text-muted-foreground text-sm'>({controllers.length})</span>
      </div>
      <ControllersTable controllers={controllers} nameColumnOverride={nameColumnWithBookmark} hidePagination={true} />
    </>
  );
}

export function BookmarkedControllers({ controllers }: { controllers: ControllerData[] }) {
  const [$bookmarks] = useLazyStore(bookmarkStore, []);

  const bookmarkedData: ControllerData[] = useMemo(() => {
    return $bookmarks
      .map((b) => controllers.find((entry) => entry.companySlug === b.company && entry.controllerSlug === b.controller))
      .filter((x) => x != null);
  }, [$bookmarks, controllers]);

  // biome-ignore lint/complexity/noUselessFragments: invalid hook call error without fragment
  return bookmarkedData.length === 0 ? <></> : <BookmarkedControllersImpl controllers={bookmarkedData} />;
}
