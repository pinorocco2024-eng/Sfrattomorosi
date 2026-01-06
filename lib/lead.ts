export type LeadPayload = {
  nome?: string;
  cognome?: string;
  email?: string;
  telefono?: string;
  messaggio?: string;

  // opzionali usati nel preventivo / form
  citta?: string;
  immobile?: string;
  mensilita?: string;

  // honeypot fields (se li usi)
  company?: string;
  website?: string;
};

type ValidateOk = { ok: true; data: LeadPayload };
type ValidateKo = { ok: false; errors: string[] };
export type ValidateLeadResult = ValidateOk | ValidateKo;

function isNonEmptyString(v: unknown) {
  return typeof v === "string" && v.trim().length > 0;
}

function cleanStr(v: unknown) {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s.length ? s : undefined;
}

function cleanPhone(v: unknown) {
  const s = cleanStr(v);
  if (!s) return undefined;

  // lascia + e numeri, elimina spazi e separatori
  const normalized = s.replace(/[^\d+]/g, "");
  return normalized.length ? normalized : undefined;
}

function cleanEmail(v: unknown) {
  const s = cleanStr(v);
  if (!s) return undefined;

  // check semplice (non RFC completa, ma ok per form)
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  return ok ? s : undefined;
}

export function validateLead(input: Partial<LeadPayload>): ValidateLeadResult {
  const errors: string[] = [];

  const nome = cleanStr(input.nome);
  const cognome = cleanStr(input.cognome);
  const email = cleanEmail(input.email);
  const telefono = cleanPhone(input.telefono);
  const messaggio = cleanStr(input.messaggio);

  const citta = cleanStr(input.citta);
  const immobile = cleanStr(input.immobile);
  const mensilita = cleanStr(input.mensilita);

  // regole minime: serve almeno un contatto (email o telefono)
  if (!email && !telefono) errors.push("Inserisci almeno email o telefono.");

  // nome/cognome facoltativi ma consigliati
  // se vuoi renderli obbligatori, togli il commento:
  // if (!nome) errors.push("Nome obbligatorio.");
  // if (!cognome) errors.push("Cognome obbligatorio.");

  // messaggio facoltativo, ma se presente deve avere un minimo
  if (isNonEmptyString(messaggio) && messaggio.length < 8) {
    errors.push("Il messaggio è troppo corto.");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      nome,
      cognome,
      email,
      telefono,
      messaggio,
      citta,
      immobile,
      mensilita,
      // honeypot: lo teniamo comunque per compatibilità
      company: cleanStr((input as any).company),
      website: cleanStr((input as any).website),
    },
  };
}
