import { HelpCircleIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function SimilarControllersReasons({ reasons }: { reasons: string[] }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className='shrink-0 text-muted-foreground transition-colors hover:text-foreground'>
          <HelpCircleIcon className='size-4' />
        </TooltipTrigger>
        <TooltipContent side='top' className='max-w-[200px] border bg-background text-foreground'>
          <p className='mb-1 font-semibold'>Why similar?</p>
          <ul className='space-y-0.5 text-xs'>
            {reasons.map((reason) => (
              <li key={reason}>• {reason}</li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
