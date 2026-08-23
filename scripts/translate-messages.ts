// Traduce messages/it.json (sorgente di verità) nelle altre 7 lingue del sito via
// DeepL. Da rilanciare ogni volta che si aggiunge o modifica una stringa fissa
// dell'interfaccia in it.json — genera/sovrascrive gli altri 7 file.
import "dotenv/config";
import { writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { TARGET_LOCALES } from "../src/lib/i18n/locales";
import { translateTexts } from "../src/lib/i18n/deepl";

type Json = string | Json[] | { [key: string]: Json };

// Percorre sia oggetti che array (le varianti Hero/CtaBand sono elenchi di stringhe o di
// {title, description, ctaLabel}): ogni indice di array diventa un segmento numerico nel
// percorso, es. "pages.home.heroVariants.web.0".
function flatten(node: Json, prefix = ""): [string, string][] {
  if (typeof node === "string") return [[prefix, node]];
  if (Array.isArray(node)) {
    return node.flatMap((item, i) => flatten(item, prefix ? `${prefix}.${i}` : String(i)));
  }
  return Object.entries(node).flatMap(([key, value]) =>
    flatten(value, prefix ? `${prefix}.${key}` : key),
  );
}

function unflatten(pairs: [string, string][]): Json {
  const root: Record<string, Json> = {};
  for (const [key, value] of pairs) {
    const parts = key.split(".");
    let node = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (typeof node[part] !== "object" || node[part] === null) node[part] = {};
      node = node[part] as Record<string, Json>;
    }
    node[parts[parts.length - 1]] = value;
  }
  return arrayify(root);
}

// Un oggetto le cui chiavi sono esattamente "0","1","2"... in ordine diventa un array vero,
// altrimenti resta un oggetto — ricorsivo, per gli array annidati dentro altri oggetti.
function arrayify(node: Json): Json {
  if (typeof node !== "object" || node === null || Array.isArray(node)) return node;
  const out: Record<string, Json> = {};
  for (const key of Object.keys(node)) out[key] = arrayify(node[key]);
  const keys = Object.keys(out);
  const isArrayLike = keys.length > 0 && keys.every((k, i) => k === String(i));
  return isArrayLike ? keys.map((k) => out[k]) : out;
}

// Nessuna chiave del catalogo contiene più tag incorporati da tradurre: testato che
// DeepL riordina male tag "finti" senza contenuto attorno a loro in lingue con
// struttura grammaticale molto diversa dall'italiano (arabo, giapponese) — i link
// nel banner cookie sono composti a parte nel componente, non dentro una frase tradotta.
const RICH_TEXT_KEYS = new Set<string>([]);
const NON_SPLITTING_TAGS: string[] = [];

async function main() {
  const messagesDir = path.join(process.cwd(), "messages");
  const source = JSON.parse(readFileSync(path.join(messagesDir, "it.json"), "utf-8")) as Json;
  const entries = flatten(source);

  const plainEntries = entries.filter(([k]) => !RICH_TEXT_KEYS.has(k));
  const richEntries = entries.filter(([k]) => RICH_TEXT_KEYS.has(k));

  for (const locale of TARGET_LOCALES) {
    console.log(`Traduzione messaggi -> ${locale}...`);
    const plainTranslated = await translateTexts(
      plainEntries.map(([, v]) => v),
      locale,
    );
    const richTranslated = await translateTexts(
      richEntries.map(([, v]) => v),
      locale,
      { html: true, nonSplittingTags: NON_SPLITTING_TAGS },
    );

    const pairs: [string, string][] = [
      ...plainEntries.map(([k], i): [string, string] => [k, plainTranslated[i]]),
      ...richEntries.map(([k], i): [string, string] => [k, richTranslated[i]]),
    ];
    const tree = unflatten(pairs);
    writeFileSync(path.join(messagesDir, `${locale}.json`), JSON.stringify(tree, null, 2) + "\n");
    console.log(`  scritto messages/${locale}.json (${pairs.length} stringhe)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
