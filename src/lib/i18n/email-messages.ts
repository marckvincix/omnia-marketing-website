import { LOCALES, DEFAULT_LOCALE, type Locale } from "./locales";

type EmailMessages = Record<string, string>;

/**
 * Cataloghi statici (messages/*.json) letti direttamente, senza passare dal
 * provider React di next-intl: le email sono stringhe HTML generate lato server, non
 * componenti. Sostituzione placeholder {nome} semplice, non serve l'intera libreria ICU
 * per i pochi casi usati nei template email.
 */
export async function getEmailMessages(locale: string): Promise<EmailMessages> {
  const resolved = LOCALES.includes(locale as Locale) ? (locale as Locale) : DEFAULT_LOCALE;
  const messages = (await import(`../../../messages/${resolved}.json`)).default as {
    email: EmailMessages;
  };
  return messages.email;
}

export function formatMessage(template: string, vars: Record<string, string> = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => vars[key] ?? match);
}
