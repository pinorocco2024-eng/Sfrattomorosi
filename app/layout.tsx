import "./globals.css";
import type { Metadata } from "next";
import { siteMetadata } from "@/lib/seo";
import SiteShell from "@/components/SiteShell";

/**
 * Metadata globale del sito
 * (canonical, open graph, twitter, robots)
 */
export const metadata: Metadata = siteMetadata({
  title: "Sfratto Morosi",
  pathname: "/",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head />
      <body className="min-h-screen bg-[#0A1831] text-white antialiased">
        {/* 
          SiteShell contiene:
          - Header
          - Navigazione
          - Footer
          - Layout coerente con il canvas
        */}
        <SiteShell>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
