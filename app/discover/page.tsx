import type { Metadata } from "next";
import Link from "next/link";
import { publicHoloCrawlLinks } from "@/lib/seo/holo-links";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tryamm.online";

export const metadata: Metadata = {
  title: "Discover TRYAMM",
  description: "Explore TRYAMM LIVE, games, HoloForge, Stubbs AI, Omni Box, marketplace, services and creator tools.",
  alternates: { canonical: "/discover" },
  openGraph: {
    title: "Discover TRYAMM",
    description: "Public gateway to TRYAMM's creator, AI, games, marketplace and immersive-media experiences.",
    url: "/discover",
  },
};

export default function DiscoverPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "TRYAMM public experiences",
    itemListElement: publicHoloCrawlLinks.map((link, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: link.title,
      url: `${siteUrl}${link.href}`,
      description: link.description,
    })),
  };

  return (
    <main className="product-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <header className="product-header">
        <Link href="/" className="brand-link">TRYAMM</Link>
        <Link href="/auth" className="pill-link">Sign in</Link>
      </header>
      <section className="product-hero">
        <p className="eyebrow">HOLO CRAWLABLE LINKS</p>
        <h1>Discover TRYAMM</h1>
        <p className="lede">A public, crawlable map of TRYAMM experiences. Private account, wallet, notification and founder-vault routes are intentionally excluded.</p>
      </section>
      <section className="world-grid" aria-labelledby="discover-heading">
        <div className="section-heading"><h2 id="discover-heading">Explore the platform</h2></div>
        <div className="cards">
          {publicHoloCrawlLinks.map((link) => (
            <article key={link.slug}>
              <p className="eyebrow">{link.category.toUpperCase()}</p>
              <h3>{link.title}</h3>
              <p>{link.description}</p>
              <Link className="card-link" href={link.href}>Open {link.title} →</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
