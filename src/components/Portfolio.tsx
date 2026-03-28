"use client";

/**
 * Portfolio Component - Professional Version
 * Restores all business sections: Services, Projects, Process, About, Contact.
 * Fully integrated with Global ThemeContext and React Icons.
 */

import React, { useState } from "react";
import { motion, easeOut, type MotionProps } from "framer-motion";

// React Icons Imports
import {
  LuCode,
  LuRocket,
  LuMail,
  LuGlobe,
  LuFileSpreadsheet,
  LuBot,
  LuZap,
  LuSend,
  LuCheck,
  LuFileText,
  LuBell,
  LuLayoutGrid,
} from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { I18nProps } from "@/types/i18n";

import Section from "@/components/UI/Section";
import { TechTag } from "@/components/TechTag";
import { useTheme } from "@/context/ThemeContext";
import ThemePicker from "@/components/UI/ThemePicker";

const fade: MotionProps = {
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: easeOut },
};

export default function Portfolio({ dict, lang }: I18nProps) {
  const { theme, setTheme, themeConfig: T } = useTheme();
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // TOGGLE: Set to 'true' once GCP Service Account is active
  const isBackendReady = false;

  /**
   * Handle form submission to the GCP-ready API route.
   */
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name")).trim(),
      email: String(formData.get("email")).trim(),
      subject: String(formData.get("subject")).trim() || undefined,
      message: String(formData.get("message")).trim(),
    };

    setErrors({});
    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 422) {
        setErrors(data.errors ?? {});
        return;
      }

      if (!res.ok) throw new Error(data.error || "Submission failed");

      // Success state
      form.reset();
      alert("Thank you! Your inquiry has been secured in our system. ✔️");
    } catch (err: any) {
      alert(err.message || "Something went wrong. Please try again later.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={`${T.page} transition-colors duration-500 selection:bg-white/10`}>
      {/* THEME SWITCHER */}
      <ThemePicker />
      {/* HERO SECTION */}
      <section id="home" className="relative py-20 md:py-32 overflow-hidden">
        <div className={`pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-30 ${T.accentGrad}`} />
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fade}>
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-6 ${T.accentText} border-current opacity-80`}
            >
              <LuGlobe /> PL / EN · Remote · EU
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Automatyzacja{" "}
              <span className={`text-transparent bg-clip-text bg-linear-to-r ${T.accentGrad}`}>Google Workspace</span>{" "}
              dla Twojej firmy.
            </h1>
            <p className="mt-6 text-lg opacity-70 leading-relaxed max-w-lg">
              Zamieniam chaos w Arkuszach Google w działające systemy CRM, generatory dokumentów i raporty. Oszczędzaj
              godziny pracy tygodniowo.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#contact"
                className={`px-8 py-4 text-white font-bold rounded-2xl transition-all flex items-center gap-2 ${T.accentGrad} ${T.soft}`}
              >
                <LuRocket /> Darmowa konsultacja
              </a>
              <div className="flex items-center gap-6 px-4">
                <a
                  href="https://github.com/Malzagic"
                  target="_blank"
                  className={`text-2xl opacity-60 hover:opacity-100 ${T.link}`}
                >
                  <SiGithub />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  className={`text-2xl opacity-60 hover:opacity-100 ${T.link}`}
                >
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div {...fade} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <HeroCard
              icon={<LuZap />}
              title="Oszczędność czasu"
              desc="Automatyzacja nudnych zadań. Skrypty pracują za Ciebie 24/7."
              theme={T}
            />
            <HeroCard
              icon={<LuFileSpreadsheet />}
              title="Moc Arkuszy"
              desc="Google Sheets jako baza danych. Znane środowisko, nowe możliwości."
              theme={T}
            />
            <HeroCard
              icon={<LuBot />}
              title="Automatyzacja"
              desc="Bot & API integracja, SMS i e-mail o zdarzeniach. Raporty prosto na telefon."
              theme={T}
            />
            <HeroCard
              icon={<LuCode />}
              title="Szyte na miarę"
              desc="Rozwiązania dopasowane w 100% do Twojego procesu biznesowego."
              theme={T}
            />
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
            icon={<LuFileSpreadsheet />}
            title="Automatyzacja Sheets"
            points={["Customowe funkcje i skrypty", "Walidacja danych i formularze", "Dashboardy i raporty"]}
            theme={T}
          />
          <ServiceCard
            icon={<LuFileText />}
            title="Obieg Dokumentów"
            points={["Generowanie umów/faktur (PDF)", "Szablony w Google Docs", "Wysyłka e-mail z załącznikami"]}
            theme={T}
          />
          <ServiceCard
            icon={<LuBell />}
            title="Integracje i Alerty"
            points={["Powiadomienia SMS/Telegram", "Łączenie z zewnętrznym API", "Cykliczne raporty sprzedaży"]}
            theme={T}
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
            stack={["Forms", "Apps Script", "Calendar"]}
            problem="Ręczne przepisywanie zapytań do kalendarza."
            solution="Auto-sync from website to Sheets & Calendar."
            result="Oszczędność 5h/tydzień."
            theme={T}
          />
          <ProjectCard
            title="Generator Dokumentów"
            stack={["Docs", "Drive API", "PDF"]}
            problem="Czasochłonne tworzenie umów."
            solution="Data-to-PDF automated flow."
            result="Gotowe w 3 sekundy."
            theme={T}
          />
          <ProjectCard
            title="Raporty & Powiadomienia"
            stack={["Twilio", "Telegram API", "Triggers"]}
            problem="Brak wiedzy o wynikach sprzedaży."
            solution="Daily reports sent to your mobile."
            result="Pełna kontrola 24/7."
            theme={T}
          />
        </div>
      </Section>
      {/* PROCESS */}
      <Section id="process" title="Jak pracuję" subtitle="Prosty proces wdrożenia automatyzacji w Twojej firmie.">
        <ol className="grid md:grid-cols-5 gap-6">
          {[
            { n: 1, t: "Analiza", d: "Szukamy wąskich gardeł." },
            { n: 2, t: "Plan", d: "Dobieramy narzędzia." },
            { n: 3, t: "Skryptowanie", d: "Piszę czysty, wydajny kod." },
            { n: 4, t: "Wdrożenie", d: "Instalacja i szkolenie." },
            { n: 5, t: "Opieka", d: "Gwarancja i rozwój." },
          ].map(s => (
            <li key={s.n} className={`rounded-2xl p-5 border border-white/5 ${T.card}`}>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`h-7 w-7 flex items-center justify-center rounded-full text-white text-xs ${T.accentGrad}`}
                >
                  {s.n}
                </span>
                <strong className="text-sm font-bold">{s.t}</strong>
              </div>
              <p className="text-xs opacity-60 leading-relaxed">{s.d}</p>
            </li>
          ))}
        </ol>
      </Section>
      {/* ABOUT SECTION */}
      <Section id="about" title="O mnie" subtitle="Digital Architect | MERN Stack & Google Workspace Expert">
        <div className={`rounded-3xl p-8 border border-white/5 ${T.card}`}>
          <div className="grid md:grid-cols-3 gap-12">
            {/* Left & Middle: Narrative and Tech Stack */}
            <div className="md:col-span-2 space-y-8">
              <div className="space-y-4">
                <p className="opacity-90 leading-relaxed text-lg">
                  Łączę świat nowoczesnych aplikacji webowych z potęgą automatyzacji biznesowej. Jako{" "}
                  <span className={T.accentText}>Digital Architect</span>, nie tylko buduję software, ale projektuję
                  ekosystemy, które eliminują powtarzalną pracę.
                </p>
                <p className="opacity-70 leading-relaxed">
                  Specjalizuję się w stacku **MERN** (MongoDB, Express, React, Node.js) oraz infrastrukturze **Google
                  Cloud (GCP/Firebase)**. Moim unikalnym atutem jest głęboka integracja tych rozwiązań z ekosystemem
                  Google Workspace, co pozwala na tworzenie narzędzi klasy Enterprise w lekkiej formie.
                </p>
              </div>

              {/* Tech Stack Grouping */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] opacity-40">Core Stack & Cloud</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "JavaScript (ES6+)",
                    "TypeScript",
                    "React.js",
                    "Node.js",
                    "Express",
                    "MongoDB",
                    "Firebase",
                    "Google Cloud (GCP)",
                    "Google Apps Script",
                    "Next.js",
                    "REST APIs",
                  ].map(t => (
                    <TechTag key={t} label={t} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Trust & Business Details */}
            <div className="space-y-6 md:border-l md:border-white/10 md:pl-8">
              <div className="space-y-4 text-sm opacity-80">
                <div className="flex items-center gap-3">
                  <LuCheck className={T.accentText} />
                  <span>Pełny cykl **MERN Development**</span>
                </div>
                <div className="flex items-center gap-3">
                  <LuCheck className={T.accentText} />
                  <span>Architektura **Serverless (GCP)**</span>
                </div>
                <div className="flex items-center gap-3">
                  <LuCheck className={T.accentText} />
                  <span>Faktura B2B (Polska/EU)</span>
                </div>
                <div className="flex items-center gap-3">
                  <LuCheck className={T.accentText} />
                  <span>Gwarancja & Kod najwyższej jakości</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
      {/* CONTACT SECTION */}
      <Section id="contact" title="Kontakt" subtitle="Napisz, co chcesz zautomatyzować — wrócę z pomysłem w 48h.">
        <div className={`rounded-3xl p-8 grid md:grid-cols-3 gap-12 border border-white/10 ${T.card}`}>
          {/* Left Column: Static Contact Info */}
          <div className="space-y-6">
            <a className={`flex items-center gap-3 text-lg font-medium ${T.link}`} href="mailto:pm@pmdev.ovh">
              <LuMail className="text-xl" /> pm@pmdev.ovh
            </a>
            <div className="text-sm opacity-60 space-y-1">
              <p>Lokalizacja: Polska (PL) / Remote (EU)</p>
              <p>Timezone: CET (UTC+1)</p>
            </div>
          </div>

          {/* Right Column: Dynamic Form Logic */}
          <div className="md:col-span-2 relative">
            {(() => {
              // Maintenance Flag: Toggle to 'true' once Google Cloud Platform is connected
              const isBackendReady = false;

              // Dynamic Alert Styling based on current theme T
              const accentBase = T.accentText; // e.g., 'text-amber-400'
              const accentBg = accentBase.replace("text-", "bg-") + "/10";
              const accentBorder = accentBase.replace("text-", "border-") + "/20";
              const pulseColor = accentBase.replace("text-", "bg-");

              return (
                <>
                  {/* THEMED MAINTENANCE ALERT */}
                  {!isBackendReady && (
                    <div
                      className={`mb-6 p-4 rounded-xl border flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-700 ${accentBg} ${accentBorder}`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full animate-pulse shadow-[0_0_10px_currentColor] ${pulseColor}`}
                      />
                      <p className={`text-xs font-medium tracking-wide uppercase italic ${accentBase}`}>
                        Status: <span className="opacity-80">Trwają prace nad integracją GCP</span> –
                        <span className="ml-1 opacity-100 font-bold">Zapraszam do kontaktu mailowego.</span>
                      </p>
                    </div>
                  )}

                  {/* RESPONSIVE CONTACT FORM */}
                  <form
                    onSubmit={onSubmit}
                    className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-500 ${!isBackendReady ? "opacity-60 grayscale-[0.5]" : "opacity-100"}`}
                    noValidate
                  >
                    {/* Name Input - Mobile-first grid (1 col by default, 2 cols on sm+) */}
                    <div className="space-y-1">
                      <input
                        name="name"
                        disabled={!isBackendReady}
                        className={`w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:outline-none focus:ring-2 ${T.ring} transition-all
                    ${!isBackendReady ? "cursor-not-allowed" : "hover:border-white/20"}`}
                        placeholder={isBackendReady ? "Imię" : "Formularz offline"}
                      />
                      {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1">
                      <input
                        name="email"
                        type="email"
                        disabled={!isBackendReady}
                        className={`w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:outline-none focus:ring-2 ${T.ring} transition-all
                    ${!isBackendReady ? "cursor-not-allowed" : "hover:border-white/20"}`}
                        placeholder="Email"
                      />
                      {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                    </div>

                    {/* Message Textarea - Always full width in the form grid */}
                    <div className="sm:col-span-2 space-y-1">
                      <textarea
                        name="message"
                        disabled={!isBackendReady}
                        rows={5}
                        className={`w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:outline-none focus:ring-2 ${T.ring} transition-all resize-none
                    ${!isBackendReady ? "cursor-not-allowed" : "hover:border-white/20"}`}
                        placeholder={
                          isBackendReady ? "Opisz proces do usprawnienia..." : "System w trakcie konfiguracji..."
                        }
                      />
                      {errors.message && <p className="text-xs text-red-400">{errors.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!isBackendReady || sending}
                      className={`sm:col-span-2 py-4 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 
                  ${
                    isBackendReady
                      ? `${T.accentGrad} ${T.soft} active:scale-95 cursor-pointer`
                      : "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50"
                  }`}
                    >
                      {sending ? (
                        "Wysyłanie..."
                      ) : !isBackendReady ? (
                        "Przerwa techniczna"
                      ) : (
                        <>
                          <LuSend /> Wyślij zgłoszenie
                        </>
                      )}
                    </button>
                  </form>
                </>
              );
            })()}
          </div>
        </div>
      </Section>
      <footer className="py-12 border-t border-white/5 opacity-40 text-center text-xs">
        <p>© {new Date().getFullYear()} pmdev · Digital Architect · built with Next.js 16.2</p>
      </footer>
    </div>
  );
}

/** * Local Sub-components for optimal structure */

function HeroCard({ icon, title, desc, theme }: { icon: React.ReactNode; title: string; desc: string; theme: any }) {
  return (
    <div className={`p-6 rounded-2xl border border-white/5 transition-all hover:border-white/20 ${theme.card}`}>
      <div className={`text-2xl mb-3 ${theme.accentText}`}>{icon}</div>
      <h3 className="font-bold text-sm mb-1">{title}</h3>
      <p className="opacity-50 text-[10px] leading-relaxed uppercase tracking-wider">{desc}</p>
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  points,
  theme,
}: {
  icon: React.ReactNode;
  title: string;
  points: string[];
  theme: any;
}) {
  return (
    <div
      className={`p-8 rounded-3xl border border-white/5 flex flex-col h-full hover:border-white/20 transition-all ${theme.card}`}
    >
      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white mb-6 ${theme.accentGrad}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <ul className="space-y-3">
        {points.map(p => (
          <li key={p} className="flex items-center gap-3 text-sm opacity-70">
            <LuCheck className={theme.accentText} /> {p}
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
  theme,
}: {
  title: string;
  stack: string[];
  problem: string;
  solution: string;
  result: string;
  theme: any;
}) {
  return (
    <div className={`p-8 rounded-3xl border border-white/5 hover:bg-white/2 transition-all ${theme.card}`}>
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {stack.map(s => (
          <span
            key={s}
            className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border border-white/10 opacity-50"
          >
            {s}
          </span>
        ))}
      </div>
      <div className="space-y-4 text-xs leading-relaxed">
        <p>
          <span className={`${theme.accentText} font-bold`}>Problem:</span>{" "}
          <span className="opacity-70">{problem}</span>
        </p>
        <p>
          <span className={`${theme.accentText} font-bold`}>Rozwiązanie:</span>{" "}
          <span className="opacity-70">{solution}</span>
        </p>
        <p>
          <span className={`${theme.accentText} font-bold`}>Rezultat:</span>{" "}
          <span className="opacity-90 font-bold">{result}</span>
        </p>
      </div>
    </div>
  );
}
