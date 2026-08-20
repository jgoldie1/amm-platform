import type { MetadataRoute } from 'next';
import { publicHoloCrawlLinks } from '@/lib/seo/holo-links';

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tryamm.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/discover', '/link-kit', ...publicHoloCrawlLinks.map((link) => link.href)];
  const uniqueRoutes = [...new Set(routes)];

  return uniqueRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/feed' || route === '/live' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/discover' || route === '/feed' || route === '/marketplace' ? 0.9 : route === '/link-kit' ? 0.6 : 0.7,
  }));
}
