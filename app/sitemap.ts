import type { MetadataRoute } from 'next';
import { publicHoloCrawlLinks } from '@/lib/seo/holo-links';

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tryamm.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/discover', ...publicHoloCrawlLinks.map((link) => link.href)];
  const uniqueRoutes = [...new Set(routes)];

  return uniqueRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/feed' || route === '/live' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/discover' || route === '/feed' || route === '/marketplace' ? 0.9 : 0.7,
  }));
}
