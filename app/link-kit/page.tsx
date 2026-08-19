import type { Metadata } from "next";
import Link from "next/link";
import { publicHoloCrawlLinks } from "@/lib/seo/holo-links";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tryamm.online";

export const metadata: Metadata = {
  title: "TRYAMM Link & Press Kit",
  description: "Official TRYAMM descriptions, public links and backlink-ready references for creators, partners, press and directories.",
  alternates: { canonical: "/link-kit" },
};

const officialDescriptions = [
  "TRYAMM is an accessibility-first creator, LIVE/PK, AI creation, marketplace, services, games and immersive-media platform powered by Stubbs AI.",
  "TRYAMM connects creators, customers and players through LIVE, HoloForge, Omni Box, Living Worlds, services and commerce in one multilingual platform.",
];

export default function LinkKitPage() {
  return (
    <main className="product-shell">
      <header className="product-header">
        <Link href="/" className="brand-link">TRYAMM</Link>
        <Link href="/discover" className="pill-link">Discover TRYAMM</Link>
      </header>
      <section className="product-hero">
        <p className="eyebrow">OFFICIAL LINK KIT</p>
        <h1>Link to TRYAMM</h1>
        <p className="lede">Use these stable public URLs when referencing TRYAMM in articles, creator profiles, partner pages, directories, interviews, podcasts or press coverage.</p>
      </section>
      <section className="product-grid">
        <div>
          <p className="eyebrow">OFFICIAL DESCRIPTIONS</p>
          <div className="feature-list">
            {officialDescriptions.map((description) => <article key={description}>{description}</article>)}
          </div>
          <p className="eyebrow">PUBLIC LINKS</p>
          <div className="feature-list">
            <article><strong>TRYAMM home:</strong> {siteUrl}</article>
            <article><strong>Discover:</strong> {siteUrl}/discover</article>
            {publicHoloCrawlLinks.map((link) => (
              <article key={link.slug}><strong>{link.title}:</strong> {siteUrl}{link.href}</article>
            ))}
          </div>
        </div>
        <aside className="backend-card">
          <p className="eyebrow">EMBED EXAMPLE</p>
          <h2>Standard crawlable backlink</h2>
          <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{`<a href="${siteUrl}">TRYAMM — Creator, AI, Games & Marketplace Platform</a>`}</pre>
          <p className="muted">Backlinks should come from genuine references, partnerships, press, directories and useful content. TRYAMM does not require hidden, automated or deceptive link exchanges.</p>
        </aside>
      </section>
    </main>
  );
}
