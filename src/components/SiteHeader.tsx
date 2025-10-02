import { Link } from '@tanstack/react-router'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-6">
        <Link to="/" className="font-mono flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity">
          {/* todo: figure out logo */}
          <span>Arcade.Wiki</span>
        </Link>
      </div>
    </header>
  )
}
