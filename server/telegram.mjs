// Formadan kelgan ma'lumotni tekshirib, Telegram xabariga aylantiradi.
// Bu fayl ham o'z serverimizda (server.mjs), ham Vercel'da (api/send-telegram.js) ishlatiladi.

const esc = (v, limit = 1000) =>
  String(v ?? "")
    .trim()
    .slice(0, limit)
    .replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

const show = (v, fallback = "Kiritilmagan") => v || fallback;

export function buildMessage(data, meta) {
  if (esc(data.website, 200)) return { spam: true };

  const kind = data.kind === "survey" ? "survey" : "contact";
  const f = {
    name: esc(data.name, 100),
    phone: esc(data.phone, 60),
    birthday: esc(data.birthday, 40),
    school: esc(data.school, 120),
    address: esc(data.address, 200),
    phone2: esc(data.phone2, 40),
    subject: esc(data.subject, 200),
    job: esc(data.job, 120),
    comment: esc(data.comment, 1200),
  };

  if (f.name.length < 2 || !f.phone) {
    return { error: "Ism va telefon (yoki Telegram) maydonlarini to‘ldiring." };
  }
  if (kind === "contact" && !f.comment) {
    return { error: "Xabar matnini yozing." };
  }

  const tech = [
    "",
    "🔎 <b>Texnik ma’lumot</b>",
    `🌐 IP: ${esc(meta.ip, 100)}`,
    `📍 Mamlakat: ${esc(meta.country, 20)}`,
    `🕐 Vaqt: ${esc(meta.time, 60)} (Toshkent)`,
    `💻 ${esc(meta.ua, 300)}`,
  ];

  const lines =
    kind === "survey"
      ? [
          "📝 <b>Yangi so‘rovnoma</b> · baxromjonov.uz",
          "",
          `👤 <b>Ism:</b> ${f.name}`,
          `📞 <b>Telefon:</b> ${f.phone}`,
          `☎️ <b>Qo‘shimcha:</b> ${show(f.phone2)}`,
          `🎂 <b>Tug‘ilgan sana:</b> ${show(f.birthday)}`,
          `🏫 <b>Maktab/sinf:</b> ${show(f.school)}`,
          `📍 <b>Manzil:</b> ${show(f.address)}`,
          `📚 <b>Fanlar:</b> ${show(f.subject)}`,
          `💼 <b>Kasb orzusi:</b> ${show(f.job)}`,
          `💬 <b>1-dars haqida:</b>\n${show(f.comment, "Fikr yozilmagan")}`,
          ...tech,
        ]
      : [
          "✉️ <b>Yangi xabar</b> · baxromjonov.uz",
          "",
          `👤 <b>Ism:</b> ${f.name}`,
          `📞 <b>Aloqa:</b> ${f.phone}`,
          "",
          `💬 ${f.comment}`,
          ...tech,
        ];

  return { text: lines.join("\n") };
}

export async function sendToTelegram(text, { token, chatId }) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
    signal: AbortSignal.timeout(10000),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.ok !== true) {
    const err = new Error(json.description || `Telegram HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return true;
}

export function tashkentTime() {
  return new Intl.DateTimeFormat("uz-UZ", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}
