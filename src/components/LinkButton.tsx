import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ButtonProps = Omit<Parameters<typeof Button>[0], 'asChild'>;

type LinkButtonProps = ButtonProps & {
  className?: string;
  href: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
};

export default function LinkButton({ href, target, rel, children, className, ...buttonProps }: LinkButtonProps) {
  const aProps = { href, target, rel };

  return (
    <Button asChild {...buttonProps} className={cn('no-underline', className)}>
      <a {...aProps}>{children}</a>
    </Button>
  );
}
