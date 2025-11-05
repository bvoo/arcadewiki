import { BookmarkIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { bookmarkStore, isBookmarked, toggleBookmark } from '@/stores/bookmarkStore';

export function BookmarkButton({ company, controller }: { company: string; controller: string }) {
  const [bookmarked, setBookmarked] = useState(() => false);

  useEffect(
    () => bookmarkStore.subscribe(() => setBookmarked(isBookmarked(company, controller))),
    [company, controller],
  );

  return (
    <Button
      variant='outline'
      size='sm'
      onClick={() => toggleBookmark(company, controller)}
      className='w-full gap-2 whitespace-nowrap'
    >
      <BookmarkIcon className={`size-4 ${bookmarked ? 'fill-current' : ''}`} />
      {bookmarked ? 'Bookmarked' : 'Bookmark'}
    </Button>
  );
}
