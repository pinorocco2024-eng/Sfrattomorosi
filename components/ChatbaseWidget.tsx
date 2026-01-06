"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    chatbase?: any;
  }
}

export default function ChatbaseWidget() {
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_CHATBASE_ID;
    if (!id) return;

    if (document.getElementById("chatbase-script")) return;

    (window as any).chatbase =
      (window as any).chatbase ||
      function () {
        ((window as any).chatbase.q = (window as any).chatbase.q || []).push(arguments);
      };

    (window as any).chatbase("init", { chatbotId: id });

    const s = document.createElement("script");
    s.id = "chatbase-script";
    s.src = "https://www.chatbase.co/embed.min.js";
    s.async = true;
    s.defer = true;
    document.body.appendChild(s);
  }, []);

  return null;
}
