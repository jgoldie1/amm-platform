import type { Metadata } from "next";
import Link from "next/link";
import { listHoloNetServices } from "@/lib/holonet/gateway";

export const metadata: Metadata = {
  title: "HoloNet — TRYAMM Network",
  description: "TRYAMM HoloNet connects Stubbs AI, Holo Search, Holo Advertise, LIVE, games, marketplace, media, mobility and other TRYAMM services through one signed service network.",
  alternates: { canonical: "/holonet" },
};

const layers = [
  ["Holo DNS", "Public/private naming with DNSSEC-required production zones.", "SOFTWARE READY"],
  ["Holo Identity / PKI", "Signed identities, certificates, issuer trust and mTLS policy.", "SOFTWARE READY"],
  ["Quantum WiFi", "Latency-aware Wi-Fi/mesh orchestration, secure roaming and QoS for LIVE, games, XR, accessibility and safety traffic.", "SOFTWARE READY"],
  ["Holo Edge / CDN", "Region-aware edge selection using health, load and P95 latency.", "SOFTWARE READY"],
  ["Holo Search Index", "Public search index with private content excluded by policy.", "SOFTWARE READY"],
  ["Holo Advertise Exchange", "Placement, locale, safety and budget-aware campaign selection.", "SOFTWARE READY"],
  ["Holo Federation", "Signed node-to-node capability exchange with explicit trust levels.", "SOFTWARE READY"],
  ["Evidence Anchoring", "Checksummed network evidence with optional blockchain anchoring.", "SOFTWARE READY"],
  ["Quantum Lag Routing", "Telemetry-driven routing decisions for latency, errors, saturation and packet loss.", "SOFTWARE READY"],
  ["External IP / ASN / BGP", "Requires legitimate address-space authority, ASN, RPKI, upstream/peering agreements and operator approval.", "ACTIVATION REQUIRED"],
  ["Physical Edge / Data Center", "Requires real routers, access points, servers/colo/cloud edge capacity, DDoS services and operations.", "ACTIVATION REQUIRED"],
];

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
        <h1>HoloNet + Quantum WiFi</h1>
        <p className="lede">HoloNet is the distributed application/network control plane. Quantum WiFi is its wireless access layer, optimizing secure device connectivity and prioritizing realtime, accessibility and safety-critical traffic without bypassing network security.</p>
        <div className="actions">
          <Link href="/discover" className="button-link">Explore public HoloNet</Link>
          <Link href="/stubbs-ai" className="button-link secondary">Ask Stubbs AI</Link>
        </div>
      </section>

      <section className="world-grid" aria-labelledby="layers-heading">
        <div className="section-heading"><p className="eyebrow">INDEPENDENT NETWORK STACK</p><h2 id="layers-heading">Network layers</h2></div>
        <div className="cards">
          {layers.map(([title, description, status]) => (
            <article key={title}><p className="eyebrow">{status}</p><h3>{title}</h3><p>{description}</p></article>
          ))}
        </div>
      </section>

      <section className="world-grid" aria-labelledby="services-heading">
        <div className="section-heading"><h2 id="services-heading">Connected HoloNet services</h2></div>
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
