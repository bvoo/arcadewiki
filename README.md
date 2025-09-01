# Rectangle Directory — Contributing Guide

Thanks for helping improve Rectangle Directory! This guide explains how to add and maintain controller pages using MDX.

## Project Structure

- __Content root__: `src/content/`
- __Per-controller path__: `src/content/{company}/{controller}/index.mdx`
  - Example: `src/content/orca-analog-controllers/the-orca/index.mdx`

## MDX Frontmatter Schema

Each controller page uses YAML frontmatter that maps to `ControllerFrontmatter` in `src/lib/controllers.content.ts`.

Required/optional fields:

```yaml
id: the-orca                    # string; defaults to folder name
name: The Orca                  # string; display name
maker: Orca Analog Controllers  # string; human-friendly maker
company: orca-analog-controllers# string; company slug (folder name)
controller: the-orca            # string; controller slug (folder name)
buttonType: analog              # string; "digital" or "analog"
priceUSD: 249.0                 # number; omit if unknown
currentlySold: true             # boolean
releaseYear: 2024               # number
switchType:                     # string or string[]
  - Everglide Rice Pudding Hall Effect
  - Kailh Speed Silver
weightGrams: 1000               # number; omit if unknown
dimensionsMm:                   # object; omit fields if unknown
  width: 331
  depth: 185
  height: 39
link: https://example.com       # optional external link
```

After the frontmatter separator `---`, write normal Markdown/MDX for the page body (e.g., Overview, Features, Pros/Cons, etc.).

## Example MDX File

```mdx
---
id: the-orca
name: The Orca
maker: Orca Analog Controllers
company: orca-analog-controllers
controller: the-orca
buttonType: analog
priceUSD: 249.0
currentlySold: true
releaseYear: 2024
switchType:
  - Everglide Rice Pudding Hall Effect
  - Kailh Speed Silver
weightGrams: 1000
dimensionsMm:
  width: 331
  depth: 185
  height: 39
link: https://theorca.gg/product/orca-analog-controller/
---

## Overview

Write your description here. You can use standard Markdown: headings, paragraphs, lists, links, code, images, etc.

### Features

- Analog stick-like buttons
- Low latency design

> Tip: Keep content factual and avoid marketing language.
```

## Content Rules of Thumb

- __Slugs__ (`company`, `controller`) must match their directory names.
- __Numbers__: use plain numbers (no quotes). Prices are in USD.
- __Omit unknowns__: leave fields out instead of guessing.
- __External links__: set a single `link` to the official product page if available.
- __Images__: For now, store public images next to their respective `index.mdx` and link by relative path (e.g., `./controller.webp`).

## Local Development

- Install deps: `pnpm install` (or `npm install`)
- Start dev: `pnpm dev` (or `npm run dev`)
- Lint/format: `pnpm check`, `pnpm lint`, `pnpm format`

## How Pages Are Loaded

- Files are discovered by `import.meta.glob('../content/**/index.mdx', { eager: true })` in `src/lib/controllers.content.ts`.
- Frontmatter is parsed and combined with a compiled MDX component (`Component`).
- Rendering happens in `src/routes/controllers.$company.$controller.tsx` inside an `<article className="prose ...">` wrapper.

## Pull Request Checklist

- [ ] Folder and slugs follow `src/content/{company}/{controller}/index.mdx`
- [ ] Frontmatter validates against the schema above
- [ ] No broken links, typos, or placeholder text
- [ ] Markdown renders cleanly (headings, lists, links)

## Questions

Open an issue or PR with your question. Thanks for contributing!
