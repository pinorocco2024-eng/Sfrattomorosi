"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; text: string };

type Cfg = {
  brand: string;
  welcome: string;
  placeholder: string;
  button: string;
};

const DEFAULT_CFG: Cfg = {
  brand: "Assistenza",
  welcome: "Ciao! Come posso aiutarti?",
  placeholder: "Scrivi qui…",
  button: "Invia",
};

function getCfg(hostname: string): Cfg {
  const host = (hostname || "").toLowerCase();

  // IT domains
  if (host.includes("sfrattomorosi.it")) {
    // se vuoi distinguere i due, lo facciamo dopo. Per ora IT ok.
    const isDolce = host.includes("ladolcesosta.it");
    return {
      brand: isDolce ? "La Dolce Sosta" : "Residenza a Venezia",
      welcome: isDolce
        ? "Ciao! Benvenuto su La Dolce Sosta. Posso rispondere a domande utili sul sito."
        : "Ciao! Benvenuto su Residenza a Venezia. Posso rispondere a domande utili sul sito.",
      placeholder: "Scrivi qui…",
      button: "Invia",
    };
  }

  // default (vercel preview o altri domini)
  return {
    brand: "La Dolce Sosta",
    welcome: "Ciao! Benvenuto. Posso rispondere a domande utili sul sito.",
    placeholder: "Scrivi qui…",
    button: "Invia",
  };
}

export default function ChatWidget() {
  const [open, setOpen] = useState(true);

  // hydration-safe: stesso contenuto server/client al primo render
  const [cfg, setCfg] = useState<Cfg>(DEFAULT_CFG);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: DEFAULT_CFG.welcome },
  ]);

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  // dopo mount (solo client) settiamo il dominio
  useEffect(() => {
    const c = getCfg(window.location.hostname);
    setCfg(c);
    setMsgs([{ role: "assistant", text: c.welcome }]);
  }, []);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  async function send() {
    const message = input.trim();
    if (!message || busy) return;

    setMsgs((m) => [...m, { role: "user", text: message }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Errore");

      setMsgs((m) => [...m, { role: "assistant", text: json.text || "Ok." }]);
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          text:
            cfg.brand === "House in Venice"
              ? "Sorry — something went wrong. Please try again."
              : "Ops — c’è stato un problema. Riprova tra poco.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Bottone in basso a destra */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[999999] rounded-full bg-[#1A3B4A] px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-[#F8F5EF] shadow-[0_18px_50px_rgba(0,0,0,0.25)] hover:opacity-95"
        type="button"
        aria-label="Apri chat"
      >
        {open ? (cfg.brand === "House in Venice" ? "Close" : "Chiudi") : "Chat"}
      </button>

      {/* Finestra chat */}
      {open && (
        <div className="fixed bottom-20 right-5 z-[999999] w-[92vw] max-w-sm overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.20)]">
          <div className="flex items-center justify-between bg-[#1A3B4A] px-4 py-3">
            <div className="text-[12px] uppercase tracking-[0.22em] text-[#F8F5EF]">
              {cfg.brand}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full bg-white/10 px-3 py-1 text-xs text-[#F8F5EF]"
              type="button"
              aria-label="Chiudi"
            >
              ✕
            </button>
          </div>

          <div className="max-h-[55vh] space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto w-fit max-w-[85%] rounded-2xl bg-[#B8A07E] px-4 py-3 text-sm text-[#2C2C2C]"
                    : "w-fit max-w-[85%] rounded-2xl bg-black/5 px-4 py-3 text-sm text-[#2C2C2C]"
                }
              >
                {m.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2 border-t border-black/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
              placeholder={cfg.placeholder}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[#B8A07E]"
              disabled={busy}
            />
            <button
              onClick={send}
              className="rounded-xl bg-[#1A3B4A] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#F8F5EF] disabled:opacity-60"
              disabled={busy}
              type="button"
            >
              {busy ? "..." : cfg.button}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
