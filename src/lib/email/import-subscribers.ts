import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validation/newsletter";

export interface ImportResult {
  imported: number;
  updated: number;
  skipped: number;
  invalid: number;
  error?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_HEADER_REGEX = /nome|name/i;

function cell(row: unknown[], col: number): string {
  return String(row[col] ?? "").trim();
}

// Legge CSV, XLS o XLSX (SheetJS riconosce il formato dal contenuto) ed estrae email + nome
// senza richiedere intestazioni di colonna precise: individua da sola quale colonna
// contiene indirizzi email (quella con più celle che sembrano un'email) e, se c'è
// un'intestazione, quale contiene il nome (colonna il cui header contiene "nome"/"name").
export async function importSubscribersFromFile(file: File): Promise<ImportResult> {
  const empty = { imported: 0, updated: 0, skipped: 0, invalid: 0 };

  let rows: unknown[][];
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) return { ...empty, error: "Il file non contiene nessun foglio." };
    rows = XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[sheetName], {
      header: 1,
      defval: "",
      blankrows: false,
    });
  } catch {
    return { ...empty, error: "File non leggibile: usa un CSV, XLS o XLSX valido." };
  }

  if (rows.length === 0) return { ...empty, error: "Il file è vuoto." };

  const columnCount = Math.max(...rows.map((r) => r.length));

  let emailCol = -1;
  let bestScore = 0;
  for (let col = 0; col < columnCount; col++) {
    const score = rows.filter((r) => EMAIL_REGEX.test(cell(r, col))).length;
    if (score > bestScore) {
      bestScore = score;
      emailCol = col;
    }
  }
  if (emailCol === -1) return { ...empty, error: "Non trovo nessuna colonna con indirizzi email nel file." };

  // Se la prima riga non ha un'email valida nella colonna individuata, è un'intestazione.
  const hasHeader = !EMAIL_REGEX.test(cell(rows[0], emailCol));
  const headerRow = hasHeader ? rows[0] : null;
  const dataRows = hasHeader ? rows.slice(1) : rows;

  let nameCol = headerRow
    ? headerRow.findIndex((h, i) => i !== emailCol && NAME_HEADER_REGEX.test(String(h ?? "")))
    : -1;
  if (nameCol === -1 && columnCount === 2) {
    nameCol = emailCol === 0 ? 1 : 0;
  }

  const seen = new Map<string, string | null>();
  let invalid = 0;
  for (const row of dataRows) {
    const rawEmail = cell(row, emailCol);
    if (!rawEmail) continue;
    const parsed = newsletterSchema.safeParse({ email: rawEmail });
    if (!parsed.success) {
      invalid++;
      continue;
    }
    if (!seen.has(parsed.data.email)) {
      const name = nameCol >= 0 ? cell(row, nameCol) || null : null;
      seen.set(parsed.data.email, name);
    }
  }

  if (seen.size === 0) {
    return { ...empty, invalid, error: "Nessun indirizzo email valido trovato nel file." };
  }

  const existing = await prisma.newsletterSubscriber.findMany({
    where: { email: { in: [...seen.keys()] } },
    select: { id: true, email: true, name: true },
  });
  const existingByEmail = new Map(existing.map((s) => [s.email, s]));

  const toCreate: { email: string; name?: string }[] = [];
  const toUpdateName: { id: string; name: string }[] = [];
  let skipped = 0;

  for (const [email, name] of seen) {
    const current = existingByEmail.get(email);
    if (current) {
      // Chi si è già disiscritto non viene ri-iscritto da un import: non è un nuovo
      // consenso espresso dalla persona stessa. Aggiorniamo solo il nome se mancante.
      if (name && !current.name) {
        toUpdateName.push({ id: current.id, name });
      } else {
        skipped++;
      }
      continue;
    }
    toCreate.push({ email, name: name ?? undefined });
  }

  const [createResult] = await Promise.all([
    toCreate.length > 0
      ? prisma.newsletterSubscriber.createMany({ data: toCreate, skipDuplicates: true })
      : Promise.resolve({ count: 0 }),
    ...toUpdateName.map((u) => prisma.newsletterSubscriber.update({ where: { id: u.id }, data: { name: u.name } })),
  ]);

  return { imported: createResult.count, updated: toUpdateName.length, skipped, invalid };
}
