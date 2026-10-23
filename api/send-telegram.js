// Vercel uchun zaxira varianti (asosiy deploy — o'z serverda, server/server.mjs).
import { buildMessage, sendToTelegram, tashkentTime } from "../server/telegram.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, message: "Faqat POST." });
  }
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return res.status(503).json({ ok: false, message: "Telegram sozlanmagan." });

  const msg = buildMessage(req.body || {}, {
    ip: String(req.headers["x-forwarded-for"] || "").split(",")[0] || "—",
    country: req.headers["x-vercel-ip-country"] || "—",
    ua: req.headers["user-agent"] || "—",
    time: tashkentTime(),
  });
  if (msg.spam) return res.status(200).json({ ok: true });
  if (msg.error) return res.status(400).json({ ok: false, message: msg.error });
  try {
    await sendToTelegram(msg.text, { token, chatId });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ ok: false, message: "Telegramga yuborilmadi." });
  }
}
