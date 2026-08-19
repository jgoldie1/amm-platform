import type { Metadata } from 'next';
import Link from "next/link";
import { notFound } from "next/navigation";
import { productNav, productSections } from "@/lib/product-sections";

type PageProps = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section: slug } = await params;
  const section = productSections[slug];
  if (!section) return {};

  const indexable = !['auth', 'wallet', 'notifications', 'settings', 'my-vault', 'checkout'].includes(slug);
  return {
    title: section.title,
    description: section.description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: `${section.title} | TRYAMM`,
      description: section.description,
      url: `/${slug}`,
      type: 'website',
      images: ['/icons/tryamm-judah-icon-1024.png'],
    },
    robots: { index: indexable, follow: indexable },
  };
}

export default async function ProductSectionPage({ params }: PageProps) {
  const { section: slug } = await params;
  const section = productSections[slug];
  if (!section) notFound();

  return (
    <main className="product-shell">
      <header className="product-header">
        <Link href="/" className="brand-link">TRYAMM</Link>
        <nav aria-label="Product navigation" className="product-nav">
          {productNav.map((navSlug) => (
            <Link key={navSlug} href={`/${navSlug}`} aria-current={navSlug === section.slug ? "page" : undefined}>
              {productSections[navSlug].title.replace("TRYAMM ", "")}
            </Link>
          ))}
        </nav>
        <Link href="/auth" className="pill-link">Sign in</Link>
      </header>

      <section className="product-hero">
        <p className="eyebrow">{section.eyebrow}</p>
        <h1>{section.title}</h1>
        <p className="lede">{section.description}</p>
        <div className="actions">
          <button type="button">{section.primaryAction}</button>
          {section.secondaryAction && <button type="button" className="secondary">{section.secondaryAction}</button>}
        </div>
        <div className="status-strip" aria-label="Implementation status">
          <span>{section.status.replaceAll("-", " ")}</span>
          <span>Stubbs AI connected architecture</span>
          <span>Accessibility + multilingual required</span>
        </div>
      </section>

      <section className="product-grid" aria-labelledby="capabilities-heading">
        <div>
          <p className="eyebrow">EXPERIENCE</p>
          <h2 id="capabilities-heading">What this screen does</h2>
          <div className="feature-list">
            {section.capabilities.map((capability) => <article key={capability}>{capability}</article>)}
          </div>
        </div>
        <aside className="backend-card">
          <p className="eyebrow">CONNECTED SYSTEMS</p>
          <h2>Behind the screen</h2>
          <ul>{section.backend.map((item) => <li key={item}>{item}</li>)}</ul>
          <p className="muted">This route is part of the working consumer-app shell. Production actions stay gated until their real provider credentials, auth/RLS, payment/realtime integrations, and deployed tests pass.</p>
        </aside>
      </section>
    </main>
  );
}
