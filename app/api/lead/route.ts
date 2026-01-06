// app/api/lead/route.ts
export const runtime = "nodejs";

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  page?: string;
  lang?: string;
};

function isEmail(s: unknown) {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as LeadPayload;

    const name = typeof data.name === "string" ? data.name.trim() : "";
    const email = typeof data.email === "string" ? data.email.trim() : "";
    const phone = typeof data.phone === "string" ? data.phone.trim() : "";
    const message = typeof data.message === "string" ? data.message.trim() : "";
    const page = typeof data.page === "string" ? data.page.trim() : "";
    const lang = typeof data.lang === "string" ? data.lang.trim() : "";

    if (!name || !isEmail(email) || !message) {
      return new Response(JSON.stringify({ ok: false, error: "invalid_payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Per ora: log server-side (su Vercel lo vedi nei Logs)
    console.log("[LEAD]", { name, email, phone, message, page, lang, at: new Date().toISOString() });

    // TODO (quando vuoi):
    // - invio email (Resend, SMTP, ecc.)
    // - salvataggio su Google Sheet / DB / CRM

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[LEAD_ERROR]", err);
    return new Response(JSON.stringify({ ok: false, error: "server_error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
