/**
 * Sovrascrive i campi di `base` con quelli di `translation` quando presenti e non vuoti,
 * ricadendo sull'italiano campo per campo altrimenti (traduzione non ancora generata,
 * quota DeepL esaurita quel mese, o campo non tradotto per quella riga). Non produce mai
 * una pagina vuota o rotta: nel peggiore dei casi mostra il testo italiano.
 */
export function localize<T extends Record<string, unknown>>(
  base: T,
  translation: Partial<T> | null | undefined,
  fields: (keyof T)[],
): T {
  if (!translation) return base;
  const merged = { ...base };
  for (const field of fields) {
    const value = translation[field];
    if (value !== null && value !== undefined && value !== "") {
      merged[field] = value as T[typeof field];
    }
  }
  return merged;
}
