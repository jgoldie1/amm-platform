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
];

export default function ProviderOnboardingPage() {
  const [providerId, setProviderId] = useState("");
  const [message, setMessage] = useState("Start by creating the provider profile.");

  async function onboardProvider(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setMessage("Creating provider profile...");

    const response = await fetch("/api/providers/onboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: form.get("displayName"),
        providerType: form.get("providerType"),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message ?? data.error ?? "Provider onboarding failed.");
      return;
    }

    setProviderId(data.provider.id);
    setMessage(`Provider created: ${data.provider.id}. Add a credential next.`);
  }

  async function addCredential(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setMessage("Submitting credential...");

    const response = await fetch("/api/providers/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId,
        vertical: form.get("vertical"),
        jurisdiction: form.get("jurisdiction"),
        credentialType: form.get("credentialType"),
        licenseNumber: form.get("licenseNumber"),
        issuingAuthority: form.get("issuingAuthority"),
        expiresAt: form.get("expiresAt") || undefined,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message ?? data.error ?? "Credential submission failed.");
      return;
    }

    setMessage(`Credential submitted with status: ${data.credential.verification_status}.`);
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 80px" }}>
      <p style={{ letterSpacing: 2, textTransform: "uppercase", opacity: 0.7 }}>TRYAMM ComplianceOS</p>
      <h1>Provider Credential Vault</h1>
      <p>
        Regulated providers create a profile, submit credentials, and remain transaction-blocked until verification is complete.
      </p>

      <section style={{ marginTop: 32, padding: 24, border: "1px solid #444", borderRadius: 16 }}>
        <h2>1. Provider profile</h2>
        <form onSubmit={onboardProvider} style={{ display: "grid", gap: 14 }}>
          <label>
            Display name
            <input name="displayName" required style={{ display: "block", width: "100%", padding: 12, marginTop: 6 }} />
          </label>
          <label>
            Provider type
            <input name="providerType" placeholder="Attorney, clinic, broker, contractor..." required style={{ display: "block", width: "100%", padding: 12, marginTop: 6 }} />
          </label>
          <button type="submit" style={{ padding: 14, fontWeight: 700 }}>Create provider profile</button>
        </form>
      </section>

      <section style={{ marginTop: 24, padding: 24, border: "1px solid #444", borderRadius: 16, opacity: providerId ? 1 : 0.55 }}>
        <h2>2. Credential submission</h2>
        <form onSubmit={addCredential} style={{ display: "grid", gap: 14 }}>
          <label>
            Service vertical
            <select name="vertical" disabled={!providerId} required style={{ display: "block", width: "100%", padding: 12, marginTop: 6 }}>
              {verticals.map((vertical) => <option key={vertical} value={vertical}>{vertical.replaceAll("_", " ")}</option>)}
            </select>
          </label>
          <label>
            Jurisdiction
            <input name="jurisdiction" placeholder="Illinois" disabled={!providerId} required style={{ display: "block", width: "100%", padding: 12, marginTop: 6 }} />
          </label>
          <label>
            Credential type
            <input name="credentialType" placeholder="Professional license" disabled={!providerId} required style={{ display: "block", width: "100%", padding: 12, marginTop: 6 }} />
          </label>
          <label>
            License / registration number
            <input name="licenseNumber" disabled={!providerId} style={{ display: "block", width: "100%", padding: 12, marginTop: 6 }} />
          </label>
          <label>
            Issuing authority
            <input name="issuingAuthority" disabled={!providerId} style={{ display: "block", width: "100%", padding: 12, marginTop: 6 }} />
          </label>
          <label>
            Expiration
            <input type="date" name="expiresAt" disabled={!providerId} style={{ display: "block", width: "100%", padding: 12, marginTop: 6 }} />
          </label>
          <button type="submit" disabled={!providerId} style={{ padding: 14, fontWeight: 700 }}>Submit credential</button>
        </form>
      </section>

      <aside aria-live="polite" style={{ marginTop: 24, padding: 18, borderRadius: 12, background: "rgba(79,227,255,0.08)" }}>
        <strong>Status:</strong> {message}
        {providerId ? <div style={{ marginTop: 8, wordBreak: "break-all" }}>Provider ID: {providerId}</div> : null}
      </aside>
    </main>
  );
}
