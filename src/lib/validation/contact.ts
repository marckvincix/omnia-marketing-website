import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Inserisci il tuo nome"),
  email: z.string().trim().email("Inserisci un'email valida"),
  phone: z.string().trim().min(1, "Inserisci il tuo numero di telefono"),
  message: z.string().trim().min(10, "Il messaggio deve contenere almeno 10 caratteri"),
  serviceId: z.string().trim().min(1, "Seleziona un servizio"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
