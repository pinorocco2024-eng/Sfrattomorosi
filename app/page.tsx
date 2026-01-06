"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------
   Motion tokens (stile "canvas")
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
      when: "beforeChildren" as const,
      staggerChildren: 0.10,
    },
  },
};

const cardIn = {
  hidden: { y: 22, opacity: 0, scale: 0.985 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.65, ease: easeIgloo } },
};

const clipReveal = {
  hidden: { clipPath: "inset(0% 100% 0% 0%)" },
  visible: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.0, ease: easeIgloo } },
};

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------
   Visual helpers (noise / glow / grid)
------------------------------------------------------------ */
function SoftNoise() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 4px)",
      }}
    />
  );
}

function BlueGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.20]"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    />
  );
}

function GlowBlob({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute blur-3xl opacity-40",
        className
      )}
      style={{
        background:
          "radial-gradient(circle at 30% 30%, rgba(120, 200, 255, 0.55) 0%, rgba(80, 150, 255, 0.25) 40%, rgba(0,0,0,0) 70%)",
      }}
    />
  );
}

/* ------------------------------------------------------------
   Sticky section spy
------------------------------------------------------------ */
function useSectionSpy(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0] || "home");

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("IntersectionObserver" in window)) return;

    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        // prendi quello più visibile
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) setActive(visible.target.id);
      },
      {
        root: null,
        threshold: [0.15, 0.25, 0.35, 0.5, 0.65],
        rootMargin: "-20% 0px -65% 0px",
      }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sectionIds]);

  return active;
}

/* ------------------------------------------------------------
   UI primitives (glass, section)
------------------------------------------------------------ */
function GlassButton({
  label,
  variant = "primary",
  onClick,
}: {
  label: string;
  variant?: "primary" | "ghost";
  onClick?: () => void;
}) {
  const primary =
    "bg-white text-[#0B2C5A] hover:bg-white/95 shadow-[0_18px_55px_rgba(0,0,0,0.22)]";
  const ghost =
    "bg-white/10 text-white border border-white/25 hover:bg-white/15";
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "rounded-full px-7 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-sm md:text-base uppercase tracking-[0.20em]",
        "backdrop-blur-xl transition",
        variant === "primary" ? primary : ghost
      )}
      type="button"
    >
      {label}
    </motion.button>
  );
}

function SectionShell({
  id,
  tone = "blue",
  children,
}: {
  id: string;
  tone?: "blue" | "light";
  children: React.ReactNode;
}) {
  const blue = "bg-[#0B4FAE] text-white";
  const light = "bg-[#F6FAFF] text-[#0B2C5A]";
  return (
    <section id={id} className={cn("relative overflow-hidden py-16 sm:py-20 md:py-28", tone === "blue" ? blue : light)}>
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">{children}</div>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] sm:text-xs uppercase tracking-[0.22em] text-white/90 backdrop-blur-xl">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------
   TopNav (sticky, canvas-like)
------------------------------------------------------------ */
function TopNav({
  active,
  onGo,
}: {
  active: string;
  onGo: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const items = [
    { id: "home", label: "Home" },
    { id: "come-funziona", label: "Come funziona" },
    { id: "servizi", label: "Servizi" },
    { id: "preventivo", label: "Preventivo" },
    { id: "faq", label: "FAQ" },
    { id: "contatti", label: "Contatti" },
  ];

  const go = (id: string) => {
    setOpen(false);
    onGo(id);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 md:px-8 pt-3 sm:pt-4">
        <div className="rounded-2xl sm:rounded-full border border-white/20 bg-black/25 backdrop-blur-xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-[0_18px_55px_rgba(0,0,0,0.22)]">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => go("home")}
              className="rounded-full px-3 py-2 text-[12px] sm:text-[13px] md:text-[14px] uppercase tracking-[0.26em] text-white hover:bg-white/10 transition"
              aria-label="Vai a inizio"
              type="button"
            >
              Sfratto Morosi
            </button>

            <div className="hidden md:flex items-center gap-2">
              {items.slice(1, -1).map((it) => (
                <button
                  key={it.id}
                  onClick={() => go(it.id)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm md:text-base tracking-[0.18em] uppercase transition",
                    active === it.id ? "bg-white/18 text-white" : "text-white/90 hover:bg-white/10"
                  )}
                  type="button"
                >
                  {it.label}
                </button>
              ))}
              <button
                onClick={() => go("contatti")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm md:text-base tracking-[0.18em] uppercase transition",
                  active === "contatti"
                    ? "bg-white text-[#0B2C5A]"
                    : "bg-white/90 text-[#0B2C5A] hover:bg-white"
                )}
                type="button"
              >
                Contatti
              </button>
            </div>

            <button
              className="md:hidden rounded-full px-3 py-2 text-[12px] uppercase tracking-[0.22em] text-white border border-white/15 bg-white/5 hover:bg-white/10 transition"
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Apri menu"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>

          <div className={cn("md:hidden overflow-hidden transition-[max-height,opacity] duration-300", open ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
            <div className="mt-3 grid gap-2">
              {items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => go(it.id)}
                  className={cn(
                    "w-full rounded-xl px-4 py-3 text-sm tracking-[0.18em] uppercase transition",
                    active === it.id ? "bg-white/18 text-white" : "bg-white/5 text-white hover:bg-white/10"
                  )}
                  type="button"
                >
                  {it.label}
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
   Page content (copy + sections)
------------------------------------------------------------ */
type Stat = { k: string; v: string; note: string };

export default function Page() {
  const sectionIds = useMemo(
    () => ["home", "come-funziona", "servizi", "preventivo", "faq", "contatti"],
    []
  );

  const active = useSectionSpy(sectionIds);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) {
      if (id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const stats: Stat[] = useMemo(
    () => [
      { k: "Costo indicativo", v: "€ 1300", note: "Chiaro e coerente" },
      { k: "Ordinanza", v: "~90 giorni", note: "In media" },
      { k: "Esperienza", v: "10+ anni", note: "Pratiche seguite" },
      { k: "Casi gestiti", v: "100+", note: "Storico reale" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[#0B4FAE] text-white">
      <TopNav active={active} onGo={go} />

      {/* HERO */}
      <motion.section
        id="home"
        className="relative overflow-hidden pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20"
        variants={sectionFade}
        initial="hidden"
        animate="visible"
      >
        <BlueGrid />
        <GlowBlob className="left-[-120px] top-[-120px] h-[380px] w-[380px]" />
        <GlowBlob className="right-[-140px] top-[40px] h-[420px] w-[420px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/20" />
        <SoftNoise />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-8">
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <Pill>Recupero immobile</Pill>
            <Pill>Procedura guidata</Pill>
            <Pill>Supporto legale</Pill>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14 items-center">
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.06] tracking-[0.02em]">
                Sfratto per morosità,
                <span className="block text-white/90">senza confusione.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base sm:text-lg md:text-xl leading-relaxed text-white/85">
                Un percorso <b>chiaro</b> per proprietari e agenzie: analisi del caso,
                deposito atti, udienza, esecuzione e riconsegna dell’immobile.
                Con tempi stimati e costi trasparenti.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <GlassButton label="Richiedi consulenza" variant="primary" onClick={() => go("contatti")} />
                <GlassButton label="Vedi come funziona" variant="ghost" onClick={() => go("come-funziona")} />
              </div>

              <div className="mt-10 flex flex-wrap gap-3 text-xs sm:text-sm uppercase tracking-[0.22em] text-white/70">
                <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-xl">
                  Risposta rapida
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-xl">
                  Documenti guidati
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-xl">
                  Follow-up continuo
                </span>
              </div>
            </div>

            {/* HERO CARD */}
            <motion.div variants={clipReveal} className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_22px_70px_rgba(0,0,0,0.28)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
              <SoftNoise />

              <div className="relative p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.26em] text-white/75">
                      Stima rapida
                    </div>
                    <div className="mt-2 text-2xl sm:text-3xl font-serif">
                      Inizia in 2 minuti
                    </div>
                  </div>
                  <div className="h-11 w-11 rounded-2xl border border-white/20 bg-white/10" />
                </div>

                <div className="mt-6 grid gap-3">
                  <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/70">
                      Caso
                    </div>
                    <div className="mt-2 text-sm sm:text-base text-white/90">
                      Morosità + recupero immobile + documenti
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-white/70">
                        Priorità
                      </div>
                      <div className="mt-2 text-sm sm:text-base text-white/90">
                        Alta (affitto fermo)
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-white/70">
                        Azione
                      </div>
                      <div className="mt-2 text-sm sm:text-base text-white/90">
                        Consulenza + strategia
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/70">
                      Output
                    </div>
                    <div className="mt-2 text-sm sm:text-base text-white/90">
                      Piano operativo con tempi indicativi e prossimi step.
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <GlassButton label="Vai al preventivo" variant="primary" onClick={() => go("preventivo")} />
                  <GlassButton label="FAQ" variant="ghost" onClick={() => go("faq")} />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* STATS */}
          <motion.div variants={fadeUp} className="mt-14 sm:mt-16 grid gap-4 sm:gap-6 md:grid-cols-4">
            {stats.map((s, idx) => (
              <motion.div
                key={idx}
                variants={cardIn}
                className={cn(
                  "relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-6",
                  "backdrop-blur-xl shadow-[0_16px_55px_rgba(0,0,0,0.22)]"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/25" />
                <SoftNoise />
                <div className="relative">
                  <div className="text-[11px] uppercase tracking-[0.26em] text-white/75">{s.k}</div>
                  <div className="mt-3 text-2xl sm:text-3xl font-serif text-white">{s.v}</div>
                  <div className="mt-2 text-sm text-white/80">{s.note}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          aria-hidden
          className="absolute bottom-6 sm:bottom-8 left-1/2 z-10 -translate-x-1/2"
          animate={{ y: [0, 10, 0], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity }}
        >
          <div className="h-10 sm:h-12 w-[2px] rounded bg-white/55" />
        </motion.div>
      </motion.section>

      {/* COME FUNZIONA */}
      <SectionShell id="come-funziona" tone="light">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-15%" }} variants={sectionFade}>
          <motion.h2 variants={fadeUp} className="text-center font-serif text-3xl sm:text-4xl md:text-5xl text-[#0B2C5A]">
            Come funziona (davvero)
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-3xl text-center text-sm sm:text-base md:text-lg text-[#0B2C5A]/75">
            Ti guidiamo dall’analisi iniziale fino alla riconsegna dell’immobile.
            Ogni step ha uno scopo: ridurre tempi morti, errori e ansia.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "Step 1",
                title: "Analisi del caso",
                text: "Raccogliamo dati e documenti, verifichiamo contratto, morosità e obiettivo. Ti diciamo cosa serve davvero.",
              },
              {
                step: "Step 2",
                title: "Strategia & tempi",
                text: "Definiamo il percorso migliore e la timeline. Ti spieghiamo cosa aspettarti, senza promesse irreali.",
              },
              {
                step: "Step 3",
                title: "Deposito & udienza",
                text: "Preparazione atti e gestione procedure. Tu resti aggiornato: stato pratica, scadenze, prossimi passaggi.",
              },
              {
                step: "Step 4",
                title: "Esecuzione",
                text: "Seguiamo fino alla fase esecutiva e alla riconsegna dell’immobile. Supporto pratico e operativo.",
              },
            ].map((c, idx) => (
              <motion.div
                key={idx}
                variants={cardIn}
                className="relative rounded-3xl border border-[#0B2C5A]/10 bg-white p-6 sm:p-7 shadow-[0_14px_40px_rgba(0,0,0,0.10)]"
              >
                <div className="mb-4 h-[2px] w-10 rounded bg-[#0B4FAE]" />
                <div className="text-[11px] uppercase tracking-[0.26em] text-[#0B2C5A]/60">{c.step}</div>
                <div className="mt-2 font-serif text-xl sm:text-2xl text-[#0B2C5A]">{c.title}</div>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#0B2C5A]/75">{c.text}</p>
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition-all hover:ring-[#0B4FAE]/25" />
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 flex justify-center">
            <button
              onClick={() => go("preventivo")}
              className="rounded-full bg-[#0B4FAE] px-8 py-4 text-xs sm:text-sm uppercase tracking-[0.22em] text-white shadow-[0_16px_40px_rgba(0,0,0,0.20)] hover:opacity-95 transition"
              type="button"
            >
              Richiedi un preventivo
            </button>
          </motion.div>
        </motion.div>
      </SectionShell>

      {/* SERVIZI */}
      <SectionShell id="servizi" tone="blue">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-15%" }} variants={sectionFade}>
          <motion.h2 variants={fadeUp} className="text-center font-serif text-3xl sm:text-4xl md:text-5xl">
            Servizi
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-3xl text-center text-sm sm:text-base md:text-lg text-white/80">
            Una struttura chiara: scegli il percorso giusto e sai cosa include.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Sfratto per morosità",
                subtitle: "Percorso completo",
                points: ["Analisi documenti", "Procedura e gestione scadenze", "Aggiornamenti costanti", "Supporto fino alla riconsegna"],
              },
              {
                title: "Recupero crediti",
                subtitle: "Quando serve",
                points: ["Valutazione recuperabilità", "Strategia esecutiva", "Riduzione tempi morti", "Approccio realistico"],
              },
              {
                title: "Prevenzione morosità",
                subtitle: "Per proprietari & agenzie",
                points: ["Check contrattuale", "Clausole e garanzie", "Modello documentale", "Processo operativo"],
              },
            ].map((s, idx) => (
              <motion.div
                key={idx}
                variants={cardIn}
                className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_18px_55px_rgba(0,0,0,0.22)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/25" />
                <SoftNoise />
                <div className="relative p-6 sm:p-7">
                  <div className="text-[11px] uppercase tracking-[0.26em] text-white/70">{s.subtitle}</div>
                  <div className="mt-2 font-serif text-2xl sm:text-3xl">{s.title}</div>
                  <div className="mt-5 grid gap-2">
                    {s.points.map((p, i) => (
                      <div key={i} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <span className="mt-[2px] inline-block h-2.5 w-2.5 rounded-full bg-white/70" />
                        <span className="text-sm sm:text-base text-white/85">{p}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-start">
                    <GlassButton label="Parliamone" variant="primary" onClick={() => go("contatti")} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </SectionShell>

      {/* PREVENTIVO */}
      <SectionShell id="preventivo" tone="light">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-15%" }} variants={sectionFade}>
          <motion.h2 variants={fadeUp} className="text-center font-serif text-3xl sm:text-4xl md:text-5xl text-[#0B2C5A]">
            Preventivo chiaro
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-3xl text-center text-sm sm:text-base md:text-lg text-[#0B2C5A]/75">
            Niente fumo: ti diciamo cosa include, cosa no, e come partire nel modo giusto.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 grid gap-6 lg:grid-cols-2 items-start">
            <motion.div variants={cardIn} className="rounded-3xl border border-[#0B2C5A]/10 bg-white p-6 sm:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.10)]">
              <div className="text-[11px] uppercase tracking-[0.26em] text-[#0B2C5A]/60">Pacchetto</div>
              <div className="mt-2 font-serif text-2xl sm:text-3xl text-[#0B2C5A]">Sfratto Morosità</div>

              <div className="mt-6 flex items-end gap-3">
                <div className="font-serif text-4xl text-[#0B2C5A]">€ 1300</div>
                <div className="pb-2 text-sm text-[#0B2C5A]/65">indicativo • in base al caso</div>
              </div>

              <div className="mt-6 grid gap-2">
                {[
                  "Analisi iniziale e checklist documenti",
                  "Impostazione pratica e calendario scadenze",
                  "Assistenza operativa (step-by-step)",
                  "Aggiornamenti e coordinamento",
                ].map((p, i) => (
                  <div key={i} className="flex gap-3 rounded-2xl border border-[#0B2C5A]/10 bg-[#F6FAFF] px-4 py-3">
                    <span className="mt-[3px] inline-block h-2.5 w-2.5 rounded-full bg-[#0B4FAE]" />
                    <span className="text-sm sm:text-base text-[#0B2C5A]/80">{p}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => go("contatti")}
                  className="rounded-full bg-[#0B4FAE] px-8 py-4 text-xs sm:text-sm uppercase tracking-[0.22em] text-white shadow-[0_16px_40px_rgba(0,0,0,0.18)] hover:opacity-95 transition"
                  type="button"
                >
                  Richiedi preventivo
                </button>
                <button
                  onClick={() => go("faq")}
                  className="rounded-full border border-[#0B2C5A]/20 bg-white px-8 py-4 text-xs sm:text-sm uppercase tracking-[0.22em] text-[#0B2C5A] hover:bg-[#F6FAFF] transition"
                  type="button"
                >
                  Leggi FAQ
                </button>
              </div>
            </motion.div>

            <motion.div variants={cardIn} className="relative overflow-hidden rounded-3xl border border-[#0B2C5A]/10 bg-white p-6 sm:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.10)]">
              <div className="text-[11px] uppercase tracking-[0.26em] text-[#0B2C5A]/60">Cosa ti serve</div>
              <div className="mt-2 font-serif text-2xl sm:text-3xl text-[#0B2C5A]">Per partire bene</div>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#0B2C5A]/75">
                Preparare bene il caso evita ritardi. Se non hai tutto, nessun problema:
                ti diciamo cosa manca e come recuperarlo.
              </p>

              <div className="mt-6 grid gap-3">
                {[
                  { t: "Contratto", d: "Versione firmata + eventuali rinnovi" },
                  { t: "Morosità", d: "Mensilità non pagate + prove (estratti, ricevute)" },
                  { t: "Comunicazioni", d: "WhatsApp, email, raccomandate (se presenti)" },
                  { t: "Obiettivo", d: "Recupero immobile / anche crediti?" },
                ].map((x, i) => (
                  <div key={i} className="rounded-2xl border border-[#0B2C5A]/10 bg-[#F6FAFF] px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-[#0B2C5A]/60">{x.t}</div>
                    <div className="mt-2 text-sm sm:text-base text-[#0B2C5A]/80">{x.d}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-[#0B4FAE]/20 bg-[#0B4FAE]/5 px-4 py-4">
                <div className="text-xs uppercase tracking-[0.22em] text-[#0B2C5A]/70">
                  Nota
                </div>
                <div className="mt-2 text-sm text-[#0B2C5A]/80">
                  I tempi dipendono da tribunale e caso. Qui troverai stime realistiche, non marketing.
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </SectionShell>

      {/* FAQ */}
      <SectionShell id="faq" tone="blue">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-15%" }} variants={sectionFade}>
          <motion.h2 variants={fadeUp} className="text-center font-serif text-3xl sm:text-4xl md:text-5xl">
            FAQ
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-3xl text-center text-sm sm:text-base md:text-lg text-white/80">
            Le domande che bloccano più spesso i proprietari. Risposte chiare.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 grid gap-4">
            <FaqItem q="Quanto dura uno sfratto per morosità?" a="Dipende dal tribunale e dalla completezza dei documenti. Una stima media può essere ~90 giorni per arrivare a provvedimenti iniziali, ma la fase esecutiva può variare." />
            <FaqItem q="Posso avviare la procedura se ho documenti incompleti?" a="Sì: si può partire con una checklist. Prima mettiamo ordine, poi impostiamo il percorso migliore per evitare blocchi e rinvii." />
            <FaqItem q="Il costo è fisso?" a="No: €1300 è indicativo e dipende dalla complessità. L’obiettivo è darti una struttura chiara e prevedibile, evitando sorprese." />
            <FaqItem q="Cosa succede nella fase esecutiva?" a="È la fase in cui si arriva alla riconsegna dell’immobile. Qui serve coordinamento, tempi corretti, e supporto operativo per non perdere settimane inutili." />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 flex justify-center">
            <GlassButton label="Parla con noi" variant="primary" onClick={() => go("contatti")} />
          </motion.div>
        </motion.div>
      </SectionShell>

      {/* CONTATTI */}
      <SectionShell id="contatti" tone="light">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-15%" }} variants={sectionFade}>
          <motion.h2 variants={fadeUp} className="text-center font-serif text-3xl sm:text-4xl md:text-5xl text-[#0B2C5A]">
            Contatti
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-3xl text-center text-sm sm:text-base md:text-lg text-[#0B2C5A]/75">
            Scrivici i dettagli essenziali: ti rispondiamo con i prossimi step.
          </motion.p>

          <motion.div variants={fadeUp} className="mx-auto mt-10 max-w-3xl">
            <ContactCard />
          </motion.div>

          <motion.p variants={fadeUp} className="mx-auto mt-8 max-w-2xl text-center text-xs uppercase tracking-[0.28em] text-[#0B2C5A]/55">
            Sfratto Morosi · Procedura guidata · Recupero immobile
          </motion.p>
        </motion.div>
      </SectionShell>
    </div>
  );
}

/* ------------------------------------------------------------
   FAQ item (accordion glass)
------------------------------------------------------------ */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_16px_55px_rgba(0,0,0,0.22)] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-5 sm:px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition"
        type="button"
      >
        <div className="font-serif text-lg sm:text-xl text-white">{q}</div>
        <div className={cn("h-9 w-9 rounded-2xl border border-white/15 bg-white/5 grid place-items-center transition", open ? "rotate-45" : "")}>
          <span className="text-white text-xl leading-none">+</span>
        </div>
      </button>
      <div className={cn("px-5 sm:px-6 transition-[max-height,opacity] duration-300", open ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0")}>
        <p className="text-sm sm:text-base leading-relaxed text-white/85">{a}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   Contact card (client-side)
   NOTE: qui non sto chiamando l'API lead perché nel tuo repo
   ci sono stati errori di tipizzazione. È un form "ready",
   e quando vuoi lo agganciamo a /api/lead.
------------------------------------------------------------ */
function ContactCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [months, setMonths] = useState("1");
  const [msg, setMsg] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const onSend = async () => {
    try {
      setStatus("sending");

      // Se vuoi agganciarlo alla tua API:
      // const res = await fetch("/api/lead", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({...}) })
      // if (!res.ok) throw new Error("send failed");

      // Per adesso simulazione (così non rompe build se API non è pronta)
      await new Promise((r) => setTimeout(r, 700));

      setStatus("ok");
    } catch {
      setStatus("err");
    }
  };

  return (
    <div className="rounded-3xl border border-[#0B2C5A]/10 bg-white p-6 sm:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.10)]">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <div className="text-xs uppercase tracking-[0.22em] text-[#0B2C5A]/60">Nome</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-[#0B2C5A]/15 bg-[#F6FAFF] px-4 py-3 text-[#0B2C5A] outline-none focus:border-[#0B4FAE]/50"
            placeholder="Mario Rossi"
          />
        </label>

        <label className="space-y-2">
          <div className="text-xs uppercase tracking-[0.22em] text-[#0B2C5A]/60">Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-[#0B2C5A]/15 bg-[#F6FAFF] px-4 py-3 text-[#0B2C5A] outline-none focus:border-[#0B4FAE]/50"
            placeholder="nome@email.com"
            type="email"
          />
        </label>

        <label className="space-y-2">
          <div className="text-xs uppercase tracking-[0.22em] text-[#0B2C5A]/60">Telefono</div>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-2xl border border-[#0B2C5A]/15 bg-[#F6FAFF] px-4 py-3 text-[#0B2C5A] outline-none focus:border-[#0B4FAE]/50"
            placeholder="+39 ..."
          />
        </label>

        <label className="space-y-2">
          <div className="text-xs uppercase tracking-[0.22em] text-[#0B2C5A]/60">Città / Tribunale</div>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-2xl border border-[#0B2C5A]/15 bg-[#F6FAFF] px-4 py-3 text-[#0B2C5A] outline-none focus:border-[#0B4FAE]/50"
            placeholder="Es. Milano"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <div className="text-xs uppercase tracking-[0.22em] text-[#0B2C5A]/60">Da quanti mesi è moroso?</div>
          <select
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            className="w-full rounded-2xl border border-[#0B2C5A]/15 bg-[#F6FAFF] px-4 py-3 text-[#0B2C5A] outline-none focus:border-[#0B4FAE]/50"
          >
            {["1", "2", "3", "4", "5", "6+", "12+"].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 md:col-span-2">
          <div className="text-xs uppercase tracking-[0.22em] text-[#0B2C5A]/60">Messaggio</div>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="min-h-[120px] w-full rounded-2xl border border-[#0B2C5A]/15 bg-[#F6FAFF] px-4 py-3 text-[#0B2C5A] outline-none focus:border-[#0B4FAE]/50"
            placeholder="Descrivi la situazione: contratto, importo, comunicazioni, obiettivo..."
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-xs tracking-[0.12em] text-[#0B2C5A]/55">
          Invio dal sito (quando agganciamo l’API /api/lead, sarà reale).
        </div>

        <motion.button
          onClick={onSend}
          disabled={status === "sending"}
          whileHover={{ scale: status === "sending" ? 1 : 1.02 }}
          whileTap={{ scale: status === "sending" ? 1 : 0.99 }}
          className={cn(
            "rounded-full bg-[#0B4FAE] px-8 py-4 text-xs sm:text-sm uppercase tracking-[0.22em] text-white shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition",
            status === "sending" ? "opacity-70 cursor-not-allowed" : "hover:opacity-95"
          )}
          type="button"
        >
          {status === "sending" ? "Invio…" : "Invia richiesta"}
        </motion.button>
      </div>

      {status === "ok" ? (
        <div className="mt-4 rounded-2xl border border-[#0B4FAE]/20 bg-[#0B4FAE]/5 px-4 py-3 text-sm text-[#0B2C5A]">
          Richiesta inviata (demo). Quando vuoi lo colleghiamo alla tua API reale.
        </div>
      ) : null}

      {status === "err" ? (
        <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-[#0B2C5A]">
          Errore invio. Riprova.
        </div>
      ) : null}
    </div>
  );
}
