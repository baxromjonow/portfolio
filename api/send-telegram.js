function clean(value, limit = 1000) {
  return String(value ?? "").trim().slice(0, limit).replace(/[&<>]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
  })[char]);
}

function show(value, fallback = "Kiritilmagan") {
  return value || fallback;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, message: "Faqat POST so‘rovi qabul qilinadi." });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ ok: false, message: "Telegram sozlamalari Vercel’da kiritilmagan." });
  }

  const data = req.body || {};

  // Honeypot: botlar to‘ldiradigan yashirin maydon.
  if (clean(data.website, 200)) {
    return res.status(200).json({ ok: true, message: "Qabul qilindi." });
  }

  const fields = {
    name: clean(data.name, 100),
    birthday: clean(data.birthday, 40),
    school: clean(data.school, 120),
    address: clean(data.address, 200),
    phone: clean(data.phone, 40),
    phone2: clean(data.phone2, 40),
    subject: clean(data.subject, 200),
    job: clean(data.job, 120),
    comment: clean(data.comment, 1200),
  };

  if (!fields.name || !fields.phone) {
    return res.status(400).json({ ok: false, message: "Ism-familiya va telefon raqamini kiriting." });
  }

  const text = [
    "📝 <b>Yangi so‘rovnoma</b>",
    "",
    `👤 <b>Ism va familiya:</b>\n${fields.name}`,
    `🎂 <b>Tug‘ilgan sana:</b>\n${show(fields.birthday)}`,
    `🏫 <b>Maktab va sinf:</b>\n${show(fields.school)}`,
    `📍 <b>Manzil:</b>\n${show(fields.address)}`,
    `📞 <b>Telefon raqami:</b>\n${fields.phone}`,
    `☎️ <b>Qo‘shimcha telefon:</b>\n${show(fields.phone2)}`,
    `📚 <b>Qiziqadigan fanlari:</b>\n${show(fields.subject)}`,
    `💼 <b>Kelajakdagi kasbi:</b>\n${show(fields.job)}`,
    `💬 <b>1-dars haqidagi fikri:</b>\n${show(fields.comment, "Fikr bildirilmagan")}`,
  ].join("\n\n");

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });

    const result = await telegramResponse.json().catch(() => ({}));

    if (!telegramResponse.ok || result.ok !== true) {
      return res.status(telegramResponse.status || 502).json({
        ok: false,
        message: result.description || "Telegramga yuborishda xatolik yuz berdi.",
      });
    }

    return res.status(200).json({ ok: true, message: "So‘rovnoma muvaffaqiyatli yuborildi." });
  } catch (error) {
    console.error("Telegram send error:", error);
    return res.status(502).json({ ok: false, message: "Telegram bilan bog‘lanishda xatolik yuz berdi." });
  }
}
