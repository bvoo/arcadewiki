import { useStore } from '@nanostores/react';
import { DebouncedInput } from '@/components/DebouncedInput';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { GameType } from '@/content.config';
import { gameTypeFilter, globalFilter } from '@/stores/filterStore';

const GAME_TYPE_OPTIONS: { value: GameType; label: string }[] = [
  { value: 'traditional', label: 'Traditional' },
  { value: 'platform', label: 'Platform' },
  { value: 'multi', label: 'Multi' },
];

export function ControllerFilter() {
  const $globalFilter = useStore(globalFilter);
  const $gameTypeFilter = useStore(gameTypeFilter);

  return (
    <div className='flex flex-row flex-wrap items-center gap-2'>
      <DebouncedInput
        name='search'
        value={$globalFilter}
        onChange={(v) => globalFilter.set(String(v))}
        placeholder='Search controllers...'
        className='min-w-0 flex-1'
        debounce={50}
      />
      <Tabs
        value={$gameTypeFilter === 'all' ? 'all' : $gameTypeFilter}
        onValueChange={(v) => gameTypeFilter.set(v as GameType | 'all')}
      >
        <TabsList>
          <TabsTrigger value='all'>All</TabsTrigger>
          {GAME_TYPE_OPTIONS.map((opt) => (
            <TabsTrigger key={opt.value} value={opt.value}>
              {opt.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
