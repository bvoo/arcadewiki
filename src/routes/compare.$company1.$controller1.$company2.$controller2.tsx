import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { InfoCard } from '@/components/InfoCard';
import { SiteHeader } from '@/components/SiteHeader';
import { Button } from '@/components/ui/button';
import { isBookmarked, toggleBookmark } from '../lib/bookmarks';
import { getControllerDoc } from '../lib/controllers.content';

export const Route = createFileRoute('/compare/$company1/$controller1/$company2/$controller2')({
  component: ComparisonPage,
  head: ({ params }) => {
    const doc1 = getControllerDoc(params.company1, params.controller1);
    const doc2 = getControllerDoc(params.company2, params.controller2);

    if (!doc1 || !doc2) return { meta: [] };

    const title = `Compare ${doc1.meta.name} vs ${doc2.meta.name} | arcade.wiki`;
    const description = `Side-by-side comparison of ${doc1.meta.name} by ${doc1.meta.maker} and ${doc2.meta.name} by ${doc2.meta.maker}. Compare specs, features, and prices.`;
    const url = `https://arcade.wiki/compare/${params.company1}/${params.controller1}/${params.company2}/${params.controller2}`;

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        {
          name: 'keywords',
          content: `${doc1.meta.name}, ${doc2.meta.name}, compare arcade controllers, arcade stick comparison, ${doc1.meta.maker}, ${doc2.meta.maker}`,
        },
        // Open Graph
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url },
        { property: 'og:type', content: 'website' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
      ],
      links: [{ rel: 'canonical', href: url }],
    };
  },
});

function ComparisonPage() {
  const { company1, controller1, company2, controller2 } = Route.useParams();

  const doc1 = getControllerDoc(company1, controller1);
  const doc2 = getControllerDoc(company2, controller2);

  const [bookmarked1, setBookmarked1] = React.useState(() => isBookmarked(company1, controller1));
  const [bookmarked2, setBookmarked2] = React.useState(() => isBookmarked(company2, controller2));

  if (doc1 == null || doc2 == null) {
    return (
      <div className="min-h-screen bg-background p-6 text-foreground">
        <h1 className="font-bold text-xl">Controllers not found</h1>
        <Button asChild variant="ghost" className="mt-4">
          <a href="/">
            <ArrowLeft className="mr-2 size-4" />
            Back to List
          </a>
        </Button>
      </div>
    );
  }

  const { meta: meta1, Component: Component1 } = doc1;
  const { meta: meta2, Component: Component2 } = doc2;

  const switchItems1 = Array.isArray(meta1.switchType) ? meta1.switchType : meta1.switchType ? [meta1.switchType] : [];
  const switchItems2 = Array.isArray(meta2.switchType) ? meta2.switchType : meta2.switchType ? [meta2.switchType] : [];

  const handleBookmarkToggle1 = () => {
    const newState = toggleBookmark(company1, controller1);
    setBookmarked1(newState);
  };

  const handleBookmarkToggle2 = () => {
    const newState = toggleBookmark(company2, controller2);
    setBookmarked2(newState);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: meta1.maker, href: `/makers/${company1}` },
          {
            label: meta1.name,
            href: `/controllers/${company1}/${controller1}`,
          },
          { label: 'vs' },
          { label: meta2.maker, href: `/makers/${company2}` },
          {
            label: meta2.name,
            href: `/controllers/${company2}/${controller2}`,
          },
        ]}
        actions={
          <Button asChild variant="ghost" size="sm">
            <a href="/">
              <ArrowLeft className="mr-2 size-4" />
              Back to List
            </a>
          </Button>
        }
      />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-bold text-2xl">Controller Comparison</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1px_1fr]">
          <div className="flex flex-col">
            <div className="mb-4">
              <h2 className="font-bold text-xl">{meta1.name}</h2>
              <p className="text-muted-foreground">{meta1.maker}</p>
            </div>
            <article className="prose prose-invert mb-4 max-w-none flex-1">
              <Component1 />
            </article>
            <div className="w-1/2">
              <InfoCard
                meta={meta1}
                bookmarked={bookmarked1}
                onBookmarkToggle={handleBookmarkToggle1}
                switchItems={switchItems1}
              />
            </div>
          </div>

          <div className="hidden bg-border lg:block" />

          <div className="flex flex-col">
            <div className="mb-4">
              <h2 className="font-bold text-xl">{meta2.name}</h2>
              <p className="text-muted-foreground">{meta2.maker}</p>
            </div>
            <article className="prose prose-invert mb-4 max-w-none flex-1">
              <Component2 />
            </article>
            <div className="w-1/2">
              <InfoCard
                meta={meta2}
                bookmarked={bookmarked2}
                onBookmarkToggle={handleBookmarkToggle2}
                switchItems={switchItems2}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
