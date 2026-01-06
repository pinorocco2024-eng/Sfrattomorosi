import { NextResponse } from "next/server";
import { sendLeadEmail, validateLead } from "@/lib/lead";

export const runtime = "nodejs";

function json(status: number, body: unknown) {
  return NextResponse.json(body, { status });
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const validation = validateLead(payload);

    if (!validation.ok) {
      // qui validation è ValidateError, quindi ha errors
      return json(400, {
        ok: false,
        errors: validation.errors
      });
    }

    // qui validation è ValidateOk, quindi ha data
    const lead = validation.data;

    const emailResult = await sendLeadEmail(lead);

    return json(200, {
      ok: true,
      sent: true,
      id: (emailResult as any)?.data?.id ?? null
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Errore sconosciuto nella richiesta lead.";

    return json(500, {
      ok: false,
      error: message
    });
  }
}

export async function GET() {
  return json(200, { ok: true });
}