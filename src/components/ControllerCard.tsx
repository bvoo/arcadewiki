import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type ControllerWithSlug, getButtonTypeBadge } from '@/data/controllers';
import { USD } from '@/lib/format';

type ControllerCardProps = ControllerWithSlug;

export function ControllerCard({
  slug,
  name,
  releaseYear,
  buttonType,
  weightGrams,
  dimensionsMm,
  priceUSD,
  currentlySold,
  company,
  controller,
}: ControllerCardProps) {
  const { label: buttonLabel, variant: buttonVariant } = getButtonTypeBadge(buttonType);

  return (
    <Card key={slug} className="group py-4 transition-colors hover:border-primary/50">
      <CardHeader>
        <CardTitle className="text-lg transition-colors group-hover:text-primary">{name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        {priceUSD && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Price</span>
            <span className="font-mono">{USD.format(priceUSD)}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Released</span>
          <span className="font-mono">{releaseYear}</span>
        </div>

        {dimensionsMm && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Dimensions</span>
            <span className="text-right font-mono">
              {dimensionsMm.width} × {dimensionsMm.depth} × {dimensionsMm.height}
              <span className="ml-1 text-muted-foreground text-xs">mm</span>
            </span>
          </div>
        )}

        {weightGrams && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Weight</span>
            <span className="text-right font-mono">
              {weightGrams}
              <span className="ml-1 text-muted-foreground text-xs">g</span>
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Button Type</span>
          {buttonLabel ? (
            <Badge variant={buttonVariant} className="font-bold font-mono">
              {buttonLabel}
            </Badge>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Availability</span>
          <Badge variant={currentlySold ? 'default' : 'secondary'} className="font-mono">
            {currentlySold ? 'In Stock' : 'Not Sold'}
          </Badge>
        </div>
        <Button asChild variant="ghost" className="w-full">
          <a href={`/controllers/${company}/${controller}`}>
            View Details
            <ArrowRight className="ml-2 size-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
