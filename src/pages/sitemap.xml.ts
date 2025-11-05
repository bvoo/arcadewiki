import { srcDir } from 'astro:config/server';
import { getCollection } from 'astro:content';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { baseUrl } from '@/lib/utils';

function gitLogDate(filePath?: string): string | null {
  if (filePath == null || filePath.trim() === '') return null;
  const gitDate = execSync(`git log -1 --pretty="format:%cI" -- "${filePath}"`).toString().trim();

  if (gitDate == null || gitDate === '') return null;

  return gitDate;
}

function getLastmod(filePath?: string): string {
  const isoDate = gitLogDate(filePath) ?? new Date().toISOString();
  return isoDate.split('T')[0].trim();
}

export async function GET() {
  const collection = await getCollection('controllers');

  const companies = new Map<string, string>();
  const controllers: { loc: string; lastmod: string }[] = [];

  for (const entry of collection) {
    const company = entry.data.companySlug;
    const controller = entry.data.controllerSlug;

    const lastmod = getLastmod(entry.filePath);

    controllers.push({
      loc: `/controllers/${company}/${controller}`,
      lastmod,
    });

    const existingLastmod = companies.get(company);
    if (existingLastmod == null || existingLastmod < lastmod) {
      companies.set(company, lastmod);
    }
  }

  const pagesDir = join(srcDir.toString().replace(/^file:\/\/\//, ''), 'pages');

  const entries: { loc: string; lastmod: string }[] = [
    { loc: '/', lastmod: getLastmod(join(pagesDir, 'index.astro')) },
    { loc: '/makers', lastmod: getLastmod(join(pagesDir, 'makers/index.astro')) },
  ];

  for (const [company, lastmod] of companies) {
    entries.push({ loc: `/makers/${company}`, lastmod });
  }

  for (const controller of controllers) {
    entries.push(controller);
  }

  const urls = entries.map((entry) => {
    const loc = `${baseUrl}${entry.loc}`.replace(/\/+/, '/');
    return `<url><loc>${loc}</loc><lastmod>${entry.lastmod}</lastmod></url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(sitemap, { headers: { 'Content-Type': 'application/xml' } });
}
