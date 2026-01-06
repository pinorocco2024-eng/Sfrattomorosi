import SiteShell from "@/components/SiteShell";
import Link from "next/link";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="pt-28 min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-xl text-center">
          <h1 className="font-serif text-5xl mb-4">404</h1>
          <p className="text-white/70 mb-8">Pagina non trovata. Torna alla home.</p>
          <Link href="/" className="inline-block bg-[#C5A14A] text-black px-8 py-4 rounded-2xl font-semibold">
            Vai alla Home
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}