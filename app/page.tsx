"use client";

import React, { useMemo, useState } from "react";

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function GlassButton({
  label,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
}: {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full px-6 sm:px-8 py-3 text-xs sm:text-sm uppercase tracking-[0.22em] transition",
        "backdrop-blur-xl border shadow-[0_14px_44px_rgba(0,0,0,0.25)]",
        disabled && "opacity-60 cursor-not-allowed",
        variant === "primary"
          ? "bg-[#B8A07E] text-[#1b1b1b] border-[#B8A07E]/60 hover:brightness-105"
          : "bg-white/10 text-white border-white/20 hover:bg-white/15"
      )}
    >
      {label}
    </button>
  );
}

function Section({
  id,
  tone = "ivory",
  children,
}: {
  id?: string;
  tone?: "ivory" | "lagoon";
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden py-16 sm:py-20 md:py-24",
        tone === "lagoon" ? "bg-[#1A3B4A] text-[#F8F5EF]" : "bg-[#F8F5EF] text-[#2C2C2C]"
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">{children}</div>
    </section>
  );
}

function TopNav({ onGo }: { onGo: (id: string) => void }) {
  const [open, setOpen] = useState(false);

  const Item = ({ id, label, primary }: { id: string; label: string; primary?: boolean }) => (
    <button
      type="button"
      onClick={() => {
        setOpen(false);
        onGo(id);
      }}
      className={cn(
        "rounded-xl md:rounded-full px-4 py-3 md:py-2 text-sm md:text-base uppercase tracking-[0.18em] transition",
        primary
          ? "bg-[#B8A07E]/90 text-[#1b1b1b] hover:bg-[#B8A07E]"
          : "bg-white/5 text-white hover:bg-white/10"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 md:px-8 pt-3 sm:pt-4">
        <div className="rounded-2xl sm:rounded-full border border-white/20 bg-black/30 backdrop-blur-xl px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onGo("home")}
              className="rounded-full px-2 sm:px-3 py-2 text-[12px] sm:text-[13px] uppercase tracking-[0.26em] text-white hover:bg-white/15"
            >
              Sfratto Morosi
            </button>

            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => onGo("servizi")} className="rounded-full px-4 py-2 text-sm tracking-[0.18em] uppercase text-white hover:bg-white/15" type="button">
                Servizi
              </button>
              <button onClick={() => onGo("come-funziona")} className="rounded-full px-4 py-2 text-sm tracking-[0.18em] uppercase text-white hover:bg-white/15" type="button">
                Come funziona
              </button>
              <button onClick={() => onGo("faq")} className="rounded-full px-4 py-2 text-sm tracking-[0.18em] uppercase text-white hover:bg-white/15" type="button">
                FAQ
              </button>
              <button onClick={() => onGo("contatti")} className="rounded-full bg-[#B8A07E]/90 px-4 py-2 text-sm tracking-[0.18em] uppercase text-white hover:bg-[#B8A07E]" type="button">
                Contatti
              </button>
            </div>

            <button
              className="md:hidden rounded-full px-3 py-2 text-[12px] uppercase tracking-[0.22em] text-white border border-white/15 bg-white/5 hover:bg-white/10"
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              {open ? "Chiudi" : "Menu"}
            </button>
          </div>

          <div className={cn("md:hidden overflow-hidden transition-[max-height,opacity] duration-300", open ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
            <div className="mt-3 grid gap-2">
              <Item id="servizi" label="Servizi" />
              <Item id="come-funziona" label="Come funziona" />
              <Item id="faq" label="FAQ" />
              <Item id="contatti" label="Contatti" primary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const bg =
    "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=2400&q=70"; // Venice-ish luxury, puoi cambiare

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) {
      if (id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const features = useMemo(
    () => [
      { t: "Sfratto per morosità", d: "Avvio e gestione pratica con attenzione a tempi, notifiche e udienze." },
      { t: "Recupero crediti", d: "Messa in mora, decreti ingiuntivi e soluzioni progressive orientate al risultato." },
      { t: "Consulenza rapida", d: "Valutazione documenti e strategia: chiara, concreta, senza giri di parole." },
      { t: "Aggiornamenti", d: "Comunicazioni puntuali: sai sempre a che punto è la tua pratica." },
    ],
    []
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const send = async () => {
    try {
      setStatus("sending");
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, city, message: msg }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
    } catch {
      setStatus("err");
    }
  };

  return (
    <div>
      <TopNav onGo={go} />

      {/* HERO */}
      <section id="home" className="relative h-[100svh] w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(1.05)",
            transform: "scale(1.03)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.45) 0%, rgba(26,59,74,0.50) 45%, rgba(0,0,0,0.35) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-black/15" />

        <div className="relative z-10 flex h-full items-center justify-center pt-20 sm:pt-16">
          <div className="mx-auto max-w-5xl px-4 text-center text-white">
            <p className="mb-5 sm:mb-6 text-xs sm:text-sm uppercase tracking-[0.28em] text-white/95">
              Tutela legale · Recupero crediti · Sfratti
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[1.06] tracking-[0.02em] font-serif">
              Soluzioni concrete contro la morosità
            </h1>

            <p className="mx-auto mt-6 sm:mt-7 max-w-3xl text-base sm:text-lg md:text-2xl leading-relaxed text-white/90">
              Un’esperienza “premium”: comunicazione chiara, percorso guidato, e una richiesta contatto immediata.
            </p>

            <div className="mt-9 sm:mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center">
              <GlassButton label="Vedi servizi" onClick={() => go("servizi")} />
              <GlassButton label="Richiedi contatto" variant="ghost" onClick={() => go("contatti")} />
            </div>

            <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-10 text-white/90">
              <div className="text-xs sm:text-sm tracking-[0.18em] uppercase">Velocità</div>
              <div className="hidden sm:block h-4 w-px bg-white/30" />
              <div className="text-xs sm:text-sm tracking-[0.18em] uppercase">Chiarezza</div>
              <div className="hidden sm:block h-4 w-px bg-white/30" />
              <div className="text-xs sm:text-sm tracking-[0.18em] uppercase">Risultato</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 opacity-80">
          <div className="h-12 w-[2px] rounded bg-white/55" />
        </div>
      </section>

      {/* SERVIZI */}
      <Section id="servizi" tone="ivory">
        <h2 className="mx-auto max-w-4xl text-center text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
          Servizi
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-center text-sm md:text-base text-[#2C2C2C]/70">
          Un percorso lineare: analizziamo, proponiamo la strategia, avviamo la procedura e ti aggiorniamo.
        </p>

        <div className="mt-10 grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.t}
              className={cn(
                "relative rounded-2xl border border-black/15 bg-white p-6 sm:p-7",
                "shadow-[0_14px_40px_rgba(0,0,0,0.10)]"
              )}
            >
              <div className="mb-4 h-[2px] w-10 rounded bg-[#B8A07E]/80" />
              <h3 className="text-xl sm:text-2xl text-[#2C2C2C] font-serif">{f.t}</h3>
              <p className="mt-3 text-sm md:text-base leading-relaxed text-[#2C2C2C]/80">{f.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <GlassButton label="Richiedi contatto" onClick={() => go("contatti")} />
        </div>
      </Section>

      {/* COME FUNZIONA */}
      <Section id="come-funziona" tone="ivory">
        <h2 className="mx-auto max-w-4xl text-center text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
          Come funziona
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            { n: "01", t: "Raccolta informazioni", d: "Carichi i dati essenziali. Ti chiediamo solo ciò che serve." },
            { n: "02", t: "Valutazione e strategia", d: "Ti proponiamo il percorso migliore (tempi/costi/alternative)." },
            { n: "03", t: "Avvio e aggiornamenti", d: "Procedura avviata e comunicazioni puntuali sullo stato." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
              <div className="text-xs uppercase tracking-[0.28em] text-[#2C2C2C]/60">{s.n}</div>
              <div className="mt-3 text-2xl font-serif">{s.t}</div>
              <p className="mt-3 text-sm md:text-base text-[#2C2C2C]/75 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" tone="ivory">
        <h2 className="mx-auto max-w-4xl text-center text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
          FAQ
        </h2>

        <div className="mt-10 mx-auto max-w-3xl grid gap-3">
          {[
            { q: "Quanto tempo ci vuole?", a: "Dipende dal caso e dal tribunale. Ti diamo una stima realistica dopo l’analisi." },
            { q: "Posso iniziare anche se mancano documenti?", a: "Sì. Intanto raccogliamo le informazioni e ti guidiamo su cosa serve." },
            { q: "Quanto costa?", a: "Dipende dal percorso. Ti proponiamo una soluzione trasparente e scalabile." },
          ].map((x) => (
            <details key={x.q} className="rounded-2xl border border-black/10 bg-white/70 p-5 shadow-[0_12px_34px_rgba(0,0,0,0.06)]">
              <summary className="cursor-pointer text-sm md:text-base uppercase tracking-[0.18em] text-[#2C2C2C]">
                {x.q}
              </summary>
              <p className="mt-3 text-sm md:text-base text-[#2C2C2C]/75 leading-relaxed">{x.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* CONTATTI / FORM */}
      <Section id="contatti" tone="lagoon">
        <h2 className="mx-auto max-w-4xl text-center text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
          Contatti
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-sm md:text-base text-[#F8F5EF]/75">
          Invia la richiesta: ti rispondiamo il prima possibile.
        </p>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="rounded-2xl border border-white/15 bg-black/20 p-5 sm:p-6 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.25)] md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <div className="text-xs uppercase tracking-[0.22em] text-[#F8F5EF]/70">Nome e cognome</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-[#F8F5EF] placeholder:text-[#F8F5EF]/40 outline-none focus:border-[#B8A07E]/60"
                  placeholder="Mario Rossi"
                />
              </label>

              <label className="space-y-2">
                <div className="text-xs uppercase tracking-[0.22em] text-[#F8F5EF]/70">Email</div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-[#F8F5EF] placeholder:text-[#F8F5EF]/40 outline-none focus:border-[#B8A07E]/60"
                  placeholder="nome@email.com"
                  type="email"
                />
              </label>

              <label className="space-y-2">
                <div className="text-xs uppercase tracking-[0.22em] text-[#F8F5EF]/70">Telefono (opzionale)</div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-[#F8F5EF] placeholder:text-[#F8F5EF]/40 outline-none focus:border-[#B8A07E]/60"
                  placeholder="+39 ..."
                />
              </label>

              <label className="space-y-2">
                <div className="text-xs uppercase tracking-[0.22em] text-[#F8F5EF]/70">Città / Provincia</div>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-[#F8F5EF] placeholder:text-[#F8F5EF]/40 outline-none focus:border-[#B8A07E]/60"
                  placeholder="Es. Milano"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <div className="text-xs uppercase tracking-[0.22em] text-[#F8F5EF]/70">Messaggio</div>
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="min-h-[140px] w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-[#F8F5EF] placeholder:text-[#F8F5EF]/40 outline-none focus:border-[#B8A07E]/60"
                  placeholder="Descrivi la situazione in breve..."
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="text-xs tracking-[0.12em] text-[#F8F5EF]/60">
                Invio diretto dal sito. Ti rispondiamo appena possibile.
              </div>

              <GlassButton
                label={status === "sending" ? "Invio..." : "Invia richiesta"}
                type="button"
                onClick={send}
                disabled={status === "sending"}
              />
            </div>

            {status === "ok" ? (
              <div className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-sm text-white/90">
                Richiesta inviata. Ti ricontattiamo a breve.
              </div>
            ) : null}
            {status === "err" ? (
              <div className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-sm text-white/90">
                Errore invio. Riprova.
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <GlassButton label="Torna su" variant="ghost" onClick={() => go("home")} />
        </div>

        <p className="mx-auto mt-7 max-w-2xl text-center text-xs uppercase tracking-[0.28em] text-[#F8F5EF]/55">
          Quiet luxury · Italia · Legale
        </p>
      </Section>
    </div>
  );
}
