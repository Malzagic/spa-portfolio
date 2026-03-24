/**
 * Contact API Route - GCP Elite Integration
 * Features: Service Account Authentication, Server-side Validation, Rate Limiting.
 * Standards: Secure, Optimal, English comments.
 */

import { NextResponse } from "next/server";
import { google } from "googleapis";
import { ContactSchema } from "@/types/contact";

// In-memory rate limiting to prevent automated abuse (3 req / 60s)
const rateLimit = new Map<string, { count: number; lastReset: number }>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const now = Date.now();

  // 1. Rate Limiting Logic
  const limitData = rateLimit.get(ip) ?? { count: 0, lastReset: now };
  if (now - limitData.lastReset > 60000) {
    limitData.count = 0;
    limitData.lastReset = now;
  }
  if (limitData.count >= 3) {
    return NextResponse.json({ ok: false, error: "Rate limit exceeded. Try again in 60s." }, { status: 429 });
  }
  rateLimit.set(ip, { ...limitData, count: limitData.count + 1 });

  try {
    const body = await req.json();

    // 2. Server-side Zod Validation (Secure)
    const result = ContactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ ok: false, errors: result.error.flatten().fieldErrors }, { status: 422 });
    }

    // 3. Google Cloud Authentication Setup
    // Note: These env vars must be set after GCP subscription is active
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/gmail.send"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // 4. Data Injection into Google Sheets (The "CRM" part)
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            result.data.name,
            result.data.email,
            result.data.subject || "No Subject",
            result.data.message,
          ],
        ],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Log the error for internal debugging, return a generic professional message
    console.error("GCP API Error:", error);
    return NextResponse.json({ ok: false, error: "Inquiry system temporarily unavailable." }, { status: 500 });
  }
}
