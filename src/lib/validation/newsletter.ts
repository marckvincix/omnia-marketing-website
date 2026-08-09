import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().trim().email("Inserisci un'email valida"),
});
