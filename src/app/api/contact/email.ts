/**
 * Email Templates for pmdev.ovh
 * Principles: English-only comments, Safe escaping, Brand-aligned UI.
 */

import type { ContactPayload } from "@/types/contact";

const BRAND_NAME = "pmdev";
const SITE_URL = process.env.SITE_URL ?? "https://pmdev.ovh";
const ACCENT_COLOR = "#fbbf24"; // Amber Gold
const BG_DARK = "#020617"; // Slate 950

/** Simple HTML escaping to prevent XSS in email clients */
export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, ch => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[ch]!;
  });
}

/** Professional date formatting for the administrator */
export function formatDate(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Warsaw",
  }).format(d);
}

/** Plain-text fallback for maximum deliverability */
export function toPlainText({ name, email, subject, message }: ContactPayload): string {
  return [
    `NEW INQUIRY - ${BRAND_NAME.toUpperCase()}`,
    `Timestamp: ${formatDate()}`,
    `------------------------------------------`,
    `CLIENT DETAILS`,
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Subject: ${subject ?? "N/A"}`,
    `------------------------------------------`,
    `MESSAGE:`,
    message,
    `------------------------------------------`,
    `Reply directly to: ${email}`,
  ].join("\n");
}

/** Brand-aligned HTML template with professional styling */
export function toHtml({ name, email, subject, message }: ContactPayload): string {
  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    subject: subject ? escapeHtml(subject) : "New Project Inquiry",
    message: escapeHtml(message).replace(/\n/g, "<br/>"),
  };

  return `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8"/>
      <style>
        body { font-family: sans-serif; background-color: ${BG_DARK}; color: #f8fafc; margin: 0; padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
        .header { padding: 32px; border-bottom: 1px solid #1e293b; }
        .content { padding: 32px; }
        .footer { padding: 24px; background: #1e293b; font-size: 12px; color: #94a3b8; }
        .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: ${ACCENT_COLOR}; font-weight: bold; margin-bottom: 4px; }
        .value { font-size: 15px; margin-bottom: 24px; color: #f1f5f9; }
        .message-box { padding: 20px; background: ${BG_DARK}; border-radius: 12px; border-left: 4px solid ${ACCENT_COLOR}; line-height: 1.6; }
        a { color: ${ACCENT_COLOR}; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div style="font-size: 24px; font-weight: bold; color: #fff;">pm<span style="color: ${ACCENT_COLOR}">dev</span></div>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Incoming Digital Architecture Inquiry • ${formatDate()}</div>
        </div>
        <div class="content">
          <div class="label">From</div>
          <div class="value"><strong>${safe.name}</strong> (${safe.email})</div>
          
          <div class="label">Subject</div>
          <div class="value">${safe.subject}</div>
          
          <div class="label">Message Content</div>
          <div class="message-box">${safe.message}</div>
        </div>
        <div class="footer">
          This is an automated notification from ${SITE_URL}. 
          To respond, simply <strong>reply to this email</strong>.
        </div>
      </div>
    </body>
    </html>
  `;
}
