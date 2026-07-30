import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  GraduationCap,
  LoaderCircle,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

const initial = {
  name: "",
  birthday: "",
  school: "",
  address: "",
  phone: "",
  phone2: "",
  subject: "",
  job: "",
  comment: "",
  website: "",
};

const fields = [
  ["name", "Ism va familiya *", "Ali Valiyev", UserRound, { required: true, minLength: 3, maxLength: 100 }],
  ["birthday", "Tug‘ilgan sana", "", CalendarDays, { type: "date" }],
  ["school", "Maktab va sinf", "25-maktab, 9-sinf", GraduationCap, { maxLength: 120 }],
  ["address", "Manzil", "Chinoz tumani", MapPin, { maxLength: 200 }],
  ["phone", "Telefon raqami *", "+998 90 123 45 67", Phone, { required: true, maxLength: 40, inputMode: "tel" }],
  ["phone2", "Qo‘shimcha telefon", "+998 90 765 43 21", Phone, { maxLength: 40, inputMode: "tel" }],
  ["subject", "Qiziqadigan fanlari", "IT, matematika, ingliz tili", Sparkles, { maxLength: 200 }],
  ["job", "Kelajakdagi kasbi", "Dasturchi", UserRound, { maxLength: 120 }],
];

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");

  const completed = useMemo(() => {
    const keys = ["name", "birthday", "school", "address", "phone", "subject", "job", "comment"];
    return Math.round((keys.filter((key) => String(form[key]).trim()).length / keys.length) * 100);
  }, [form]);

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      if (!response.ok || !data.ok) throw new Error(data.message || "Yuborishda xatolik yuz berdi.");
      setForm(initial);
      setStatus("success");
    } catch (submitError) {
      setError(submitError.message || "Hozir yuborilmadi. Server sozlamalarini tekshiring.");
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-28">
      <div className="contact-orb contact-orb-one" />
      <div className="contact-orb contact-orb-two" />

      <div className="relative mx-auto grid max-w-7xl items-stretch gap-7 px-5 lg:grid-cols-[.62fr_1.38fr] lg:px-8">
        <motion.aside
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="contact-info-card glass flex h-full min-h-[100%] flex-col rounded-[2.2rem] p-6 sm:p-8 lg:p-9"
        >
          <div>
            <div className="section-kicker"><Sparkles size={14} /> O‘quvchi so‘rovnomasi</div>
            <h2 className="mt-5 text-[clamp(2rem,3.5vw,3.5rem)] font-black leading-[1.03] tracking-[-.045em]">Kelajak sari birinchi <span className="text-gradient">qadam.</span></h2>
            <p className="mt-5 leading-8 text-slate-400">Ma’lumotlaringiz xavfsiz backend orqali Telegram botga yuboriladi. Javob tez yetib keladi.</p>
          </div>

          <div className="mt-8 space-y-4">
            {["Ma’lumot botga darhol keladi", "Forma to‘ldirish 2 daqiqadan kam", "Telefon raqamingiz ochiq saytda ko‘rinmaydi"].map((item, index) => (
              <motion.div key={item} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-cyan/15 bg-cyan/10 text-cyan"><Check size={15} /></span>{item}
              </motion.div>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <div className="quick-accept-card relative overflow-hidden rounded-[1.7rem] border border-white/10 p-6">
              <div className="quick-accept-glow" aria-hidden="true" />
              <div className="telegram-icon relative z-10 grid h-16 w-16 place-items-center rounded-2xl"><Send size={24} /></div>
              <div className="relative z-10 mt-5">
                <strong className="block text-xl">Tezkor qabul</strong>
                <span className="mt-2 block text-sm leading-6 text-slate-400">Yuborilgan so‘rovnoma to‘g‘ridan-to‘g‘ri Telegram guruhiga keladi.</span>
              </div>
            </div>
          </div>
        </motion.aside>

        <motion.form
          initial={{ opacity: 0, y: 25, scale: 0.99 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onSubmit={submit}
          className="form-shell glass relative h-full rounded-[2.2rem] p-5 sm:p-8 lg:p-9"
        >
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan">Ro‘yxatdan o‘tish</p><h3 className="mt-1 text-2xl font-black">Ma’lumotlarni kiriting</h3></div>
            <div className="min-w-36">
              <div className="mb-2 flex justify-between text-xs text-slate-400"><span>To‘ldirildi</span><span>{completed}%</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10"><motion.div animate={{ width: `${completed}%` }} className="h-full rounded-full bg-gradient-to-r from-cyan to-electric" /></div>
            </div>
          </div>

          <input className="hidden" tabIndex="-1" autoComplete="off" name="website" value={form.website} onChange={change} />

          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(([name, label, placeholder, Icon, attrs], index) => (
              <motion.label key={name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.03 }} className="group block text-sm font-semibold text-slate-300">
                <span className="flex items-center gap-2"><Icon size={15} className={focused === name ? "text-cyan" : "text-slate-500"} />{label}</span>
                <div className="relative mt-2">
                  <input {...attrs} name={name} value={form[name]} onChange={change} onFocus={() => setFocused(name)} onBlur={() => setFocused("")} placeholder={placeholder} />
                  <AnimatePresence>{form[name] && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400"><CheckCircle2 size={17} /></motion.span>}</AnimatePresence>
                </div>
              </motion.label>
            ))}
          </div>

          <label className="mt-4 block text-sm font-semibold text-slate-300">
            <span className="flex items-center gap-2"><MessageCircle size={15} className={focused === "comment" ? "text-cyan" : "text-slate-500"} />1-dars haqidagi fikri</span>
            <textarea maxLength="1200" name="comment" value={form.comment} onChange={change} onFocus={() => setFocused("comment")} onBlur={() => setFocused("")} rows="5" className="mt-2 resize-none" placeholder="Dars haqida fikringiz..." />
            <span className="mt-2 block text-right text-xs text-slate-500">{form.comment.length}/1200</span>
          </label>

          <motion.button whileHover={{ scale: 1.006 }} whileTap={{ scale: 0.99 }} disabled={status === "loading"} className="btn-primary submit-shine mt-3 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-4 font-extrabold transition disabled:opacity-70">
            {status === "loading" ? <LoaderCircle className="animate-spin" size={19} /> : <Send size={18} />}
            {status === "loading" ? "Telegramga yuborilmoqda..." : "So‘rovnomani yuborish"}
          </motion.button>

          <AnimatePresence>
            {status === "error" && <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300"><AlertCircle className="mt-0.5 shrink-0" size={18} />{error}</motion.p>}
          </AnimatePresence>
        </motion.form>
      </div>

      <AnimatePresence>
        {status === "success" && (
          <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/85 px-5 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="confetti" aria-hidden="true">{Array.from({ length: 22 }).map((_, i) => <i key={i} style={{ "--i": i }} />)}</div>
            <motion.div initial={{ scale: 0.68, opacity: 0, y: 45 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.82, opacity: 0 }} transition={{ type: "spring", stiffness: 220, damping: 17 }} className="success-card glass relative w-full max-w-md overflow-hidden rounded-[2.2rem] p-9 text-center">
              <button type="button" onClick={() => setStatus("idle")} className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"><X size={20} /></button>
              <motion.div initial={{ scale: 0, rotate: -120 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.12, type: "spring" }} className="success-check mx-auto grid h-28 w-28 place-items-center rounded-full text-emerald-300"><CheckCircle2 size={62} /></motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <p className="mt-7 text-xs font-bold uppercase tracking-[.28em] text-emerald-300">Xabar yuborildi</p>
                <h3 className="mt-2 text-3xl font-black text-white">Tabriklaymiz!</h3>
                <p className="mt-3 leading-7 text-slate-300">Siz muvaffaqiyatli ro‘yxatdan o‘tdingiz. Ma’lumotlaringiz Telegram botga yetkazildi.</p>
                <button type="button" onClick={() => setStatus("idle")} className="btn-primary mt-7 w-full rounded-2xl px-6 py-4 font-extrabold">Ajoyib, yopish</button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
