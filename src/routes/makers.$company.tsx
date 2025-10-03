import { ControllerCard } from "@/components/ControllerCard";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getAllControllerDocs } from "../lib/controllers.content";

export const Route = createFileRoute("/makers/$company")({
  component: MakerPage,
  head: ({ params }) => {
    const controllers = getAllControllerDocs().filter(
      (d) => d.meta.company === params.company,
    );

    if (controllers.length === 0) return { meta: [] };

    const makerName = controllers[0]?.meta.maker || params.company;
    const title = `${makerName} Controllers | arcade.wiki`;
    const description = `Browse all ${controllers.length} controllers from ${makerName}. Compare specs, prices, and features.`;
    const url = `https://arcade.wiki/makers/${params.company}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        {
          name: "keywords",
          content: `${makerName}, arcade controllers, ${params.company}, fightstick`,
        },
        // Open Graph
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        // Twitter Card
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function MakerPage() {
  const { company } = Route.useParams();
  const allDocs = getAllControllerDocs();
  const controllers = allDocs.filter((d) => d.meta.company === company);

  if (controllers.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">Maker Not Found</h1>
          <p className="text-muted-foreground mb-6">
            No controllers found for "{company}".
          </p>
          <Button asChild variant="ghost">
            <a href="/">
              <ArrowLeft className="size-4 mr-2" />
              Back to List
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const makerName = controllers[0].meta.maker;

  const sortedControllers = [...controllers].sort(
    (a, b) => b.meta.releaseYear - a.meta.releaseYear,
  );

  const currentlySoldCount = controllers.filter(
    (c) => c.meta.currentlySold,
  ).length;
  const avgPrice =
    controllers
      .filter((c) => c.meta.priceUSD)
      .reduce((sum, c) => sum + (c.meta.priceUSD || 0), 0) /
    controllers.filter((c) => c.meta.priceUSD).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Makers", href: "/makers" },
          { label: makerName },
        ]}
        actions={
          <Button asChild variant="ghost" size="sm">
            <a href="/">
              <ArrowLeft className="size-4 mr-2" />
              Back to List
            </a>
          </Button>
        }
      />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{makerName}</h1>
          <p className="text-muted-foreground mb-4">
            {controllers.length} controller{controllers.length !== 1 ? "s" : ""}
            {currentlySoldCount > 0 && (
              <> - {currentlySoldCount} currently available</>
            )}
            {avgPrice && <> - Avg price: ${Math.round(avgPrice)}</>}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedControllers.map((doc) => (
            <ControllerCard
              key={doc.slug}
              slug={doc.slug}
              name={doc.meta.name}
              releaseYear={doc.meta.releaseYear}
              buttonType={doc.meta.buttonType}
              weightGrams={doc.meta.weightGrams}
              dimensionsMm={doc.meta.dimensionsMm}
              priceUSD={doc.meta.priceUSD}
              currentlySold={doc.meta.currentlySold}
              company={doc.meta.company}
              controller={doc.meta.controller}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
