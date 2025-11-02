import { useStore } from '@nanostores/react';
import { DebouncedInput } from '@/components/DebouncedInput';
import { globalFilter } from '@/stores/filterStore';

export function ControllerFilter() {
  const $globalFilter = useStore(globalFilter);

  return (
    <DebouncedInput
      name='search'
      value={$globalFilter}
      onChange={(v) => globalFilter.set(String(v))}
      placeholder='Search controllers...'
      className='flex-1'
      debounce={50}
    />
  );
}
