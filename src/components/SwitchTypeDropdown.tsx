import { ChevronDown } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DropdownModule = typeof import('@/components/ui/dropdown-menu');

type SwitchTypeDropdownProps = {
  summary: string;
  items: string[];
  maxChars?: number;
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
};

export function SwitchTypeDropdown({
  summary,
  items,
  maxChars,
  buttonClassName,
  buttonStyle,
}: SwitchTypeDropdownProps) {
  const [dropdownModule, setDropdownModule] = React.useState<DropdownModule | null>(null);
  const [renderMenu, setRenderMenu] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const ensureModule = React.useCallback(async () => {
    if (dropdownModule) return dropdownModule;
    setLoading(true);
    try {
      const mod = await import('@/components/ui/dropdown-menu');
      setDropdownModule(mod);
      return mod;
    } finally {
      setLoading(false);
    }
  }, [dropdownModule]);

  const triggerOpen = React.useCallback(async () => {
    const mod = await ensureModule();
    if (!mod) return;
    setRenderMenu(true);
    setOpen(true);
  }, [ensureModule]);

  const prefetch = React.useCallback(() => {
    void ensureModule();
  }, [ensureModule]);

  const buttonClasses = React.useMemo(() => cn('justify-between max-w-full', buttonClassName), [buttonClassName]);

  const widthStyle = React.useMemo<React.CSSProperties | undefined>(() => {
    if (maxChars === undefined) return buttonStyle;
    return { ...buttonStyle, width: `clamp(1ch, ${maxChars}ch, 100%)` };
  }, [buttonStyle, maxChars]);

  if (dropdownModule && renderMenu) {
    const { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } = dropdownModule;

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={buttonClasses}
            style={widthStyle}
            onMouseEnter={prefetch}
            onFocus={prefetch}
          >
            <span className="truncate" title={summary}>
              {summary}
            </span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
          {items.map((item) => (
            <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={buttonClasses}
      style={widthStyle}
      disabled={loading}
      onClick={(event) => {
        event.preventDefault();
        void triggerOpen();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          void triggerOpen();
        }
      }}
      onFocus={prefetch}
      onMouseEnter={prefetch}
    >
      <span className="truncate" title={summary}>
        {loading ? 'Loading…' : summary}
      </span>
      <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
    </Button>
  );
}
