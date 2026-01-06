import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbaseWidget from '@/components/ChatbaseWidget';

export const metadata: Metadata = {
  title: "Sfratto Morosi",
  description: "Avvocato per sfratto per morosità: tempi, costi, procedura, consulenza.",
};

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
