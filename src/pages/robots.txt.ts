import { baseUrl } from '@/lib/utils';

export async function GET() {
  const robots = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow:

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(robots, { headers: { 'Content-Type': 'text/plain' } });
}
