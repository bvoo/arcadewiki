import type { ErrorComponentProps } from '@tanstack/react-router';
import { Link, rootRouteId, useMatch, useRouter } from '@tanstack/react-router';
import { TriangleAlertIcon } from 'lucide-react';
import { SiteHeader } from './SiteHeader';
import { Button } from './ui/button';

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  console.error('DefaultCatchBoundary Error:', error);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-destructive/10 text-3xl text-destructive">
              <TriangleAlertIcon size="48" />
            </div>

            <h1 className="font-semibold text-2xl">Something went wrong</h1>
            <p className="text-muted-foreground">{error.message}</p>

            <details>
              <summary className="cursor-pointer text-muted-foreground">Show error details</summary>
              <pre className="max-h-60 w-full overflow-auto rounded bg-muted p-4 text-left font-mono text-sm">
                {error.stack}
              </pre>
            </details>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                type="button"
                variant="default"
                onClick={() => {
                  router.invalidate();
                }}
              >
                Try Again
              </Button>

              {isRoot ? (
                <Button asChild variant="ghost">
                  <Link to="/">Home</Link>
                </Button>
              ) : (
                <Button asChild variant="ghost">
                  <Link
                    to="/"
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.back();
                    }}
                  >
                    Go Back
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
