"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------
   Helpers
------------------------------------------------------------ */
function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function SoftNoise() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 5px)",
      }}
    />
  );
}

function useInViewOnce<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: "-10% 0px -10% 0px", ...(options || {}) }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return { ref, inView };
}

/* ------------------------------------------------------------
   Motion tokens (stesso stile del tuo esempio)
------------------------------------------------------------ */
const easeIgloo = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.85, ease: easeIgloo } },
};

const sectionFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.05,
      ease: easeIgloo,
      when: "beforeChildren",
      staggerChildren: 0.12,
    },
  },
};

const cardIn = {
  hidden: { y: 22, opacity: 0, scale: 0.985 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.62, ease: easeIgloo },
  },
};

const clipReveal = {
  hidden: { clipPath: "inset(0% 100% 0% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.0, ease: easeIgloo },
  },
};

/* ------------------------------------------------------------
   Theme (palette blu/azzurro come hai chiesto)
------------------------------------------------------------ */
const THEME = {
  // fondo principale (azzurro canvas)
  sky: "#CFEFFF",
  sky2: "#BFE7FF",
  deep: "#0B2A3A",
  deep2: "#0E3449",
  ink: "#0A1C25",
  card: "rgba(255,255,255,0.72)",
  cardStrong: "rgba(255,255,255,0.86)",
  border: "rgba(255,255,255,0.28)",
  gold: "#B8A07E",
} as const;

/* ------------------------------------------------------------
   Copy (Sfratto Morosi)
------------------------------------------------------------ */
type Copy = {
  brand: string;
  kicker: string;
  h1: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;

  nav: Array<{ id: string; label: string }>;

  stats: Array<{ label: string; value: string; note: string }>;

  howTitle: string;
  howSub: string;
  howSteps: Array<{ title: string; desc: string }>;

  servicesTitle: string;
  servicesSub: string;
  services: Array<{ title: string; desc: string; bullets: string[] }>;

  pricingTitle: string;
  pricingSub: string;
  pricingCardTitle: string;
  pricingPrice: string;
  pricingNote: string;
  pricingBullets: string[];

  blogTitle: string;
  blogSub: string;
  blogCards: Array<{ title: string; desc: string; href: string }>;

  faqTitle: string;
  faqSub: string;
  faqs: Array<{ q: string; a: string }>;

  contactTitle: string;
  contactSub: string;
  form: {
    name: string;
    email: string;
    phone: string;
    city: string;
    message: string;
    send: string;
    hint: string;
    ok: string;
    err: string;
    sending: string;
  };

  footerNote: string;
};

const COPY: Copy = {
  brand: "Sfratto Morosi",
  kicker: "Recupero immobile · Procedura guidata · Supporto legale",
  h1: "Sfratto per Morosità senza caos.",
  sub:
    "Un percorso chiaro, tempi stimati e assistenza completa per recuperare il tuo immobile. Niente confusione: ti guidiamo dall’inizio alla consegna delle chiavi.",
  ctaPrimary: "Richiedi Preventivo",
  ctaSecondary: "Vedi Come Funziona",

  nav: [
    { id: "come-funziona", label: "Come funziona" },
    { id: "servizi", label: "Servizi" },
    { id: "preventivo", label: "Preventivo" },
    { id: "blog", label: "Blog" },
    { id: "faq", label: "FAQ" },
    { id: "contatti", label: "Contatti" },
  ],

  stats: [
    { label: "Costo medio", value: "€ 1300", note: "Chiaro e coerente" },
    { label: "Ordinanza", value: "~90 giorni", note: "In media" },
    { label: "Esperienza", value: "10+ anni", note: "Pratiche seguite" },
    { label: "Casi gestiti", value: "100+", note: "Storico reale" },
  ],

  howTitle: "Come funziona",
  howSub:
    "Un flusso semplice ma completo: raccolta info → strategia → deposito → udienza → esecuzione.",
  howSteps: [
    {
      title: "1) Analisi pratica",
      desc:
        "Raccogliamo i dettagli essenziali (contratto, insoluti, Comune, situazione inquilino) per impostare la strategia corretta.",
    },
    {
      title: "2) Piano e tempi stimati",
      desc:
        "Ti diciamo cosa aspettarti, step-by-step. Niente promesse vaghe: obiettivi, rischi, alternative e stime reali.",
    },
    {
      title: "3) Deposito e udienza",
      desc:
        "Gestiamo i passaggi e la documentazione. Ti teniamo aggiornato e prepariamo la fase successiva senza rallentare.",
    },
    {
      title: "4) Esecuzione e rilascio",
      desc:
        "Coordinamento della fase esecutiva e assistenza fino al rilascio dell’immobile, con supporto sulle criticità più frequenti.",
    },
  ],

  servicesTitle: "Servizi",
  servicesSub:
    "Non solo “atto e via”: qui trovi un servizio completo, progettato per ridurre tempi morti ed errori.",
  services: [
    {
      title: "Sfratto per morosità",
      desc:
        "Gestione completa del procedimento, con impostazione solida e aggiornamenti costanti.",
      bullets: ["Verifica documenti", "Strategia e deposito", "Gestione udienza", "Follow-up e step successivi"],
    },
    {
      title: "Recupero canoni e spese",
      desc:
        "Quando ha senso, impostiamo anche il recupero economico in parallelo (valutando costi/benefici).",
      bullets: ["Valutazione fattibilità", "Impostazione richiesta", "Riduzione attriti", "Chiarezza su costi"],
    },
    {
      title: "Consulenza preventiva",
      desc:
        "Prima che il problema esploda: contratti, clausole, garanzie e check pratici per prevenire la morosità.",
      bullets: ["Checklist contratto", "Garanzie", "Procedure interne", "Riduzione rischio"],
    },
  ],

  pricingTitle: "Preventivo",
  pricingSub:
    "Un prezzo trasparente e una checklist di cosa è incluso. Se emergono criticità, te lo diciamo subito.",
  pricingCardTitle: "Pacchetto base (stima media)",
  pricingPrice: "€ 1300",
  pricingNote: "Importo indicativo: varia per Comune e complessità.",
  pricingBullets: [
    "Analisi iniziale e impostazione strategia",
    "Redazione e deposito",
    "Assistenza udienza",
    "Aggiornamenti e supporto operativo",
  ],

  blogTitle: "Blog",
  blogSub:
    "Articoli utili, scritti per proprietari: niente fuffa, solo cose che servono davvero.",
  blogCards: [
    {
      title: "Sfratto per morosità: tempi e costi (2025)",
      desc:
        "Cosa succede davvero, quanto dura e quali sono i costi più comuni (senza fantasie).",
      href: "/blog/sfratto-per-morosita-tempi-costi-2025",
    },
    {
      title: "Prevenire la morosità in locazione",
      desc:
        "Le 10 cose che riducono il rischio: garanzie, controlli, clausole e procedure.",
      href: "/blog/prevenire-morosita-locazione",
    },
    {
      title: "Fase esecutiva: cosa aspettarsi",
      desc:
        "Come funziona l’esecuzione, cosa può rallentare e come prepararsi bene.",
      href: "/blog/fase-esecutiva-sfratto-cosa-aspettarsi",
    },
  ],

  faqTitle: "FAQ",
  faqSub: "Le risposte alle domande più comuni: rapide, concrete, senza gergo.",
  faqs: [
    {
      q: "Quanto tempo ci vuole?",
      a: "Dipende dal Tribunale e dalla situazione, ma una stima media per arrivare all’ordinanza può essere ~90 giorni. La fase esecutiva può variare.",
    },
    {
      q: "Serve che io vada in udienza?",
      a: "Non sempre. Ti diciamo in anticipo se è necessario e come prepararti. In molti casi gestiamo tutto noi.",
    },
    {
      q: "Posso recuperare i canoni non pagati?",
      a: "A volte sì, ma va valutata la fattibilità. Ti diciamo chiaramente costi/benefici prima di procedere.",
    },
  ],

  contactTitle: "Contatti",
  contactSub:
    "Scrivici i dettagli essenziali: rispondiamo con una prima valutazione e i prossimi step.",
  form: {
    name: "Nome e cognome",
    email: "Email",
    phone: "Telefono",
    city: "Città / Comune",
    message: "Descrivi la situazione",
    send: "Invia richiesta",
    hint: "Invio diretto dal sito. Ti rispondiamo appena possibile.",
    ok: "Richiesta inviata. Ti contattiamo a breve.",
    err: "Errore durante l’invio. Riprova tra poco.",
    sending: "Invio…",
  },

  footerNote:
    "© 2026 Sfratto Morosi — Informazioni indicative: per casi specifici serve valutazione completa.",
};

/* ------------------------------------------------------------
   UI primitives in stile “canvas”
------------------------------------------------------------ */
function GlassButton({
  label,
  onClick,
  variant,
}: {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
}) {
  const isPrimary = variant !== "ghost";
  return (
    <motion.button
      onClick={onClick}
      whileHover={{
        scale: 1.02,
        boxShadow: isPrimary
          ? "0 0 46px rgba(12, 140, 190, 0.35)"
          : "0 0 36px rgba(255,255,255,0.20)",
        borderColor: isPrimary ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.30)",
      }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "relative rounded-full border px-7 sm:px-9 py-3.5 sm:py-4 backdrop-blur-xl",
        "text-xs sm:text-sm md:text-base uppercase tracking-[0.18em] outline-none",
        "focus-visible:ring-2 focus-visible:ring-white/55 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        isPrimary
          ? "border-white/25 bg-white/16 text-white shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
          : "border-white/20 bg-white/10 text-white/90 hover:text-white"
      )}
      type="button"
    >
      {label}
    </motion.button>
  );
}

function SectionShell({
  id,
  tone,
  children,
}: {
  id?: string;
  tone?: "sky" | "deep";
  children: React.ReactNode;
}) {
  const isDeep = tone === "deep";
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden py-16 sm:py-20 md:py-28",
        isDeep ? "text-white" : "text-[#0A1C25]"
      )}
      style={{
        background: isDeep
          ? `linear-gradient(180deg, ${THEME.deep} 0%, ${THEME.deep2} 100%)`
          : `linear-gradient(180deg, ${THEME.sky} 0%, ${THEME.sky2} 100%)`,
      }}
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">{children}</div>
      <SoftNoise />
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-4 py-2 text-[11px] sm:text-xs uppercase tracking-[0.22em] backdrop-blur-xl"
      style={{
        borderColor: "rgba(255,255,255,0.28)",
        background: "rgba(0,0,0,0.18)",
        color: "rgba(255,255,255,0.92)",
      }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------
   Sticky Top Nav (glass + highlight scroll)
------------------------------------------------------------ */
function TopNav({
  activeId,
  onGo,
}: {
  activeId: string;
  onGo: (id: string) => void;
}) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 md:px-8 pt-3 sm:pt-4">
        <div
          className="rounded-2xl sm:rounded-full border backdrop-blur-xl"
          style={{
            borderColor: "rgba(255,255,255,0.22)",
            background: "rgba(0,0,0,0.28)",
            boxShadow: "0 16px 50px rgba(0,0,0,0.18)",
          }}
        >
          <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5 sm:py-3">
            <button
              onClick={() => onGo("home")}
              className="rounded-full px-2 sm:px-3 py-2 text-[12px] sm:text-[13px] md:text-[14px] uppercase tracking-[0.24em] text-white hover:bg-white/15"
              aria-label="Back to top"
              type="button"
            >
              {COPY.brand}
            </button>

            <div className="hidden md:flex items-center gap-2">
              {COPY.nav.map((n) => (
                <button
                  key={n.id}
                  onClick={() => onGo(n.id)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm md:text-[15px] uppercase tracking-[0.18em] transition",
                    activeId === n.id ? "bg-white/18 text-white" : "text-white/88 hover:bg-white/12 hover:text-white"
                  )}
                  type="button"
                >
                  {n.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <a
                href="#contatti"
                onClick={(e) => {
                  e.preventDefault();
                  onGo("contatti");
                }}
                className="hidden sm:inline-flex rounded-full bg-white/18 px-4 py-2 text-[12px] uppercase tracking-[0.22em] text-white hover:bg-white/22"
              >
                Contattaci
              </a>
              <a
                href="#preventivo"
                onClick={(e) => {
                  e.preventDefault();
                  onGo("preventivo");
                }}
                className="inline-flex rounded-full px-4 py-2 text-[12px] uppercase tracking-[0.22em]"
                style={{
                  background: "rgba(255,255,255,0.22)",
                  color: "white",
                }}
              >
                Preventivo
              </a>
            </div>
          </div>

          {/* Mobile row */}
          <div className="md:hidden px-3 pb-3">
            <div className="flex flex-wrap gap-2">
              {COPY.nav.map((n) => (
                <button
                  key={n.id}
                  onClick={() => onGo(n.id)}
                  className={cn(
                    "rounded-full px-4 py-2 text-[12px] uppercase tracking-[0.20em] transition",
                    activeId === n.id ? "bg-white/18 text-white" : "bg-white/8 text-white/90 hover:bg-white/12"
                  )}
                  type="button"
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   HERO (con cards statistiche “in alto” come hai chiesto)
------------------------------------------------------------ */
function Hero({ onPrimary, onSecondary }: { onPrimary: () => void; onSecondary: () => void }) {
  return (
    <motion.section
      id="home"
      className="relative min-h-[100svh] overflow-hidden"
      variants={sectionFade}
      initial="hidden"
      animate="visible"
      style={{
        background: `radial-gradient(1200px 600px at 20% 20%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 55%),
                     radial-gradient(900px 500px at 80% 30%, rgba(0,120,170,0.30) 0%, rgba(0,120,170,0) 55%),
                     linear-gradient(180deg, ${THEME.deep} 0%, ${THEME.deep2} 100%)`,
      }}
    >
      <div className="absolute inset-0 opacity-[0.65]">
        <motion.div
          aria-hidden
          className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full"
          animate={{ scale: [1, 1.08, 1.02, 1], opacity: [0.65, 0.85, 0.72, 0.65] }}
          transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.28), rgba(255,255,255,0) 60%)",
          }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-40 -right-40 h-[640px] w-[640px] rounded-full"
          animate={{ scale: [1, 1.06, 1.01, 1], opacity: [0.55, 0.75, 0.60, 0.55] }}
          transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(150,230,255,0.28), rgba(150,230,255,0) 62%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8 pt-28 sm:pt-28 md:pt-32 pb-16">
        <motion.div variants={fadeUp} className="flex items-center justify-center">
          <Pill>{COPY.kicker}</Pill>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mx-auto mt-7 max-w-4xl text-center text-4xl sm:text-5xl md:text-7xl leading-[1.06] tracking-[0.02em] text-white font-serif"
        >
          {COPY.h1}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-3xl text-center text-base sm:text-lg md:text-2xl leading-relaxed text-white/90"
        >
          {COPY.sub}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-9 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <GlassButton label={COPY.ctaPrimary} onClick={onPrimary} variant="primary" />
          <GlassButton label={COPY.ctaSecondary} onClick={onSecondary} variant="ghost" />
        </motion.div>

        {/* Cards “in alto” / highlight */}
        <motion.div variants={fadeUp} className="mx-auto mt-12 sm:mt-14 max-w-5xl">
          <div className="grid gap-4 sm:gap-5 md:grid-cols-4">
            {COPY.stats.map((s) => (
              <div
                key={s.label}
                className="relative overflow-hidden rounded-2xl border px-5 py-5 sm:px-6 sm:py-6 backdrop-blur-xl"
                style={{
                  borderColor: "rgba(255,255,255,0.22)",
                  background: "rgba(255,255,255,0.10)",
                  boxShadow: "0 18px 50px rgba(0,0,0,0.20)",
                }}
              >
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/75">{s.label}</div>
                <div className="mt-2 text-2xl sm:text-3xl font-serif text-white">{s.value}</div>
                <div className="mt-2 text-sm text-white/80">{s.note}</div>
                <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-transparent hover:ring-white/20 transition" />
                <SoftNoise />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          aria-hidden
          className="absolute bottom-7 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity }}
        >
          <div className="h-12 w-[2px] rounded bg-white/55" />
        </motion.div>
      </div>

      <SoftNoise />
    </motion.section>
  );
}

/* ------------------------------------------------------------
   SEZIONI
------------------------------------------------------------ */
function ComeFunziona() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();

  return (
    <SectionShell id="come-funziona" tone="sky">
      <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={sectionFade}>
        <motion.h2 variants={fadeUp} className="text-center text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
          {COPY.howTitle}
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-3xl text-center text-sm sm:text-base md:text-lg text-black/70">
          {COPY.howSub}
        </motion.p>

        <div className="mt-10 sm:mt-14 grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {COPY.howSteps.map((st, idx) => (
            <motion.div
              key={st.title}
              variants={cardIn}
              className="relative rounded-2xl border bg-white/70 p-6 sm:p-7 shadow-[0_18px_55px_rgba(0,0,0,0.10)]"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <div className="mb-4 h-[2px] w-10 rounded" style={{ background: "rgba(12,140,190,0.55)" }} />
              <div className="text-xs uppercase tracking-[0.22em] text-black/55">Step {idx + 1}</div>
              <h3 className="mt-2 text-xl sm:text-2xl font-serif text-[#0A1C25]">{st.title}</h3>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-black/70">{st.desc}</p>
              <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-transparent hover:ring-black/10 transition" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionShell>
  );
}

function Servizi() {
  return (
    <SectionShell id="servizi" tone="sky">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-12%" }} variants={sectionFade}>
        <motion.h2 variants={fadeUp} className="text-center text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
          {COPY.servicesTitle}
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-3xl text-center text-sm sm:text-base md:text-lg text-black/70">
          {COPY.servicesSub}
        </motion.p>

        <div className="mt-10 sm:mt-14 grid gap-6 lg:grid-cols-3">
          {COPY.services.map((s) => (
            <motion.div
              key={s.title}
              variants={cardIn}
              className="relative overflow-hidden rounded-2xl border bg-white/75 p-6 sm:p-7 shadow-[0_18px_55px_rgba(0,0,0,0.10)]"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <motion.div variants={clipReveal} className="absolute inset-0 opacity-[0.55]">
                <div
                  className="absolute -top-24 -right-24 h-[240px] w-[240px] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(0,140,200,0.20), rgba(0,140,200,0) 60%)",
                  }}
                />
              </motion.div>

              <div className="relative z-10">
                <div className="mb-4 h-[2px] w-10 rounded" style={{ background: "rgba(12,140,190,0.55)" }} />
                <h3 className="text-xl sm:text-2xl font-serif text-[#0A1C25]">{s.title}</h3>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-black/70">{s.desc}</p>

                <ul className="mt-5 space-y-2 text-sm text-black/70">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-[7px] h-1.5 w-1.5 rounded-full" style={{ background: "rgba(12,140,190,0.70)" }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <SoftNoise />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionShell>
  );
}

function Preventivo({ onGoContatti }: { onGoContatti: () => void }) {
  return (
    <SectionShell id="preventivo" tone="deep">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-12%" }} variants={sectionFade}>
        <motion.h2 variants={fadeUp} className="text-center text-3xl sm:text-4xl md:text-5xl font-serif leading-tight text-white">
          {COPY.pricingTitle}
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-3xl text-center text-sm sm:text-base md:text-lg text-white/75">
          {COPY.pricingSub}
        </motion.p>

        <motion.div variants={fadeUp} className="mx-auto mt-10 sm:mt-12 max-w-4xl">
          <div
            className="relative overflow-hidden rounded-2xl border p-6 sm:p-8 backdrop-blur-xl"
            style={{
              borderColor: "rgba(255,255,255,0.18)",
              background: "rgba(0,0,0,0.22)",
              boxShadow: "0 20px 70px rgba(0,0,0,0.28)",
            }}
          >
            <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-center">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-white/70">{COPY.pricingCardTitle}</div>
                <div className="mt-3 text-4xl sm:text-5xl font-serif text-white">{COPY.pricingPrice}</div>
                <div className="mt-2 text-sm text-white/70">{COPY.pricingNote}</div>

                <ul className="mt-6 space-y-2 text-sm sm:text-base text-white/80">
                  {COPY.pricingBullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-white/70" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <GlassButton label="Richiedi preventivo ora" onClick={onGoContatti} />
                <div className="text-xs text-white/60 tracking-[0.10em]">
                  Nessuna promessa magica. Ti diciamo cosa è realistico per il tuo Comune.
                </div>
              </div>
            </div>

            <SoftNoise />
          </div>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}

function Blog() {
  return (
    <SectionShell id="blog" tone="sky">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-12%" }} variants={sectionFade}>
        <motion.h2 variants={fadeUp} className="text-center text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
          {COPY.blogTitle}
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-3xl text-center text-sm sm:text-base md:text-lg text-black/70">
          {COPY.blogSub}
        </motion.p>

        <div className="mt-10 sm:mt-14 grid gap-6 lg:grid-cols-3">
          {COPY.blogCards.map((c) => (
            <motion.a
              key={c.href}
              href={c.href}
              variants={cardIn}
              whileHover={{ scale: 1.02, boxShadow: "0 22px 60px rgba(0,0,0,0.14)" }}
              className="group relative overflow-hidden rounded-2xl border bg-white/75 p-6 sm:p-7 shadow-[0_18px_55px_rgba(0,0,0,0.10)]"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <div className="mb-4 h-[2px] w-10 rounded" style={{ background: "rgba(12,140,190,0.55)" }} />
              <h3 className="text-xl sm:text-2xl font-serif text-[#0A1C25]">{c.title}</h3>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-black/70">{c.desc}</p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-[12px] uppercase tracking-[0.20em] text-black/70 group-hover:bg-black/8">
                Leggi →
              </div>

              <SoftNoise />
            </motion.a>
          ))}
        </div>
      </motion.div>
    </SectionShell>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SectionShell id="faq" tone="sky">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-12%" }} variants={sectionFade}>
        <motion.h2 variants={fadeUp} className="text-center text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
          {COPY.faqTitle}
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-3xl text-center text-sm sm:text-base md:text-lg text-black/70">
          {COPY.faqSub}
        </motion.p>

        <div className="mx-auto mt-10 sm:mt-14 max-w-4xl space-y-3">
          {COPY.faqs.map((f, idx) => {
            const isOpen = open === idx;
            return (
              <motion.div
                key={f.q}
                variants={cardIn}
                className="overflow-hidden rounded-2xl border bg-white/75 shadow-[0_18px_55px_rgba(0,0,0,0.10)]"
                style={{ borderColor: "rgba(0,0,0,0.08)" }}
              >
                <button
                  type="button"
                  onClick={() => setOpen((v) => (v === idx ? null : idx))}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-base sm:text-lg font-serif text-[#0A1C25]">{f.q}</span>
                  <span className={cn("text-black/60 transition", isOpen ? "rotate-45" : "rotate-0")}>+</span>
                </button>

                <div className={cn("grid transition-[grid-template-rows] duration-300", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden px-6 pb-5 text-sm sm:text-base text-black/70 leading-relaxed">
                    {f.a}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </SectionShell>
  );
}

function Contatti() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const canSend = useMemo(() => {
    if (!name.trim()) return false;
    if (!email.trim()) return false;
    if (!message.trim()) return false;
    return true;
  }, [name, email, message]);

  const onSend = async () => {
    try {
      setStatus("sending");

      // Se hai già /api/lead nel progetto, questa call è perfetta.
      // Se la route richiede campi diversi, dimmelo e la allineo 100%.
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          city,
          message,
          source: "website",
          page: "/",
        }),
      });

      if (!res.ok) throw new Error("send failed");
      setStatus("ok");
    } catch {
      setStatus("err");
    }
  };

  return (
    <SectionShell id="contatti" tone="deep">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-12%" }} variants={sectionFade}>
        <motion.h2 variants={fadeUp} className="text-center text-3xl sm:text-4xl md:text-5xl font-serif leading-tight text-white">
          {COPY.contactTitle}
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-3xl text-center text-sm sm:text-base md:text-lg text-white/75">
          {COPY.contactSub}
        </motion.p>

        <motion.div variants={fadeUp} className="mx-auto mt-10 sm:mt-12 max-w-4xl">
          <div
            className="rounded-2xl border p-5 sm:p-6 md:p-8 backdrop-blur-xl shadow-[0_22px_70px_rgba(0,0,0,0.28)]"
            style={{
              borderColor: "rgba(255,255,255,0.18)",
              background: "rgba(0,0,0,0.22)",
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <div className="text-xs uppercase tracking-[0.22em] text-white/70">{COPY.form.name}</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-white/35"
                  placeholder="Mario Rossi"
                />
              </label>

              <label className="space-y-2">
                <div className="text-xs uppercase tracking-[0.22em] text-white/70">{COPY.form.email}</div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-white/35"
                  placeholder="nome@email.com"
                />
              </label>

              <label className="space-y-2">
                <div className="text-xs uppercase tracking-[0.22em] text-white/70">{COPY.form.phone}</div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-white/35"
                  placeholder="+39…"
                />
              </label>

              <label className="space-y-2">
                <div className="text-xs uppercase tracking-[0.22em] text-white/70">{COPY.form.city}</div>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-white/35"
                  placeholder="Milano, Roma, …"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <div className="text-xs uppercase tracking-[0.22em] text-white/70">{COPY.form.message}</div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[140px] w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-white/35"
                  placeholder="Esempio: contratto 4+4, 3 mensilità non pagate, inquilino irreperibile…"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="text-xs tracking-[0.12em] text-white/60">{COPY.form.hint}</div>

              <motion.button
                onClick={onSend}
                disabled={!canSend || status === "sending"}
                whileHover={{ scale: !canSend || status === "sending" ? 1 : 1.02 }}
                whileTap={{ scale: !canSend || status === "sending" ? 1 : 0.99 }}
                className={cn(
                  "rounded-full px-8 py-3 text-xs uppercase tracking-[0.22em] shadow-[0_18px_50px_rgba(0,0,0,0.28)]",
                  !canSend || status === "sending" ? "opacity-70 cursor-not-allowed" : "opacity-100"
                )}
                style={{
                  background: "rgba(255,255,255,0.22)",
                  color: "white",
                }}
                type="button"
              >
                {status === "sending" ? COPY.form.sending : COPY.form.send}
              </motion.button>
            </div>

            {status === "ok" ? (
              <div className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-sm text-white/90">
                {COPY.form.ok}
              </div>
            ) : null}
            {status === "err" ? (
              <div className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-sm text-white/90">
                {COPY.form.err}
              </div>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}

function Footer() {
  return (
    <footer
      className="py-10"
      style={{
        background: `linear-gradient(180deg, ${THEME.deep2} 0%, ${THEME.deep} 100%)`,
        color: "rgba(255,255,255,0.75)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8 text-center text-xs tracking-[0.08em]">
        {COPY.footerNote}
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------
   Active section tracker (per highlight nav)
------------------------------------------------------------ */
function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string>("home");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      { threshold: [0.12, 0.18, 0.24], rootMargin: "-20% 0px -65% 0px" }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sectionIds]);

  return activeId;
}

/* ------------------------------------------------------------
   PAGE
------------------------------------------------------------ */
export default function Page() {
  const sectionIds = useMemo(
    () => ["home", ...COPY.nav.map((n) => n.id)],
    []
  );

  const activeId = useActiveSection(sectionIds);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) {
      if (id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ background: THEME.sky, color: THEME.ink }}>
      <TopNav activeId={activeId} onGo={go} />

      <Hero onPrimary={() => go("contatti")} onSecondary={() => go("come-funziona")} />
      <ComeFunziona />
      <Servizi />
      <Preventivo onGoContatti={() => go("contatti")} />
      <Blog />
      <FAQ />
      <Contatti />
      <Footer />
    </div>
  );
}
