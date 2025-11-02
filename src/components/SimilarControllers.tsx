import { HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getButtonTypeBadge } from '../data/controllers';
import type { SimilarController } from '../lib/similarControllers';

interface SimilarControllersProps {
  controllers: SimilarController[];
}

export function SimilarControllers({ controllers }: SimilarControllersProps) {
  if (controllers.length === 0) return null;

  const usd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  return (
    <div className="mt-12 border-border border-t pt-8">
      <h2 className="mb-4 font-bold text-xl">Similar Controllers</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {controllers.map(({ doc, reasons }) => {
          const { meta } = doc;
          const { label: buttonLabel, variant: buttonVariant } = getButtonTypeBadge(meta.buttonType);

          return (
            <a key={doc.slug} href={`/controllers/${meta.company}/${meta.controller}`} className="block">
              <Card className="h-full gap-0 py-2 transition-colors hover:border-primary/50">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{meta.name}</CardTitle>
                      <p className="text-muted-foreground text-sm">{meta.maker}</p>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="shrink-0 pt-2 text-muted-foreground transition-colors hover:text-foreground"
                            onClick={(e) => e.preventDefault()}
                          >
                            <HelpCircle className="size-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[200px] border bg-background text-foreground">
                          <p className="mb-1 font-semibold">Why similar?</p>
                          <ul className="space-y-0.5 text-xs">
                            {reasons.map((reason) => (
                              <li key={reason}>• {reason}</li>
                            ))}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                      {buttonLabel && (
                        <Badge variant={buttonVariant} className="font-mono text-xs">
                          {buttonLabel}
                        </Badge>
                      )}
                      {meta.currentlySold && (
                        <Badge variant="outline" className="text-xs">
                          Available
                        </Badge>
                      )}
                    </div>
                    {meta.weightGrams && <p className="font-mono text-muted-foreground text-xs">{meta.weightGrams}g</p>}
                  </div>
                  {(meta.priceUSD || meta.dimensionsMm) && (
                    <div className="flex items-center justify-between gap-2 text-sm">
                      {meta.priceUSD && <p className="font-mono">{usd.format(meta.priceUSD)}</p>}
                      {meta.dimensionsMm && (
                        <p className="font-mono text-muted-foreground text-xs">
                          {meta.dimensionsMm.width} × {meta.dimensionsMm.depth} × {meta.dimensionsMm.height}mm
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
}
