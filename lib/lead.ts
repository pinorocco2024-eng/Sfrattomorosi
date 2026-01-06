import { Resend } from "resend";
import { INVARIANTS } from "@/lib/invariants";

export type LeadPayload = {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  messaggio?: string;
  source?: string;
  pathname?: string;
};

export type ValidateOk = {
  ok: true;
  data: LeadPayload;
};

export type ValidateError = {
  ok: false;
  errors: string[];
};

export type ValidateLeadResult = ValidateOk | ValidateError;

function isEmailLike(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function onlyDigits(v: string) {
  return v.replace(/[^\d+]/g, "").trim();
}

export function validateLead(input: unknown): ValidateLeadResult {
  const errors: string[] = [];

  if (!input || typeof input !== "object") {
    return { ok: false, errors: ["Payload non valido."] };
  }

  const obj = input as Partial<LeadPayload>;

  const nome = (obj.nome ?? "").trim();
  const cognome = (obj.cognome ?? "").trim();
  const email = (obj.email ?? "").trim();
  const telefono = onlyDigits(obj.telefono ?? "");
  const messaggio = (obj.messaggio ?? "").trim();
  const source = (obj.source ?? "").trim();
  const pathname = (obj.pathname ?? "").trim();

  if (nome.length < 2) errors.push("Nome obbligatorio.");
  if (cognome.length < 2) errors.push("Cognome obbligatorio.");
  if (!isEmailLike(email)) errors.push("Email non valida.");
  if (telefono.length < 6) errors.push("Telefono non valido.");

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      nome,
      cognome,
      email,
      telefono,
      messaggio: messaggio || undefined,
      source: source || undefined,
      pathname: pathname || undefined
    }
  };
}

export async function sendLeadEmail(lead: LeadPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY non impostata.");
  }

  const to = process.env.LEADS_TO_EMAIL || INVARIANTS.email;
  const from = process.env.LEADS_FROM_EMAIL || "Sfratto Morosi <onboarding@resend.dev>";

  const resend = new Resend(apiKey);

  const subject = `Nuovo lead — ${lead.nome} ${lead.cognome}`;
  const lines: string[] = [];

  lines.push(`Nome: ${lead.nome}`);
  lines.push(`Cognome: ${lead.cognome}`);
  lines.push(`Email: ${lead.email}`);
  lines.push(`Telefono: ${lead.telefono}`);
  if (lead.pathname) lines.push(`Pagina: ${lead.pathname}`);
  if (lead.source) lines.push(`Fonte: ${lead.source}`);
  if (lead.messaggio) lines.push(`Messaggio: ${lead.messaggio}`);

  const text = lines.join("\n");

  const result = await resend.emails.send({
    from,
    to,
    replyTo: lead.email,
    subject,
    text
  });

  return result;
}
