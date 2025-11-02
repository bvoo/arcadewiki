import { Bookmark } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { USD } from '@/lib/format';
import { type ControllerMeta, getButtonTypeBadge } from '../data/controllers';
import { SwitchTypeDropdown } from './SwitchTypeDropdown';

interface InfoCardProps {
  meta: ControllerMeta;
  bookmarked: boolean;
  onBookmarkToggle: () => void;
  switchItems: string[];
}

export function InfoCard({ meta, bookmarked, onBookmarkToggle, switchItems }: InfoCardProps) {
  return (
    <Card className="w-full md:mb-2 md:max-w-md">
      <CardContent className="p-3">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
          {/* left col - details */}
          <div className="grid grid-cols-[1fr_auto] gap-2 text-sm">
            {meta.currentlySold !== undefined ? (
              <>
                <span className="text-muted-foreground">Availability:</span>
                <Badge variant={meta.currentlySold ? 'default' : 'secondary'}>
                  {meta.currentlySold ? 'In stock' : 'Not sold'}
                </Badge>
              </>
            ) : null}
            <span className="text-muted-foreground">Buttons:</span>
            {(() => {
              const { label, variant } = getButtonTypeBadge(meta.buttonType);
              return label ? (
                <Badge variant={variant} className="font-bold font-mono">
                  {label}
                </Badge>
              ) : null;
            })()}
            <span className="text-muted-foreground">Switches:</span>
            {switchItems.length ? (
              <SwitchTypeDropdown
                summary={switchItems.length === 1 ? switchItems[0] : `${switchItems.length} types`}
                items={switchItems}
                buttonClassName="justify-between max-w-full min-w-32"
              />
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
            <span className="text-muted-foreground">Release Year:</span>{' '}
            <span className="font-mono tabular-nums">{meta.releaseYear}</span>
            <span className="text-muted-foreground">Weight:</span>{' '}
            {meta.weightGrams ? (
              <span className="font-mono tabular-nums">
                {meta.weightGrams} <span className="text-muted-foreground text-xs">g</span>
              </span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
            <span className="text-muted-foreground">Dimensions:</span>{' '}
            {meta.dimensionsMm ? (
              <span className="font-mono tabular-nums">
                {meta.dimensionsMm.width} × {meta.dimensionsMm.depth} × {meta.dimensionsMm.height}
                <span className="ml-1 text-muted-foreground text-xs">mm</span>
              </span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
            <span className="text-muted-foreground">Price:</span>{' '}
            {meta.priceUSD ? (
              <span className="font-mono tabular-nums">{USD.format(meta.priceUSD)}</span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>

          {/* right col - buttons/links */}
          <div className="flex flex-col gap-2 md:items-end">
            <Button variant="outline" size="sm" onClick={onBookmarkToggle} className="w-full gap-2 whitespace-nowrap">
              <Bookmark className={`size-4 ${bookmarked ? 'fill-current' : ''}`} />
              {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>

            {meta.link ? (
              <Button asChild variant="outline" size="sm" className="w-full">
                <a href={meta.link} target="_blank" rel="noreferrer">
                  Official link
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
