import type { ControllerMeta, ControllerWithSlug } from "../data/controllers";

export type ControllerFrontmatter = ControllerMeta;

export type ControllerDoc = {
  slug: ControllerWithSlug["slug"]; // company/controller
  meta: ControllerFrontmatter;
  Component: React.ComponentType<Record<string, never>>;
};

const modules = import.meta.glob("../content/**/index.mdx", {
  eager: true,
  // biome-ignore lint/suspicious/noExplicitAny: MDX modules don't have static types
}) as Record<string, any>;

const allDocs: ControllerDoc[] = Object.entries(modules)
  .map(([path, mod]) => {
    const fm = (mod.frontmatter ||
      mod.meta ||
      {}) as Partial<ControllerFrontmatter>;
    const match = /content\/([^/]+)\/([^/]+)\/index\.mdx$/.exec(path);
    const company = fm.company ?? match?.[1] ?? "unknown";
    const controller = fm.controller ?? match?.[2] ?? fm.id ?? "unknown";
    const slug = `${company}/${controller}`;

    const buttonType: "digital" | "analog" =
      fm.buttonType === "digital" || fm.buttonType === "analog"
        ? fm.buttonType
        : "digital";

    const meta: ControllerFrontmatter = {
      id: String(fm.id ?? controller),
      name: String(fm.name ?? controller),
      maker: String(fm.maker ?? company),
      buttonType,
      priceUSD: fm.priceUSD,
      link: fm.link,
      currentlySold: Boolean(fm.currentlySold ?? false),
      releaseYear: Number(fm.releaseYear ?? new Date().getFullYear()),
      switchType: fm.switchType,
      weightGrams: fm.weightGrams,
      dimensionsMm: fm.dimensionsMm,
      company,
      controller,
    };
    return {
      slug,
      meta,
      Component: mod.default as React.ComponentType<Record<string, never>>,
    };
  })
  .sort((a, b) => a.meta.name.localeCompare(b.meta.name));

export function getAllControllerDocs(): ControllerDoc[] {
  return allDocs;
}

export function getControllerDoc(
  company: string,
  controller: string,
): ControllerDoc | undefined {
  return allDocs.find(
    (d) => d.meta.company === company && d.meta.controller === controller,
  );
}
