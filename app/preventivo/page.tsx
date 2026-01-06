"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const BASE = 1300;
const EXEC = 1200;

export default function PreventivoPage() {
  const [mensilita, setMensilita] = useState<number>(3);
  const [faseEsecutiva, setFaseEsecutiva] = useState<boolean>(false);

  const totale = useMemo(() => {
    return BASE + (faseEsecutiva ? EXEC : 0);
  }, [faseEsecutiva]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-serif text-4xl md:text-5xl mb-10 text-center"
      >
        Calcola il preventivo
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="text-white/75 text-lg leading-relaxed space-y-4">
          <p>
            Stima semplice e trasparente. <span className="text-white/50">Tempi e costi indicativi.</span>
          </p>
          <ul className="space-y-2">
            <li>• Ordinanza: <strong>~90 giorni</strong></li>
            <li>• Base: <strong>€ 1.300</strong></li>
            <li>• Esecutiva (se necessaria): <strong>€ 1.200,00</strong></li>
          </ul>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <label className="block text-sm text-white/70 mb-2">Mensilità non pagate</label>
          <input
            type="number"
            min={1}
            value={mensilita}
            onChange={(e) => setMensilita(Math.max(1, Number(e.target.value || 1)))}
            className="w-full bg-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C5A14A]/40"
          />

          <div className="mt-6 flex items-center gap-3">
            <input
              id="exec"
              type="checkbox"
              checked={faseEsecutiva}
              onChange={(e) => setFaseEsecutiva(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="exec" className="text-white/80">
              Includi possibile fase esecutiva
            </label>
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-[#0E1F3D]/70 border border-white/10">
            <p className="text-white/60 text-sm">Totale stimato</p>
            <p className="font-serif text-3xl text-white mt-2">
              € {totale.toLocaleString("it-IT")}
            </p>
            <p className="text-white/45 text-xs mt-2">
              Mensilità arretrate (indicativo): ~{mensilita} mensilità
            </p>
          </div>

          <a
            href="/contatti"
            className="mt-8 block text-center bg-[#C5A14A] text-black px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition"
          >
            Prenota consulenza
          </a>
        </div>
      </div>
    </div>
  );
}
