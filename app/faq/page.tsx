export default function FAQPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-14">
      <h1 className="font-serif text-4xl md:text-5xl mb-10 text-center">FAQ</h1>

      <div className="space-y-6">
        {[
          ["In quanto tempo si ottiene l’ordinanza?", "In media circa 90 giorni (indicativo)."],
          ["Quanto costa?", "Costo base € 1.300. Eventuale fase esecutiva € 1.200,00 (indicativo)."],
        ].map(([q, a]) => (
          <div key={q} className="border-b border-white/10 pb-6">
            <h3 className="font-serif text-2xl mb-2">{q}</h3>
            <p className="text-white/70 text-lg">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
