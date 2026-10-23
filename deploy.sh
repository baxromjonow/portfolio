#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
#  baxromjonov.uz v2 — serverga o'rnatish skripti
#  Ishlatish:  bash deploy.sh
#  Sozlamalar (ixtiyoriy, buyruq oldidan yoziladi):
#    SWITCH_TUNNEL=0  bash deploy.sh   → domenni yangi saytga ulamaydi (faqat sinov)
#    PORT=3099        bash deploy.sh   → boshqa port
#
#  Nima qiladi:
#   1) .env ni tayyorlaydi (Telegram token eski portfoliodan topilsa — ko'chiradi)
#   2) bo'sh port tanlaydi, docker compose build + up
#   3) /healthz orqali tekshiradi
#   4) /etc/cloudflared/config.yml dan zaxira oladi va baxromjonov.uz + www ni
#      yangi portga ulaydi, tekshiradi, xato bo'lsa avtomatik qaytaradi
#  Boshqa konteynerlar, saytlar va bazalarga TEGMAYDI.
# ─────────────────────────────────────────────────────────────
set -Eeuo pipefail

cd "$(dirname "$(readlink -f "$0")")"
APP_DIR="$(pwd)"
NAME="baxromjonov-portfolio"
CFG="${CF_CONFIG:-/etc/cloudflared/config.yml}"
HOSTS=("baxromjonov.uz" "www.baxromjonov.uz")
SWITCH_TUNNEL="${SWITCH_TUNNEL:-1}"
TS="$(date +%Y%m%d-%H%M%S)"
mkdir -p backups

c_ok()   { printf "\033[32m✔ %s\033[0m\n" "$*"; }
c_info() { printf "\033[36m➜ %s\033[0m\n" "$*"; }
c_warn() { printf "\033[33m⚠ %s\033[0m\n" "$*"; }
c_err()  { printf "\033[31m✖ %s\033[0m\n" "$*"; }
trap 'c_err "Xato: ${BASH_COMMAND} (qator $LINENO). Hech narsa buzilmadi — eski sayt ishlashda davom etadi."' ERR

# ── 0. Talablar ──
command -v docker >/dev/null || { c_err "docker topilmadi"; exit 1; }
docker compose version >/dev/null 2>&1 || { c_err "docker compose (v2) topilmadi"; exit 1; }
command -v curl >/dev/null || sudo apt-get install -y curl >/dev/null
c_ok "Docker tayyor"

# ── 1. .env ──
env_get() { grep -E "^$1=" .env 2>/dev/null | tail -n1 | cut -d= -f2- || true; }
env_set() {
  if grep -qE "^$1=" .env 2>/dev/null; then sed -i "s|^$1=.*|$1=$2|" .env; else echo "$1=$2" >> .env; fi
}
if [[ ! -f .env ]]; then
  cp .env.example .env
  chmod 600 .env
  c_info ".env yaratildi"
fi

if [[ -z "$(env_get TELEGRAM_BOT_TOKEN)" ]]; then
  # Eski portfolio papkalaridan tokenni qidiramiz (faqat o'z uy papkangizda)
  OLD_ENV="$(find "$HOME" -maxdepth 3 -name .env -path '*portfolio*' ! -path "$APP_DIR/*" 2>/dev/null \
            | xargs -r grep -l '^TELEGRAM_BOT_TOKEN=.\+' 2>/dev/null | head -n1 || true)"
  if [[ -n "$OLD_ENV" ]]; then
    env_set TELEGRAM_BOT_TOKEN "$(grep -E '^TELEGRAM_BOT_TOKEN=' "$OLD_ENV" | cut -d= -f2-)"
    env_set TELEGRAM_CHAT_ID   "$(grep -E '^TELEGRAM_CHAT_ID=' "$OLD_ENV" | cut -d= -f2-)"
    c_ok "Telegram sozlamalari eski portfoliodan ko'chirildi ($OLD_ENV)"
  elif [[ -t 0 ]]; then
    echo
    c_info "Forma Telegramga yuborishi uchun bot token kerak (Enter — keyinroq kiritaman)."
    read -rsp "  TELEGRAM_BOT_TOKEN: " T; echo
    if [[ -n "$T" ]]; then
      read -rp  "  TELEGRAM_CHAT_ID:   " C
      env_set TELEGRAM_BOT_TOKEN "$T"; env_set TELEGRAM_CHAT_ID "$C"
      c_ok "Telegram sozlandi"
    else
      c_warn "Token kiritilmadi. Keyin: nano $APP_DIR/.env  →  docker compose up -d"
    fi
  fi
fi

# ── 2. Port ──
PORT="${PORT:-$(env_get PORT)}"; PORT="${PORT:-3095}"
port_owner() { docker ps --format '{{.Names}} {{.Ports}}' | grep -E "[:.]$1->" | awk '{print $1}' | head -n1; }
port_busy()  { ss -ltnH "( sport = :$1 )" 2>/dev/null | grep -q .; }
while port_busy "$PORT" && [[ "$(port_owner "$PORT")" != "$NAME" ]]; do
  c_warn "Port $PORT band ($(port_owner "$PORT" || echo 'boshqa dastur')) — keyingisini sinayman"
  PORT=$((PORT + 1))
  [[ $PORT -gt 3199 ]] && { c_err "Bo'sh port topilmadi"; exit 1; }
done
env_set PORT "$PORT"
c_ok "Port: $PORT"

# ── 3. Build + ishga tushirish ──
c_info "Docker image yig'ilmoqda (birinchi marta 1–3 daqiqa)…"
docker compose build --pull
docker compose up -d --remove-orphans
c_info "Sog'liq tekshiruvi…"
for i in $(seq 1 40); do
  if curl -fsS "http://127.0.0.1:$PORT/healthz" >/dev/null 2>&1; then break; fi
  sleep 1.5
  [[ $i -eq 40 ]] && { c_err "Konteyner javob bermadi. Loglar:"; docker compose logs --tail=50; exit 1; }
done
HDR="$(curl -sI "http://127.0.0.1:$PORT/" | tr -d '\r' | grep -i '^x-portfolio' || true)"
c_ok "Yangi sayt ishlayapti: http://127.0.0.1:$PORT  ($HDR)"

# ── 4. Cloudflare Tunnel ──
if [[ "$SWITCH_TUNNEL" != "1" ]]; then
  c_warn "SWITCH_TUNNEL=0 — domen hali eski saytda. Sinab ko'ring:  curl -I http://127.0.0.1:$PORT"
  exit 0
fi
if [[ ! -f "$CFG" ]]; then
  c_warn "$CFG topilmadi — tunnelni o'zingiz ulaysiz (README → 'Tunnelsiz variant')."
  exit 0
fi

sudo cp -a "$CFG" "backups/cloudflared-config-$TS.yml"
sudo chown "$(id -u):$(id -g)" "backups/cloudflared-config-$TS.yml"
echo "$CFG" > backups/LAST_CONFIG_PATH
c_ok "Tunnel sozlamasi zaxiralandi: backups/cloudflared-config-$TS.yml"

TMP="$(mktemp)"
python3 - "$CFG" "$TMP" "$PORT" "${HOSTS[@]}" <<'PY'
import re, sys
src, dst, port, hosts = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4:]
lines = open(src).read().split("\n")
target = f"http://localhost:{port}"
host_re = re.compile(r'^(\s*)-\s*hostname:\s*["\']?([^"\'\s#]+)["\']?\s*(#.*)?$')
svc_re = re.compile(r'^(\s*)service:\s*(\S+)(.*)$')
found = set()
for i, line in enumerate(lines):
    m = host_re.match(line)
    if not m or m.group(2) not in hosts:
        continue
    base = len(m.group(1))
    for j in range(i + 1, len(lines)):
        l = lines[j]
        if not l.strip():
            continue
        ind = len(l) - len(l.lstrip())
        if ind <= base:
            break
        s = svc_re.match(l)
        if s and ind == base + 2:
            print(f"  {m.group(2)}: {s.group(2)}  →  {target}")
            lines[j] = f"{s.group(1)}service: {target}{s.group(3)}"
            found.add(m.group(2))
            break
missing = [h for h in hosts if h not in found]
if missing:
    idx = next((k for k, l in enumerate(lines) if re.match(r'^\s*-\s*service:\s*http_status', l)), None)
    if idx is None:
        print("XATO: ingress oxiridagi 'service: http_status:404' qatori topilmadi", file=sys.stderr); sys.exit(3)
    ind = re.match(r'^(\s*)', lines[idx]).group(1)
    add = []
    for h in missing:
        print(f"  {h}: (yo'q edi)  →  {target}  [qo'shildi]")
        add += [f"{ind}- hostname: {h}", f"{ind}  service: {target}"]
    lines[idx:idx] = add
open(dst, "w").write("\n".join(lines))
PY

c_info "Yangi tunnel sozlamasi tekshirilmoqda…"
if ! sudo cloudflared tunnel --config "$TMP" ingress validate; then
  c_err "Tunnel sozlamasi noto'g'ri chiqdi — o'zgartirilmadi."; rm -f "$TMP"; exit 1
fi
sudo cp "$TMP" "$CFG"; rm -f "$TMP"
sudo systemctl restart cloudflared
sleep 4
if ! systemctl is-active --quiet cloudflared; then
  c_err "cloudflared ishga tushmadi — eski sozlama qaytarilmoqda"
  sudo cp "backups/cloudflared-config-$TS.yml" "$CFG"; sudo systemctl restart cloudflared; exit 1
fi
c_ok "cloudflared qayta ishga tushdi"

# ── 5. Internetdan tekshirish ──
for H in "${HOSTS[@]}"; do
  OK=""
  for i in $(seq 1 10); do
    if curl -sI --max-time 8 "https://$H/" | tr -d '\r' | grep -qi '^x-portfolio: v2'; then OK=1; break; fi
    sleep 3
  done
  if [[ -n "$OK" ]]; then c_ok "https://$H → yangi sayt"; else
    c_warn "https://$H hali yangi saytni ko'rsatmayapti."
    c_warn "  Sabab: domen DNS'i boshqa joyga (masalan, Vercel) qaragan bo'lishi mumkin."
    c_warn "  Cloudflare → DNS: '$H' yozuvini shu tunnelga (CNAME <tunnel-id>.cfargotunnel.com, Proxied) yo'naltiring."
    c_warn "  Yoki:  cloudflared tunnel route dns <tunnel-nomi> $H"
  fi
done

echo
c_ok "Tayyor! baxromjonov.uz v2 → 127.0.0.1:$PORT"
echo "   Loglar:       cd $APP_DIR && docker compose logs -f"
echo "   Orqaga qaytish: bash $APP_DIR/rollback.sh"
