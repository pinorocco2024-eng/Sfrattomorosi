// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import ChatbaseWidget from 'ChatbaseWidget';

export const metadata: Metadata = {
  title: "Sfratto Morosi",
  description: "Recupero crediti e sfratto morosi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        {children}
        <ChatbaseWidget />
      </body>
    </html>
  );
}
