// Traduce messages/it.json (sorgente di verità) nelle altre 7 lingue del sito via
// DeepL. Da rilanciare ogni volta che si aggiunge o modifica una stringa fissa
// dell'interfaccia in it.json — genera/sovrascrive gli altri 7 file.
import "dotenv/config";
import { writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { TARGET_LOCALES } from "../src/lib/i18n/locales";
import { translateTexts } from "../src/lib/i18n/deepl";

type MessageTree = { [key: string]: string | MessageTree };

function flatten(tree: MessageTree, prefix = ""): [string, string][] {
  const out: [string, string][] = [];
  for (const [key, value] of Object.entries(tree)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      out.push([fullKey, value]);
    } else {
      out.push(...flatten(value, fullKey));
    }
  }
  return out;
}

function unflatten(pairs: [string, string][]): MessageTree {
  const root: MessageTree = {};
  for (const [key, value] of pairs) {
    const parts = key.split(".");
    let node = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (typeof node[part] !== "object") node[part] = {};
      node = node[part] as MessageTree;
    }
    node[parts[parts.length - 1]] = value;
  }
  return root;
}

// Nessuna chiave del catalogo contiene più tag incorporati da tradurre: testato che
// DeepL riordina male tag "finti" senza contenuto attorno a loro in lingue con
// struttura grammaticale molto diversa dall'italiano (arabo, giapponese) — i link
// nel banner cookie sono composti a parte nel componente, non dentro una frase tradotta.
const RICH_TEXT_KEYS = new Set<string>([]);
const NON_SPLITTING_TAGS: string[] = [];

async function main() {
  const messagesDir = path.join(process.cwd(), "messages");
  const source = JSON.parse(readFileSync(path.join(messagesDir, "it.json"), "utf-8")) as MessageTree;
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
