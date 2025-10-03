import React from 'react'
import { Bookmark } from 'lucide-react'
import { getBookmarks, toggleBookmark } from '@/lib/bookmarks'
import { getAllControllerDocs } from '@/lib/controllers.content'
import { ControllersTable } from './ControllersTable'
import type { Controller } from '../data/controllers'
import type { ColumnDef } from '@tanstack/react-table'

type Row = Controller & { company: string; controller: string; slug: string }

interface BookmarkedControllersProps {
  enableComparison?: boolean
}

export function BookmarkedControllers({ enableComparison = false }: BookmarkedControllersProps) {
  const [bookmarks, setBookmarks] = React.useState(getBookmarks())
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)

  React.useEffect(() => {
    const handleStorage = () => {
      setBookmarks(getBookmarks())
      forceUpdate()
    }
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const allDocs = getAllControllerDocs()
  const bookmarkedData: Row[] = React.useMemo(() => {
    return bookmarks
      .map(b => {
        const doc = allDocs.find(d => d.meta.company === b.company && d.meta.controller === b.controller)
        if (!doc) return null
        return {
          ...doc.meta,
          company: doc.meta.company,
          controller: doc.meta.controller,
          slug: doc.slug,
        }
      })
      .filter(Boolean) as Row[]
  }, [bookmarks, allDocs])

  if (bookmarkedData.length === 0) return null

  const nameColumnWithBookmark: ColumnDef<Controller, any> = {
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => {
      const r = info.row.original as Row
      return (
        <div className="flex items-center gap-2">
          <a
            href={`/controllers/${r.company}/${r.controller}`}
            className="text-white hover:underline font-bold"
          >
            {info.getValue<string>()}
          </a>
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleBookmark(r.company, r.controller)
              setBookmarks(getBookmarks())
              forceUpdate()
            }}
            className="text-white hover:scale-105 transition-all shrink-0"
            title="Remove bookmark"
          >
            <Bookmark className="size-4 fill-white" />
          </button>
        </div>
      )
    },
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-bold text-white">Bookmarked Controllers</h2>
        <span className="text-sm text-muted-foreground font-mono">({bookmarkedData.length})</span>
      </div>
      <ControllersTable 
        data={bookmarkedData}
        nameColumnOverride={nameColumnWithBookmark}
        hidePagination={true}
        enableComparison={enableComparison}
      />
    </>
  )
}
