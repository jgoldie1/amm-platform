import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  applicationName: 'TRYAMM',
  title: 'TRYAMM — The Holographic Gateway',
  description: 'An accessibility-first creator, marketplace, live, AI and Living Worlds platform.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icons/favicon.ico' },
      { url: '/icons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png' }
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }]
  },
  openGraph: {
    title: 'TRYAMM — The Holographic Gateway',
    description: 'Enter the TRYAMM Omniverse through the Lion of Judah.',
    images: ['/icons/tryamm-judah-icon-1024.png']
  }
};

export const viewport: Viewport = {
  themeColor: '#02040A',
  colorScheme: 'dark'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
