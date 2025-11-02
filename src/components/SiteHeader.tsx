import { Link } from '@tanstack/react-router';
import { Breadcrumbs } from './Breadcrumbs';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SiteHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function SiteHeader({ breadcrumbs, actions }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-border border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex w-full flex-col items-center gap-2 px-4 py-2 sm:h-14 sm:flex-row sm:gap-8 sm:px-6 sm:py-0">
        <div className="flex w-full items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold font-mono text-lg transition-opacity hover:opacity-80"
          >
            {/* todo: figure out logo */}
            <span>arcade.wiki</span>
          </Link>

          <div className="ml-4 hidden sm:block">
            {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
          </div>

          <div className="ml-auto">{actions}</div>
        </div>
      </div>
    </header>
  );
}
