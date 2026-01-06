"use client";

import Script from "next/script";

export default function Chatbase() {
  return (
    <>
      <Script id="chatbase-config" strategy="afterInteractive">
        {`
          window.embeddedChatbotConfig = {
            chatbotId: "Ov9NcGjN69XIUDU_0dZLR",
            domain: "www.chatbase.co"
          };
        `}
      </Script>

      <Script
        src="https://www.chatbase.co/embed.min.js"
        strategy="afterInteractive"
      />
    </>
  );
}