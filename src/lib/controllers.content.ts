import type { Controller } from '../data/controllers'

export type ControllerFrontmatter = Controller & {
  company: string
  controller: string
}

export type ControllerDoc = {
  slug: string // company/controller
  meta: ControllerFrontmatter
  Component: React.ComponentType<any>
}

const modules = import.meta.glob('../content/**/index.mdx', { eager: true }) as Record<
  string,
  any
>

const allDocs: ControllerDoc[] = Object.entries(modules)
  .map(([path, mod]) => {
    const fm = (mod.frontmatter || mod.meta || {}) as Partial<ControllerFrontmatter>
    const match = /content\/([^/]+)\/([^/]+)\/index\.mdx$/.exec(path)
    const company = fm.company ?? match?.[1] ?? 'unknown'
    const controller = fm.controller ?? match?.[2] ?? (fm.id as string) ?? 'unknown'
    const slug = `${company}/${controller}`
    const meta: ControllerFrontmatter = {
      id: String(fm.id ?? controller),
      name: String(fm.name ?? controller),
      maker: String(fm.maker ?? company),
      buttonType: (fm.buttonType as any) ?? 'digital',
      priceUSD: fm.priceUSD as any,
      link: fm.link as any,
      currentlySold: Boolean(fm.currentlySold ?? false),
      releaseYear: Number(fm.releaseYear ?? new Date().getFullYear()),
      switchType: fm.switchType as any,
      weightGrams: fm.weightGrams as any,
      dimensionsMm: fm.dimensionsMm as any,
      company,
      controller,
    }
    return { slug, meta, Component: mod.default as React.ComponentType<any> }
  })
  .sort((a, b) => a.meta.name.localeCompare(b.meta.name))

export function getAllControllerDocs(): ControllerDoc[] {
  return allDocs
}

export function getControllerDoc(company: string, controller: string): ControllerDoc | undefined {
  return allDocs.find((d) => d.meta.company === company && d.meta.controller === controller)
}
