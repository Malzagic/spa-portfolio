// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ContactSchema, type ContactPayload } from "@/types/contact";
import { toHtml, toPlainText } from "./email";

/**
 * Contact API (Resend)
 * - Returns 422 with per-field errors on validation fail
 * - Uses Reply-To; guards env; strips CR/LF from subject
 */

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  // Env guard
  if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM || !process.env.MAIL_TO) {
    return NextResponse.json(
      { ok: false, error: "Server misconfigured: missing RESEND_API_KEY / MAIL_FROM / MAIL_TO." },
      { status: 500 }
    );
  }

  // Parse body
  const json = await req.json().catch(() => null);
  if (!json || typeof json !== "object") {
    return NextResponse.json({ ok: false, error: "Malformed JSON" }, { status: 400 });
  }

  // Validate
  const parsed = ContactSchema.safeParse(json);
  if (!parsed.success) {
    const { fieldErrors, formErrors } = parsed.error.flatten();
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed",
        errors: {
          name: fieldErrors.name?.[0] ?? null,
          email: fieldErrors.email?.[0] ?? null,
          subject: fieldErrors.subject?.[0] ?? null,
          message: fieldErrors.message?.[0] ?? null,
          _form: formErrors?.[0] ?? null,
        },
      },
      { status: 422 }
    );
  }

  const data = parsed.data as ContactPayload;

  // Defensive subject normalization
  const cleanSubject = data.subject?.replace(/[\r\n]/g, " ").slice(0, 120) ?? null;

  const emailPayload = {
    from: process.env.MAIL_FROM!, // e.g. "PMDev <hello@pmdev.ovh>"
    to: process.env.MAIL_TO!, // your inbox
    replyTo: data.email, // reply goes to client
    subject: cleanSubject ? `[PMDev.ovh] ${cleanSubject}` : "New inquiry",
    html: toHtml(data),
    text: toPlainText(data),
  } as const;

  try {
    await resend.emails.send(emailPayload);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Send failed" }, { status: 500 });
  }
}
