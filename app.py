import html
from pathlib import Path

import requests
from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
DIST_DIR = BASE_DIR / "dist"

app = Flask(__name__, static_folder=str(DIST_DIR), static_url_path="")

# ==================================================
# TELEGRAM BOT SOZLAMALARI
# ==================================================
# BotFather bergan tokenni qo'shtirnoq ichiga yozing.
# Misol: TOKEN = ""
TOKEN = "8778054533:AAHtsCT7LL2k2zP1MsZsr4ojz7imejBqGCI"

# Telegram guruh yoki shaxsiy chat ID raqamini yozing.
# Guruh ID odatda -100 bilan boshlanadi.
CHAT_ID = "-1004498400997"


def clean(value, limit=1000):
    """Foydalanuvchi kiritgan matnni Telegram HTML rejimi uchun xavfsiz qiladi."""
    return html.escape(str(value or "").strip()[:limit])


@app.get("/api/health")
def health():
    return jsonify({"ok": True, "service": "BW Portfolio API"})


@app.post("/api/send-telegram")
def send_telegram():
    data = request.get_json(silent=True) or request.form.to_dict()

    # Botlarga qarshi yashirin maydon.
    if clean(data.get("website"), 200):
        return jsonify({"ok": True, "message": "Qabul qilindi."})

    fields = {
        "name": clean(data.get("name"), 100),
        "birthday": clean(data.get("birthday"), 40),
        "school": clean(data.get("school"), 120),
        "address": clean(data.get("address"), 200),
        "phone": clean(data.get("phone"), 40),
        "phone2": clean(data.get("phone2"), 40),
        "subject": clean(data.get("subject"), 200),
        "job": clean(data.get("job"), 120),
        "group": clean(data.get("group"), 80),
        "lesson_time": clean(data.get("time"), 80),
        "comment": clean(data.get("comment"), 1200),
    }

    if not fields["name"] or not fields["phone"]:
        return jsonify({
            "ok": False,
            "message": "Ism-familiya va telefon raqamini kiriting."
        }), 400

    if not TOKEN.strip() or not CHAT_ID.strip():
        return jsonify({
            "ok": False,
            "message": "app.py ichiga Telegram TOKEN va CHAT_ID yozilmagan."
        }), 500

    def show(value, fallback="Kiritilmagan"):
        return value or fallback

    text = f"""
📝 <b>Yangi so‘rovnoma</b>

👤 <b>Ism va familiya:</b>
{fields['name']}

🎂 <b>Tug‘ilgan sana:</b>
{show(fields['birthday'])}

🏫 <b>Maktab va sinf:</b>
{show(fields['school'])}

📍 <b>Manzil:</b>
{show(fields['address'])}

📞 <b>Telefon raqami:</b>
{fields['phone']}

☎️ <b>Qo‘shimcha telefon:</b>
{show(fields['phone2'])}

📚 <b>Qiziqadigan fanlari:</b>
{show(fields['subject'])}

💼 <b>Kelajakdagi kasbi:</b>
{show(fields['job'])}

👥 <b>Guruhi:</b>
{show(fields['group'])}

🕒 <b>Dars vaqti:</b>
{show(fields['lesson_time'])}

💬 <b>1-dars haqidagi fikri:</b>
{show(fields['comment'], 'Fikr bildirilmagan')}
""".strip()

    try:
        response = requests.post(
            f"https://api.telegram.org/bot{TOKEN.strip()}/sendMessage",
            data={
                "chat_id": CHAT_ID.strip(),
                "text": text,
                "parse_mode": "HTML",
            },
            timeout=15,
        )

        try:
            result = response.json()
        except ValueError:
            result = {}

        if response.ok and result.get("ok") is True:
            return jsonify({
                "ok": True,
                "message": "So‘rovnoma muvaffaqiyatli yuborildi."
            })

        return jsonify({
            "ok": False,
            "message": result.get(
                "description",
                "Telegramga yuborishda xatolik yuz berdi."
            ),
        }), response.status_code or 502

    except requests.exceptions.Timeout:
        return jsonify({
            "ok": False,
            "message": "Telegram serveridan javob kelmadi."
        }), 504
    except requests.exceptions.ConnectionError:
        return jsonify({
            "ok": False,
            "message": "Kompyuter internetga ulana olmadi."
        }), 503
    except Exception as error:
        app.logger.exception("Telegram yuborish xatosi: %s", error)
        return jsonify({
            "ok": False,
            "message": "Serverda kutilmagan xatolik yuz berdi."
        }), 500


@app.get("/")
def index():
    if not (DIST_DIR / "index.html").exists():
        return (
            "Frontend hali yig‘ilmagan. Terminalda npm install va npm run build bajaring.",
            503,
        )
    return send_from_directory(app.static_folder, "index.html")


@app.get("/<path:path>")
def static_files(path):
    target = DIST_DIR / path
    if target.exists() and target.is_file():
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
