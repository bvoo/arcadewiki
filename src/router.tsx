import { createRouter } from '@tanstack/react-router';
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultCatchBoundary,
  });

  return router;
}
