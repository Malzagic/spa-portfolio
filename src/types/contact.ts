// src/types/contact.ts
import { z } from "zod";

/**
 * Normalize empty string to undefined (so optional works as expected).
 */
const OptionalTrimmed = z
  .string()
  .trim()
  .transform(v => (v === "" ? undefined : v))
  .optional();

export const ContactSchema = z.object({
  name: z.string().trim().min(2, "Podaj co najmniej 2 znaki").max(80),
  email: z.string().trim().email("Podaj poprawny adres e-mail").max(120),
  subject: OptionalTrimmed.refine(v => (v ? v.length <= 120 : true), {
    message: "Temat może mieć maks. 120 znaków",
  }),
  message: z.string().trim().min(10, "Wiadomość min. 10 znaków").max(5000),
});

export type ContactPayload = z.infer<typeof ContactSchema>;
