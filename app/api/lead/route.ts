import { NextResponse } from "next/server";
import { Resend } from "resend";

import { validateLead, type LeadPayload } from "../../../lib/lead";

/**
 * API: /api/lead
 * - Valida i dati del lead
 * - (Opzionale) invia email con Resend
 * - Ritorna JSON coerente e tipizzato
 *
 * Nota: usiamo import relativi (../../../) per evitare problemi con alias @/
 */

type ApiOk = {
  ok: true;
  message: string;
};

type ApiKo = {
  ok: false;
  errors: string[];
};

function jsonOk(message: string, status = 200) {
  const body: ApiOk = { ok: true, message };
  return NextResponse.json(body, { status });
}

function jsonKo(errors: string[], status = 400) {
  const body: ApiKo = { ok: false, errors };
  return NextResponse.json(body, { status });
}

function safeTrim(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function getClientIp(req: Request) {
  // In prod spesso c’è x-forwarded-for; in dev può mancare.
  const h = req.headers.get("x-forwarded-for") || "";
  const ip = h.split(",")[0]?.trim();
  return ip || "unknown";
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // 1) Parse body
    const raw = (await req.json().catch(() => null)) as unknown;

    if (!raw || typeof raw !== "object") {
      return jsonKo(["Payload non valido."], 400);
    }

    const payload = raw as LeadPayload;

    // 2) (Opzionale) honeypot: se un bot compila questi campi, rifiutiamo
    const hpCompany = safeTrim((payload as any).company);
    const hpWebsite = safeTrim((payload as any).website);
    if (hpCompany || hpWebsite) {
      // risposta “neutra”
      return jsonOk("Richiesta ricevuta.", 200);
    }

    // 3) Validazione forte tipizzata
    const check = validateLead(payload);

    // ✅ narrowing ultra-robusto: check.ok === false
    if (check.ok === false) {
      return jsonKo(check.errors, 400);
    }

    // Qui TS sa che check è ValidateOk e che esiste data
    const lead = check.data;

    // 4) Prepariamo il contenuto email
    const subject = "Nuovo lead — Sfratto Morosi";
    const lines = [
      `IP: ${ip}`,
      "",
      `Nome: ${lead.nome ?? ""} ${lead.cognome ?? ""}`.trim(),
      `Email: ${lead.email ?? ""}`,
      `Telefono: ${lead.telefono ?? ""}`,
      "",
      `Città/Zona: ${lead.citta ?? ""}`,
      `Immobile: ${lead.immobile ?? ""}`,
      `Mensilità: ${lead.mensilita ?? ""}`,
      "",
      "Messaggio:",
      lead.messaggio ?? "",
    ];
    const text = lines.join("\n").trim();

    // 5) Se Resend è configurato, inviamo email. Altrimenti rispondiamo ok senza invio.
    const resendApiKey = process.env.RESEND_API_KEY || "";
    const toEmail = process.env.LEAD_TO_EMAIL || ""; // es: info@sfrattomorosi.it
    const fromEmail = process.env.LEAD_FROM_EMAIL || ""; // es: "Sfratto Morosi <onboarding@resend.dev>"

    const resendConfigured = Boolean(resendApiKey && toEmail && fromEmail);

    if (resendConfigured) {
      const resend = new Resend(resendApiKey);

      await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        subject,
        text,
        replyTo: lead.email || undefined,
      });
    }

    return jsonOk("Richiesta ricevuta.", 200);
  } catch (err) {
    // Non leakare errori interni al client
    return jsonKo(["Errore interno. Riprova tra poco."], 500);
  }
}

export async function GET() {
  // utile per testare che l’endpoint esiste
  return NextResponse.json(
    {
      ok: true,
      message: "Lead endpoint is up.",
    },
    { status: 200 }
  );
}
