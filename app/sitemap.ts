import type { MetadataRoute } from 'next';

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tryamm.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/feed',
    '/live',
    '/games',
    '/omni-box',
    '/stubbs-ai',
    '/holoforge',
    '/marketplace',
    '/services',
    '/creator',
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/feed' || route === '/live' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/feed' || route === '/marketplace' ? 0.9 : 0.7,
  }));
}
