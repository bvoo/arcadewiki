import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-muted-foreground text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href || item.label} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link to={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-medium text-foreground' : ''}>{item.label}</span>
              )}
              {!isLast && <ChevronRight className="size-4" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
