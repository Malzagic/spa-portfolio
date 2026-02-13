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

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; lastReset: number }>();

export async function POST(req: Request) {
  // 1. Rate Limiting
  const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const limit = 3; // max 3 requests per minute per IP

  const record = rateLimit.get(ip) ?? { count: 0, lastReset: now };

  if (now - record.lastReset > windowMs) {
    record.count = 0;
    record.lastReset = now;
  }

  if (record.count >= limit) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  record.count++;
  rateLimit.set(ip, record);

  // Env guard
  if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM || !process.env.MAIL_TO) {
    console.error("Missing env vars for contact form");
    return NextResponse.json(
      { ok: false, error: "Server misconfigured: missing RESEND_API_KEY / MAIL_FROM / MAIL_TO." },
      { status: 500 },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

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
      { status: 422 },
    );
  }

  const data = parsed.data as ContactPayload;

  // Defensive subject normalization
  const cleanSubject = data.subject?.replace(/[\r\n]/g, " ").slice(0, 120) ?? null;

  const emailPayload = {
    from: process.env.MAIL_FROM, // Checked above
    to: process.env.MAIL_TO, // Checked above
    replyTo: data.email, // reply goes to client
    subject: cleanSubject ? `[PMDev.ovh] ${cleanSubject}` : "New inquiry",
    html: toHtml(data),
    text: toPlainText(data),
  } as const;

  try {
    await resend.emails.send(emailPayload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form sending failed:", error);
    return NextResponse.json({ ok: false, error: "Send failed" }, { status: 500 });
  }
}
