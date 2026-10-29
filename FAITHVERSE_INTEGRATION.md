# FaithVerse Safe Super App Integration
- This branch adds only `app/faithverse/page.tsx`. It does not alter the Super App homepage, StreetVerse, authentication, or customer records.
- Set the **server-side** environment variable `FAITHVERSE_PUBLIC_URL` to an independently tested HTTPS FaithVerse reader deployment. Leave unset to display a safe staging notice.
- Do **not** use `NEXT_PUBLIC_` for payment secrets. Do not enable Stripe or Lulu by default.
- Review historical text licenses and full KJV/Strong's completeness before release. Supplemental collections must carry explicit edition/provenance labels.
- Run `npm install && npm run build` in an isolated branch build; test keyboard/mobile access; verify the HTTPS link and destination permissions.
- Test Quantum Sandbox rollback before merger. No automatic production promotion.
- v0.9 separate source archive remains a separate app; this route is a safe integration entry, not a full bundle or proof of deployment.
