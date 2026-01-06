"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Lightweight runtime “tests” for this preview.
 * In Canvas we don’t have a full test runner, so we use console assertions.
 */
function runSmokeTests() {
  const required = {
    phone: "03311090750",
    email: "info@sfrattomorosi.it",
    brand: "Sfratto Morosi",
    baseCost: "€ 1.300",
    execCost: "€ 1.200,00",
  };

  console.assert(required.phone.length > 0, "Phone must be present");
  console.assert(required.email.includes("@"), "Email must be valid-ish");
  console.assert(required.brand === "Sfratto Morosi", "Brand must be 'Sfratto Morosi'");
  console.assert(required.baseCost.includes("1.300"), "Base cost format must include 1.300");
  console.assert(required.execCost.includes("1.200"), "Exec cost format must include 1.200");

  // Formatting guards
  console.assert(!required.baseCost.includes("1300"), "Base cost must not be plain '1300'");
  console.assert(!required.execCost.includes("1200"), "Exec cost must keep separator formatting");

  // Route map tests
  const routeFromPath = (pathname: string) => {
    const p = (pathname || "/").toLowerCase().replace(/\/$/, "") || "/";
    const map: Record<string, string> = {
      "/": "home",
      "/home": "home",
      "/preventivo": "preventivo",
      "/servizi": "servizi",
      "/blog": "blog",
      "/blog-1": "blog-1",
      "/blog-2": "blog-2",
      "/blog-3": "blog-3",
      "/faq": "faq",
      "/contatti": "contatti",
    };
    return map[p] ?? "home";
  };

  console.assert(routeFromPath("/") === "home", "Route map: / -> home");
  console.assert(routeFromPath("/blog-2") === "blog-2", "Route map: /blog-2 -> blog-2");

  return required;
}

const INVARIANTS = runSmokeTests();

type RouteKey =
  | "home"
  | "preventivo"
  | "servizi"
  | "blog"
  | "faq"
  | "contatti"
  | "blog-1"
  | "blog-2"
  | "blog-3";

function ScalesIcon({ className = "" }: { className?: string }) {
  // Inline SVG — “bilancia a due piatti”.
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3v18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M6 7l-3 6a4 4 0 0 0 6 0L6 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M18 7l-3 6a4 4 0 0 0 6 0l-3-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8 21h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function useTypewriter(text: string, speedMs = 18, startDelayMs = 280) {
  const [out, setOut] = useState("");

  useEffect(() => {
    let mounted = true;
    setOut("");

    const start = window.setTimeout(() => {
      let i = 0;
      const id = window.setInterval(() => {
        if (!mounted) return;
        i += 1;
        setOut(text.slice(0, i));
        if (i >= text.length) window.clearInterval(id);
      }, Math.max(12, speedMs));

      return () => window.clearInterval(id);
    }, Math.max(0, startDelayMs));

    return () => {
      mounted = false;
      window.clearTimeout(start);
    };
  }, [text, speedMs, startDelayMs]);

  return out;
}

function CountUp({
  to,
  durationMs = 2400,
  suffix = "",
  prefix = "",
  format,
}: {
  to: number;
  durationMs?: number;
  suffix?: string;
  prefix?: string;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const start = performance.now();
    const from = 0;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / Math.max(1, durationMs));
      // Smooth easing
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (to - from) * eased;
      setVal(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, durationMs]);

  const shown = useMemo(() => {
    const n = Math.round(val);
    return format ? format(n) : `${prefix}${n}${suffix}`;
  }, [val, format, prefix, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
    </span>
  );
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setPath(path: string) {
  try {
    window.history.pushState({}, "", path);
  } catch {
    window.location.hash = `#${path}`;
  }
}

function normalizePath(p: string): string {
  if (!p) return "/";
  const noQuery = p.split("?")[0].split("#")[0];
  if (noQuery.length > 1 && noQuery.endsWith("/")) return noQuery.slice(0, -1);
  return noQuery;
}

function routeFromPath(pathname: string): RouteKey {
  const p = normalizePath((pathname || "/").toLowerCase());
  const map: Record<string, RouteKey> = {
    "/": "home",
    "/home": "home",
    "/preventivo": "preventivo",
    "/servizi": "servizi",
    "/blog": "blog",
    "/blog-1": "blog-1",
    "/blog-2": "blog-2",
    "/blog-3": "blog-3",
    "/faq": "faq",
    "/contatti": "contatti",
  };
  return map[p] ?? "home";
}

function pathFromRoute(route: RouteKey): string {
  return route === "home" ? "/" : `/${route}`;
}

const GlowButton = ({
  children,
  variant,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  variant: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
}) => {
  if (variant === "primary") {
    return (
      <motion.button
        onClick={onClick}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.99 }}
        className={`relative overflow-hidden bg-[#C5A14A] text-black px-10 py-5 rounded-2xl font-semibold shadow-2xl transition ${className}`}
      >
        <span className="relative z-10">{children}</span>
        <span
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(1200px circle at 50% 50%, rgba(255,255,255,0.22), rgba(197,161,74,0.0) 55%)",
          }}
        />
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      className={`px-10 py-5 rounded-2xl border border-white/20 text-white/80 transition hover:border-[#C5A14A]/60 hover:text-white ${className}`}
    >
      {children}
    </motion.button>
  );
};

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function ArticleMeta({ pill, readingTime }: { pill: string; readingTime: string }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      <span className="text-[#C5A14A] text-xs uppercase tracking-[0.25em]">{pill}</span>
      <span className="text-white/35">•</span>
      <span className="text-white/60 text-xs uppercase tracking-[0.2em]">{readingTime}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-white/10 my-10" />;
}

export default function Page() {
  const heroKicker = useTypewriter("Avvocato sfratto per morosità", 18, 260);
  const [route, setRoute] = useState<RouteKey>("home");

  useEffect(() => {
    const parse = () => {
      const next = routeFromPath(window.location.pathname || "/");
      setRoute(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    parse();
    window.addEventListener("popstate", parse);
    return () => window.removeEventListener("popstate", parse);
  }, []);

  const go = (to: RouteKey) => {
    setPath(pathFromRoute(to));
    setRoute(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goSectionOnHome = (id: string) => {
    if (route !== "home") {
      go("home");
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(id)));
      return;
    }
    scrollToId(id);
  };

  const ValueProps = () => (
    <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 -mt-32">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            t: "Costo fisso",
            render: (
              <span className="text-3xl font-serif text-white">
                € <CountUp to={1300} durationMs={3200} format={(n) => n.toLocaleString("it-IT")} />
              </span>
            ),
            sub: "Chiaro e coerente",
          },
          {
            t: "Ordinanza",
            render: (
              <span className="text-3xl font-serif text-white">
                ~<CountUp to={90} durationMs={3000} suffix=" giorni" />
              </span>
            ),
            sub: "In media",
          },
          {
            t: "Esperienza",
            render: (
              <span className="text-3xl font-serif text-white">
                <CountUp to={10} durationMs={2800} suffix="+ anni" />
              </span>
            ),
            sub: "Pratiche seguite",
          },
          {
            t: "Casi gestiti",
            render: (
              <span className="text-3xl font-serif text-white">
                <CountUp to={100} durationMs={3200} suffix="+" />
              </span>
            ),
            sub: "Storico indicativo",
          },
        ].map((c, idx) => (
          <motion.div
            key={c.t}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: idx * 0.06 }}
            whileHover={{ y: -7 }}
            className="bg-[#0E1F3D]/80 backdrop-blur rounded-2xl p-6 border border-white/10 shadow-2xl text-center"
          >
            <p className="text-white/60 text-sm mb-3">{c.t}</p>
            <div className="leading-tight">{c.render}</div>
            <p className="text-white/45 text-xs mt-3">{c.sub}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );

  const ComeFunziona = () => (
    <section id="come-funziona" className="max-w-7xl mx-auto px-6 md:px-10 py-36">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-serif text-4xl md:text-5xl mb-16 text-center"
      >
        Come funziona
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          {
            n: "01",
            t: "Analisi gratuita del caso",
            d: "Valutiamo la situazione, i documenti e la strategia migliore per avviare lo sfratto per morosità.",
          },
          {
            n: "02",
            t: "Procedura legale completa",
            d: "Gestiamo l’intero procedimento: notifiche, udienza e predisposizione degli atti necessari.",
          },
          {
            n: "03",
            t: "Ordinanza di liberazione",
            d: "In media, in circa 90 giorni si ottiene l’ordinanza di liberazione dell’immobile (tempistica indicativa).",
          },
        ].map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: i * 0.06 }}
            className="relative text-center"
          >
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-7xl font-serif text-white/10">
              {s.n}
            </span>
            <h3 className="font-serif text-2xl mb-4">{s.t}</h3>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm mx-auto">{s.d}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="mt-16 mx-auto max-w-4xl text-center"
      >
        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
          <span className="text-white/70">Hai già un contratto e vuoi capire come muoverti?</span>
          <GlowButton variant="secondary" onClick={() => go("contatti")} className="px-6 py-3">
            Richiedi consulenza
          </GlowButton>
        </div>
      </motion.div>
    </section>
  );

  const Preventivo = () => (
    <section id="preventivo" className="max-w-7xl mx-auto px-6 md:px-10 py-36">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-serif text-4xl md:text-5xl mb-16 text-center"
      >
        Calcola il preventivo
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6 text-center md:text-left">
          <p className="text-white/70 text-xl">
            Rispondi a poche domande e ottieni una stima chiara di tempi e costi. Nessun impegno.
          </p>
          <ul className="text-white/70 text-lg space-y-3">
            <li>
              • Ordinanza di liberazione: <strong>~90 giorni</strong>
            </li>
            <li>
              • Fase esecutiva: <strong>~6 mesi</strong> + <strong>{INVARIANTS.execCost}</strong>
            </li>
            <li>
              • Costo base servizio: <strong>{INVARIANTS.baseCost}</strong>
            </li>
          </ul>
          <p className="text-white/50 text-sm">
            Nota: tempi e costi sono indicativi e dipendono dal Tribunale competente e dal caso concreto.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.995 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl"
        >
          <div className="space-y-5">
            <input
              placeholder="Tipo immobile (es. appartamento, negozio)"
              className="w-full bg-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C5A14A]/40"
            />
            <input
              placeholder="Città / zona"
              className="w-full bg-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C5A14A]/40"
            />
            <input
              placeholder="Mensilità non pagate"
              className="w-full bg-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C5A14A]/40"
            />
            <GlowButton variant="primary" onClick={() => go("contatti")} className="w-full">
              Continua
            </GlowButton>
          </div>
        </motion.div>
      </div>
    </section>
  );

  const Servizi = () => (
    <section id="servizi" className="max-w-7xl mx-auto px-6 md:px-10 py-36">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-serif text-4xl md:text-5xl mb-16 text-center"
      >
        I nostri servizi
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-20">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <h3 className="font-serif text-3xl mb-6">Sfratto per morosità</h3>
          <p className="text-white/70 text-xl leading-relaxed mb-6">
            Gestione completa della procedura di sfratto per morosità: dall’analisi iniziale fino all’ottenimento
            dell’ordinanza e, se necessario, alla fase esecutiva.
          </p>
          <ul className="text-white/70 text-lg space-y-3">
            <li>• Impostazione documentale chiara</li>
            <li>• Ordinanza in media in ~90 giorni</li>
            <li>• Costo base del servizio: {INVARIANTS.baseCost}</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <h3 className="font-serif text-3xl mb-6">Gestione locazioni</h3>
          <p className="text-white/70 text-xl leading-relaxed mb-6">
            Supporto per contratti, registrazioni, rinnovi, proroghe e gestione corretta delle comunicazioni.
            La prevenzione riduce il rischio di morosità e contenziosi.
          </p>
          <ul className="text-white/70 text-lg space-y-3">
            <li>• Contratti su misura e aggiornati</li>
            <li>• Registrazione (anche telematica)</li>
            <li>• Gestione nel tempo (ISTAT, rinnovi, cessioni)</li>
          </ul>
        </motion.div>
      </div>
    </section>
  );

  const Blog = () => (
    <section id="blog" className="max-w-7xl mx-auto px-6 md:px-10 py-36">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-serif text-4xl md:text-5xl mb-12 text-center"
      >
        Blog
      </motion.h2>

      <p className="text-center text-white/70 max-w-3xl mx-auto mb-12">
        Articoli pensati per chiarire dubbi reali su <strong>sfratto per morosità</strong>, <strong>tempi</strong>,{" "}
        <strong>costi</strong> e prevenzione. Ogni articolo include collegamenti rapidi a preventivo, servizi e FAQ.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Sfratto per morosità: tempi e costi nel 2025",
            tag: "Guida completa",
            excerpt:
              "Tempi medi (circa 90 giorni), costi chiari e passaggi principali per recuperare il tuo immobile in modo ordinato.",
            route: "blog-1" as RouteKey,
          },
          {
            title: "Come prevenire la morosità nella locazione",
            tag: "Prevenzione",
            excerpt:
              "Contratto su misura, garanzie e gestione nel tempo: riduci il rischio di morosità prima che diventi un problema.",
            route: "blog-2" as RouteKey,
          },
          {
            title: "La fase esecutiva dello sfratto: cosa aspettarsi",
            tag: "Procedura",
            excerpt:
              "Dopo l’ordinanza: cosa succede, quali passaggi sono tipici e come affrontare la fase esecutiva con maggiore tutela.",
            route: "blog-3" as RouteKey,
          },
        ].map((a, i) => (
          <motion.article
            key={a.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: i * 0.05 }}
            whileHover={{ y: -8 }}
            onClick={() => go(a.route)}
            className="cursor-pointer bg-white/5 border border-white/10 rounded-3xl p-7 shadow-2xl"
          >
            <p className="text-[#C5A14A] text-xs uppercase tracking-[0.25em]">{a.tag}</p>
            <h3 className="font-serif text-2xl mt-3 mb-4">{a.title}</h3>
            <p className="text-white/70 text-base leading-relaxed">{a.excerpt}</p>
            <p className="mt-6 text-sm text-[#C5A14A]">Leggi l’articolo →</p>
          </motion.article>
        ))}
      </div>
    </section>
  );

  const FAQ = () => (
    <section id="faq" className="max-w-5xl mx-auto px-6 md:px-10 py-36">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-serif text-4xl md:text-5xl mb-16 text-center"
      >
        Domande frequenti
      </motion.h2>

      {[
        {
          q: "In quanto tempo si ottiene l’ordinanza di sfratto?",
          a: "In media, in circa 90 giorni si ottiene l’ordinanza di liberazione dell’immobile. Le tempistiche variano in base al Tribunale e al caso specifico.",
        },
        {
          q: "Qual è il costo del servizio per sfratto per morosità?",
          a: `Il costo base del servizio è pari a ${INVARIANTS.baseCost}. Eventuali fasi successive vengono sempre condivise in modo trasparente prima dell’avvio.`,
        },
        {
          q: "Cos’è la fase esecutiva e quanto dura?",
          a: `La fase esecutiva segue l’ordinanza di liberazione e si svolge con l’Ufficiale Giudiziario. In media dura circa 6 mesi e comporta un costo aggiuntivo di circa ${INVARIANTS.execCost}.`,
        },
        {
          q: "Posso addebitare al conduttore moroso i costi della procedura?",
          a: "In alcuni casi è possibile richiedere l’addebito delle spese al conduttore, ma dipende dalle decisioni del giudice e dalla situazione concreta. Ogni valutazione viene fatta con approccio prudente.",
        },
      ].map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.07 }}
          className="mb-6 border-b border-white/10 pb-6 text-center md:text-left"
        >
          <h3 className="font-serif text-2xl mb-3">{f.q}</h3>
          <p className="text-white/70 text-lg leading-relaxed">{f.a}</p>
        </motion.div>
      ))}
    </section>
  );

  const Contatti = () => (
    <section id="contatti" className="max-w-4xl mx-auto px-6 md:px-10 py-36">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-[#0E1F3D]/80 backdrop-blur rounded-3xl p-10 md:p-14 border border-white/10 shadow-2xl"
      >
        <h2 className="font-serif text-4xl mb-6 text-center">Richiedi una consulenza gratuita</h2>
        <p className="text-white/70 text-lg mb-10 text-center max-w-2xl mx-auto">
          I tuoi dati vengono gestiti con riservatezza. Ti ricontattiamo per valutare il percorso migliore.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <input
            placeholder="Nome"
            className="bg-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C5A14A]/40"
          />
          <input
            placeholder="Cognome"
            className="bg-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C5A14A]/40"
          />
          <input
            placeholder="Email"
            className="bg-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C5A14A]/40"
          />
          <input
            placeholder="Telefono"
            className="bg-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C5A14A]/40"
          />
          <textarea
            placeholder="Descrizione della situazione (es. mensilità arretrate, tipo immobile, città)"
            className="md:col-span-2 bg-white/10 rounded-xl px-5 py-4 h-32 focus:outline-none focus:ring-2 focus:ring-[#C5A14A]/40"
          />
        </div>

        <GlowButton variant="primary" onClick={() => {}} className="mt-10 w-full">
          Invia richiesta
        </GlowButton>

        <p className="mt-6 text-center text-white/40 text-xs">
          Le informazioni qui presenti hanno finalità informativa e non sostituiscono una consulenza legale.
        </p>
      </motion.div>
    </section>
  );

  const Nav = () => (
    <nav className="hidden md:flex gap-8 text-sm text-white/70">
      <button onClick={() => go("home")} className="hover:text-white transition">
        Home
      </button>
      <button onClick={() => go("preventivo")} className="hover:text-white transition">
        Preventivo
      </button>
      <button onClick={() => go("servizi")} className="hover:text-white transition">
        Servizi
      </button>
      <button onClick={() => go("blog")} className="hover:text-white transition">
        Blog
      </button>
      <button onClick={() => go("faq")} className="hover:text-white transition">
        FAQ
      </button>
      <button onClick={() => go("contatti")} className="hover:text-white transition">
        Contatti
      </button>
    </nav>
  );

  const HeaderCTA = () => (
    <motion.button
      onClick={() => go("contatti")}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      className="bg-[#C5A14A] text-black px-5 py-3 rounded-lg text-sm font-semibold shadow-lg hover:shadow-2xl transition"
    >
      Prenota Consulenza
    </motion.button>
  );

  const HomePage = () => (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LegalService",
          name: INVARIANTS.brand,
          telephone: INVARIANTS.phone,
          email: INVARIANTS.email,
          areaServed: "IT",
          serviceType: ["Sfratto per morosità", "Gestione locazioni"],
        }}
      />

      <section id="top" className="relative h-screen flex items-center justify-center overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(197,161,74,0.28),_transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1831]/50 via-[#0A1831]/80 to-[#0A1831]" />

        <motion.div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.08]"
          animate={{ opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(900px circle at 50% 25%, rgba(197,161,74,0.35), rgba(10,24,49,0) 60%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 45 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative z-10 w-full max-w-5xl px-6 md:px-10 text-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-[#C5A14A] uppercase tracking-[0.35em] text-[11px] md:text-xs mb-8"
          >
            {heroKicker}
            <span className="text-white/35"> • </span>
            Avvocato per sfratto per morosità
          </motion.p>

          <h1 className="font-serif text-6xl md:text-8xl leading-[1.03] mb-10">
            Avvocato per
            <br />
            <span className="text-[#C5A14A]">Sfratto per Morosità</span>
          </h1>

          <p className="text-white/75 text-xl md:text-2xl max-w-3xl mx-auto mb-14">
            In media, in circa <strong>90 giorni</strong> ottieni l’ordinanza di liberazione dell’immobile. Controllo,
            trasparenza e gestione completa della procedura.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <GlowButton variant="primary" onClick={() => go("contatti")}>
              Prenota Consulenza Gratuita
            </GlowButton>
            <GlowButton variant="secondary" onClick={() => goSectionOnHome("come-funziona")}>
              Scopri come funziona
            </GlowButton>
          </div>

          <motion.div
            className="mt-20 text-white/50 text-base md:text-lg text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{ y: [10, 0, 10] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            Scorri ↓
          </motion.div>
        </motion.div>
      </section>

      <ValueProps />
      <ComeFunziona />

      {/* Home order: Preventivo → Servizi → Blog → FAQ → Contatti */}
      <Preventivo />
      <Servizi />
      <Blog />
      <FAQ />
      <Contatti />
    </>
  );

  const SimplePageShell = ({
    title,
    children,
    backTo = "home",
  }: {
    title: string;
    children: React.ReactNode;
    backTo?: RouteKey;
  }) => (
    <div className="pt-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-serif text-4xl md:text-5xl">{title}</h1>
          <GlowButton variant="secondary" onClick={() => go(backTo)} className="px-6 py-3">
            Torna alla Home
          </GlowButton>
        </div>
      </div>
      {children}
    </div>
  );

  const ArticleLayout = ({
    title,
    pill,
    readingTime,
    slug,
    children,
    footerCtas,
    faqPairs,
  }: {
    title: string;
    pill: string;
    readingTime: string;
    slug: string;
    children: React.ReactNode;
    footerCtas: React.ReactNode;
    faqPairs: Array<{ q: string; a: string }>;
  }) => (
    <div className="pt-32 max-w-4xl mx-auto px-6 md:px-10 pb-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: title,
          author: { "@type": "Organization", name: INVARIANTS.brand },
          publisher: { "@type": "Organization", name: INVARIANTS.brand },
          mainEntityOfPage: { "@type": "WebPage", "@id": `https://sfrattomorosi.it/${slug}` },
          about: [
            "avvocato sfratto per morosità",
            "sfratto morosi",
            "procedura sfratto per morosità",
            "tempi sfratto",
            "costo sfratto",
          ],
        }}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqPairs.map((it) => ({
            "@type": "Question",
            name: it.q,
            acceptedAnswer: { "@type": "Answer", text: it.a },
          })),
        }}
      />

      <ArticleMeta pill={pill} readingTime={readingTime} />
      <h1 className="font-serif text-4xl md:text-5xl mb-8 text-center">{title}</h1>

      <div className="text-white/75 text-lg leading-relaxed space-y-6">{children}</div>

      <Divider />

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
        <h2 className="font-serif text-2xl mb-3 text-center">Vuoi un’indicazione chiara sul tuo caso?</h2>
        <p className="text-white/70 text-center mb-8">
          Scegli l’opzione più utile: preventivo rapido, panoramica servizi o FAQ.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">{footerCtas}</div>
      </div>

      <div className="mt-10 text-center">
        <GlowButton variant="secondary" onClick={() => go("blog")} className="px-8 py-4">
          Torna al Blog
        </GlowButton>
      </div>
    </div>
  );

  // --- SEO advanced articles ---

  const Blog1 = () => {
    const faqPairs = [
      {
        q: "Quanto dura uno sfratto per morosità?",
        a: "In media, l’ordinanza di liberazione può arrivare in circa 90 giorni. I tempi variano in base al Tribunale e al caso.",
      },
      {
        q: "Quanto costa lo sfratto per morosità?",
        a: `Il costo base del servizio è ${INVARIANTS.baseCost}. La fase esecutiva, se necessaria, è in media ~6 mesi e costa circa ${INVARIANTS.execCost} (sempre condivisa prima dell’avvio).`,
      },
      {
        q: "Che documenti servono per iniziare?",
        a: "Contratto, prova dei pagamenti/insoluti e comunicazioni utili. In consulenza si valuta cosa integrare caso per caso.",
      },
    ];

    return (
      <ArticleLayout
        title="Sfratto per morosità: tempi e costi nel 2025"
        pill="Guida completa"
        readingTime="9 min"
        slug="blog/sfratto-per-morosita-tempi-costi-2025"
        faqPairs={faqPairs}
        footerCtas={
          <>
            <GlowButton variant="primary" onClick={() => go("preventivo")}>
              Calcola il preventivo
            </GlowButton>
            <GlowButton variant="secondary" onClick={() => go("servizi")}>
              Scopri i servizi
            </GlowButton>
            <GlowButton variant="secondary" onClick={() => go("faq")}>
              Leggi le FAQ
            </GlowButton>
          </>
        }
      >
        <p>
          Se stai cercando <strong>avvocato sfratto per morosità</strong> o <strong>avvocato per sfratto per morosità</strong>, probabilmente
          hai un problema molto concreto: l’inquilino non paga e l’immobile resta occupato. In questa guida trovi una panoramica chiara e pratica su{" "}
          <strong>tempi</strong>, <strong>costi</strong> e passaggi tipici.
        </p>

        <h2 className="font-serif text-2xl text-white mt-10">Cos’è lo sfratto per morosità (in breve)</h2>
        <p>
          Lo <strong>sfratto per morosità</strong> è la procedura prevista per i casi di mancato pagamento del canone. Serve a ottenere un provvedimento
          che consenta al proprietario di rientrare nel possesso dell’immobile.
        </p>

        <h2 className="font-serif text-2xl text-white mt-10">Tempi: quanto ci vuole davvero?</h2>
        <p>
          In modo trasparente: <strong>dipende dal Tribunale e dal caso</strong>. Come riferimento utile, <strong>in media in circa 90 giorni</strong>{" "}
          si ottiene l’ordinanza di liberazione dell’immobile.
        </p>

        <h2 className="font-serif text-2xl text-white mt-10">Costi: chiarezza prima, serenità dopo</h2>
        <p>
          Il costo base del servizio è <strong>{INVARIANTS.baseCost}</strong>. Dopo l’ordinanza può essere necessaria la <strong>fase esecutiva</strong>,
          in media circa 6 mesi, con costo aggiuntivo indicativo <strong>{INVARIANTS.execCost}</strong>.
        </p>

        <h2 className="font-serif text-2xl text-white mt-10">Checklist rapida</h2>
        <ul className="text-white/75 list-disc ml-6 space-y-2">
          <li>Contratto di locazione e prova dei pagamenti.</li>
          <li>Elenco mensilità non pagate.</li>
          <li>Comunicazioni inviate (email, PEC, raccomandate).</li>
          <li>Dati immobile e recapiti utili.</li>
        </ul>
      </ArticleLayout>
    );
  };

  const Blog2 = () => {
    const faqPairs = [
      { q: "Come ridurre il rischio di morosità?", a: "Contratto chiaro, garanzie adeguate e gestione ordinata (pagamenti, solleciti, comunicazioni)." },
      { q: "È meglio prevenire o agire subito?", a: "Entrambe le cose: prevenzione in fase contrattuale e intervento tempestivo ai primi segnali di criticità." },
      { q: "Un contratto standard basta?", a: "Dipende. Spesso serve adattarlo alla situazione reale per ridurre ambiguità e contenziosi." },
    ];

    return (
      <ArticleLayout
        title="Come prevenire la morosità nella locazione"
        pill="Prevenzione"
        readingTime="8 min"
        slug="blog/prevenire-morosita-locazione"
        faqPairs={faqPairs}
        footerCtas={
          <>
            <GlowButton variant="secondary" onClick={() => go("preventivo")}>
              Calcola il preventivo
            </GlowButton>
            <GlowButton variant="primary" onClick={() => go("servizi")}>
              Scopri i servizi
            </GlowButton>
            <GlowButton variant="secondary" onClick={() => go("faq")}>
              Leggi le FAQ
            </GlowButton>
          </>
        }
      >
        <p>
          Una parte della morosità si può <strong>prevenire</strong> con scelte intelligenti: contratto chiaro, garanzie coerenti, gestione ordinata.
        </p>
        <h2 className="font-serif text-2xl text-white mt-10">Contratto chiaro</h2>
        <p>Meno ambiguità significa meno contenzioso.</p>
        <h2 className="font-serif text-2xl text-white mt-10">Garanzie</h2>
        <p>La soluzione migliore dipende da canone, durata e profilo del conduttore.</p>
        <h2 className="font-serif text-2xl text-white mt-10">Gestione nel tempo</h2>
        <p>Rinnovi, proroghe, comunicazioni: la prevenzione continua anche dopo la firma.</p>
      </ArticleLayout>
    );
  };

  const Blog3 = () => {
    const faqPairs = [
      { q: "Cosa succede dopo l’ordinanza di liberazione?", a: "Si avvia la fase esecutiva con l’Ufficiale Giudiziario: notifiche e accessi possono richiedere tempo." },
      { q: "Quanto dura la fase esecutiva?", a: "In media circa 6 mesi, ma dipende dal Tribunale e dalle prassi locali." },
      { q: "Quanto costa la fase esecutiva?", a: `In media comporta un costo aggiuntivo di circa ${INVARIANTS.execCost}, condiviso prima dell’avvio.` },
    ];

    return (
      <ArticleLayout
        title="La fase esecutiva dello sfratto: cosa aspettarsi"
        pill="Procedura"
        readingTime="8 min"
        slug="blog/fase-esecutiva-sfratto-cosa-aspettarsi"
        faqPairs={faqPairs}
        footerCtas={
          <>
            <GlowButton variant="secondary" onClick={() => go("preventivo")}>
              Calcola il preventivo
            </GlowButton>
            <GlowButton variant="secondary" onClick={() => go("servizi")}>
              Scopri i servizi
            </GlowButton>
            <GlowButton variant="primary" onClick={() => go("faq")}>
              Leggi le FAQ
            </GlowButton>
          </>
        }
      >
        <p>
          Ottenere l’ordinanza è fondamentale, ma spesso serve la <strong>fase esecutiva</strong> per rendere effettivo il rilascio dell’immobile.
        </p>
        <h2 className="font-serif text-2xl text-white mt-10">Tempistiche</h2>
        <p>In media circa 6 mesi, variabile in base al Tribunale.</p>
        <h2 className="font-serif text-2xl text-white mt-10">Costi</h2>
        <p>Indicativamente {INVARIANTS.execCost}, sempre condivisi prima dell’avvio.</p>
      </ArticleLayout>
    );
  };

  const View = () => {
    switch (route) {
      case "blog-1":
        return <Blog1 />;
      case "blog-2":
        return <Blog2 />;
      case "blog-3":
        return <Blog3 />;
      case "preventivo":
        return (
          <SimplePageShell title="Calcola il preventivo">
            <Preventivo />
            <Contatti />
          </SimplePageShell>
        );
      case "servizi":
        return (
          <SimplePageShell title="Servizi">
            <Servizi />
            <Contatti />
          </SimplePageShell>
        );
      case "blog":
        return (
          <SimplePageShell title="Blog">
            <Blog />
            <Contatti />
          </SimplePageShell>
        );
      case "faq":
        return (
          <SimplePageShell title="FAQ">
            <FAQ />
            <Contatti />
          </SimplePageShell>
        );
      case "contatti":
        return (
          <SimplePageShell title="Contatti">
            <Contatti />
          </SimplePageShell>
        );
      case "home":
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1831] text-white antialiased">
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md border-b border-[#C5A14A]/20">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
          <button onClick={() => go("home")} className="flex items-center gap-3 text-left group" aria-label="Vai alla Home">
            <span className="text-[#C5A14A]">
              <ScalesIcon className="w-6 h-6" />
            </span>
            <span className="font-serif text-2xl tracking-wide group-hover:text-white transition">
              {INVARIANTS.brand}
            </span>
          </button>

          <Nav />

          <HeaderCTA />
        </div>
      </header>

      <div className="pt-0">
        <View />
      </div>
    </div>
  );
}
