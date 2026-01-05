import { NextResponse } from "next/server";
import { Resend } from "resend";
import { omitEmpty, isValidEmail } from "@/lib/lead";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payload = omitEmpty({
      nome: body.nome,
      cognome: body.cognome,
      email: body.email,
      telefono: body.telefono,
      dati_immobile: body.dati_immobile,
      canoni_arretrati: body.canoni_arretrati,
      messaggio: body.messaggio,
      pagina_provenienza: body.pagina_provenienza,
      timestamp: body.timestamp,
      ip: body.ip,
    });

    if (!payload.nome || !payload.cognome || !payload.email || !payload.telefono) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }
    if (!isValidEmail(String(payload.email))) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const toEmail = process.env.LEAD_TO_EMAIL || "info@sfrattomorosi.it";

    if (!resendKey || !fromEmail) {
      return NextResponse.json({ ok: false, error: "missing_env" }, { status: 500 });
    }

    const resend = new Resend(resendKey);
    const yyyyMmDd = new Date().toISOString().slice(0, 10);

    const lines: string[] = [
      `Nome: ${payload.nome}`,
      `Cognome: ${payload.cognome}`,
      `Email: ${payload.email}`,
      `Telefono: ${payload.telefono}`,
      `Dati immobile: ${payload.dati_immobile || ""}`,
      ...(payload.canoni_arretrati ? [`Canoni arretrati: ${payload.canoni_arretrati}`] : []),
      `Messaggio: ${payload.messaggio || ""}`,
      `Data/ora invio: ${new Date().toLocaleString("it-IT")}`,
      ...(payload.ip ? [`IP: ${payload.ip}`] : []),
      `Pagina provenienza: ${payload.pagina_provenienza || ""}`,
    ];

    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `Nuovo lead Sfratto Morosi – ${payload.nome} ${payload.cognome} – ${yyyyMmDd}`,
      text: lines.join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "lead_error" }, { status: 500 });
  }
}
