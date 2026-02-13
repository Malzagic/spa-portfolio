// src/components/Portfolio.tsx
"use client";

import React, { useMemo, useState } from "react";
import { motion, easeOut, type MotionProps } from "framer-motion";
import {
  Code2,
  Rocket,
  Boxes,
  CheckCircle2,
  Github,
  Linkedin,
  Mail,
  Globe,
  FileSpreadsheet,
  FileText,
  Bell,
  Bot,
  Zap,
} from "lucide-react";

import Section from "@/components/UI/Section";
import TechTag from "@/components/TechTag";
import { THEMES, type ThemeKey } from "@/types/portfolio-theme";
import { ContactSchema, type ContactPayload } from "@/types/contact";
import { BRAND_NAME } from "@/constant/constants";

const fade: MotionProps = {
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: easeOut },
};

export default function Portfolio() {
  const [theme, setTheme] = useState<ThemeKey>("darkGold");
  const T = useMemo(() => THEMES[theme], [theme]);

  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  /** Submit handler — validates on client, posts JSON to /api/contact, surfaces field errors. */
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload: ContactPayload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      subject: (() => {
        const v = String(formData.get("subject") ?? "").trim();
        return v === "" ? undefined : v;
      })(),
      message: String(formData.get("message") ?? "").trim(),
    };

    // Client-side validation mirrors API
    const local = ContactSchema.safeParse(payload);
    if (!local.success) {
      const { fieldErrors } = local.error.flatten();
      setErrors({
        name: fieldErrors.name?.[0] ?? null,
        email: fieldErrors.email?.[0] ?? null,
        subject: fieldErrors.subject?.[0] ?? null,
        message: fieldErrors.message?.[0] ?? null,
      });
      return;
    }

    setErrors({});
    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 422) {
        const data = await res.json();
        setErrors(data.errors ?? {});
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Request failed");
      }

      form.reset();
      alert("Dziękuję! Wiadomość została wysłana ✔️");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(`Nie udało się wysłać wiadomości. ${message ? "Szczegóły: " + message : ""}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={`${T.page} min-h-screen selection:bg-white/10`}>
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/10/50 backdrop-blur supports-[backdrop-filter]:bg-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 h-16">
          <a href="#home" className={`font-semibold tracking-tight ${T.link}`}>
            {BRAND_NAME}
          </a>
          <nav className="hidden md:flex gap-6 text-sm opacity-80">
            <a className={T.link} href="#services">
              Usługi
            </a>
            <a className={T.link} href="#projects">
              Realizacje
            </a>
            <a className={T.link} href="#process">
              Proces
            </a>
            <a className={T.link} href="#about">
              O mnie
            </a>
            <a className={T.link} href="#contact">
              Kontakt
            </a>
          </nav>
          {/* Theme switcher */}
          <div className="flex items-center gap-2">
            <select
              aria-label="Theme preset"
              name="theme preset"
              className={`text-sm rounded-xl px-3 py-1.5 border ${T.card.split(" ").slice(-1)[0]} bg-transparent`}
              value={theme}
              onChange={e => setTheme(e.target.value as ThemeKey)}
            >
              {Object.entries(THEMES).map(([k, v]) => (
                <option key={k} value={k} className={`${T.select} ${T.accentText}`}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden">
        <div className={`pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-40 ${T.accentGrad} ${T.soft}`} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <motion.div {...fade}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs opacity-80 mb-4">
              <Globe className="h-3.5 w-3.5" />
              <span>PL / EN · Remote · EU</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight max-w-2xl">
              Automatyzacja <span className={T.accentText}>Google Workspace</span> dla Twojej firmy.
            </h1>
            <p className="mt-4 md:mt-6 opacity-80 max-w-xl">
              Zamieniam chaos w Arkuszach Google w działające systemy CRM, generatory dokumentów i raporty. Oszczędzaj
              godziny pracy tygodniowo dzięki dedykowanym skryptom.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Google Apps Script",
                "Google Sheets",
                "AppSheet",
                "JavaScript",
                "TypeScript",
                "Node.js",
                "Make.com",
                "Google Cloud",
              ].map(t => (
                <TechTag key={t} label={t} />
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#contact"
                className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium ${T.accentGrad} text-white hover:opacity-95 transition ${T.soft}`}
              >
                <Rocket className="h-4 w-4" /> Darmowa konsultacja
              </a>
              <a
                href="#projects"
                className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium ${T.card} hover:opacity-90 transition`}
              >
                <Boxes className="h-4 w-4" /> Przykłady wdrożeń
              </a>
            </div>
          </motion.div>

          {/* Feature card */}
          <motion.div {...fade} className={`rounded-3xl p-6 md:p-8 ${T.card}`}>
            <div className="grid grid-cols-2 gap-4">
              <Feature
                icon={<Zap className="h-5 w-5" />}
                title="Oszczędność czasu"
                desc="Automatyzacja nudnych zadań. Skrypty pracują za Ciebie 24/7."
              />
              <Feature
                icon={<FileSpreadsheet className="h-5 w-5" />}
                title="Moc Arkuszy"
                desc="Google Sheets jako baza danych. Znane środowisko, nowe możliwości."
              />
              <Feature
                icon={<Bot className="h-5 w-5" />}
                title="Powiadomienia"
                desc="SMS i e-mail o zdarzeniach. Raporty prosto na telefon."
              />
              <Feature
                icon={<Code2 className="h-5 w-5" />}
                title="Szyte na miarę"
                desc="Rozwiązania dopasowane w 100% do Twojego procesu biznesowego."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <Section
        id="services"
        title="Usługi"
        subtitle="Pomagam małym i średnim firmom wejść na wyższy poziom efektywności dzięki ekosystemowi Google."
      >
        <div className="grid md:grid-cols-3 gap-6">
          <ServiceCard
            icon={<FileSpreadsheet />}
            title="Automatyzacja Google Sheets"
            points={["Customowe funkcje i skrypty", "Walidacja danych i formularze", "Dashbordy i raporty"]}
          />
          <ServiceCard
            icon={<FileText />}
            title="Obieg Dokumentów"
            points={["Generowanie umów/faktur (PDF)", "Szablony w Google Docs", "Wysyłka e-mail z załącznikami"]}
          />
          <ServiceCard
            icon={<Bell />}
            title="Integracje i Alerty"
            points={["Powiadomienia SMS/Telegram", "Łączenie z zewnętrznym API", "Cykliczne raporty sprzedaży"]}
          />
        </div>
      </Section>

      {/* PROJECTS */}
      <Section
        id="projects"
        title="Przykładowe wdrożenia"
        subtitle="Zobacz, jak automatyzacja rozwiązuje realne problemy biznesowe."
      >
        <div className="grid md:grid-cols-3 gap-6">
          <ProjectCard
            title="CRM w Arkuszu Google"
            stack={["Google Forms", "Apps Script", "Calendar API"]}
            problem="Ręczne przepisywanie zapytań ze strony do kalendarza."
            solution="Formularz na stronie -> Automatyczny wpis w Sheets -> E-mail do klienta + Event w Kalendarzu."
            result="Oszczędność 5h tygodniowo, zero zgubionych leadów."
            href="#"
          />
          <ProjectCard
            title="Generator Dokumentów"
            stack={["Google Docs", "Drive API", "PDF"]}
            problem="Czasochłonne tworzenie umów i faktur dla klientów."
            solution="Skrypt pobiera dane z Arkusza -> Wypełnia szablon Docs -> Generuje PDF -> Wysyła mailem."
            result="Dokument gotowy w 3 sekundy zamiast 15 minut."
            href="#"
          />
          <ProjectCard
            title="Raporty & Powiadomienia"
            stack={["Twilio API", "Telegram Bot", "Triggers"]}
            problem="Brak bieżącej wiedzy o wynikach sprzedaży i wizytach."
            solution="Codzienny raport SMS o 20:00 z podsumowaniem dnia + przypomnienia o wizytach dla klientów."
            result="Pełna kontrola nad biznesem z poziomu telefonu."
            href="#"
          />
        </div>
      </Section>

      {/* PROCESS */}
      <Section id="process" title="Jak pracuję" subtitle="Prosty proces wdrożenia automatyzacji w Twojej firmie.">
        <ol className="grid md:grid-cols-5 gap-6">
          {[
            { n: 1, t: "Analiza", d: "Rozmawiamy o tym, co zabiera Ci najwięcej czasu." },
            { n: 2, t: "Plan", d: "Proponuję rozwiązanie oparte o narzędzia, które już znasz." },
            { n: 3, t: "Skryptowanie", d: "Piszę kod łączący Twoje Arkusze, Maile i Dokumenty." },
            { n: 4, t: "Wdrożenie", d: "Instaluję rozwiązanie i szkolę z obsługi." },
            { n: 5, t: "Opieka", d: "Gwarancja działania i ewentualny rozwój." },
          ].map(s => (
            <li key={s.n} className={`rounded-2xl p-5 ${T.card}`}>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`h-7 w-7 inline-flex items-center justify-center rounded-full ${T.accentGrad} text-white text-sm`}
                >
                  {s.n}
                </span>
                <strong>{s.t}</strong>
              </div>
              <p className="text-sm opacity-80">{s.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ABOUT */}
      <Section
        id="about"
        title="O mnie"
        subtitle="Programista Google Workspace & Full-stack Developer. Łączę świat kodu ze światem biznesu."
      >
        <div className={`rounded-3xl p-6 md:p-8 ${T.card}`}>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="opacity-90">
                Specjalizuję się w automatyzacji procesów dla małych i średnich firm. Zamiast drogich i skomplikowanych
                systemów CRM, buduję lekkie, szyte na miarę narzędzia w oparciu o Google Workspace (Arkusze, Docs,
                Gmail). Moje rozwiązania działają w tle, oszczędzając Twój czas, podczas gdy Ty zajmujesz się rozwojem
                biznesu.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["Google Apps Script", "Business Automation", "API Integrations", "Data Processing", "Node.js"].map(
                  t => (
                    <TechTag key={t} label={t} />
                  ),
                )}
              </div>
            </div>
            <div>
              <div className="space-y-2 text-sm">
                <p>
                  <CheckCircle2 className="inline h-4 w-4 mr-2" />
                  Faktura B2B
                </p>
                <p>
                  <CheckCircle2 className="inline h-4 w-4 mr-2" />
                  Gwarancja na kod
                </p>
                <p>
                  <CheckCircle2 className="inline h-4 w-4 mr-2" />
                  Szybki czas realizacji
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <a href="/cv.pdf" className={`text-sm underline ${T.link}`}>
                  Zobacz CV (PDF)
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" title="Kontakt" subtitle="Napisz, co chcesz zautomatyzować — wrócę z pomysłem w 48h.">
        <div className={`rounded-3xl p-6 md:p-8 grid md:grid-cols-3 gap-8 ${T.card}`}>
          <div className="space-y-4">
            <a className={`inline-flex items-center gap-2 ${T.link}`} href="mailto:hello@pmdev.ovh">
              <Mail className="h-4 w-4" /> devpmme@gmail.com
            </a>
            <div className="opacity-80 text-sm">Lokalizacja: Polska (PL) / Remote (EU)</div>
            <div className="flex gap-3">
              <a
                className={`inline-flex items-center gap-2 ${T.link}`}
                href="https://github.com/Malzagic"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
              <a
                className={`inline-flex items-center gap-2 ${T.link}`}
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </div>
          </div>

          {/* FORM */}
          <form className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={onSubmit} noValidate>
            <div>
              <input
                name="name"
                required
                autoComplete="name"
                className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:outline-none focus:ring ${T.ring} ${
                  errors.name ? "border-red-500" : ""
                }`}
                placeholder="Imię"
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div>
              <input
                name="email"
                required
                type="email"
                autoComplete="email"
                className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:outline-none focus:ring ${T.ring} ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="Email"
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            <div className="sm:col-span-2">
              <input
                name="subject"
                autoComplete="off"
                className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:outline-none focus:ring ${T.ring} ${
                  errors.subject ? "border-red-500" : ""
                }`}
                placeholder="Temat (opcjonalnie)"
              />
              {errors.subject && <p className="text-xs text-red-400 mt-1">{errors.subject}</p>}
            </div>

            <div className="sm:col-span-2">
              <textarea
                name="message"
                required
                rows={5}
                className={`w-full px-4 py-3 rounded-xl bg-transparent border focus:outline-none focus:ring ${T.ring} ${
                  errors.message ? "border-red-500" : ""
                }`}
                placeholder="Opisz krótko proces, który chcesz usprawnić (np. 'chcę automatycznie wysyłać faktury z arkusza')"
              />
              {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={sending}
              aria-busy={sending}
              className={`sm:col-span-2 mt-1 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-medium ${T.accentGrad} text-white hover:opacity-95 transition ${T.soft} disabled:opacity-60`}
            >
              <Rocket className="h-4 w-4" />
              {sending ? "Wysyłanie…" : "Wyślij zgłoszenie"}
            </button>
          </form>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-white/10/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 text-sm flex flex-col sm:flex-row items-center justify-between gap-4 opacity-70">
          <p>
            © {new Date().getFullYear()} {BRAND_NAME}
          </p>
          <p>Built with React · Tailwind · Framer Motion</p>
        </div>
      </footer>
    </div>
  );
}

/* Small presentational bits kept local for cohesiveness */
function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl p-4 border border-white/10 bg-white/5">
      <div className="flex items-center gap-2 mb-2 opacity-90">
        {icon}
        <strong>{title}</strong>
      </div>
      <p className="text-sm opacity-75">{desc}</p>
    </div>
  );
}

function ServiceCard({ icon, title, points }: { icon?: React.ReactNode; title: string; points: string[] }) {
  return (
    <div className="rounded-3xl p-6 border border-white/10 bg-white/5">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
          {icon ?? <Boxes className="h-4 w-4" aria-hidden="true" />}
        </span>
        <h3 className="font-medium">{title}</h3>
      </div>
      <ul className="space-y-2 text-sm opacity-80">
        {points.map(p => (
          <li key={p} className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5" aria-hidden="true" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectCard({
  title,
  stack,
  problem,
  solution,
  result,
  href,
}: {
  title: string;
  stack: string[];
  problem: string;
  solution: string;
  result: string;
  href?: string;
}) {
  return (
    <div className="rounded-3xl p-6 border border-white/10 bg-white/5 flex flex-col">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {stack.map(s => (
          <span key={s} className="text-xs px-2 py-0.5 rounded-full border border-white/10">
            {s}
          </span>
        ))}
      </div>
      <dl className="mt-4 space-y-1 text-sm opacity-80">
        <div>
          <dt className="inline opacity-70">Problem:</dt> <dd className="inline">{problem}</dd>
        </div>
        <div>
          <dt className="inline opacity-70">Rozwiązanie:</dt> <dd className="inline">{solution}</dd>
        </div>
        <div>
          <dt className="inline opacity-70">Wynik:</dt> <dd className="inline">{result}</dd>
        </div>
      </dl>
      <div className="mt-4">
        <a href={href} className="text-sm underline opacity-80 hover:opacity-100">
          Zobacz więcej
        </a>
      </div>
    </div>
  );
}
