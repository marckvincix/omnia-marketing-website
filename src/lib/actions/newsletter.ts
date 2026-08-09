"use server";

import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validation/newsletter";
import { sendWelcomeEmail } from "@/lib/email/send-welcome";

export type NewsletterActionState = {
  error?: string;
  success?: boolean;
};

export async function subscribeNewsletter(
  _prevState: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  // Honeypot anti-spam: campo invisibile che solo i bot compilano
  if (formData.get("website")) {
    return { success: true };
  }

  const parsed = newsletterSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Email non valida" };
  }

  const subscriber = await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    create: { email: parsed.data.email },
    update: { unsubscribedAt: null },
  });

  try {
    await sendWelcomeEmail(subscriber.email, subscriber.unsubscribeToken);
  } catch (error) {
    // L'iscrizione è comunque andata a buon fine anche se l'email non parte.
    console.error("Errore invio email di benvenuto newsletter", error);
  }

  return { success: true };
}
