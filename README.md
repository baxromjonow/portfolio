# BW Premium Portfolio

React + Vite portfolio. So‘rovnoma `/api/send-telegram` Vercel Serverless Function orqali Telegramga yuboriladi. Python server kerak emas.

## Local frontend

```bash
npm install
npm run dev
```

`npm run dev` frontendni ochadi. Telegram serverless funksiyasini localda ham sinash kerak bo‘lsa Vercel CLI bilan `vercel dev` ishlatiladi.

## Vercel deploy

GitHub repositoryni Vercel’ga ulang. Project Settings → Environment Variables ichida quyidagilarni kiriting:

```text
TELEGRAM_BOT_TOKEN=BotFather bergan token
TELEGRAM_CHAT_ID=Telegram guruh/chat ID
```

Keyin Deploy/Redeploy qiling. Build output `dist`.

## Ijtimoiy havolalar

- Instagram: `asadbekbw`
- Telegram: `asadbek_baxromjonov`
- GitHub: `baxromjonow`

## Muhim

Tokenni hech qachon React kodiga yoki GitHub repositoryga yozmang. Faqat Vercel Environment Variables’da saqlang.
