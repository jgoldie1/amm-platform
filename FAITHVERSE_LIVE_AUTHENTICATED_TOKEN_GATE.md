# FaithVerse LIVE — authenticated room tokens (review build)
Endpoint: POST /api/faithverse/live/token with Authorization: Bearer <Supabase JWT> and JSON {"room":"approved-uuid","role":"viewer"|"host"}.
Disabled by default unless TRYAMM_LIVE_ENABLED=true and LiveKit/Supabase server secrets exist.
Host permissions require server-configured TRYAMM_LIVE_HOST_USER_IDS; room access requires TRYAMM_LIVE_APPROVED_ROOM_IDS. Both are UUID comma-separated lists. Never authorize via editable user_metadata.
Provides 15-minute LiveKit HS256 room tokens, viewer subscribe-only, host publish. No public admin/egress grants.
**Not proof of complete broadcast:** LiveKit provider/room, frontend publishing UI, per-room membership, real broadcast, egress recording, moderation, usage alerts, and cloud media pipeline are still pending.
Before activation: add DB-backed room ownership/invitations rather than static allowlists; verify LiveKit issuer/secret via test join, token revocation and participant removal, mobile permission prompts, audio/video and captions, stream stop/recovery, recording consent and private Egress storage. Keep features disabled before those checks.
