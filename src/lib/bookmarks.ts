const BOOKMARKS_KEY = 'arcade-wiki-bookmarks'

export interface Bookmark {
  company: string
  controller: string
  timestamp: number
}

export function getBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function isBookmarked(company: string, controller: string): boolean {
  const bookmarks = getBookmarks()
  return bookmarks.some(b => b.company === company && b.controller === controller)
}

export function toggleBookmark(company: string, controller: string): boolean {
  const bookmarks = getBookmarks()
  const index = bookmarks.findIndex(b => b.company === company && b.controller === controller)
  
  if (index >= 0) {
    bookmarks.splice(index, 1)
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
    return false
  } else {
    bookmarks.push({ company, controller, timestamp: Date.now() })
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
    return true
  }
}

export function clearBookmarks(): void {
  localStorage.removeItem(BOOKMARKS_KEY)
}
