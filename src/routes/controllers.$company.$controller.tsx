import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { EditOnGitHub } from '@/components/EditOnGitHub';
import { InfoCard } from '@/components/InfoCard';
import { SimilarControllers } from '@/components/SimilarControllers';
import { SiteHeader } from '@/components/SiteHeader';
import { Button } from '@/components/ui/button';
import { isBookmarked, toggleBookmark } from '../lib/bookmarks';
import { getControllerDoc } from '../lib/controllers.content';
import { getSimilarControllers } from '../lib/similarControllers';

export const Route = createFileRoute('/controllers/$company/$controller')({
  component: ControllerContentPage,
  head: ({ params }) => {
    const doc = getControllerDoc(params.company, params.controller);
    if (!doc) return { meta: [] };

    const { meta } = doc;
    const title = `${meta.name} by ${meta.maker} | arcade.wiki`;
    const description = `Detailed information for the ${meta.name} controller by ${meta.maker}. ${meta.buttonType ? `Features ${meta.buttonType} buttons` : ''}${meta.weightGrams ? `, weighs ${meta.weightGrams}g` : ''}${meta.priceUSD ? `, priced at $${meta.priceUSD}` : ''}.`;
    const url = `https://arcade.wiki/controllers/${params.company}/${params.controller}`;
    const ogImageUrl = `https://arcade.wiki/og/${params.company}/${params.controller}.png`;

    // JSON-LD Structured Data
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: meta.name,
      image: ogImageUrl,
      brand: {
        '@type': 'Brand',
        name: meta.maker,
      },
      description: description,
      ...(meta.priceUSD && {
        offers: {
          '@type': 'Offer',
          price: meta.priceUSD,
          priceCurrency: 'USD',
          availability: meta.currentlySold ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          ...(meta.link && { url: meta.link }),
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              price: 0,
              priceCurrency: 'USD',
            },
            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: 'Worldwide',
            },
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
          },
        },
      }),
      ...(meta.releaseYear && {
        releaseDate: `${meta.releaseYear}-01-01`,
      }),
      ...(meta.weightGrams && {
        weight: {
          '@type': 'QuantitativeValue',
          value: meta.weightGrams,
          unitCode: 'GRM',
        },
      }),
      ...(meta.dimensionsMm && {
        depth: {
          '@type': 'QuantitativeValue',
          value: meta.dimensionsMm.depth,
          unitCode: 'MMT',
        },
        width: {
          '@type': 'QuantitativeValue',
          value: meta.dimensionsMm.width,
          unitCode: 'MMT',
        },
        height: {
          '@type': 'QuantitativeValue',
          value: meta.dimensionsMm.height,
          unitCode: 'MMT',
        },
      }),
    };

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        {
          name: 'keywords',
          content: `${meta.name}, ${meta.maker}, arcade controller, arcade stick, ${meta.buttonType || ''}, fightstick`,
        },
        // Open Graph
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url },
        { property: 'og:type', content: 'product' },
        { property: 'og:image', content: ogImageUrl },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'product:brand', content: meta.maker },
        ...(meta.priceUSD
          ? [
              {
                property: 'product:price:amount',
                content: String(meta.priceUSD),
              },
              { property: 'product:price:currency', content: 'USD' },
            ]
          : []),
        ...(meta.currentlySold !== undefined
          ? [
              {
                property: 'product:availability',
                content: meta.currentlySold ? 'in stock' : 'out of stock',
              },
            ]
          : []),
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: ogImageUrl },
      ],
      links: [{ rel: 'canonical', href: url }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(structuredData),
        },
      ],
    };
  },
});

function ControllerContentPage() {
  const { company, controller } = Route.useParams();
  const doc = getControllerDoc(company, controller);

  const [bookmarked, setBookmarked] = React.useState(() => isBookmarked(company, controller));

  if (doc == null) {
    return (
      <div className="min-h-screen bg-background p-6 text-foreground">
        <h1 className="font-bold text-xl">Controller not found</h1>
        <p className="text-muted-foreground">
          No controller at {company}/{controller}.
        </p>
      </div>
    );
  }

  const { meta, Component } = doc;

  const switchItems = Array.isArray(meta.switchType) ? meta.switchType : meta.switchType ? [meta.switchType] : [];

  const similarControllers = getSimilarControllers(doc, 3);

  const handleBookmarkToggle = () => {
    const newState = toggleBookmark(company, controller);
    setBookmarked(newState);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: meta.maker, href: `/makers/${company}` },
          { label: meta.name },
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
        <div>
          <h1 className="font-bold text-2xl">{meta.name}</h1>
          <p className="text-muted-foreground">{meta.maker}</p>
        </div>
        <div className="h-4" />
        <div className="lg:flow-root">
          <InfoCard
            meta={meta}
            bookmarked={bookmarked}
            onBookmarkToggle={handleBookmarkToggle}
            switchItems={switchItems}
          />
          <div className="h-4 lg:h-0" />
          <article className="prose prose-invert max-w-none">
            <Component />
          </article>
          <SimilarControllers controllers={similarControllers} />
          <EditOnGitHub filePath={`src/content/${company}/${controller}/index.mdx`} />
        </div>
      </div>
    </div>
  );
}
