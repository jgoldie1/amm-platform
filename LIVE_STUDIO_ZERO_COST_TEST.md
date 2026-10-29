# Zero-cost TRYAMM LIVE browser smoke test

Local development only; **not** a production broadcast or a security-approved preview.

Prerequisites: Node.js 22+, a local LiveKit Server binary, a Chromium browser. No Vercel or billing required. Install LiveKit Server according to its official documentation and start it in dev mode (default `ws://127.0.0.1:7880`, API key `devkey`, secret `secret`). Do not expose this dev server to the internet.

1. Run `node scripts/live/local-room-tokens.mjs` on your Chromebook Linux terminal. This prints distinct 10-minute host/viewer tokens.
2. Serve repository static files locally (e.g. `python3 -m http.server 8088` at repository root).
3. Open `http://localhost:8088/tools/livekit-local-smoke.html` in two browser windows. Copy host token into first and viewer token into second, then connect both to local LiveKit.
4. Host clicks **Publish camera and microphone**; viewer sees/hears the remote stream. Viewer clicks Publish to confirm it is rejected by server permissions.
5. Disconnect both and verify browser microphone/camera indicators switch off.
6. Record observed results in a manual acceptance log. This smoke test does **not** use Supabase authentication, Egress, storage or the media worker.

For remote phone-to-Chromebook tests, HTTPS, a reachable server, TURN networking and a legitimate LiveKit deployment are required. Do not publish dev credentials or put tokens in Git.
A successful local check does not authorize TRYAMM_LIVE_ENABLED=true or a paid service.
