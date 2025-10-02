import { createFileRoute } from '@tanstack/react-router'
import { getControllerDoc } from '../lib/controllers.content'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { EditOnGitHub } from '@/components/EditOnGitHub'
import { SiteHeader } from '@/components/SiteHeader'

export const Route = createFileRoute('/controllers/$company/$controller')({
  component: ControllerContentPage,
})

function ControllerContentPage() {
  const { company, controller } = Route.useParams()
  const doc = getControllerDoc(company, controller)

  if (!doc) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <h1 className="text-xl font-bold">Controller not found</h1>
        <p className="text-muted-foreground">No controller at {company}/{controller}.</p>
      </div>
    )
  }

  const { meta, Component } = doc

  // Formatters
  const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  // Normalize switches to string[]
  const switchItems = Array.isArray(meta.switchType)
    ? meta.switchType
    : meta.switchType
      ? [meta.switchType]
      : []

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{meta.name}</h1>
          <p className="text-muted-foreground">{meta.maker}</p>
        </div>
      </div>
      <div className="h-4" />
      <div className="lg:flow-root">
        <Card className="lg:float-right lg:w-[28rem] lg:ml-6 lg:mb-2">
          <CardContent className="p-3 grid gap-2 text-sm">
            {/* Availability */}
            {meta.currentlySold !== undefined ? (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Availability:</span>
                <Badge variant={meta.currentlySold ? 'default' : 'secondary'}>
                  {meta.currentlySold ? 'In stock' : 'Not sold'}
                </Badge>
              </div>
            ) : null}
            {/* Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Buttons:</span>
              {(() => {
                const v = String(meta.buttonType || '').toLowerCase()
                const label = v ? v.charAt(0).toUpperCase() + v.slice(1) : ''
                const variant = v === 'digital' ? 'default' : 'secondary'
                return label ? (
                  <Badge variant={variant as any} className="font-mono font-bold">{label}</Badge>
                ) : null
              })()}
            </div>
          

          {/* Switches */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Switches:</span>
            {switchItems.length ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="justify-between max-w-full min-w-32">
                    <span className="truncate" title={switchItems.length === 1 ? switchItems[0] : `${switchItems.length} types`}>
                      {switchItems.length === 1 ? switchItems[0] : `${switchItems.length} types`}
                    </span>
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
                  {switchItems.map((it, i) => (
                    <DropdownMenuItem key={i}>{it}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>

          {/* Release Year */}
          <div><span className="text-muted-foreground">Release Year:</span> <span className="tabular-nums font-mono">{meta.releaseYear}</span></div>

          {/* Weight */}
          <div>
            <span className="text-muted-foreground">Weight:</span>{' '}
            {meta.weightGrams ? (
              <span className="tabular-nums font-mono">{meta.weightGrams} <span className="text-muted-foreground text-xs">g</span></span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>

          {/* Dimensions */}
          <div>
            <span className="text-muted-foreground">Dimensions:</span>{' '}
            {meta.dimensionsMm ? (
              <span className="tabular-nums font-mono">
                {meta.dimensionsMm.width} × {meta.dimensionsMm.depth} × {meta.dimensionsMm.height}
                <span className="text-muted-foreground text-xs ml-1">mm</span>
              </span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>

          {/* Price */}
          <div>
            <span className="text-muted-foreground">Price:</span>{' '}
            {meta.priceUSD ? (
              <span className="tabular-nums font-mono">{usd.format(meta.priceUSD)}</span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>

            {/* Link */}
            {meta.link ? (
              <div>
                <Button asChild variant="outline" size="sm">
                  <a href={meta.link} target="_blank" rel="noreferrer">Official link</a>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
        <div className="h-4 lg:h-0" />
        <article className="prose prose-invert max-w-none">
          <Component />
        </article>
        <EditOnGitHub filePath={`src/content/${company}/${controller}/index.mdx`} />
      </div>
      </div>
    </div>
  )
}
