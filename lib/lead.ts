export type LeadPayload = {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  messaggio: string;
  source?: string;
};

export function validateLeadPayload(input: unknown): { ok: true; data: LeadPayload } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "Payload non valido" };
  const x = input as Record<string, unknown>;

  const get = (k: string) => (typeof x[k] === "string" ? x[k].trim() : "");

  const data: LeadPayload = {
    nome: get("nome"),
    cognome: get("cognome"),
    email: get("email"),
    telefono: get("telefono"),
    messaggio: get("messaggio"),
    source: typeof x["source"] === "string" ? x["source"].trim() : undefined,
  };

  if (!data.nome) return { ok: false, error: "Nome obbligatorio" };
  if (!data.cognome) return { ok: false, error: "Cognome obbligatorio" };
  if (!data.email || !data.email.includes("@")) return { ok: false, error: "Email non valida" };
  if (!data.telefono) return { ok: false, error: "Telefono obbligatorio" };
  if (!data.messaggio) return { ok: false, error: "Messaggio obbligatorio" };

  return { ok: true, data };
}
