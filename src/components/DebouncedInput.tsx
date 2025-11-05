import React from 'react';
import { Input } from '@/components/ui/input';

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & React.ComponentProps<'input'>) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => setValue(initialValue), [initialValue]);
  React.useEffect(() => {
    const t = setTimeout(() => onChange(value), debounce);
    return () => clearTimeout(t);
  }, [value, debounce, onChange]);

  return <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}
