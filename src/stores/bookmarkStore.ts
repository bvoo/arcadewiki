import { persistentAtom } from '@nanostores/persistent';

export type Bookmark = {
  company: string;
  controller: string;
  timestamp: number;
};

export const bookmarkStore = persistentAtom<Bookmark[]>('arcade-wiki-bookmarks', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function isBookmarked(company: string, controller: string): boolean {
  return bookmarkStore.get().some((b) => b.company === company && b.controller === controller);
}

export function toggleBookmark(company: string, controller: string) {
  const bookmarks = bookmarkStore.get();
  const index = bookmarks.findIndex((b) => b.company === company && b.controller === controller);

  if (index >= 0) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push({ company, controller, timestamp: Date.now() });
  }

  bookmarkStore.set([]);
  bookmarkStore.set(bookmarks);
}

export function removeBookmark(company: string, controller: string): void {
  const bookmarks = bookmarkStore.get();
  const index = bookmarks.findIndex((b) => b.company === company && b.controller === controller);

  if (index >= 0) {
    bookmarks.splice(index, 1);
    bookmarkStore.set(bookmarks);
  }
}

export function clearBookmarks(): void {
  bookmarkStore.set([]);
}
