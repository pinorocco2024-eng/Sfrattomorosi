"use client";

import Script from "next/script";

export default function ChatBaseWidget() {
  const chatbotId = process.env.NEXT_PUBLIC_CHATBOT_ID;

  if (!chatbotId) return null;

  return (
    <>
      <Script
        id="chatbase-loader"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
(function(){
  if (window.chatbase) return;
  window.chatbase = function(){ (window.chatbase.q = window.chatbase.q || []).push(arguments); };
  window.chatbase("init", { chatbotId: "${chatbotId}" });
  var s = document.createElement("script");
  s.src = "https://www.chatbase.co/embed.min.js";
  s.async = true;
  s.defer = true;
  document.body.appendChild(s);
})();`,
        }}
      />
    </>
  );
}
