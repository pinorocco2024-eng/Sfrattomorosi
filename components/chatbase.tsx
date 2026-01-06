"use client";

import { useEffect } from "react";

export default function Chatbase() {
  useEffect(() => {
    if (document.getElementById("chatbase-script")) return;

    const script = document.createElement("script");
    script.id = "chatbase-script";
    script.src = "https://www.chatbase.co/embed.min.js";
    script.defer = true;
    script.setAttribute("chatbotId", "IL_TUO_ID_CHATBASE");
    script.setAttribute("domain", "www.chatbase.co");

    document.body.appendChild(script);
  }, []);

  return null;
}
