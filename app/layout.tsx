import "./globals.css";
import type { Metadata } from "next";
import { siteMetadata } from "@/lib/seo";

export const metadata: Metadata = siteMetadata({
  title: "Sfratto Morosi",
  pathname: "/"
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}