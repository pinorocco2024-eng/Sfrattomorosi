import SiteShell from "@/components/SiteShell";
import Link from "next/link";
import { INVARIANTS } from "@/lib/invariants";

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
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
    <SiteShell>
      <div className="pt-32 max-w-4xl mx-auto px-6 md:px-10 pb-20">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: "Sfratto per morosità: tempi e costi nel 2025",
            author: { "@type": "Organization", name: INVARIANTS.brand },
            publisher: { "@type": "Organization", name: INVARIANTS.brand },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://sfrattomorosi.it/blog/sfratto-per-morosita-tempi-costi-2025" },
            about: ["avvocato sfratto per morosità", "sfratto morosi", "procedura sfratto per morosità", "tempi sfratto", "costo sfratto"],
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

        <ArticleMeta pill="Guida completa" readingTime="9 min" />
        <h1 className="font-serif text-4xl md:text-5xl mb-8 text-center">
          Sfratto per morosità: tempi e costi nel 2025
        </h1>

        <div className="text-white/75 text-lg leading-relaxed space-y-6">
          <p>
            Se stai cercando <strong>avvocato sfratto per morosità</strong> o <strong>avvocato per sfratto per morosità</strong>,
            probabilmente hai un problema molto concreto: l’inquilino non paga e l’immobile resta occupato.
            In questa guida trovi una panoramica chiara e pratica su <strong>tempi</strong>, <strong>costi</strong> e passaggi tipici.
          </p>

          <h2 className="font-serif text-2xl text-white mt-10">Cos’è lo sfratto per morosità (in breve)</h2>
          <p>
            Lo <strong>sfratto per morosità</strong> è la procedura prevista per i casi di mancato pagamento del canone.
            Serve a ottenere un provvedimento che consenta al proprietario di rientrare nel possesso dell’immobile.
          </p>

          <h2 className="font-serif text-2xl text-white mt-10">Tempi: quanto ci vuole davvero?</h2>
          <p>
            In modo trasparente: <strong>dipende dal Tribunale e dal caso</strong>. Come riferimento utile,
            <strong>in media in circa 90 giorni</strong> si ottiene l’ordinanza di liberazione dell’immobile (dato indicativo).
          </p>

          <ul className="text-white/75 list-disc ml-6 space-y-2">
            <li><strong>Notifiche</strong>: possono incidere sulla calendarizzazione.</li>
            <li><strong>Calendario udienze</strong>: alcuni fori hanno agenda più carica di altri.</li>
            <li><strong>Documentazione</strong>: un dossier ordinato riduce rallentamenti.</li>
          </ul>

          <h2 className="font-serif text-2xl text-white mt-10">Costi: chiarezza prima, serenità dopo</h2>
          <p>
            Il costo base del servizio è <strong>{INVARIANTS.baseCost}</strong>. L’idea è semplice: conoscere le voci principali e
            avere trasparenza su ciò che può arrivare dopo.
          </p>

          <h3 className="font-serif text-xl text-white/90 mt-8">Fase Esecutiva – Tempistiche e Costi</h3>
          <p>
            Dopo l’ordinanza può essere necessaria la <strong>fase esecutiva</strong> (Ufficiale Giudiziario).
            La durata dipende dal Tribunale, ma <strong>in media è di circa 6 mesi</strong>. Questa fase comporta un costo aggiuntivo
            di circa <strong>{INVARIANTS.execCost}</strong>, sempre condiviso prima dell’avvio.
          </p>

          <h2 className="font-serif text-2xl text-white mt-10">Checklist rapida</h2>
          <ul className="text-white/75 list-disc ml-6 space-y-2">
            <li>Contratto di locazione e cronologia pagamenti/insoluti.</li>
            <li>Elenco mensilità non pagate (periodi e importi).</li>
            <li>Comunicazioni inviate (email/PEC/raccomandate), se presenti.</li>
            <li>Dati immobile e informazioni utili (città, recapiti, ecc.).</li>
          </ul>
        </div>

        <Divider />

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          <h2 className="font-serif text-2xl mb-3 text-center">Link rapidi</h2>
          <p className="text-white/70 text-center mb-8">
            Preventivo, servizi e FAQ per orientarti subito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/preventivo" className="bg-[#C5A14A] text-black px-8 py-4 rounded-2xl font-semibold text-center">
              Calcola il preventivo
            </Link>
            <Link href="/servizi" className="px-8 py-4 rounded-2xl border border-white/20 text-white/80 text-center">
              Scopri i servizi
            </Link>
            <Link href="/faq" className="px-8 py-4 rounded-2xl border border-white/20 text-white/80 text-center">
              Leggi le FAQ
            </Link>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/blog" className="inline-block px-8 py-4 rounded-2xl border border-white/20 text-white/80">
            Torna al Blog
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}