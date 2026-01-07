import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TO = process.env.CONTACT_TO_EMAIL;
  const FROM = process.env.RESEND_FROM;

  if (!RESEND_API_KEY || !TO || !FROM) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Server misconfigured: missing env vars (RESEND_API_KEY, CONTACT_TO_EMAIL, RESEND_FROM)",
      },
      { status: 500 }
    );
  }

  const resend = new Resend(RESEND_API_KEY);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const nome = String(body?.nome || "").trim();
  const cognome = String(body?.cognome || "").trim();
  const email = String(body?.email || "").trim();
  const telefono = String(body?.telefono || "").trim();
  const messaggio = String(body?.messaggio || "").trim();

  if (!nome || !cognome || !email || !telefono) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields (nome, cognome, email, telefono)" },
      { status: 400 }
    );
  }

  try {
    // Resend send example is via resend.emails.send(...) :contentReference[oaicite:0]{index=0}
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      subject: `Nuova richiesta - ${nome} ${cognome}`,
      replyTo: email,
      text: [
        "Nuova richiesta dal sito:",
        "",
        `Nome: ${nome}`,
        `Cognome: ${cognome}`,
        `Email: ${email}`,
        `Telefono: ${telefono}`,
        `Messaggio: ${messaggio || "-"}`,
      ].join("\n"),
      html: `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.5">
          <h2>Nuova richiesta dal sito</h2>
          <p><b>Nome:</b> ${escapeHtml(nome)}</p>
          <p><b>Cognome:</b> ${escapeHtml(cognome)}</p>
          <p><b>Email:</b> ${escapeHtml(email)}</p>
          <p><b>Telefono:</b> ${escapeHtml(telefono)}</p>
          <p><b>Messaggio:</b><br/>${escapeHtml(messaggio || "-").replace(/\n/g, "<br/>")}</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Send failed" }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
