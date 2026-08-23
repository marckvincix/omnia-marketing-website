"use server";

import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation/contact";
import { sendContactConfirmationEmail, sendContactNotificationEmail } from "@/lib/email/send-contact-notifications";

export type ContactActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitContact(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const locale = await getLocale();

  // Honeypot anti-spam: campo invisibile che solo i bot compilano
  if (formData.get("website")) {
    return redirect({ href: "/grazie", locale });
  }

  // formData.get() ritorna null (non undefined) per i campi assenti dal form.
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    message: formData.get("message"),
    serviceId: formData.get("serviceId") || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const [, service, settings] = await Promise.all([
    prisma.contactSubmission.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        message: parsed.data.message,
        serviceId: parsed.data.serviceId || null,
        locale,
      },
    }),
    parsed.data.serviceId
      ? prisma.service.findUnique({ where: { id: parsed.data.serviceId }, select: { title: true } })
      : Promise.resolve(null),
    prisma.siteSettings.findUnique({ where: { id: 1 }, select: { contactEmail: true } }),
  ]);

  const notifyEmail = settings?.contactEmail || "info@omniamarketing.it";

  // Le email non devono mai bloccare l'invio: la richiesta è comunque salvata anche se
  // Resend fallisce (es. chiave API non ancora aggiornata).
  const results = await Promise.allSettled([
    sendContactConfirmationEmail(parsed.data.name, parsed.data.email, locale),
    sendContactNotificationEmail({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || "—",
      serviceName: service?.title ?? null,
      message: parsed.data.message,
      notifyEmail,
    }),
  ]);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Errore invio email modulo contatti", result.reason);
    }
  }

  return redirect({ href: "/grazie", locale });
}
