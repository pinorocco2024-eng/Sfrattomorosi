// app/layout.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import Chatbase from "@/components/chatbase";

const SITE_NAME = "Sfratto Morosi";

async function getSiteUrlFromRequest(): Promise<string> {
  const h = await headers();

  const host = (h.get("x-forwarded-host") || h.get("host") || "").toLowerCase();
  const proto = (h.get("x-forwarded-proto") || "https").toLowerCase();

  // fallback (se per qualche motivo manca host)
  const fallback = "sfrattomorosi.it";

  const rawHost = host || fallback;

  // canonical host senza www
  const canonicalHost = rawHost.startsWith("www.") ? rawHost.slice(4) : rawHost;

  return `${proto}://${canonicalHost}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const SITE_URL = await getSiteUrlFromRequest();
  const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

  return {
    metadataBase: new URL(SITE_URL),

    title: {
      default: "Sfratto per Morosità | Procedura Chiara e Assistenza Completa",
      template: `%s | ${SITE_NAME}`,
    },

    description:
      "Sfratto per morosità con percorso guidato, tempi stimati e assistenza completa per recuperare il tuo immobile.",

    alternates: {
      canonical: "/",
    },

    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },

    manifest: "/site.webmanifest",

    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: "Sfratto per Morosità | Sfratto Morosi",
      description:
        "Procedura guidata e assistenza completa per recuperare il tuo immobile in modo chiaro e senza confusione.",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
      locale: "it_IT",
    },

    twitter: {
      card: "summary_large_image",
      title: "Sfratto per Morosità | Sfratto Morosi",
      description:
        "Percorso chiaro, tempi stimati e assistenza completa per recuperare il tuo immobile.",
      images: [OG_IMAGE],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        {/* CONTENUTO PAGINA */}
        {children}

        {/* FOOTER LEGALE */}
        <footer
          style={{
            marginTop: 60,
            padding: "24px 16px",
            textAlign: "center",
            fontSize: 12,
            opacity: 0.6,
          }}
        >
          © 2026 Tutti i diritti riservati —{" "}
          <span>
            <a href="/" style={{ textDecoration: "underline" }}>
              sfrattomorosi.it
            </a>
          </span>
        </footer>

        {/* CHAT BOT */}
        <Chatbase />
      </body>
    </html>
  );
}
