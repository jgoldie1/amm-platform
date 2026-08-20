"use client";

import { FormEvent, useState } from "react";

const verticals = [
  "legal",
  "medical",
  "insurance",
  "real_estate",
  "tax",
  "medicaid",
  "staffing",
  "security",
  "vehicle_sharing",
  "dispatch",
  "financial_services",
  "home_services",
] as const;

export default function ComplianceConsolePage() {
  const [result, setResult] = useState<string>("Run a test decision to see the gate result.");
  const [busy, setBusy] = useState(false);

  async function runCheck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);

    const form = new FormData(event.currentTarget);
    const vertical = String(form.get("vertical"));
    const jurisdiction = String(form.get("jurisdiction"));
    const feeType = String(form.get("feeType"));
    const status = String(form.get("credentialStatus"));

    const payload = {
      vertical,
      jurisdiction,
      providerId: "demo-provider",
      requestedFeeType: feeType,
      requestedAmountCents: 2500,
      credential: {
        providerId: "demo-provider",
        vertical,
        jurisdiction,
        credentialType: "professional_license",
        licenseNumber: "DEMO-ONLY",
        issuingAuthority: "Demo Authority",
        status,
        expiresAt: "2099-12-31T23:59:59.000Z",
      },
    };

    try {
      const response = await fetch("/api/compliance/check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch {
      setResult("The compliance API could not be reached.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", padding: "32px", maxWidth: 1000, margin: "0 auto" }}>
      <p style={{ letterSpacing: "0.18em", opacity: 0.7 }}>TRYAMM / COMPLIANCEOS</p>
      <h1>Regulated Services Gate</h1>
      <p>
        This operator console tests whether a regulated transaction may continue, must be blocked,
        or needs manual review. Demo credentials shown here are never production verification.
      </p>

      <form onSubmit={runCheck} style={{ display: "grid", gap: 16, marginTop: 28 }}>
        <label>
          Service vertical
          <select name="vertical" defaultValue="legal" style={{ display: "block", width: "100%", padding: 12, marginTop: 6 }}>
            {verticals.map((vertical) => (
              <option key={vertical} value={vertical}>{vertical.replaceAll("_", " ")}</option>
            ))}
          </select>
        </label>

        <label>
          Jurisdiction
          <input name="jurisdiction" defaultValue="Illinois" style={{ display: "block", width: "100%", padding: 12, marginTop: 6 }} />
        </label>

        <label>
          Credential status
          <select name="credentialStatus" defaultValue="verified" style={{ display: "block", width: "100%", padding: 12, marginTop: 6 }}>
            <option value="verified">verified</option>
            <option value="pending">pending</option>
            <option value="expired">expired</option>
            <option value="suspended">suspended</option>
            <option value="rejected">rejected</option>
          </select>
        </label>

        <label>
          Requested fee type
          <select name="feeType" defaultValue="platform" style={{ display: "block", width: "100%", padding: 12, marginTop: 6 }}>
            <option value="platform">TRYAMM platform fee</option>
            <option value="saas">SaaS fee</option>
            <option value="advertising">advertising fee</option>
            <option value="booking">booking fee</option>
            <option value="referral">referral fee</option>
            <option value="professional">professional fee</option>
          </select>
        </label>

        <button type="submit" disabled={busy} style={{ padding: 14, fontWeight: 700 }}>
          {busy ? "Checking…" : "Run compliance gate"}
        </button>
      </form>

      <section style={{ marginTop: 28 }}>
        <h2>Decision</h2>
        <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", padding: 18, border: "1px solid currentColor", borderRadius: 12 }}>
          {result}
        </pre>
      </section>
    </main>
  );
}
