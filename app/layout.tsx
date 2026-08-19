import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tryamm.online';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'TRYAMM',
  title: {
    default: 'TRYAMM — Stubbs AI, LIVE, HoloForge, Marketplace & Living Worlds',
    template: '%s | TRYAMM',
  },
  description:
    'TRYAMM is an accessibility-first global creator, LIVE/PK, AI creation, marketplace, services, games, immersive media and Living Worlds platform powered by Stubbs AI.',
  keywords: [
    'TRYAMM', 'Stubbs AI', 'HoloGPT', 'HoloForge', 'LIVE PK', 'creator platform',
    'AI marketplace', 'Living Worlds', 'immersive games', 'Omni Box', 'accessibility',
    'multilingual creator platform',
  ],
  alternates: { canonical: '/' },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icons/favicon.ico' },
      { url: '/icons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'TRYAMM',
    title: 'TRYAMM — Stubbs AI, Creator Economy & Living Worlds',
    description: 'Create, go LIVE, play, build, shop, book and earn through one accessibility-first platform.',
    images: [{ url: '/icons/tryamm-judah-icon-1024.png', width: 1024, height: 1024, alt: 'TRYAMM Lion of Judah holographic emblem' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TRYAMM — Stubbs AI, Creator Economy & Living Worlds',
    description: 'LIVE, HoloForge, marketplace, services, games and immersive worlds in one platform.',
    images: ['/icons/tryamm-judah-icon-1024.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
};

export const viewport: Viewport = {
  themeColor: '#02040A',
  colorScheme: 'dark',
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TRYAMM',
  url: siteUrl,
  logo: `${siteUrl}/icons/tryamm-judah-icon-1024.png`,
  description: 'Accessibility-first creator, AI, marketplace, services, games and immersive media platform.',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TRYAMM',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        {children}
      </body>
    </html>
  );
}
