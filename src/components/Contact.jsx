import { useRef, useState } from "react";
import { gsap, prefersReduced, useIsoLayoutEffect } from "../lib/motion";
import { socials } from "../data/projects";

const surveyFields = [
  ["name", "Ism va familiya", "Ali Valiyev", { required: true, minLength: 3, maxLength: 100, autoComplete: "name" }],
  ["phone", "Telefon raqami", "+998 90 123 45 67", { required: true, maxLength: 40, inputMode: "tel", autoComplete: "tel" }],
  ["birthday", "Tug‘ilgan sana", "", { type: "date" }],
  ["school", "Maktab va sinf", "25-maktab, 9-sinf", { maxLength: 120 }],
  ["address", "Manzil", "Chinoz tumani", { maxLength: 200 }],
  ["phone2", "Qo‘shimcha telefon", "+998 90 765 43 21", { maxLength: 40, inputMode: "tel" }],
  ["subject", "Qiziqadigan fanlari", "IT, matematika, ingliz tili", { maxLength: 200 }],
  ["job", "Kelajakdagi kasbi", "Dasturchi", { maxLength: 120 }],
];

const contactFields = [
  ["name", "Ismingiz", "Ali Valiyev", { required: true, minLength: 2, maxLength: 100, autoComplete: "name" }],
  ["phone", "Telefon yoki Telegram", "+998 90 123 45 67 yoki @username", { required: true, maxLength: 60 }],
];

const empty = { name: "", phone: "", birthday: "", school: "", address: "", phone2: "", subject: "", job: "", comment: "", website: "" };

const icons = {
  telegram: <path d="M21.5 4.5 2.9 11.7c-1 .4-1 1.6 0 1.9l4.6 1.5 1.8 5.6c.2.7 1.1.9 1.6.4l2.6-2.4 4.8 3.5c.6.4 1.4.1 1.6-.6l3.2-15.4c.2-.9-.7-1.6-1.6-1.2ZM9.6 14.6l8.4-7.4-6.8 8.6-.3 3.2-1.3-4.4Z" />,
  channel: <path d="M4 10v4a1 1 0 0 0 1 1h2l5 4V5L7 9H5a1 1 0 0 0-1 1Zm12-2a5 5 0 0 1 0 8m2.5-10.5a8.5 8.5 0 0 1 0 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />,
  instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.3" cy="6.7" r="1.1" /></>,
  github: <path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.7c-2.7.6-3.3-1.2-3.3-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.5-1.1-4.5-4.8 0-1.1.4-1.9 1-2.6-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.6 1a9 9 0 0 1 4.8 0c1.8-1.3 2.6-1 2.6-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.5 1 2.6 0 3.7-2.3 4.5-4.5 4.8.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5Z" />,
};

export function SocialIcon({ id }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">{icons[id]}</svg>;
}

export default function Contact() {
  const root = useRef(null);
  const [mode, setMode] = useState("contact");
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const fields = mode === "survey" ? surveyFields : contactFields;
  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, kind: mode }),
      });
      const text = await res.text();
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
      if (!res.ok || !data.ok) throw new Error(data.message || "Yuborilmadi. Birozdan keyin qayta urinib ko‘ring.");
      setForm(empty);
      setStatus("success");
    } catch (err) {
      setError(err.message || "Yuborilmadi. Internet aloqasini tekshiring.");
      setStatus("error");
    }
  }

  useIsoLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".ct-big .ch", {
        yPercent: 120,
        rotateX: -80,
        stagger: 0.04,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ct-big", start: "top 95%", end: "top 45%", scrub: 0.8 },
      });
      gsap.from(".ct-grid > *", {
        y: 50,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.9,
        scrollTrigger: { trigger: ".ct-grid", start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="contact" id="contact" ref={root}>
      <div className="wrap">
        <h2 className="ct-big" aria-label="Gaplashamizmi?">
          {Array.from("GAPLASHAMIZMI?").map((c, i) => <span className="ch" key={i} aria-hidden="true">{c}</span>)}
        </h2>

        <div className="ct-grid">
          <div className="ct-side">
            <p className="ct-lead">
              Loyiha, dars yoki hamkorlik bo‘yicha yozing. Xabar to‘g‘ridan-to‘g‘ri Telegramimga keladi.
            </p>
            <ul className="ct-socials">
              {socials.map((s) => (
                <li key={s.id}>
                  <a href={s.href} target="_blank" rel="noreferrer noopener">
                    <SocialIcon id={s.id} />
                    <span>{s.label}</span>
                    <em>{s.handle}</em>
                    <b aria-hidden="true">↗</b>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form className="ct-form" onSubmit={submit} noValidate={false}>
            {status === "success" ? (
              <div className="ct-ok" role="status">
                <svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg>
                <h3>Yuborildi!</h3>
                <p>{mode === "survey" ? "So‘rovnoma Telegramga yetib bordi. Rahmat!" : "Xabaringiz yetib bordi. Tez orada javob beraman."}</p>
                <button type="button" className="btn btn-dark" onClick={() => setStatus("idle")}>Yana yozish</button>
              </div>
            ) : (
              <>
                <div className="ct-tabs" role="tablist" aria-label="Forma turi">
                  <button type="button" role="tab" aria-selected={mode === "contact"} className={mode === "contact" ? "on" : ""} onClick={() => setMode("contact")}>Xabar yozish</button>
                  <button type="button" role="tab" aria-selected={mode === "survey"} className={mode === "survey" ? "on" : ""} onClick={() => setMode("survey")}>O‘quvchi so‘rovnomasi</button>
                </div>

                <input className="hp" tabIndex={-1} autoComplete="off" name="website" value={form.website} onChange={change} aria-hidden="true" />

                <div className={`ct-fields is-${mode}`}>
                  {fields.map(([name, label, ph, attrs]) => (
                    <label key={`${mode}-${name}`} className="fld">
                      <span>{label}{attrs.required ? " *" : ""}</span>
                      <input id={`f-${mode}-${name}`} name={name} value={form[name]} onChange={change} placeholder={ph} {...attrs} />
                    </label>
                  ))}
                  <label className="fld wide">
                    <span>{mode === "survey" ? "1-dars haqidagi fikringiz" : "Xabar *"}</span>
                    <textarea
                      id={`f-${mode}-comment`}
                      name="comment"
                      rows={mode === "survey" ? 3 : 5}
                      maxLength={1200}
                      required={mode === "contact"}
                      value={form.comment}
                      onChange={change}
                      placeholder={mode === "survey" ? "Dars sizga yoqdimi?" : "Salom! Menga ... kerak edi"}
                    />
                  </label>
                </div>

                {mode === "survey" && (
                  <p className="ct-note">
                    Spamning oldini olish uchun yuborish vaqti, brauzer turi va IP manzil qayd etiladi. Telefon raqamingiz saytda ko‘rinmaydi.
                  </p>
                )}

                <button className="btn btn-dark ct-send" disabled={status === "loading"}>
                  {status === "loading" ? "Yuborilmoqda…" : mode === "survey" ? "So‘rovnomani yuborish" : "Xabarni yuborish"}
                  <span aria-hidden="true">→</span>
                </button>
                {status === "error" && <p className="ct-err" role="alert">{error}</p>}
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
