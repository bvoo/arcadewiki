import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { MakerCard } from '@/components/MakerCard';
import { SiteHeader } from '@/components/SiteHeader';
import { Button } from '@/components/ui/button';
import { getAllControllerDocs } from '../lib/controllers.content';

export const Route = createFileRoute('/makers/')({
  component: MakerIndexPage,
  head: () => {
    const title = 'All Makers | arcade.wiki';
    const description = 'Browse controller makers. Hitbox, Frame1, and more.';
    const url = 'https://arcade.wiki/makers';

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        {
          name: 'keywords',
          content: 'arcade controller makers, fightstick brands, hori, qanba, razer, madcatz',
        },
        // Open Graph
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url },
        { property: 'og:type', content: 'website' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
      ],
      links: [{ rel: 'canonical', href: url }],
    };
  },
});

interface MakerStats {
  company: string;
  maker: string;
  controllerCount: number;
  currentlySoldCount: number;
  avgPrice: number | null;
  latestYear: number;
}

function MakerIndexPage() {
  const allDocs = getAllControllerDocs();

  const makerMap = new Map<string, MakerStats>();

  for (const doc of allDocs) {
    const { company, maker } = doc.meta;
    if (!makerMap.has(company)) {
      makerMap.set(company, {
        company,
        maker,
        controllerCount: 0,
        currentlySoldCount: 0,
        avgPrice: null,
        latestYear: 0,
      });
    }

    const stats = makerMap.get(company);
    if (!stats) continue;

    stats.controllerCount++;
    if (doc.meta.currentlySold) stats.currentlySoldCount++;
    if (doc.meta.releaseYear > stats.latestYear) {
      stats.latestYear = doc.meta.releaseYear;
    }
  }

  for (const [company, stats] of makerMap.entries()) {
    const companyDocs = allDocs.filter((d) => d.meta.company === company);
    const pricesAvailable = companyDocs.filter((d) => d.meta.priceUSD);
    if (pricesAvailable.length > 0) {
      const sum = pricesAvailable.reduce((acc, d) => acc + (d.meta.priceUSD || 0), 0);
      stats.avgPrice = sum / pricesAvailable.length;
    }
  }

  const makers = Array.from(makerMap.values()).sort((a, b) => b.controllerCount - a.controllerCount);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Makers' }]}
        actions={
          <Button asChild variant="ghost" size="sm">
            <a href="/">
              <ArrowLeft className="mr-2 size-4" />
              Back to List
            </a>
          </Button>
        }
      />
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8">
          <h1 className="mb-2 font-bold text-3xl">Makers</h1>
          <p className="text-muted-foreground">Browse {makers.length} makers and their controllers</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {makers.map((stats) => (
            <MakerCard
              key={stats.company}
              company={stats.company}
              maker={stats.maker}
              controllerCount={stats.controllerCount}
              currentlySoldCount={stats.currentlySoldCount}
              avgPrice={stats.avgPrice}
              latestYear={stats.latestYear}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
