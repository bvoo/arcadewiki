import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BackButton() {
  return (
    <Button variant='ghost' onClick={() => window.history.back()}>
      <ArrowLeftIcon className='mr-2 size-4' />
      Back
    </Button>
  );
}
