"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation/contact";

export type ContactActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitContact(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  // Honeypot anti-spam: campo invisibile che solo i bot compilano
  if (formData.get("website")) {
    redirect("/grazie");
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

  await prisma.contactSubmission.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
      serviceId: parsed.data.serviceId || null,
    },
  });

  redirect("/grazie");
}
