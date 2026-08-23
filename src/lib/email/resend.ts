import { Resend } from "resend";
import type { CreateEmailOptions } from "resend";
import { prisma } from "@/lib/prisma";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Omnia Marketing <info@omniamarketing.it>";

// Stesso identico comportamento di resend.emails.send: unico punto in cui passano TUTTE le
// email del sito (newsletter, benvenuto, conferme contatto, risposte admin), per poter
// contare quante ne sono state inviate oggi/questo mese — Resend non espone questo dato
// tramite API pubblica, quindi lo stimiamo noi in admin/newsletter (vedi lib/email/usage.ts).
// Il log viene scritto solo per gli invii andati a buon fine, per rispecchiare i conteggi
// "consegnate" che Resend stesso mostrerebbe in dashboard.
export async function sendTrackedEmail(payload: CreateEmailOptions) {
  const result = await resend.emails.send(payload);
  if (!result.error) {
    await prisma.emailSendLog.create({ data: {} }).catch((err) => {
      console.error("Errore nel log invii email (non blocca l'invio)", err);
    });
  }
  return result;
}
