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
    { q: "Come ridurre il rischio di morosità?", a: "Contratto chiaro, garanzie adeguate e gestione ordinata (pagamenti, solleciti, comunicazioni)." },
    { q: "È meglio prevenire o agire subito?", a: "Entrambe le cose: prevenzione in fase contrattuale e intervento tempestivo ai primi segnali di criticità." },
    { q: "Un contratto standard basta?", a: "Dipende. Spesso serve adattarlo alla situazione reale per ridurre ambiguità e contenziosi." },
  ];

  return (
    <SiteShell>
      <div className="pt-32 max-w-4xl mx-auto px-6 md:px-10 pb-20">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: "Come prevenire la morosità nella locazione",
            author: { "@type": "Organization", name: INVARIANTS.brand },
            publisher: { "@type": "Organization", name: INVARIANTS.brand },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://sfrattomorosi.it/blog/prevenire-morosita-locazione" },
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

        <ArticleMeta pill="Prevenzione" readingTime="8 min" />
        <h1 className="font-serif text-4xl md:text-5xl mb-8 text-center">
          Come prevenire la morosità nella locazione
        </h1>

        <div className="text-white/75 text-lg leading-relaxed space-y-6">
          <p>
            Molte persone cercano “<strong>sfratto morosi</strong>” quando il problema è già esploso.
            Una parte della morosità si può <strong>prevenire</strong> con scelte più solide e gestione più ordinata.
            Non è una promessa assoluta, ma è un modo pratico per ridurre probabilità e impatti.
          </p>

          <h2 className="font-serif text-2xl text-white mt-10">1) Contratto chiaro (non generico)</h2>
          <p>
            Un contratto troppo standard può lasciare zone grigie. Un contratto su misura definisce meglio
            scadenze, modalità di pagamento, spese accessorie e regole sui ritardi.
          </p>

          <h2 className="font-serif text-2xl text-white mt-10">2) Garanzie coerenti</h2>
          <p>
            Le garanzie vanno scelte in base a canone, durata e profilo del conduttore.
            L’obiettivo è l’equilibrio: tutele sufficienti senza irrigidire inutilmente.
          </p>

          <h2 className="font-serif text-2xl text-white mt-10">3) Gestione nel tempo</h2>
          <p>
            Prevenzione significa anche gestione: rinnovi, proroghe, cessioni, adeguamenti ISTAT e aggiornamenti normativi.
            Una gestione ordinata evita errori che nel tempo possono indebolire la tua posizione.
          </p>

          <h2 className="font-serif text-2xl text-white mt-10">4) Segnali da non ignorare</h2>
          <p>
            Ritardi ripetuti o comunicazioni confuse sono segnali: agire presto con comunicazioni tracciabili spesso limita
            l’accumulo di arretrati.
          </p>

          <h2 className="font-serif text-2xl text-white mt-10">5) Mini-checklist</h2>
          <ul className="text-white/75 list-disc ml-6 space-y-2">
            <li>Regola chiara su data e modalità di pagamento.</li>
            <li>Promemoria tracciabile al primo ritardo.</li>
            <li>Archivio ordinato di pagamenti e comunicazioni.</li>
            <li>Revisione del contratto se importi e durata sono rilevanti.</li>
          </ul>
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
            <Link href="/servizi" className="bg-[#C5A14A] text-black px-8 py-4 rounded-2xl font-semibold text-center">
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