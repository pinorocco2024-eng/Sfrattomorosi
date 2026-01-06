import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs"; // importante: Resend non gira su Edge

type Body = {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  messaggio: string;
};

function esc(s: string) {
  return (s || "").replace(/[<>]/g, "");
}

export async function POST(req: Request) {
  try {
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;

    if (!resendKey || !toEmail || !fromEmail) {
      return NextResponse.json(
        { ok: false, error: "Server misconfigured: missing env vars" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as Partial<Body>;

    const nome = (body.nome || "").trim();
    const cognome = (body.cognome || "").trim();
    const email = (body.email || "").trim();
    const telefono = (body.telefono || "").trim();
    const messaggio = (body.messaggio || "").trim();

    // Validazione minimale
    if (!nome || !cognome || !email || !telefono) {
      return NextResponse.json(
        { ok: false, error: "Compila tutti i campi obbligatori." },
        { status: 400 }
      );
    }
    if (!email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Email non valida." }, { status: 400 });
    }

    const resend = new Resend(resendKey);

    const subject = `Nuova richiesta consulenza: ${nome} ${cognome}`;

    const text = `Nuova richiesta consulenza

Nome: ${nome}
Cognome: ${cognome}
Email: ${email}
Telefono: ${telefono}

Messaggio:
${messaggio || "(nessun messaggio)"}
`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5">
        <h2>Nuova richiesta consulenza</h2>
        <p><strong>Nome:</strong> ${esc(nome)}</p>
        <p><strong>Cognome:</strong> ${esc(cognome)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Telefono:</strong> ${esc(telefono)}</p>
        <hr />
        <p><strong>Messaggio:</strong></p>
        <p>${esc(messaggio || "(nessun messaggio)").replace(/\n/g, "<br/>")}</p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email, // così rispondi direttamente al cliente
      subject,
      text,
      html,
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Errore sconosciuto" },
      { status: 500 }
    );
  }
}
