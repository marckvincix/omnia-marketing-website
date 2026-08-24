import { z } from "zod";

// I messaggi di errore arrivano da un traduttore (getTranslations lato server) invece di
// essere fissi in italiano, perché il modulo contatti è tradotto in tutte le lingue del
// sito — vedi messages/it.json sotto pages.contatti.form.errNome/errEmail/ecc.
export function getContactSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().trim().min(2, t("errNome")),
    email: z.string().trim().email(t("errEmail")),
    phone: z.string().trim().min(1, t("errTelefono")),
    message: z.string().trim().min(10, t("errMessaggio")),
    serviceId: z.string().trim().min(1, t("errServizio")),
  });
}

export type ContactFormValues = z.infer<ReturnType<typeof getContactSchema>>;
