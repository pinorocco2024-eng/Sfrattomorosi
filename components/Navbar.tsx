"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

function ScalesIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3v18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M6 7l-3 6a4 4 0 0 0 6 0L6 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M18 7l-3 6a4 4 0 0 0 6 0l-3-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8 21h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const nav = [
  { href: "/", label: "Home" },
  { href: "/preventivo", label: "Preventivo" },
  { href: "/servizi", label: "Servizi" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contatti", label: "Contatti" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md border-b border-[#C5A14A]/20">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 group" aria-label="Vai alla Home">
          <span className="text-[#C5A14A]">
            <ScalesIcon className="w-6 h-6" />
          </span>
          <span className="font-serif text-2xl tracking-wide group-hover:text-white transition">
            Sfratto Morosi
          </span>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm text-white/70">
          {nav.map((i) => {
            const active = pathname === i.href;
            return (
              <Link
                key={i.href}
                href={i.href}
                className={`hover:text-white transition ${active ? "text-white" : ""}`}
              >
                {i.label}
              </Link>
            );
          })}
        </nav>

        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
          <Link
            href="/contatti"
            className="bg-[#C5A14A] text-black px-5 py-3 rounded-lg text-sm font-semibold shadow-lg hover:shadow-2xl transition"
          >
            Prenota Consulenza
          </Link>
        </motion.div>
      </div>
    </header>
  );
}
