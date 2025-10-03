import { Link } from "@tanstack/react-router";
import { Breadcrumbs } from "./Breadcrumbs";

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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-6 gap-8 w-full">
        <Link
          to="/"
          className="font-mono flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity"
        >
          {/* todo: figure out logo */}
          <span>arcade.wiki</span>
        </Link>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} />
        )}
        <div className="ml-auto">{actions}</div>
      </div>
    </header>
  );
}
