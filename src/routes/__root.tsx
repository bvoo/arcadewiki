import { TanStackDevtools } from '@tanstack/react-devtools';
import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import type React from 'react';

import appCss from '../styles.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'arcade.wiki - Arcade Controller Database',
      },
      {
        name: 'description',
        content:
          'Comprehensive database of arcade-style controllers. Compare specs, get the full picture, and find the perfect controller.',
      },
      // Open Graph
      {
        property: 'og:site_name',
        content: 'arcade.wiki',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      // Twitter Card
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon/favicon.ico',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: '/favicon/favicon-96x96.png',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon/favicon.svg',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicon/apple-touch-icon.png',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }),

  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-6 text-gray-100">
      <div className="text-center">
        <h1 className="mb-2 font-bold text-3xl">Page Not Found</h1>
        <p className="mb-6 text-gray-400">The page you are looking for doesn’t exist.</p>
        <a className="text-blue-500 hover:underline" href="/">
          Go back home
        </a>
      </div>
    </div>
  ),

  shellComponent: RootDocument,
});

function GTag() {
  return (
    <>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-EM57W05E0Z" />
      <script>
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-EM57W05E0Z');
`}
      </script>
    </>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
        <GTag />
      </head>
      <body>
        {children}
        {import.meta.env.DEV ? <ClientDevtools /> : null}
        <Scripts />
      </body>
    </html>
  );
}

function ClientDevtools() {
  return (
    <TanStackDevtools
      config={{ position: 'bottom-left' }}
      plugins={[
        {
          name: 'Tanstack Router',
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />
  );
}
