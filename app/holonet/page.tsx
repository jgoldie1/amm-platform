import type { Metadata } from "next";
import Link from "next/link";
import { listHoloNetServices } from "@/lib/holonet/gateway";

export const metadata: Metadata = {
  title: "HoloNet — TRYAMM Network",
  description: "TRYAMM HoloNet connects Stubbs AI, Holo Search, Holo Advertise, LIVE, games, marketplace, media, mobility and other TRYAMM services through one signed service network.",
  alternates: { canonical: "/holonet" },
};

export default function HoloNetPage() {
  const services = listHoloNetServices();
  return (
    <main className="product-shell">
      <header className="product-header">
        <Link href="/" className="brand-link">TRYAMM</Link>
        <nav className="product-nav" aria-label="HoloNet navigation">
          <Link href="/discover">Discover</Link>
          <Link href="/stubbs-ai">Stubbs AI</Link>
          <Link href="/games">Games</Link>
          <Link href="/marketplace">Marketplace</Link>
        </nav>
      </header>
      <section className="product-hero">
        <p className="eyebrow">TRYAMM NETWORK LAYER</p>
        <h1>HoloNet</h1>
        <p className="lede">One service network for TRYAMM search, AI, media, commerce, realtime experiences, games and connected devices. Public services stay crawlable; private/high-impact services stay authenticated, signed and audited.</p>
        <div className="actions">
          <Link href="/discover" className="button-link">Explore public HoloNet</Link>
          <Link href="/stubbs-ai" className="button-link secondary">Ask Stubbs AI</Link>
        </div>
      </section>
      <section className="world-grid" aria-labelledby="services-heading">
        <div className="section-heading"><h2 id="services-heading">Connected services</h2></div>
        <div className="cards">
          {services.map((service) => (
            <article key={service.id}>
              <p className="eyebrow">{service.kind.toUpperCase()}</p>
              <h3>{service.name}</h3>
              <p>{service.capabilities.join(" • ")}</p>
              <p className="muted">{service.public ? "Public discovery service" : "Private/authenticated service"}</p>
              {service.public && service.endpoint.startsWith("/") && <Link className="card-link" href={service.endpoint}>Open →</Link>}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
