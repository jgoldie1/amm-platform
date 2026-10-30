# FaithVerse LIVE Studio checkpoint
Route: /faithverse/live. Implements camera/microphone local preview and explicit stop. No livestream, recording or upload occurs from this UI.
No direct LiveKit SDK dependency is installed. The token endpoint exists but must not be enabled until provider credentials, permission tests and room authorization are verified.
Next: real LiveKit UI with verified server token, connect/disconnect, subscription, role checks and stream lifecycle. Egress must require explicit consent and a server-side authorized recording request; output stored privately and linked to media processing jobs.
Test iOS Safari and Chromebook mic/camera, permission denied, tab close, preview stop, degraded network, unauthorized host and viewer, room access, accessible controls, captions and costs. Verify rollback and CI prior to merging.
