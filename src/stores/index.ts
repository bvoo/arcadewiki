import { useStore } from '@nanostores/react';
import type { ReadableAtom, WritableAtom } from 'nanostores';
import { useSyncExternalStore } from 'react';

export function useLazyStore<T>($atom: ReadableAtom<T> | WritableAtom<T>, initial: T): [T, boolean] {
  const atomValue = useStore($atom);
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return [isHydrated ? atomValue : initial, isHydrated];
}
