import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TryAMM Immersive OS',
  description: 'TryAMM, Omni Box, Holoverse, GameVerse and Living Worlds.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{margin:0,fontFamily:'system-ui, sans-serif',background:'#04050e',color:'#f8fbff'}}>{children}</body>
    </html>
  );
}
