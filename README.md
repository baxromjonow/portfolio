# baxromjonov.uz — Portfolio v2

React 19 + Vite 8 + GSAP (ScrollTrigger, Flip) + Lenis. Barcha animatsiyalar scroll'ga bog'langan,
`prefers-reduced-motion` yoqilgan bo'lsa o'chadi.

## Loyihalarni tahrirlash

Hamma loyihalar bitta faylda: **`src/data/projects.js`**.

- Yangi loyiha → ro'yxatga bitta obyekt qo'shing.
- Haqiqiy skrinshot → `public/shots/` ga `nom-d.webp` (1440×900) va `nom-m.webp` (telefon) qo'ying,
  so'ng `image: "/shots/nom-d.webp"`, `mobile: "/shots/nom-m.webp"` yozing.
- Rasm bo'lmasa, `preview` turi bo'yicha kod bilan chizilgan mini-ko'rinish chiqadi.
- `featured: true` → "Jonli loyihalar" 3D galereyasiga chiqadi.
- Har bir loyihaning o'z havolasi bor: `baxromjonov.uz/#ish-qr`.

## Lokal ishga tushirish

```bash
npm install
npm run dev        # http://localhost:5173
```

## Deploy — GitHub + Vercel (asosiy)

`git push` qilinsa Vercel o'zi build qiladi (`vercel.json` tayyor, Node 22).
Forma `api/send-telegram.js` orqali ishlaydi. Vercel → Project → Settings → Environment Variables:

```text
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

## Deploy — o'z serverda (zaxira variant)

`Dockerfile`, `docker-compose.yml`, `server/server.mjs` (static + forma API), `deploy.sh`, `rollback.sh`.

```bash
bash deploy.sh                    # build, ishga tushirish, cloudflared'ni ulash
SWITCH_TUNNEL=0 bash deploy.sh    # faqat konteyner, domenga tegmaydi
```

Tunnelsiz variant (Nginx): `proxy_pass http://127.0.0.1:3095;`

## Tuzilma

```
src/
  data/projects.js      ← barcha loyihalar
  components/           ← bo'limlar (Hero, About, Wall, Works, Bots, Index, ...)
  components/Preview.jsx← skrinshot / kod bilan chizilgan ko'rinishlar + telefon
  lib/motion.js         ← GSAP + Lenis sozlamasi
  styles/               ← base, sections, preview
public/
  shots/                ← saytlarning haqiqiy skrinshotlari
  img/                  ← shaxsiy rasmlar
  student-projects/     ← o'quvchilar saytlari
api/send-telegram.js    ← Vercel forma funksiyasi
server/                 ← o'z server uchun Node server
```
