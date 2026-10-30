# TRYAMM LIVE + FaithVerse Broadcasting (review-only)
Purpose: creator live video, interactive FaithVerse lessons, Holo Lab streams, and later approved redistribution.
Existing upload/FFmpeg pipeline handles recorded media AFTER LiveKit Egress writes a private original. LiveKit Ingress handles OBS/RTMP/WHIP inputs; Egress handles recordings or outbound RTMP/HLS.
Config (server only): LIVEKIT_URL (wss), LIVEKIT_API_KEY, LIVEKIT_API_SECRET; TRYAMM_LIVE_ENABLED=false by default.
Implemented: /api/faithverse/live/status returns configured/disabled, never exposes credentials.
Not implemented: issuance of authenticated publish/viewer tokens, stream UI, Egress, moderated rooms, broadcast recording consent, content rights, RTMP destinations, media worker handoff.
Next change: add livekit-server-sdk with pinned compatible lockfile, a short-lived token route with Supabase JWT validation and role/room authorization. Viewer tokens only subscribe; permitted hosts may publish. Restrict stream keys and identities.
Required tests: revoked user, wrong owner, join/view roles, start/stop/reconnect, moderator removal, duration cap, stream recording consent, origin private bucket, antivirus before publishing on-demand clips, rate/usage limits and spend alerts. Verify LiveKit credentials and cost before activation.
Never automatically syndicate religious or customer content to social platforms without creator permission. Never advertise LIVE as connected before real-device stream tests pass.
References: https://docs.livekit.io/reference/server-sdk-js/ ; https://docs.livekit.io/transport/media/ingress-egress/egress/
