"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { INVARIANTS } from "@/lib/invariants";

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

const HeaderCTA = () => (
  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
    <Link
      href="/contatti"
      className="bg-[#C5A14A] text-black px-5 py-3 rounded-lg text-sm font-semibold shadow-lg hover:shadow-2xl transition inline-block"
    >
      Prenota Consulenza
    </Link>
  </motion.div>
);

const Nav = () => (
  <nav className="hidden md:flex gap-8 text-sm text-white/70">
    <Link href="/" className="hover:text-white transition">
      Home
    </Link>
    <Link href="/preventivo" className="hover:text-white transition">
      Preventivo
    </Link>
    <Link href="/servizi" className="hover:text-white transition">
      Servizi
    </Link>
    <Link href="/blog" className="hover:text-white transition">
      Blog
    </Link>
    <Link href="/faq" className="hover:text-white transition">
      FAQ
    </Link>
    <Link href="/contatti" className="hover:text-white transition">
      Contatti
    </Link>
  </nav>
);

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A1831] text-white antialiased">
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md border-b border-[#C5A14A]/20">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-left group" aria-label="Vai alla Home">
            <span className="text-[#C5A14A]">
              <ScalesIcon className="w-6 h-6" />
            </span>
            <span className="font-serif text-2xl tracking-wide group-hover:text-white transition">{INVARIANTS.brand}</span>
          </Link>

          <Nav />
          <HeaderCTA />
        </div>
      </header>

      <main className="pt-0">{children}</main>

      <footer className="border-t border-white/10 py-12 px-6 md:px-10 text-sm text-white/60">
        <div className="max-w-7xl mx-auto text-center">
          <p>Telefono: {INVARIANTS.phone}</p>
          <p>Email: {INVARIANTS.email}</p>
        </div>
      </footer>
    </div>
  );
}
