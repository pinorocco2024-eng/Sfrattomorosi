import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbaseWidget from '@/components/ChatbaseWidget';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="min-h-screen bg-[#0A1831] text-white antialiased">
        <Navbar />
        <div className="pt-24">{children}</div>
        <Footer />
        <ChatbaseWidget />
      </body>
    </html>
  );
}
export const metadata: Metadata = {
  title: "Sfratto Morosi",
  description: "Avvocato per sfratto per morosità – consulenza chiara, tempi e costi trasparenti",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
};
