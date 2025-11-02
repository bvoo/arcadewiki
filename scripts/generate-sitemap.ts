import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { findMDXFiles, parseFrontmatter } from 'scripts/utils';
import type { ControllerMeta } from '@/data/controllers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = (process.env.SITEMAP_BASE_URL ?? 'https://arcade.wiki').replace(/\/$/, '');

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSitemap() {
  const contentDir = path.join(__dirname, '..', 'src', 'content');
  const mdxFiles = findMDXFiles(contentDir);
  const controllerUrls: { loc: string; lastmod: string }[] = [];
  const makerLastmod = new Map<string, string>();

  for (const filePath of mdxFiles) {
    const stat = fs.statSync(filePath);
    const lastmod = formatDate(stat.mtime);
    const relativeDir = path.relative(contentDir, path.dirname(filePath));
    const parts = relativeDir.split(path.sep);
    const companyFromPath = parts[0] ?? '';
    const controllerFromPath = parts[1] ?? '';

    let frontmatter: ControllerMeta = {} as ControllerMeta;

    try {
      frontmatter = parseFrontmatter(fs.readFileSync(filePath, 'utf-8')) ?? ({} as ControllerMeta);
    } catch (error) {
      console.error(`Error parsing frontmatter for ${filePath}:\n\t${(error as Error).message}`);
    }

    const company = String(frontmatter.company ?? companyFromPath).trim();
    const controller = String(frontmatter.controller ?? frontmatter.id ?? controllerFromPath).trim();

    if (!company || !controller) continue;

    const loc = `${BASE_URL}/controllers/${company}/${controller}`;
    controllerUrls.push({ loc, lastmod });

    const currentMakerLastmod = makerLastmod.get(company);
    if (!currentMakerLastmod || currentMakerLastmod < lastmod) {
      makerLastmod.set(company, lastmod);
    }
  }

  controllerUrls.sort((a, b) => a.loc.localeCompare(b.loc));

  const makerUrls = Array.from(makerLastmod.entries())
    .map(([company, lastmod]) => ({
      loc: `${BASE_URL}/makers/${company}`,
      lastmod,
    }))
    .sort((a, b) => a.loc.localeCompare(b.loc));

  const latestController = controllerUrls.reduce<string | null>(
    (latest, entry) => (latest && latest > entry.lastmod ? latest : entry.lastmod),
    null,
  );
  const latestMaker = makerUrls.reduce<string | null>(
    (latest, entry) => (latest && latest > entry.lastmod ? latest : entry.lastmod),
    null,
  );

  const today = formatDate(new Date());
  const staticUrls = [
    { loc: `${BASE_URL}/`, lastmod: latestController ?? today },
    { loc: `${BASE_URL}/makers`, lastmod: latestMaker ?? latestController ?? today },
  ];

  const allUrls = [...staticUrls, ...makerUrls, ...controllerUrls];
  const urlset = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allUrls.map((entry) => {
      const parts = ['  <url>', `    <loc>${escapeXml(entry.loc)}</loc>`];
      if (entry.lastmod) parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
      parts.push('  </url>');
      return parts.join('\n');
    }),
    '</urlset>',
    '',
  ].join('\n');

  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, urlset);
}

generateSitemap();
