#!/usr/bin/env bash
set -euo pipefail
command -v ffmpeg >/dev/null
command -v ffprobe >/dev/null
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
# Synthetic video+audio only; never customer footage.
ffmpeg -nostdin -hide_banner -loglevel error -f lavfi -i "testsrc2=size=320x240:rate=15:duration=2" -f lavfi -i "sine=frequency=440:duration=2" -shortest -c:v libx264 -pix_fmt yuv420p -c:a aac "$tmp/original.mp4"
node scripts/media/compress.mjs "$tmp/original.mp4" "$tmp/processed.mp4"
test -s "$tmp/original.mp4"
test -s "$tmp/processed.mp4"
ffmpeg -nostdin -hide_banner -loglevel error -xerror -i "$tmp/processed.mp4" -f null -
codec="$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of default=nw=1:nk=1 "$tmp/processed.mp4")"
audio="$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of default=nw=1:nk=1 "$tmp/processed.mp4")"
test "$codec" = h264
test "$audio" = aac
if node scripts/media/compress.mjs "$tmp/original.mp4" "$tmp/processed.mp4"; then echo 'ERROR: overwrote existing output' >&2; exit 1; fi
echo 'PASS: original retained, H264/AAC MP4 decodes, existing output protected'
