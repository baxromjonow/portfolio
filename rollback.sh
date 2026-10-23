#!/usr/bin/env bash
# Faqat o'z serverdagi variant uchun: cloudflared sozlamasini oxirgi zaxiradan qaytaradi.
set -Eeuo pipefail
cd "$(dirname "$(readlink -f "$0")")"
LAST="$(ls -1t backups/cloudflared-config-*.yml 2>/dev/null | head -n1 || true)"
[[ -z "$LAST" ]] && { echo "Zaxira topilmadi"; exit 1; }
CFG="$(cat backups/LAST_CONFIG_PATH 2>/dev/null || echo /etc/cloudflared/config.yml)"
sudo cp "$LAST" "$CFG"
sudo systemctl restart cloudflared
echo "✔ Tunnel sozlamasi qaytarildi: $LAST"
echo "  Yangi konteynerni to'xtatish: docker compose down"
