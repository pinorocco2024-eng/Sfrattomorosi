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
    { q: "Cosa succede dopo l’ordinanza di liberazione?", a: "Si avvia la fase esecutiva con l’Ufficiale Giudiziario: notifiche e accessi possono richiedere tempo." },
    { q: "Quanto dura la fase esecutiva?", a: "In media circa 6 mesi, ma dipende dal Tribunale e dalle prassi locali." },
    { q: "Quanto costa la fase esecutiva?", a: `In media comporta un costo aggiuntivo di circa ${INVARIANTS.execCost}, condiviso prima dell’avvio.` },
  ];

  return (
    <SiteShell>
      <div className="pt-32 max-w-4xl mx-auto px-6 md:px-10 pb-20">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: "La fase esecutiva dello sfratto: cosa aspettarsi",
            author: { "@type": "Organization", name: INVARIANTS.brand },
            publisher: { "@type": "Organization", name: INVARIANTS.brand },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://sfrattomorosi.it/blog/fase-esecutiva-sfratto-cosa-aspettarsi" },
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

        <ArticleMeta pill="Procedura" readingTime="8 min" />
        <h1 className="font-serif text-4xl md:text-5xl mb-8 text-center">
          La fase esecutiva dello sfratto: cosa aspettarsi
        </h1>

        <div className="text-white/75 text-lg leading-relaxed space-y-6">
          <p>
            Ottenere l’ordinanza è un passaggio fondamentale, ma spesso non è “la fine”.
            Per rendere effettivo il rilascio dell’immobile può essere necessaria la <strong>fase esecutiva</strong>,
            gestita con l’Ufficiale Giudiziario.
          </p>

          <h2 className="font-serif text-2xl text-white mt-10">Dopo l’ordinanza: cosa succede</h2>
          <p>
            Si avviano gli adempimenti necessari: notifiche, calendarizzazione e organizzazione degli accessi.
            È normale che ci siano passaggi intermedi: la cosa importante è la gestione ordinata della pratica.
          </p>

          <h2 className="font-serif text-2xl text-white mt-10">Tempistiche (indicative)</h2>
          <p>
            La durata varia in base al Tribunale e alle prassi locali. In modo trasparente:
            <strong> in media la fase esecutiva è di circa 6 mesi</strong>.
          </p>

          <h2 className="font-serif text-2xl text-white mt-10">Costi (indicativi)</h2>
          <p>
            La fase esecutiva comporta un costo aggiuntivo di circa <strong>{INVARIANTS.execCost}</strong>, condiviso prima dell’avvio.
          </p>

          <h2 className="font-serif text-2xl text-white mt-10">Consiglio pratico</h2>
          <p>
            Mantieni una timeline e un archivio (notifiche, comunicazioni, documenti). Ti aiuta a capire cosa succede e quando,
            riducendo incertezza e stress.
          </p>
        </div>

        <Divider />

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          <h2 className="font-serif text-2xl mb-3 text-center">Link rapidi</h2>
          <p className="text-white/70 text-center mb-8">
            Preventivo, servizi e FAQ per orientarti subito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/preventivo" className="px-8 py-4 rounded-2xl border border-white/20 text-white/80 text-center">
              Calcola il preventivo
            </Link>
            <Link href="/servizi" className="px-8 py-4 rounded-2xl border border-white/20 text-white/80 text-center">
              Scopri i servizi
            </Link>
            <Link href="/faq" className="bg-[#C5A14A] text-black px-8 py-4 rounded-2xl font-semibold text-center">
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