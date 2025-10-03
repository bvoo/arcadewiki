import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface MakerCardProps {
  company: string;
  maker: string;
  controllerCount: number;
  currentlySoldCount: number;
  avgPrice: number | null;
  latestYear: number;
}

export function MakerCard({
  company,
  maker,
  controllerCount,
  currentlySoldCount,
  avgPrice,
  latestYear,
}: MakerCardProps) {
  const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <Card className="group hover:border-primary/50 transition-colors py-4">
      <CardHeader>
        <CardTitle className="text-xl group-hover:text-primary transition-colors hover:underline">
          <a href={`/makers/${company}`}>{maker}</a>
        </CardTitle>
        <CardDescription>
          {controllerCount} controller{controllerCount !== 1 ? "s" : ""}
          {currentlySoldCount > 0 && <> - {currentlySoldCount} available</>}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Controllers</span>
          <span className="font-mono">{controllerCount}</span>
        </div>

        {avgPrice && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Avg Price</span>
            <span className="font-mono">{usd.format(avgPrice)}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Latest Release</span>
          <span className="font-mono">{latestYear}</span>
        </div>

        <Button asChild variant="ghost" className="w-full">
          <a href={`/makers/${company}`}>
            View All Controllers
            <ArrowRight className="ml-2 size-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
