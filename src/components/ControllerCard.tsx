import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface ControllerCardProps {
  slug: string;
  name: string;
  releaseYear: number;
  buttonType: "digital" | "analog";
  weightGrams?: number;
  dimensionsMm?: { width: number; depth: number; height: number };
  priceUSD?: number;
  currentlySold: boolean;
  company: string;
  controller: string;
}

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
  const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <Card
      key={slug}
      className="group hover:border-primary/50 transition-colors py-4"
    >
      <CardHeader>
        <CardTitle className="text-lg group-hover:text-primary transition-colors">
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        {priceUSD && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Price</span>
            <span className="font-mono">{usd.format(priceUSD)}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Released</span>
          <span className="font-mono">{releaseYear}</span>
        </div>

        {dimensionsMm && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Dimensions</span>
            <span className="font-mono text-right">
              {dimensionsMm.width} × {dimensionsMm.depth} ×{" "}
              {dimensionsMm.height}
              <span className="text-muted-foreground text-xs ml-1">mm</span>
            </span>
          </div>
        )}

        {weightGrams && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Weight</span>
            <span className="font-mono text-right">
              {weightGrams}
              <span className="text-muted-foreground text-xs ml-1">g</span>
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Button Type</span>
          <Badge
            variant={buttonType === "analog" ? "default" : "secondary"}
            className="font-mono font-bold"
          >
            {buttonType.charAt(0).toUpperCase() + buttonType.slice(1)}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Availability</span>
          <Badge
            variant={currentlySold ? "default" : "secondary"}
            className="font-mono"
          >
            {currentlySold ? "In Stock" : "Not Sold"}
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
