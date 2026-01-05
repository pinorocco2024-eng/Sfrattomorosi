import "./globals.css";
import type { Metadata } from "next";
import { siteMetadata } from "@/lib/seo";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = siteMetadata({
  title: "Sfratto Morosi",
  alternates: { canonical: "/" },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
