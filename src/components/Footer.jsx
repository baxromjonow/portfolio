import { Github, Instagram, Send } from "lucide-react";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/asadbekbw/", Icon: Instagram },
  { label: "Telegram", href: "https://t.me/asadbek_baxromjonov", Icon: Send },
  { label: "GitHub", href: "https://github.com/baxromjonow", Icon: Github },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto grid max-w-7xl gap-7 px-5 md:grid-cols-[1fr_auto_1fr] md:items-center lg:px-8">
        <a href="#home" className="justify-self-start" aria-label="Bosh sahifaga qaytish">
          <img src="/ba-logo.png" alt="Baxromjonov Asadbek" className="h-12 w-auto object-contain" />
        </a>

        <p className="text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Baxromjonov Asadbek. Barcha huquqlar himoyalangan.
        </p>

        <div className="flex justify-self-start gap-3 md:justify-self-end">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              title={label}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-400 transition duration-200 hover:-translate-y-0.5 hover:border-cyan/50 hover:text-cyan"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
