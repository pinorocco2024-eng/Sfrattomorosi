"use client";

import { useEffect } from "react";

type Props = {
  // Se vuoi, puoi passare l'id direttamente da layout,
  // altrimenti usa NEXT_PUBLIC_CHATBASE_ID.
  chatbotId?: string;
  domain?: string;
};

export default function Chatbase({ chatbotId, domain }: Props) {
  useEffect(() => {
    const id = chatbotId || process.env.NEXT_PUBLIC_CHATBASE_ID;
    const host = domain || process.env.NEXT_PUBLIC_CHATBASE_DOMAIN || "www.chatbase.co";

    if (!id) {
      console.warn("[Chatbase] Missing NEXT_PUBLIC_CHATBASE_ID");
      return;
    }

    // Evita doppio caricamento
    const existing = document.getElementById("chatbase-script");
    if (existing) return;

    // Config globale (Chatbase la legge)
    (window as any).chatbaseConfig = {
      chatbotId: id,
      domain: host,
    };

    const script = document.createElement("script");
    script.id = "chatbase-script";
    script.src = `https://${host}/embed.min.js`;
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      // Non rimuovo lo script: se navighi tra pagine Next,
      // meglio lasciarlo per non ricaricare tutto.
    };
  }, [chatbotId, domain]);

  return null;
}
