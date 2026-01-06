"use client";

import { useState } from "react";

export default function ContattiPage() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setOk(null);

    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);

    setLoading(false);
    setOk(!!res && res.ok);
    if (res?.ok) e.currentTarget.reset();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-14">
      <div className="bg-[#0E1F3D]/80 backdrop-blur rounded-3xl p-10 md:p-14 border border-white/10 shadow-2xl">
        <h1 className="font-serif text-4xl mb-6 text-center">Richiedi una consulenza gratuita</h1>
        <p className="text-white/70 text-lg mb-10 text-center">
          Ti ricontattiamo per valutare il percorso migliore.
        </p>

        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-6">
          <input name="nome" placeholder="Nome" className="bg-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C5A14A]/40" />
          <input name="cognome" placeholder="Cognome" className="bg-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C5A14A]/40" />
          <input name="email" placeholder="Email" className="bg-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C5A14A]/40" />
          <input name="telefono" placeholder="Telefono" className="bg-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C5A14A]/40" />
          <textarea
            name="messaggio"
            placeholder="Descrizione (mensilità arretrate, tipo immobile, città)"
            className="md:col-span-2 bg-white/10 rounded-xl px-5 py-4 h-32 focus:outline-none focus:ring-2 focus:ring-[#C5A14A]/40"
          />
          <button
            disabled={loading}
            className="md:col-span-2 bg-[#C5A14A] text-black px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition disabled:opacity-60"
          >
            {loading ? "Invio..." : "Invia richiesta"}
          </button>
        </form>

        {ok === true && <p className="mt-6 text-center text-white/70">Richiesta inviata ✅</p>}
        {ok === false && <p className="mt-6 text-center text-red-300">Errore invio ❌</p>}
      </div>
    </div>
  );
}
