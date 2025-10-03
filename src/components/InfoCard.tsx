import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bookmark, ChevronDown } from "lucide-react";
import type { Controller } from "../data/controllers";

interface InfoCardProps {
  meta: Controller;
  bookmarked: boolean;
  onBookmarkToggle: () => void;
  switchItems: string[];
}

export function InfoCard({
  meta,
  bookmarked,
  onBookmarkToggle,
  switchItems,
}: InfoCardProps) {
  const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <Card className="lg:float-right lg:w-[28rem] lg:ml-6 lg:mb-2">
      <CardContent className="p-3">
        <div className="grid grid-cols-[1fr_auto] gap-4">
          {/* left col - details */}
          <div className="grid gap-2 text-sm">
            {meta.currentlySold !== undefined ? (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Availability:</span>
                <Badge variant={meta.currentlySold ? "default" : "secondary"}>
                  {meta.currentlySold ? "In stock" : "Not sold"}
                </Badge>
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Buttons:</span>
              {(() => {
                const v = String(meta.buttonType || "").toLowerCase();
                const label = v ? v.charAt(0).toUpperCase() + v.slice(1) : "";
                const variant: "default" | "secondary" =
                  v === "digital" ? "default" : "secondary";
                return label ? (
                  <Badge variant={variant} className="font-mono font-bold">
                    {label}
                  </Badge>
                ) : null;
              })()}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Switches:</span>
              {switchItems.length ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-between max-w-full min-w-32"
                    >
                      <span
                        className="truncate"
                        title={
                          switchItems.length === 1
                            ? switchItems[0]
                            : `${switchItems.length} types`
                        }
                      >
                        {switchItems.length === 1
                          ? switchItems[0]
                          : `${switchItems.length} types`}
                      </span>
                      <ChevronDown
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[var(--radix-dropdown-menu-trigger-width)]"
                  >
                    {switchItems.map((it) => (
                      <DropdownMenuItem key={it}>{it}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>

            <div>
              <span className="text-muted-foreground">Release Year:</span>{" "}
              <span className="tabular-nums font-mono">{meta.releaseYear}</span>
            </div>

            <div>
              <span className="text-muted-foreground">Weight:</span>{" "}
              {meta.weightGrams ? (
                <span className="tabular-nums font-mono">
                  {meta.weightGrams}{" "}
                  <span className="text-muted-foreground text-xs">g</span>
                </span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>

            <div>
              <span className="text-muted-foreground">Dimensions:</span>{" "}
              {meta.dimensionsMm ? (
                <span className="tabular-nums font-mono">
                  {meta.dimensionsMm.width} × {meta.dimensionsMm.depth} ×{" "}
                  {meta.dimensionsMm.height}
                  <span className="text-muted-foreground text-xs ml-1">mm</span>
                </span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>

            <div>
              <span className="text-muted-foreground">Price:</span>{" "}
              {meta.priceUSD ? (
                <span className="tabular-nums font-mono">
                  {usd.format(meta.priceUSD)}
                </span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>
          </div>

          {/* right col - buttons/Links */}
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onBookmarkToggle}
              className="gap-2 whitespace-nowrap"
            >
              <Bookmark
                className={`size-4 ${bookmarked ? "fill-current" : ""}`}
              />
              {bookmarked ? "Bookmarked" : "Bookmark"}
            </Button>

            {meta.link ? (
              <Button asChild variant="outline" size="sm">
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
