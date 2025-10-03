import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import type { SimilarController } from "../lib/similarControllers";

interface SimilarControllersProps {
	controllers: SimilarController[];
}

export function SimilarControllers({ controllers }: SimilarControllersProps) {
	if (controllers.length === 0) return null;

	const usd = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	});

	return (
		<div className="mt-12 pt-8 border-t border-border">
			<h2 className="text-xl font-bold mb-4">Similar Controllers</h2>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{controllers.map(({ doc, reasons }) => {
					const { meta } = doc;
					const buttonType = String(meta.buttonType || "").toLowerCase();
					const buttonLabel = buttonType
						? buttonType.charAt(0).toUpperCase() + buttonType.slice(1)
						: "";
					const buttonVariant =
						buttonType === "digital" ? "default" : "secondary";

					return (
						<a
							key={doc.slug}
							href={`/controllers/${meta.company}/${meta.controller}`}
							className="block"
						>
							<Card className="h-full hover:border-primary/50 transition-colors py-2 gap-0">
								<CardHeader className="pb-2">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<CardTitle className="text-base">{meta.name}</CardTitle>
											<p className="text-sm text-muted-foreground">
												{meta.maker}
											</p>
										</div>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<button
														type="button"
														className="text-muted-foreground hover:text-foreground transition-colors shrink-0 pt-2"
														onClick={(e) => e.preventDefault()}
													>
														<HelpCircle className="size-4" />
													</button>
												</TooltipTrigger>
												<TooltipContent
													side="top"
													className="max-w-[200px] bg-background text-foreground border-1"
												>
													<p className="font-semibold mb-1">Why similar?</p>
													<ul className="text-xs space-y-0.5">
														{reasons.map((reason, i) => (
															<li key={i}>• {reason}</li>
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
												<Badge
													variant={buttonVariant as any}
													className="font-mono text-xs"
												>
													{buttonLabel}
												</Badge>
											)}
											{meta.currentlySold && (
												<Badge variant="outline" className="text-xs">
													Available
												</Badge>
											)}
										</div>
										{meta.weightGrams && (
											<p className="text-muted-foreground text-xs font-mono">
												{meta.weightGrams}g
											</p>
										)}
									</div>
									{(meta.priceUSD || meta.dimensionsMm) && (
										<div className="flex items-center justify-between gap-2 text-sm">
											{meta.priceUSD && (
												<p className="font-mono">{usd.format(meta.priceUSD)}</p>
											)}
											{meta.dimensionsMm && (
												<p className="text-muted-foreground text-xs font-mono">
													{meta.dimensionsMm.width} × {meta.dimensionsMm.depth}{" "}
													× {meta.dimensionsMm.height}mm
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
